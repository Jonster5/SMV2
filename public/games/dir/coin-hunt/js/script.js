// Physics settings
Physijs.scripts.ammo = 'js/ammo.js';
Physijs.scripts.worker = 'js/physijs_worker.js';

// This is where stuff in our game will happen:
var scene = new Physijs.Scene({ fixedTimeStep: 2 / 60 });
scene.setGravity(new THREE.Vector3(0, -100, 0));

// This is what sees the stuff:
var width = window.innerWidth,
    height = window.innerHeight,
    aspect_ratio = width / height;
var camera = new THREE.PerspectiveCamera(75, aspect_ratio, 1, 10000);
// var camera = new THREE.OrthographicCamera(
//   -width/2, width/2, height/2, -height/2, 1, 10000
// );
work;
camera.position.z = 500;
scene.add(camera);

// This will draw what the camera sees onto the screen:
var renderer = new THREE.CanvasRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.body.style.backgroundColor = '#ffffff';

// ******** START CODING ON THE NEXT LINE ********

let mesh = new THREE.Mesh(
    new THREE.SphereBufferGeometry(50, 8, 8),
    new THREE.MeshStandardMaterial()
);

scene.add(mesh);

// Animate motion in the game
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Run physics
function gameStep() {
    scene.simulate();
    // Update physics 60 times a second so that motion is smooth
    setTimeout(gameStep, 1000 / 60);
}
gameStep();