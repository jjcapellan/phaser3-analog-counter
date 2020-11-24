function runGame() {
  var config = {
    type: Phaser.AUTO,
    width: 400,
    height: 400,
    parent: 'game',
    backgroundColor: 0x000000,
    scene: [Test]
  };

  new Phaser.Game(config);
}

window.onload = function () {
  runGame();
};
