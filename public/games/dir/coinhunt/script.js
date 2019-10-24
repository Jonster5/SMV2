var scene = new THREE.Scene();

var ww = 800;
var hh = 580;

var aspect_ratio = ww / hh;
var tpcam;

var fpcam;

// var birdsEye;

function rand(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

var renderer = new THREE.WebGLRenderer();

scene.fog = new THREE.Fog(0xffffff, 10, 18000);
//renderer.shadowMapEnabled = true;
renderer.setSize(ww, hh);
document.getElementById("Game").appendChild(renderer.domElement);

var camera = fpcam;

window.addEventListener("resize", updateAspect, false);



function updateAspect() {
	//this function is for the chrome app rendering to function properly
	marker.remove(fpcam);
	marker.remove(tpcam);

	renderer.setSize(ww, hh);
	aspect_ratio = ww / hh;
	tpcam = new THREE.PerspectiveCamera(75, aspect_ratio, 1, 10000);
	fpcam = new THREE.PerspectiveCamera(75, aspect_ratio, 1, 8000);
	tpcam.position.z = -1000;
	tpcam.position.y = 500;
	tpcam.rotation.y = Math.PI;
	tpcam.rotation.x = Math.PI / 8;

	fpcam.rotation.y = Math.PI;
	fpcam.position.y = 50;

	if (firstPerson == 0) {
		camera = fpcam;
		marker.remove(tpcam);


	}
	if (firstPerson == 1) {
		camera = tpcam;
		marker.remove(fpcam);


	}
	marker.add(camera);

}

//Actual game code starts here...
var not_allowed = [];
var jumpAble = [];
var jumpTree = [];
var climbAble = [];
var coinBox = [];
var xv = 0;
var zv = 0;
var yv = 0;

var death = [];
var DMP = 75;
var tc = 25,
	gs = 400;

var isJumping = false;
var level = 500;
var climbing = false;
var daylCycle = 1;
var counter = 0;
var gravity = 1.5;
var firstPerson = 1;
var speed = 15;

var lastCalledTime;
var fps;

function requestAnimFrame() {

	if (!lastCalledTime) {
		lastCalledTime = Date.now();
		fps = 0;
		return;
	}
	delta = (Date.now() - lastCalledTime) / 1000;
	lastCalledTime = Date.now();
	fps = 1 / delta;
}



var jumpAllowed = true;
var marker = new THREE.Object3D();
marker.position.y = 1000;
scene.add(marker);


var cover = new THREE.MeshLambertMaterial({ color: 0x6dbac6, emissive: 0x061011 });
var body = new THREE.SphereGeometry(100, 20, 20);


var avatar = new THREE.Mesh(body, cover);
avatar.rotation.y = Math.PI / 4;
avatar.rotation.x = -Math.PI / 8;
marker.add(avatar);


var sunlight = new THREE.DirectionalLight(0xfdffbc);
sunlight.intensity = 1.2;
sunlight.position.set(0, 3000, 3000);
//scene.add(sunlight);

hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 2);
scene.add(hemisphereLight);


var gcover = new THREE.MeshLambertMaterial({ color: 0x219300, specular: 0x219300 });
var gbody = new THREE.PlaneGeometry(20000, 20000);
var ground = new THREE.Mesh(gbody, gcover);
ground.position.y = -175;
ground.rotation.x = -Math.PI / 2;
scene.add(ground);


var edge1c = new THREE.MeshLambertMaterial({ color: 0x219300, specular: 0x219300 });
var edge1b = new THREE.PlaneGeometry(20, 20000);
var edge1 = new THREE.Mesh(edge1b, edge1c);
edge1.position.y = -175;
edge1.position.x = -10000
edge1.rotation.x = -Math.PI / 2;
scene.add(edge1);

not_allowed.push(edge1);

var edge2c = new THREE.MeshLambertMaterial({ color: 0x219300, specular: 0x219300 });
var edge2b = new THREE.PlaneGeometry(20, 20000);
var edge2 = new THREE.Mesh(edge2b, edge2c);
edge2.position.y = -175;
edge2.position.x = 10000
edge2.rotation.x = -Math.PI / 2;
scene.add(edge2);

not_allowed.push(edge2);

