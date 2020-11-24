class Test extends Phaser.Scene {
  constructor() {
    super('test');
  }

  create(){
      let x = this.game.config.width/2 - 3 * 50;
      let y = this.game.config.height/2 - 2 * 25;
      this.camera1 = this.cameras.add(x, y, 6 * 50, 4 * 25)
      .setOrigin(0);
      this.camera1.setScroll(2000, 0);

      const counter = new AnalogCounter(this, 100, 50);
      const counter1 = new AnalogCounter(this, 100, 150, {backgroundColor: 0xcc0000, fontColor: '#ffffff', digits: 3});
      const counter2 = new AnalogCounter(this, 100, 250, {backgroundColor: 0x0000cc, fontColor: '#ffffff', digits: 2});

      counter2.setPosition(25, 150);


      counter.setNumber(1925);
      counter1.setNumber(162);

  }
}
