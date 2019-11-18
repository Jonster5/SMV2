class TriplePower {
  constructor(y) {
    this.x = Math.floor(Math.random() * 380);
    this.y = y;
  }
  render() {
    ctx.drawImage(triple_shot,this.x,this.y,20,20)
  }
  move() {
    this.y += 1;
  }
  vibeCheck() {
    if(this.y >= 314) {
      triples = destroy(triples, checkVibe2)
    }
  }
}