var edge3c = new THREE.MeshLambertMaterial({ color: 0x219300, specular: 0x219300 });
var edge3b = new THREE.PlaneGeometry(20000, 20);
var edge3 = new THREE.Mesh(edge3b, edge3c);
edge3.position.y = -175;
edge3.position.z = -10000
edge3.rotation.x = -Math.PI / 2;
scene.add(edge3);

not_allowed.push(edge3);

var edge4c = new THREE.MeshLambertMaterial({ color: 0x219300, specular: 0x219300 });
var edge4b = new THREE.PlaneGeometry(20000, 20);
var edge4 = new THREE.Mesh(edge4b, edge4c);
edge4.position.y = -175;
edge4.position.z = 10000
edge4.rotation.x = -Math.PI / 2;
scene.add(edge4);

not_allowed.push(edge4);

var hand = new THREE.SphereGeometry(50, 20, 20);

var right_hand = new THREE.Mesh(hand, cover);
right_hand.position.set(-150, 0, 0);
marker.add(right_hand);


var left_hand = new THREE.Mesh(hand, cover);
left_hand.position.set(150, 0, 0);
marker.add(left_hand);


var foot = new THREE.SphereGeometry(50, 20, 10);

var right_foot = new THREE.Mesh(foot, cover);
right_foot.position.set(-75, -125, 0);
marker.add(right_foot);


var left_foot = new THREE.Mesh(foot, cover);
left_foot.position.set(75, -125, 0);
marker.add(left_foot);


function createDeath(x, z) {
	var square = new THREE.Mesh(
		new THREE.PlaneGeometry(gs, gs),
		new THREE.MeshLambertMaterial({ color: 0xdd1a1a, emissive: 0x061011 })
	);
	scene.add(square);
	square.rotation.x = -Math.PI / 2;
	square.position.set(x * gs, -170, z * gs);

	for (let i = 0; i < death.length; i++) {
		if (death[i].position.x == square.position.x && death[i].position.z == square.position.z) {
			death.pop();
			scene.remove(square);
		}
	}

	return square;
}

updateAspect();

var tree_with_treasure;
var trees = [];
var rocks = [];
var newbound;
var hitbox;
function makeTreeAt(x, z) {
	// Don't change any code at the start...
	var trunk = new THREE.Mesh(
		new THREE.CylinderGeometry(50, 50, 200),
		new THREE.MeshLambertMaterial({ color: 0xA0522D })
	);

	var top = new THREE.Mesh(
		new THREE.SphereGeometry(150),
		new THREE.MeshPhongMaterial({ color: 0x228B22 })
	);
	top.material.side = THREE.DoubleSide;
	top.position.y = 185;
	trunk.add(top);



	var newbound = new THREE.Mesh(
		new THREE.CylinderGeometry(150, 150, 380, 20),
		new THREE.MeshLambertMaterial({ transparent: true, opacity: 0, emissive: 0x0f04ef })
	);
	newbound.position.y = 100;
	trunk.add(newbound);

	var hitbox = new THREE.Mesh(
		new THREE.CircleGeometry(150, 20),
		new THREE.MeshLambertMaterial({ transparent: true, opacity: 0 })
	);
	hitbox.position.y = -96;
	hitbox.rotation.x = -Math.PI / 2;
	trunk.add(hitbox);

	not_allowed.push(hitbox);
	jumpTree.push(hitbox);
	//climbAble.push(newbound);
	//climbAble.push(boundary);




	trunk.position.set(x, -75, z);
	scene.add(trunk);


	return top;
}
var bound;
function makeRock(x, z) {
	var rock = new THREE.Mesh(
		new THREE.IcosahedronGeometry(100, 0.9),
		new THREE.MeshLambertMaterial({ color: 0x64696d })
	);

	var bound = new THREE.Mesh(
		new THREE.CubeGeometry(250, 125, 250),
		new THREE.MeshLambertMaterial({ transparent: true, opacity: 0 })
	);

	jumpAble.push(bound);

	rock.position.set(x, -175, z);
	scene.add(rock);
	rock.add(bound);


	return bound;
}
var flowers = [];
var fo;
function makeFlower(x, z) {
	fo = new THREE.Object3D();
	scene.add(fo);
	var fstem = new THREE.Mesh(
		new THREE.CylinderGeometry(7, 7, 100),
		new THREE.MeshLambertMaterial({ color: 0x2bb700, specular: 0x3a3a3a })
	);
	var head = new THREE.Mesh(
		new THREE.CubeGeometry(50, 50, 50),
		new THREE.MeshLambertMaterial({ color: 0xf7e818, specular: 0x3a3a3a })
	);
	fstem.position.set(x, -150, z);

	scene.add(fstem);
	head.rotation.set(Math.PI / 8, -Math.PI / 8, Math.PI / 4);
	head.position.y = 50;

	fstem.add(head);

	return fstem;
}


