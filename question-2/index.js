var renderer, scene, camera, controls;

init();
animate();

function init() {
	if( !THREE )
		{ return; }
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

  var light = new THREE.HemisphereLight(0xeeeeee, 0x888888, 1);
  light.position.set(0, 20, 0);
  scene.add(light);

  // axes
  //scene.add(new THREE.AxisHelper(60));

  // geometry
  var geometry = new THREE.SphereGeometry(5, 12, 8);

  // material
  var material = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shading: THREE.FlatShading,
    polygonOffset: true,
    polygonOffsetFactor: 1, // positive value pushes polygon further away
    polygonOffsetUnits: 1
  });

  // mesh
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);


  // wireframe
  var geo = new THREE.EdgesGeometry(mesh.geometry); // or WireframeGeometry
  var mat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 2
  });
  var wireframe = new THREE.LineSegments(geo, mat);
  mesh.add(wireframe);


  // dot example
  var dotGeometry = new THREE.BufferGeometry();
  var dotVertices = new Float32Array([
    4.0, 4.0, 0.0
  ]);
  dotGeometry.setAttribute('position', new THREE.BufferAttribute(dotVertices, 3));

  var dotMaterial = new THREE.PointsMaterial({
    size: 1,
    sizeAttenuation: true,
    color: 0xff00ff
  });
  var dot = new THREE.Points(dotGeometry, dotMaterial);
  scene.add(dot);

}

function animate() {
  requestAnimationFrame(animate);

  var width = renderer.domElement.clientWidth;
  var height = renderer.domElement.clientHeight;
  
  renderer.setPixelRatio(1);

  renderer.setSize(renderer.domElement.clientWidth, renderer.domElement.clientHeight, false);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}
