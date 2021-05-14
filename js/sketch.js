// standard
var canvas;
// planets
let planets = []
let sun
let numPlanets = 4
let G = 60
let destabilise = 0.15
// stars
let x, y;
let c;
let down;
let stars = [];
let sky = 0;


function windowResized() {
	resizeCanvas(windowWidth, windowHeight + 100);
	background(8, 0, 46);
}

function setup() {

	canvas = createCanvas(windowWidth, windowHeight  + 100);
	canvas.position(0, 0);
	canvas.style('z-index', '-1');
	background(8, 0, 46);

	// make the stars
	x = width;
	y = height;
	c = 255;

	for (let i = 0; i < 1000; i++) {
		stars[i] = new Star(random(width), random(height), random(255), random(2, 10), random(10));
	}

	sun = new Body(50, createVector(0, 0), createVector(0, 0))
	// Initialise the planets
	for (let i = 0; i < numPlanets; i++) {
		let mass = random(5, 15)
		let radius = random(sun.d, min(windowWidth / 2, windowHeight / 2))
		let angle = random(0, TWO_PI)
		let planetPos = createVector(radius * cos(angle), radius * sin(angle))

		// Find direction of orbit and set velocity
		let planetVel = planetPos.copy()
		if (random(1) < 0) planetVel.rotate(-HALF_PI)
		else planetVel.rotate(HALF_PI) // Direction of orbit
		planetVel.normalize()
		planetVel.mult(sqrt((G * sun.mass) / (radius))) // Circular orbit velocity
		planetVel.mult(random(1 - destabilise, 1 + destabilise)) // create elliptical orbit

		planets.push(new Body(mass, planetPos, planetVel))
	}
}

function draw() {

	// general
	background(8, 0, 46)

	// stars
	for (let i = 0; i < stars.length; i++) {
		stars[i].twinkle();
		stars[i].showStar();
	}

	// planets
	translate(width / 2, height / 2)
	for (let i = numPlanets - 1; i >= 0; i--) {
		sun.attract(planets[i])
		planets[i].move()
		planets[i].show()
	}
	sun.show()
}


function Body(_mass, _pos, _vel) {
	this.mass = _mass
	this.pos = _pos
	this.vel = _vel
	this.d = this.mass * 2
	this.thetaInit = 0
	this.path = []
	this.pathLen = Infinity

	this.show = function () {
		stroke(255)
		for (let i = 0; i < this.path.length - 2; i++) {
			line(this.path[i].x, this.path[i].y, this.path[i + 1].x, this.path[i + 1].y, )
		}
		fill(255, 250, 235);
		noStroke()
		ellipse(this.pos.x, this.pos.y, this.d, this.d)
	}


	this.move = function () {
		this.pos.x += this.vel.x
		this.pos.y += this.vel.y
		this.path.push(createVector(this.pos.x, this.pos.y))
		if (this.path.length > 200) this.path.splice(0, 1)
	}

	this.applyForce = function (f) {
		this.vel.x += f.x / this.mass
		this.vel.y += f.y / this.mass
	}

	this.attract = function (child) {
		let r = dist(this.pos.x, this.pos.y, child.pos.x, child.pos.y)
		let f = (this.pos.copy()).sub(child.pos)
		f.setMag((G * this.mass * child.mass) / (r * r))
		child.applyForce(f)
	}
}

class Star {
	constructor(tx, ty, tc, tf, td) {
		this.x = tx;
		this.y = ty;
		this.c = tc;
		this.f = tf;
		this.down = td;
	}

	showStar() {
		stroke(this.c)
		point(this.x, this.y);
	}

	twinkle() {
		if (this.c >= 255) {
			this.down = true;
		}
		if (this.c <= 0) {
			this.down = false;
		}

		if (this.down) {
			this.c -= this.f
		} else {
			this.c += this.f
		}
	}
}