for (let i = 0; i < rand(10, 30); i++) {
	rocks.push(makeRock(Math.floor(Math.random() * 9500 - 4750), Math.floor(Math.random() * 9500 - 4750)));
}
for (let i = 0; i < rand(20, 40); i++) {
	trees.push(makeTreeAt(Math.floor(Math.random() * 9500 - 4750), Math.floor(Math.random() * 9500 - 4750)));
}
for (let i = 0; i < rand(0, 75); i++) {
	flowers.push(makeFlower(Math.floor(Math.random() * 9500 - 4750), Math.floor(Math.random() * 9500 - 4750)));
}

var coin;
var cxpos;
var czpos;

function createCoin(x, z) {
	coin = new THREE.Mesh(
		new THREE.CylinderGeometry(75, 75, 35, 15),
		new THREE.MeshLambertMaterial({ color: 0xFFD700 })
	);
	let coinCov = new THREE.Mesh(
		new THREE.CylinderGeometry(75, 75, 30, 15),
		new THREE.MeshBasicMaterial({
			color: 0x3a3a3a,
			wireframe: true,
			wireframeLinewidth: 2
		})
	);
	let coinBound = new THREE.Mesh(
		new THREE.CircleGeometry(100, 10),
		new THREE.MeshLambertMaterial({ transparent: true, opacity: 0 })
	);
	coin.rotation.x = -Math.PI / 2;
	coinBound.position.z = -230;
	scene.add(coin);
	coin.add(coinCov);
	coin.add(coinBound);
	coinBox.push(coinBound);

	coin.position.set(x, 0, z);

	return coin;
}

var flowerCount = Math.floor(Math.random() * 50);
var flowerpos = [];
var zxui = false;
function flowerBurn() {
	for (let i = 0; i < flowers.length; i++) {
		let vector = new THREE.Vector3(0, -1, 0);
		let ray = new THREE.Ray(flowers[i].position, vector);
		let intersects = ray.intersectObjects(death);
		if (intersects.length > 0) {
			scene.remove(flowers[i]);
		}
	}
}

function runCoin() {
	scene.remove(coin);
	coinBox = [];
	createCoin(Math.floor(Math.random() * 9500 - 4750), Math.floor(Math.random() * 9500 - 4750));
	if (coinDT()) {
		scene.remove(coin);
		coinbox = [];
		createCoin(Math.floor(Math.random() * 9500 - 4750), Math.floor(Math.random() * 9500 - 4750));
	}
}

runCoin();

// Now, animate what the camera sees on the screen:
var clock = new THREE.Clock(true);

