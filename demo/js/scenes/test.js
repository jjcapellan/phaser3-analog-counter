class Test extends Phaser.Scene {
  constructor() {
    super('test');
  }

  create() {

    this.add.text(200, 260, 'Click on screen').setOrigin(0.5);

    const counter = new AnalogCounter(this, 200, 50);
    const counter1 = new AnalogCounter(this, 200, 125, { backgroundColor: 0xcc0000, fontColor: '#ffffff', digits: 3 });
    const counter2 = new AnalogCounter(this, 200, 200, { duration: 500, backgroundColor: 0x0000cc, fontColor: '#ffffff', digits: 2 });

    counter.setOrigin(0.5);

    counter1.setOrigin(0.5);

    counter2.setOrigin(0.5);

    this.input.on('pointerdown', () => {
      counter.setNumber(Phaser.Math.Between(10, 999999));
      counter1.setNumber(Phaser.Math.Between(1, 999));
      counter2.setNumber(Phaser.Math.Between(1, 99));
    });

  }
}
