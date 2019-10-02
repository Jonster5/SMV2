let canvas = document.getElementById('Game');
let ctx = canvas.getContext('2d');

function random(min, max, floatrnot = false) {
    if (!floatrnot) return Math.floor(Math.random() * (max - min + 1)) + min;
    if (floatrnot) return Math.random() * (max - min + 1) + min;
}

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

        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvas.height) this.y = canvas.height - this.height;
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

        if (this.x - this.radius < 0) this.xv = -this.xv + Math.random() - 0.5;
        if (this.y - this.radius < 0) this.yv = -this.yv + Math.random() - 0.5;
        if (this.x + this.radius > canvas.width) this.xv = -this.xv + Math.random() - 0.5;
        if (this.y + this.radius > canvas.height) this.yv = -this.yv + Math.random() - 0.5;
    }
    chp(paddle, right) {
        if (right) {
            if (this.x + this.radius >= paddle.x) {
                if (this.y >= paddle.y && this.y <= paddle.y + paddle.height) this.xv = -Math.abs(this.xv) + Math.random() - 0.5;
            }
        } else {
            if (this.x - this.radius <= paddle.x + paddle.width) {
                if (this.y >= paddle.y && this.y <= paddle.y + paddle.height) this.xv = Math.abs(this.xv) + Math.random() - 0.5;
            }
        }
    }
}

let player = new Paddle(480, canvas.height / 2 - 25, 70);
let computer = new Paddle(18, canvas.height / 2 - 25, 70);
let ball = new Ball(canvas.width / 2 - 10, canvas.height / 2 - 10, 10, "white");

ball.xv = random(5, 10);
ball.yv = random(5, 10);

if (random(0, 1) == 0) {
    ball.xv = -ball.xv;
}

if (random(0, 1) == 1) {
    ball.yv = -ball.yv;
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.render("gold");
    computer.render("red");
    ball.render();

    computer.y = ball.y - computer.height / 2;

    player.move();
    computer.move();
    ball.move();

    ball.chp(player, true);
    ball.chp(computer, false);

    player.move();
    computer.move();

    window.requestAnimationFrame(loop);
}

function score(plornot, no) {

}

canvas.onmousemove = function(e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;



    if (y > canvas.height - player.height) y = canvas.height - player.height;

    player.y = y;
}