function animate() {
	var time = clock.getElapsedTime();

	if (rand(0, -Math.sin(time) * 50) == 0 && time > 5) {
		death.push(createDeath(rand(-tc / 2, tc / 2), rand(-tc / 2, tc / 2)));
	}
	while (death.length > DMP) {
		for (let i = 0; i < rand(0, 10); i++) {
			scene.remove(death[0]);
			death.shift();
		}
	}

	TWEEN.update();
	walk();

	flowerBurn();

	spinAvatar(direction);


	coin.rotation.z = clock.getElapsedTime() * 2;
	coin.position.y = Math.sin(clock.getElapsedTime() * 6) * 20;


	marker.position.x += xv;
	marker.position.z += zv;
	marker.position.y += yv;
	direction += angle;
	if (is_moving_forward) updateWalk(true);
	if (is_moving_back) updateWalk(false);
	checkForJump(jumpAllowed);
	if (detectCoin()) scorePoints();

	if (!isJumping) speed = 15;
	if (isJumping) speed = 20;

	if (marker.position.y > level) {
		yv -= gravity;
	}
	if (marker.position.y < level + 5) {
		yv = 0;
		jumpAllowed = true;
		checkForJump(jumpAllowed);
	}


	if (detectRock()) {
		level = 75;

		if (marker.position.y < level + 1) {
			yv = 0;
			jumpAllowed = true;
			checkForJump(jumpAllowed);
		}
		if (marker.position.y < 75) {
			marker.position.y += 7;
		}
	}

	if (detectTree()) {
		level = 380;


		if (marker.position.y < level + 1) {
			yv = 0;
			jumpAllowed = true;
			checkForJump(jumpAllowed);
		}
		if (marker.position.y < level - 1 && isWalking()) {
			yv += 7;
			jumpAllowed = false;
			checkForJump();
		}
	}
	if (detectDeath() && marker.position.y < level + 5) {
		if (!detectTree() && !detectRock()) {
			respawn(true);
		}
	}


	if (!detectRock() && !detectTree()) {
		level = 0;
	}
	if (detectCollisions()) {
		if (marker.position.y > 370) return;
		if (is_moving_forward) {
			marker.position.x += -speed * Math.sin(direction);
			marker.position.z += -speed * Math.cos(direction);
		}
		if (is_moving_back) {
			marker.position.x += speed * Math.sin(direction);
			marker.position.z += speed * Math.cos(direction);
		}
	}
}

function renderGame() {
	//requestAnimationFrame(renderGame);

	renderer.render(scene, camera);
}
//animate();
//renderGame();
var start = 0,
	duration = 1000 / 100;
Loop();

function Loop(timestamp) {
	requestAnimationFrame(Loop);

	if (timestamp >= start) {
		requestAnimFrame();

		animate();
		renderGame();

		start = timestamp + duration;
	}
}

function walk() {
	if (!isWalking()) return;
	var position = Math.sin(clock.getElapsedTime() * 9) * 50;
	right_hand.position.z = position;
	left_hand.position.z = -position;
	right_foot.position.z = -position;
	left_foot.position.z = position;
}

var direction = Math.PI;
var angle = 0;

function spinAvatar(direction) {
	new TWEEN
		.Tween({ y: marker.rotation.y })
		.to({ y: direction }, 70)
		.onUpdate(function () {
			marker.rotation.y = this.y;
		})
		.start();
}

var is_moving_left, is_moving_right, is_moving_forward, is_moving_back;
var isLeftForward, isRightForward, isLeftBack, isRightBack;
function isWalking() {
	if (xv != 0 || zv != 0) return true;
	return false;
}

function updateWalk(fb) {
	if (fb) {
		xv = speed * Math.sin(direction);
		zv = speed * Math.cos(direction);
		is_moving_forward = true;
	}
	if (!fb) {
		xv = -speed * Math.sin(direction);
		zv = -speed * Math.cos(direction);
		is_moving_back = true;
	}
}
function checkForJump(canornot) {
	if (canornot) {
		if (isJumping) jump();
	}
}

document.addEventListener('keydown', function (event) {
	var code = event.keyCode;


	if (code == 32) {
		jump();
	}


	if (code == 37 || code == 65) {                                   // left
		angle = Math.PI / 70;
		if (is_moving_forward) updateWalk(true);
		if (is_moving_back) updateWalk(false);
		checkForJump(jumpAllowed);
	}
	if (code == 38 || code == 87) {                                   // up
		updateWalk(true);
		checkForJump(jumpAllowed);
	}
	if (code == 39 || code == 68) {                                   // right
		angle = -Math.PI / 70;
		event.preventDefault();
		if (is_moving_forward) updateWalk(true);
		if (is_moving_back) updateWalk(false);
		checkForJump(jumpAllowed);
	}
	if (code == 40 || code == 83) {                                   // down
		updateWalk(false);
		checkForJump(jumpAllowed);
	}

	if (code == 67) {
		firstPerson++;
		if (firstPerson > 1) firstPerson = 0;

		if (firstPerson == 0) {
			camera = fpcam;
			marker.remove(tpcam);

		}
		if (firstPerson == 1) {
			camera = tpcam;
			marker.remove(fpcam);

		}
		marker.add(camera);
	}
});


