let canvas = document.getElementById('Game');
let ctx = canvas.getContext('2d');

class Paddle {
    constructor(x, y, height) {
        this.x = x;
        this.y = y;
        this.yv = 0;
        this.height = height;
        this.width = 5;
    }
    move() {
        this.y += this.yv;
    }
    render(color) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    getDim() {
        return { x: this.x, y: this.y };
    }
}

class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.xv = 0;
        this.yv = 0;
        this.radius = radius;
        this.color = color;
    }
    render() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    move() {
        this.x += this.xv;
        this.y += this.yv;
    }
}

let player = new Paddle(480, canvas.height / 2 - 25, 50);
let computer = new Paddle(18, canvas.height / 2 - 25, 50);
let ball = new Ball(canvas.width / 2 - 10, canvas.height / 2 - 10, 10, "white");


function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.render("gold");
    computer.render("red");
    ball.render();

    player.move();
    computer.move();
    ball.move();

    window.requestAnimationFrame(loop);
}

addEventListener("keydown", (event) => {
    let code = event.keyCode;

});