class Player {
  constructor(x) {
    this.x = x
    this.hp = 100;
  }
  render() {
    ctx.fillStyle = "red";
    ctx.drawImage(playerImage,this.x,350,20,20);
  }
  px(x) {
    this.x = x;
  }

}
