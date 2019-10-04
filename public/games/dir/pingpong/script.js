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
    init() {
        this.xv = random(5, 10);
        this.yv = random(5, 10);

        if (random(0, 1) == 0) {
            this.xv = -this.xv;
        }

        if (random(0, 1) == 1) {
            this.yv = -this.yv;
        }
    }
    move() {
        this.x += this.xv;
        this.y += this.yv;

        if (this.x - this.radius < 0) score(true);
        if (this.y - this.radius < 0) this.yv = Math.abs(this.yv) + Math.random() - 0.5;
        if (this.x + this.radius > canvas.width) score(false);
        if (this.y + this.radius > canvas.height) this.yv = -Math.abs(this.yv) + Math.random() - 0.5;
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

let stage;


function init() {
    stage = {

        player: new Paddle(canvas.width - 20, canvas.height / 2 - 25, 70),
        computer: new Paddle(18, canvas.height / 2 - 25, 70),

        ball: new Ball(canvas.width / 2 - 10, canvas.height / 2 - 10, 10, "white")
    };
    stage.ball.init();

}



function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stage.player.render("gold");
    stage.computer.render("red");
    stage.ball.render();

    stage.computer.y = stage.ball.y - stage.computer.height / 2;

    stage.player.move();
    stage.computer.move();
    stage.ball.move();

    stage.ball.chp(stage.player, true);
    stage.ball.chp(stage.computer, false);

    stage.player.move();
    stage.computer.move();

    window.requestAnimationFrame(loop);
}

function score(plornot, no) {
    delete stage.ball;
    if (plornot) {

    } else {

    }
    stage.ball = new Ball(canvas.width / 2 - 10, canvas.height / 2 - 10, 10, "white");
    stage.ball.init();
}

canvas.onmousemove = function(e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;



    if (y > canvas.height - stage.player.height / 2) y = canvas.height - stage.player.height / 2;
    if (y <= 0) y = 0;
    stage.player.y = y - stage.player.height / 2;
}