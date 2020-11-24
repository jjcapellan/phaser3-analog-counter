class LoadScreen extends Phaser.Scene {
    constructor() {
        super('loadScreen');
    }

    preload() {

        this.text_loading = this.add.text(200, 200, 'Loading...');

        this.load.on('complete', function () {
            this.scene.start('menu');
        }, this);

        //this.load.image('visor', 'assets/imgs/visor6digits.png');
        this.load.on('progress', this.updateText, this);

    }

    updateText(progress) {
        this.text_loading.text = `Loading ... ${Math.round(progress * 100)}%`;
    }
}