import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';


let prevColor = new THREE.Color(0x6e052f); 
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let randomColor;
let lastClicked;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-10, 20, 30);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const geometry = new THREE.SphereGeometry(2, 10, 20);
const material = new THREE.PointsMaterial({ color: 0x6e052f });
const sphere = new THREE.Points(geometry, material);

const cubeGeometry = new THREE.BoxGeometry(2,2,2);
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xfcba03});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial); 
cube.position.set(5,5,5);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

let mousePoint = new THREE.Vector2();

let isClickHandled = false;

const R = 10; 
const count = 10000; // Number of random points to generate
const points = getRandomPointsOnRing(R, count);


const objectsToIntersect = [];
  
points.forEach(point => {
        const sphereGeometry = new THREE.SphereGeometry(0.1, 5, 8); 
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const meshSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        meshSphere.position.copy(point);
        scene.add(meshSphere);
        objectsToIntersect.push(meshSphere);
    });
    
//console.log(objectsToIntersect);
function getRandomPointsOnRing(radius, count = 1000){
	return new Array(count).fill(0).map(p => {
        let u = Math.random();
        let v = Math.random();
        let theta = 2 * Math.PI * u;
        let phi = Math.acos(2 * v - 1);
        let x = radius * Math.sin(phi) * Math.cos(theta);
        let y = radius * Math.sin(phi) * Math.sin(theta);
        let z = radius * Math.cos(phi);
        return new THREE.Vector3(x, y, z);
    });
}



window.addEventListener('click', function(e) {
    if (isClickHandled) return; // Exit if the click has already been handled
    isClickHandled = true; // Set the flag to true to indicate the click has been handled

    const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    const mouseY = - (e.clientY / window.innerHeight) * 2 + 1;
    mousePoint.set(mouseX, mouseY);

    // Raycasting
    const rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(mousePoint, camera);
    const intersects = rayCaster.intersectObjects(objectsToIntersect); 
   // console.log("inside eventlistener" , objectsToIntersect)



    if (intersects.length > 0) {
        console.log('Clicked object:', intersects[0].object);
        let clickedObject = intersects[0].object;
        lastClicked = clickedObject;
        prevColor.copy(clickedObject.material.color);
        console.log('prevColor:', prevColor.r, prevColor.g, prevColor.b); 
        randomColor = getRandomColor();
        clickedObject.material.color.copy(randomColor);
        console.log("Clicked: ", clickedObject);
        console.log(randomColor);
    }

    setTimeout(() => {
        isClickHandled = false;
    }, 100);
});

// using context menu for right click 
window.addEventListener('contextmenu', function(e) {
    e.preventDefault(); // Prevent the default context menu from appearing

    lastClicked.material.color.copy(prevColor);
    console.log("Reverted color to previous color", prevColor.r, prevColor.g, prevColor.b);
    console.log("selected element color now:", lastClicked.material.color);

    randomColor.copy(prevColor);
    console.log("Updated prevColor to current color");
});
//scene.add(cube);
//scene.add(plane);
//scene.add(sphere);


function animate() {
    requestAnimationFrame(animate);

    
    orbit.update();

    renderer.render(scene, camera);
}

function getRandomColor() {
   
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    const color = new THREE.Color(r, g, b);

    return color;
}

animate();



