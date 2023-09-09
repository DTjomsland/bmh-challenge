var colorData, positionData, renderer, scene, camera, controls;



// api url
const apiUrl = 'http://localhost:1337';

// api fetch function
function fetchData(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
      throw error;
    });
}

// fetch the data and make sure it is available before creating scene
Promise.all([fetchData(`${apiUrl}/color`), fetchData(`${apiUrl}/position`)])
  .then((responses) => {
    colorData = responses[0];
    positionData = responses[1];
    console.log(colorData.firstMoonColor);
    console.log(positionData);
    init();
    animate();
  })
  .catch((error) => {
    console.error(error);
  });



function init() {
  if (!THREE) { return; }
  // renderer
  renderer = new THREE.WebGLRenderer();
  document.body.querySelector('.threeWindow').appendChild(renderer.domElement);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  // scene
  scene = new THREE.Scene();

  // camera
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(20, 20, 20);
  camera.lookAt(0.0, 0.0, 0.0);

  // controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // enable features
  controls.enablePan = true;
  controls.enableZoom = true;

  var light = new THREE.HemisphereLight(0xeeeeee, 0x888888, 1);
  light.position.set(0, 20, 0);
  scene.add(light);

  // geometry
  var geometry = new THREE.SphereGeometry(5, 12, 8);

  // material
  var material = new THREE.MeshPhongMaterial({
    color: colorData.secondMoonColor,
    shading: THREE.FlatShading,
    polygonOffset: true,
    polygonOffsetFactor: 1, 
    polygonOffsetUnits: 1
  });

  // mesh
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);


  // wireframe
  var geo = new THREE.EdgesGeometry(mesh.geometry); 
  var mat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 2
  });
  var wireframe = new THREE.LineSegments(geo, mat);
  mesh.add(wireframe);



  // added a moon to the scene
  var moonGeometry = new THREE.SphereGeometry(1, 12, 8);
  var moonMaterial = new THREE.MeshPhongMaterial({
    color: colorData.firstMoonColor,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  var moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMesh.position.set(
    positionData.firstMoonPosition.x,
    positionData.firstMoonPosition.y,
    positionData.firstMoonPosition.z
  );
  scene.add(moonMesh);

  //added a moon ring
  const ringGeometry = new THREE.RingGeometry(1.2, 1.5, 32);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: colorData.secondMoonColor,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.position.set(
    positionData.firstMoonPosition.x,
    positionData.firstMoonPosition.y,
    positionData.firstMoonPosition.z
  );
  scene.add(ring);

}



function animate() {
  requestAnimationFrame(animate);
  var width = renderer.domElement.clientWidth;
  var height = renderer.domElement.clientHeight;

  renderer.setPixelRatio(1);

  renderer.setSize(renderer.domElement.clientWidth, renderer.domElement.clientHeight, false);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  controls.update();
  renderer.render(scene, camera);
}
