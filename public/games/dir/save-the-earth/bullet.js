class Bullet {
  constructor(x,s) {
    this.x = x;
    this.y = 314;
    this.s = s;
  }
  render() {
    ctx.drawImage(bullet,this.x,this.y,10,10)
  }
  move(speed) {
    this.y -= speed;
  }
  collision() {
    for (let j=0; j < enemies.length; j++) {
      if(this.y <= enemies[j].y) {
        if(this.x >= enemies[j].x && this.x <= enemies[j].x+20) {
          score += 20;
          gscore += 20;
          enemies = destroy(enemies, j);
          bullets = destroy(bullets, g);
          return;
        }
        if(this.x+20 >= enemies[j].x && this.x+20 <= enemies[j].x+20) {
          score += 20;
          gscore += 20;
          enemies = destroy(enemies, j);
          bullets = destroy(bullets, g);
          }
        }
      }
    }
  }
