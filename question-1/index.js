
document.addEventListener("DOMContentLoaded", function () {
    const margin = 50;
    let width, height, radius;
    let svg;

    // API request to get chart data
    function loadChartData() {
        fetch("http://localhost:1337/graph")
            .then((response) => response.json())
            .then((data) => {
                createSvg();
                drawChart(data);
            })
            .catch((error) => console.error(error));
    }

    // Get teh dimensions of the view container and clear existing content
    function createSvg() {
        width = window.innerWidth;
        height = width;
        radius = Math.min(width, height) / 2 - margin;

        d3.select("#pieChart").selectAll("*").remove();

        svg = d3
            .select("#pieChart")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);
    }

    // Draw the pie chart
    function drawChart(data) {
        const colorScale = d3
            .scaleOrdinal()
            .domain(data.map((d) => d.name))
            .range(data.map((d) => `#${d.color.toString(16)}`));

        const pie = d3.pie().value((d) => d.value);

        // Build the pie chart
        const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

        svg
            .selectAll("pieces")
            .data(pie(data))
            .enter()
            .append("path")
            .attr("d", arcGenerator)
            .attr("fill", (d, i) => colorScale(d.data.name))
            .attr("stroke", "#ffffff")
            .style("stroke-width", "2px");

        // Add label location
        const labelLocation = d3.arc().innerRadius(100).outerRadius(radius);

        // Add labels with names
        svg
            .selectAll("pieces")
            .data(pie(data))
            .enter()
            .append("text")
            .text((d) => d.data.name)
            .attr("transform", (d) => `translate(${labelLocation.centroid(d)})`)
            .style("text-anchor", "middle")
            .style("font-size", 15)
            .attr("fill", "white");

        // Add percentages to the labels
        svg
            .selectAll("pieces")
            .data(pie(data))
            .enter()
            .append("text")
            .text((d) => d.data.name)
            .attr("transform", (d) => `translate(${labelLocation.centroid(d)})`)
            .style("text-anchor", "middle")
            .style("font-size", 15)
            .attr("fill", "white")
            .append("tspan")
            .text(
                (d) =>
                    `${(
                        (d.data.value / d3.sum(data, (item) => item.value)) *
                        100
                    ).toFixed(1)}%`
            )
            .attr("x", 0)
            .attr("dy", "1.2em");
    }

    // Initial data load
    loadChartData();

    // Refetch the data and reload the chart
    const reloadButton = document.getElementById("reloadButton");
    if (reloadButton) {
        reloadButton.addEventListener("click", () => {
            loadChartData();
        });
    }
});
