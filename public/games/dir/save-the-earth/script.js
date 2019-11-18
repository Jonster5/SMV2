let c = document.getElementById("c");
let ctx = c.getContext("2d");

let bs = 10;
let br = 5;
let bp = 1;
let ps = 5;
let es = 2;
let enemies = [];
let bullets = [];
let ices = [];
let triples = [];
let score = 0;
let gscore = 0;
let pause = true;
let alerted = false;
let fired2 = false;
let g;
let f;
let checkVibe;
let checkVibe2;
let ammo = 10;
let am = 10;
let r = 0;
let iceTime = 150;
let tripleTime = 150;
let cyc = true;
let iceActive = false;
let tripleActive = false;
let speed = 2;

let player = new Player(180);

setInterval(function() {
  if(pause == false) {
  ctx.clearRect(0,0,400,400);
  lineManager();
  textManager();
  healthManager();
  playerManager();
  enemyManager();
  bulletManager();
  collisionManager();
  iceManager();
  tripleManager();
  reload();
  iceTimer();
  tripleTimer();
  if(iceActive == true) {
      for(let i = 0; i < enemies.length; i++) {
        speed = 1;
      }
    } else {
        speed = 2;
      }
  }

}, 20);

function iceTimer() {
  if(iceActive == true) {
    if(iceTime > 0) {
      iceTime-=0.25;
      ctx.fillStyle = "blue";
      ctx.fillRect(380,295,15,-iceTime);
      return;
    } else if(iceTime == 0) {
      iceTime = 150;
      iceActive = false;
      return;
    }
  }
}

function tripleTimer() {
  if(tripleActive == true) {
    if(tripleTime > 0) {
      tripleTime-=0.25;
      ctx.fillStyle = "yellow";
      ctx.fillRect(360,295,15,-tripleTime);
      return;
    } else if(tripleTime == 0) {
      tripleTime = 150;
      tripleActive = false;
      return;
    }
  }
}

function reload() {
  if(pause == false) {
  if(ammo == 0) {
    if(r<150) {
      r+= 3;
      ctx.fillStyle = "green";
      ctx.fillRect(20,295,15,-r);
      return;
    } else if(r == 150) {
      r = 0;
      ammo = am;
      cyc = true
      return;
    }
  }
}
}

setInterval(function() {
  if(pause) return;
  enemies.push(new BaseEnemy(0,2));
},1250)

setInterval(function() {
  if(pause) return;
  ices.push(new IcePower(0));
},20000)

setInterval(function() {
  if(pause) return;
  triples.push(new TriplePower(0));
},30000)

function upgradeSpeed() {
  if(score >= 1000 && bs < 16) {
    bs += 1;
    score -= 1000;
  }
}

function playerManager() {
  player.render();
}

function iceManager() {
  for(checkVibe=0; checkVibe < ices.length; checkVibe++) {
    ices[checkVibe].render();
    ices[checkVibe].move();
    ices[checkVibe].vibeCheck();
  }
}
function tripleManager() {
  for(checkVibe2=0; checkVibe2 < triples.length; checkVibe2++) {
    triples[checkVibe2].render();
    triples[checkVibe2].move();
    triples[checkVibe2].vibeCheck();
  }
}

function enemyManager() {
  for(let j = 0; j < enemies.length; j++) {
    enemies[j].render();
    enemies[j].move(es);
  }
}

function bulletManager() {
  for(let i = 0; i < bullets.length; i++) {
    bullets[i].render();
    bullets[i].move(bs);
  }
}

function collisionManager() {
  for(f=0;f<enemies.length;f++) {
    enemies[f].vibeCheck()
  }
  for(g = 0; g < bullets.length; g++) {
    bullets[g].collision();
    if(bullets[g].y < 1) {
      bullets = destroy(bullets, g);
    }
  }
}

function healthManager() {
  if(player.hp <= 0) {
    document.getElementById("c").style.visibility = "hidden";
    if(alerted == false) {
      alert("YOU DIED!")
      location.reload();
      pause = true
    }
  }
}

function lineManager() {
  ctx.strokeStyle = "green";
  ctx.beginPath();
  ctx.moveTo(0,325);
  ctx.lineTo(400,325);
  ctx.lineWidth = 4;
  ctx.stroke();
  for(let f = 0; f < enemies.length; f++) {
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
  ctx.fillText("Ammo: " + ammo,10,80)
  if(pause == true) {
    ctx.font = "30px arial";
    ctx.fillStyle = "white";
    ctx.fillText("Game Paused" , 115, 180)
  }
  if(ammo == 0) {
    ctx.fillStyle = "white"
    ctx.fillText("Reloading...", 150,225)
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


  if(code == 32 && fired == false) {
    if(ammo > 0) {
      bullets.push(new Bullet(player.x+5))
      ammo -= 1;
    } else if(ammo == 0) {
      cyc = false
    }
    fired = true;
  }
  if(code == 27) {
    if(pause == true && fired2 == false) {
    pause = false;
  } else if(fired2 == false) {
    pause = true;
    textManager();
      }
    fired2 = true;
    }
});
document.addEventListener('keyup', function() {
  let code2 = event.keyCode;
  if(code2 == 32) {
      fired = false;
  }
  if(code2 == 27) {
  fired2 = false;
}

})
c.addEventListener('click', function() {
  if(ammo > 0) {
    if(tripleActive == false) {
      bullets.push(new Bullet(player.x+5))
      ammo -= 1;
    } else if(tripleActive == true) {
        bullets.push(new Bullet(player.x+5))
        bullets.push(new Bullet(player.x+30))
        bullets.push(new Bullet(player.x-20))
        ammo -= 1;
    }
  } else if(ammo == 0) {
    cyc = false
  }
})
