class IcePower {
  constructor(y) {
    this.x = Math.floor(Math.random() * 380);
    this.y = y;
  }
  render() {
    ctx.drawImage(ice,this.x,this.y,20,20)
  }
  move() {
    this.y += 1;
  }
  vibeCheck() {
    if(this.y >= 314) {
      ices = destroy(ices, checkVibe)
    }
  }
}
