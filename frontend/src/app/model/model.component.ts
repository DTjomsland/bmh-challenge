import { Component, ElementRef, NgZone, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DataService } from '../data.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
})
export class ModelComponent implements OnInit {
  private colorData: any = {};
  private positionData: any = {};
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;

  constructor(
    private dataService: DataService,
    private el: ElementRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadModelData();
    window.addEventListener('resize', () => {
      this.onWindowResize();
    });
  }

  onWindowResize() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    this.camera.aspect = newWidth / newHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(newWidth, newHeight);
  }

  // load data from the API
  loadModelData() {
    forkJoin([
      this.dataService.getColor(),
      this.dataService.getPosition()
    ]).subscribe(([colorData, positionData]) => {
      this.colorData = colorData;
      this.positionData = positionData;
      // call init and animate after both requests have completed
      this.init();
      this.animate();
    });
  }

  init(): void {
    // renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.el.nativeElement.appendChild(this.renderer.domElement);

    // scene
    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(0, 0, 0);

    var light = new THREE.HemisphereLight(0xeeeeee, 0x888888, 1);
    light.position.set(0, 20, 0);
    this.scene.add(light);

    // add orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // enable features
    this.controls.enablePan = true;
    this.controls.enableZoom = true;

    // set the target
    this.controls.target.set(0, 0, 0);

    // geometry
    const geometry = new THREE.SphereGeometry(5, 12, 8);

    // material
    const material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    // wireframe
    const wireframeGeometry = new THREE.EdgesGeometry(geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });
    const wireframe = new THREE.LineSegments(
      wireframeGeometry,
      wireframeMaterial
    );
    mesh.add(wireframe);

    const video = document.getElementById('video');
    if (video instanceof HTMLVideoElement) {
      var texture = new THREE.VideoTexture(video);
      const material2 = new THREE.MeshBasicMaterial({ map: texture });
      const mesh2 = new THREE.Mesh(geometry, material2);
      this.scene.add(mesh2);
    } else {
      console.error("Video element with ID 'video' not found in the DOM.");
    }
    
    // first Moon
    const firstMoonGeometry = new THREE.SphereGeometry(1, 12, 8);
    const firstMoonMaterial = new THREE.MeshPhongMaterial({
      color: this.colorData.firstMoonColor,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    const firstMoonMesh = new THREE.Mesh(firstMoonGeometry, firstMoonMaterial);
    firstMoonMesh.position.set(
      this.positionData.firstMoonPosition.x,
      this.positionData.firstMoonPosition.y,
      this.positionData.firstMoonPosition.z
    );
    this.scene.add(firstMoonMesh);

    //first moon ring
    const ringGeometry = new THREE.RingGeometry(1.2, 1.5, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(
      this.positionData.firstMoonPosition.x,
      this.positionData.firstMoonPosition.y,
      this.positionData.firstMoonPosition.z
    );
    this.scene.add(ring);

    // second moon
    const secondMoonGeometry = new THREE.SphereGeometry(1, 12, 8);
    const secondMoonMaterial = new THREE.MeshPhongMaterial({
      color: this.colorData.secondMoonColor,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    const secondMoonMesh = new THREE.Mesh(
      secondMoonGeometry,
      secondMoonMaterial
    );
    secondMoonMesh.position.set(
      this.positionData.secondMoonPosition.x,
      this.positionData.secondMoonPosition.y,
      this.positionData.secondMoonPosition.z
    );
    this.scene.add(secondMoonMesh);

    // stars
    const starsCoords = [];
    for (let i = 0; i < 2000; i++) {
      starsCoords.push(
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000
      );
    }

    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starsCoords, 3)
    );
    const starsMaterial = new THREE.PointsMaterial({
      size: 1,
      sizeAttenuation: true,
      color: 0xffffff,
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(stars);
  }

  animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const animateFn = () => {
        requestAnimationFrame(animateFn);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
      };
      animateFn();
    });
  }

  //update the model
}
