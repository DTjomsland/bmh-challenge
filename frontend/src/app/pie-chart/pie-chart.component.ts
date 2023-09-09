import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {
  private data: any[] = [];
  private svg: any;
  private margin = 50;
  private width!: number;
  private height!: number;
  private radius!: number;

  @ViewChild('pieChart', { static: true }) private svgElement!: ElementRef;

  constructor(
    private dataService: DataService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  // Load data from the API
  loadChartData() {
    this.dataService.getData().subscribe((res) => {
      this.data = res;
      console.log(this.data);
      this.createSvg();
      this.drawChart();
    });
  }

  private createSvg(): void {
    const parent = this.el.nativeElement;
    this.width = parent.offsetWidth;
    this.height = this.width;
    this.radius = Math.min(this.width, this.height) / 2 - this.margin;

    d3.select(this.svgElement.nativeElement).selectAll('*').remove();

    this.svg = d3
      .select(this.svgElement.nativeElement)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }

  private drawChart(): void {
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(this.data.map((d) => d.name))
      .range(this.data.map((d) => `#${d.color.toString(16)}`));

    const pie = d3.pie<any>().value((d: any) => d.value);

    // Build the pie chart
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(this.radius);

    this.svg
      .selectAll('pieces')
      .data(pie(this.data))
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', (d: any, i: any) => colorScale(d.data.name))
      .attr('stroke', '#ffffff')
      .style('stroke-width', '2px');

    // Add labels
    const labelLocation = d3.arc().innerRadius(100).outerRadius(this.radius);

    // Add labels with names
    this.svg
      .selectAll('pieces')
      .data(pie(this.data))
      .enter()
      .append('text')
      .text((d: any) => d.data.name)
      .attr(
        'transform',
        (d: any) => 'translate(' + labelLocation.centroid(d) + ')'
      )
      .style('text-anchor', 'middle')
      .style('font-size', 15)
      .attr('fill', 'white');

    // Add labels with percentages
    this.svg
      .selectAll('pieces')
      .data(pie(this.data))
      .enter()
      .append('text')
      .text((d: any) => d.data.name)
      .attr(
        'transform',
        (d: any) => 'translate(' + labelLocation.centroid(d) + ')'
      )
      .style('text-anchor', 'middle')
      .style('font-size', 15)
      .attr('fill', 'white')
      .append('tspan')
      .text(
        (d: any) =>
          `${(
            (d.data.value / d3.sum(this.data, (item) => item.value)) *
            100
          ).toFixed(1)}%`
      )
      .attr('x', 0)
      .attr('dy', '1.2em');
  }

  

  // Reload data and update the pie chart
  reloadData() {
    this.loadChartData();
  }
}
