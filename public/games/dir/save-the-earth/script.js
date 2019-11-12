let c = document.getElementById("c");
let ctx = c.getContext("2d");

let bs = 10;
let br = 5;
let bp = 1;
let ps = 5;
let es = 1;
let enemies = [];
let bullets = [];
let score = 0;
let gscore = 0;
let pause = false;
let alerted = false;
let g;
let f;
let ammo = 10;
let am = 10;
let r = 0;
let cyc = true;

let player = new Player(180);

setInterval(function() {
    if (pause == false) {
        ctx.clearRect(0, 0, 400, 400);
        lineManager();
        textManager();
        healthManager();
        playerManager();
        enemyManager();
        bulletManager();
        collisionManager();
    }
    if (pause == false) {
        if (ammo == 0) {
            if (r < 150) {
                r += 3;
                ctx.fillStyle = "green";
                ctx.fillRect(20, 295, 15, -r);
                return;
            } else if (r == 150) {
                r = 0;
                ammo = am;
                cyc = true
                return;
            }
        }
    }
}, 20);

setInterval(function() {
    if (pause) return;
    enemies.push(new BaseEnemy(0));
}, 750)

function upgradeSpeed() {
    if (score >= 1000 && bs < 16) {
        bs += 1;
        score -= 1000;
    }
}

// function reload() {
//     setTimeout(function() {
//       if(r<150) {
//         r+=3;
//         ctx.fillStyle = "green";
//         ctx.fillRect(20,295,15,-r);
//         reload();
//         return;
//         console.log(r)
//       } else if(r == 150) {
//         r = 0;
//         ammo = am
//         cyc = true;
//         return;
//       }
//     },20)
// }


function playerManager() {
    player.render();
}

function enemyManager() {
    for (let j = 0; j < enemies.length; j++) {
        enemies[j].render();
        enemies[j].move(es);
    }
}

function bulletManager() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].render();
        bullets[i].move(bs);
    }
}

function collisionManager() {
    for (f = 0; f < enemies.length; f++) {
        enemies[f].vibeCheck()
    }
    for (g = 0; g < bullets.length; g++) {
        bullets[g].collision();
        if (bullets[g].y < 1) {
            bullets = destroy(bullets, g);
        }
    }
}

function healthManager() {
    if (player.hp <= 0) {
        document.getElementById("c").style.visibility = "hidden";
        if (alerted == false) {
            alert("YOU DIED!")
            location.reload();
            pause = true
        }
    }
}

function lineManager() {
    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.moveTo(0, 325);
    ctx.lineTo(400, 325);
    ctx.lineWidth = 4;
    ctx.stroke();
    for (let f = 0; f < enemies.length; f++) {
        enemies[f].vibeCheck()
    }
}

function destroy(array, pos) {
    let arr1 = array.slice(0, pos);
    let arr2 = array.slice(pos + 1, array.length);
    return arr1.concat(arr2);
}

function textManager() {
    ctx.font = "30px arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 10, 50);
    ctx.fillText("Heath: " + player.hp, 200, 50)
    ctx.fillText("Ammo: " + ammo, 10, 80)
    if (pause == true) {
        ctx.font = "30px arial";
        ctx.fillStyle = "white";
        ctx.fillText("Game Paused", 115, 180)
    }
    if (ammo == 0) {
        ctx.fillStyle = "white"
        ctx.fillText("Reloading...", 150, 225)
    }
}

c.addEventListener("mousemove", function(e) {
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;


    if (x > 380) x = 380;
    if (x < 20) x = 20;
    player.px(x - 10);
});


var fired = false;

document.addEventListener('keydown', function() {
    var code = event.keyCode;


    if (code == 32 && fired == false) {
        if (ammo > 0) {
            bullets.push(new Bullet(player.x + 5))
            ammo -= 1;
        } else if (ammo == 0) {
            cyc = false
        }
        fired = true;
    }
    if (code == 27) {

        if (pause == true) {
            pause = false;
        } else {
            pause = true;
            textManager();
        }
    }
});
document.addEventListener('keyup', function() {
    fired = false;

})
c.addEventListener('click', function() {
    if (ammo > 0) {
        bullets.push(new Bullet(player.x + 5))
        ammo -= 1;
    } else if (ammo == 0) {
        cyc = false
    }
})