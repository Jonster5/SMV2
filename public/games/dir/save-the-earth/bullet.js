class Bullet {
  constructor(x,s) {
    this.x = x;
    this.y = 314;
    this.s = s;
  }
  render() {
    if(iceActive == false) {
          ctx.drawImage(bullet,this.x,this.y,10,10)
    } else {
      ctx.drawImage(ice_bullet,this.x,this.y,10,10)
    }

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
      for (let j=0; j < ices.length; j++) {
        if(this.y <= ices[j].y) {
          if(this.x >= ices[j].x && this.x <= ices[j].x+20) {
            iceActive = true;
            ices = destroy(ices, j);
            bullets = destroy(bullets, g);
            return;
          }
          if(this.x+20 >= ices[j].x && this.x+20 <= ices[j].x+20) {
            iceActive = true;
            ices= destroy(ices, j);
            bullets = destroy(bullets, g);
            }
          }
        }
        for (let j=0; j < triples.length; j++) {
          if(this.y <= triples[j].y) {
            if(this.x >= triples[j].x && this.x <= triples[j].x+20) {
              tripleActive = true;
              triples = destroy(triples, j);
              bullets = destroy(bullets, g);
              return;
            }
            if(this.x+20 >= triples[j].x && this.x+20 <= triples[j].x+20) {
              tripleActive = true;
              triples = destroy(triples, j);
              bullets = destroy(bullets, g);
              }
            }
          }
    }
  }
