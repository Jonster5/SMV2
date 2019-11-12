class BaseEnemy {
  constructor(y) {
    this.x = Math.floor(Math.random() * 380)
    this.y = y;
  }
  render() {
    ctx.fillStyle = "blue";
    ctx.drawImage(enemy,this.x,this.y,20,20)
  }
  move(speed) {
    this.y += speed
  }
  vibeCheck() {
    if(this.y >= 314) {
      enemies = destroy(enemies, f)
      player.hp -= 20;
    }
  }
}