document.addEventListener('keyup', function (event) {
	var code = event.keyCode;

	if (code == 32) {
		isJumping = false;
	}

	if (code == 37 || code == 65) {
		angle = 0;
	}
	if (code == 38 || code == 87) {
		xv = 0;
		zv = 0;
		is_moving_forward = false;
	}
	if (code == 39 || code == 68) {
		angle = 0;
	}
	if (code == 40 || code == 83) {
		xv = 0;
		zv = 0;
		is_moving_back = false;
	}
	if (code == 16 || code == 67) {
		setTimeout(function () {
			climbing = false;
		}, 500);
	}



	isLeftForward = false;
	isRightForward = false;
	isLeftBack = false;
	isRightBack = false;
});

function detectCollisions() {
	var vector = new THREE.Vector3(0, -1, 0);
	var ray = new THREE.Ray(marker.position, vector);
	var intersects = ray.intersectObjects(not_allowed);
	if (intersects.length > 0) {
		return true;
	}
	return false;
}
function detectClimbableObject() {
	var vector = new THREE.Vector3(0, -1, 0);
	var ray = new THREE.Ray(marker.position, vector);
	var intersects = ray.intersectObjects(climbAble);
	if (intersects.length > 0) {
		return true;
	}
	return false;
}

function detectRock() {
	var vector = new THREE.Vector3(0, -1, 0);
	var ray = new THREE.Ray(marker.position, vector);
	var intersects = ray.intersectObjects(jumpAble);
	if (intersects.length > 0) return true;
	return false;
}

function detectTree() {
	var vector = new THREE.Vector3(0, -1, 0);
	var ray = new THREE.Ray(marker.position, vector);
	var intersects = ray.intersectObjects(jumpTree);
	if (intersects.length > 0) return true;
	return false;
}

function detectCoin() {
	var vector = new THREE.Vector3(0, -1, 0);
	var ray = new THREE.Ray(marker.position, vector);
	var intersects = ray.intersectObjects(coinBox);
	if (intersects.length > 0) return true;
	return false;
}

function coinDT() {
	var vector = new THREE.Vector3(0, -1, 0);
	var ray = new THREE.Ray(coin.position, vector);
	var intersects = ray.intersectObjects(jumpTree);
	if (intersects.length > 0) return true;
	return false;
}

function detectDeath() {
	var vector = new THREE.Vector3(0, -1, 0);
	var ray = new THREE.Ray(marker.position, vector);
	var intersects = ray.intersectObjects(death);
	if (intersects.length > 0) return true;
	return false;
}


function jump() {
	if (!jumpAllowed) return;
	jumpAllowed = false;
	isJumping = true;
	animateJump();
}


function scorePoints() {
	animatefruit();
	runCoin();
	return;
}

var fruit;
function animatefruit() {
	if (fruit) return;

	fruit = new THREE.Mesh(
		new THREE.CylinderGeometry(75, 75, 5, 25),
		new THREE.MeshBasicMaterial({ color: 0xFFD700 })
	);
	if (camera == fpcam) fruit.position.z = 75;
	if (camera == tpcam) fruit.position.z = 0;
	fruit.rotation.x = Math.PI / 2;

	marker.add(fruit);
	if (camera == fpcam) {
		new TWEEN.
			Tween({
				height: 15,
				spin: 0
			}).
			to({
				height: 250,
				spin: 4
			}, 500).
			onUpdate(function () {
				fruit.position.y = this.height;
				fruit.rotation.z = this.spin;
			}).
			onComplete(function () {
				marker.remove(fruit);
				fruit = undefined;
			}).
			start();
	}
	if (camera == tpcam) {
		new TWEEN.
			Tween({
				height: 150,
				spin: 0
			}).
			to({
				height: 300,
				spin: 4
			}, 500).
			onUpdate(function () {
				fruit.position.y = this.height;
				fruit.rotation.z = this.spin;
			}).
			onComplete(function () {
				marker.remove(fruit);
				fruit = undefined;
			}).
			start();
	}
}

function animateJump() {
	yv = 30;
}

function respawn(thing = false) {
	marker.position.set(0, 1000, 0);
	marker.rotation.set(0, 0, 0);

	if (thing) {
		for (let i = death.length - 1; i >= 0; i--) {
			scene.remove(death[i]);
			death.pop();
		}
		death = [];
		clock = null;
		clock = new THREE.Clock();
	}
}
