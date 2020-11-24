/// <reference path="../node_modules/phaser/types/phaser.d.ts" />

export default class Counter {
    scene: Phaser.Scene;
    /**
     * X position of counter in pixels
     */
    x: number;
    /**
     * Y position of counter in pixels
     */
    y: number;
    /**
     * Width of counter in pixels. Default: digits * (fontSize + 4)
     */
    width: number;
    /**
     * Height of counter in pixels. Default: fontSize * 3
     */
    height: number;
    /**
     * Number of digits of counter. Default: 6
     */
    digits: number;
    /**
     * Vertical space between digits in pixels. Default: fontSize/2
     */
    padding: number;
    /**
     * CSS property "fontSize" of the font used to make the digits. Default: 24
     */
    fontSize: number;
    /**
     * Color of font in html format (example: '#ff00ff'). Default: '#000000'
     */
    fontColor: string;
    /**
     * Color of background in hex format (example: 0xff00ff). Default: 0xffffff
     */
    backgroundColor: number;
    /**
     * Alpha value of shade effect. 0 disables this effect. Default 0.9.
     */
    shade: number;

    private gap: number;
    private renderTextureWidth: number;
    private digitsArray: Phaser.GameObjects.RenderTexture[];
    private renderTextureHeight: number;
    private mask: Phaser.Display.Masks.GeometryMask;
    private shadeOverlay: Phaser.GameObjects.RenderTexture;

    constructor(scene: Phaser.Scene, x: number, y: number, config: CounterConfig) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        let conf: CounterConfig = config || {};

        this.backgroundColor = conf.backgroundColor != undefined ? config.backgroundColor : 0xffffff;
        this.fontColor = conf.fontColor != undefined ? config.fontColor : '#000000';
        this.fontSize = conf.fontSize || 24;
        this.padding = conf.padding || Math.ceil(this.fontSize / 2);
        this.digits = conf.digits || 6;
        this.height = conf.height || this.fontSize * 2;
        this.width = conf.width || this.digits * (this.fontSize + 4);
        this.shade = conf.shade != undefined ? conf.shade : 0.9;

        this.init();
    }

    init() {

        this.gap = Math.ceil(this.padding + this.fontSize / 2);
        this.renderTextureWidth = Math.ceil(this.width / this.digits);
        this.renderTextureHeight = this.height / 2 + 10 * this.gap;

        this.initMask();

        this.initDigitsArray();

        if (this.shade) {
            this.makeShade(this.shade);
        }
    }

    initMask() {
        let maskShape = this.scene.make.graphics({}).fillStyle(0xffffff).fillRect(this.x, this.y, this.width, this.height);
        this.mask = maskShape.createGeometryMask();
    }

    initDigitsArray() {
        this.digitsArray = [];
        let background = this.getBackground();
        const style = { fontFamily: 'Arial', fontSize: this.fontSize, fontStyle: 'bold', color: this.fontColor };

        for (let i = 0; i < this.digits; i++) {
            // Create one render texture for each digit
            let rt = this.scene.add.renderTexture(this.x + i * this.renderTextureWidth, this.y, this.renderTextureWidth, this.renderTextureHeight)
                .setOrigin(0);

            // Adds background
            rt.draw(background, 0, 0);

            // Adds first fake digit above 0
            let first = this.scene.add.text(0, 0, '9', style)
                .setOrigin(0.5, 0.5);
            rt.draw(first, this.renderTextureWidth / 2, this.height / 2 - this.gap);
            first.destroy();

            // Adds 0...9 numbers
            for (let j = 0; j < 10; j++) {
                let text = this.scene.add.text(0, 0, j.toString(), style)
                    .setOrigin(0.5, 0.5);
                rt.draw(text, this.renderTextureWidth / 2, this.height / 2 + j * this.gap);
                text.destroy();
            }

            // Fake digit bellow 9
            let last = this.scene.add.text(0, 0, '0', style)
                .setOrigin(0.5, 0.5);
            rt.draw(last, this.renderTextureWidth / 2, this.renderTextureHeight);
            last.destroy();

            // Mask
            rt.setMask(this.mask);

            // Adds renderTexture element to digitsArray
            this.digitsArray[i] = rt;
        }

        background.destroy();

    }// End initDigitsArray

    getBackground(): Phaser.GameObjects.Graphics {
        let graphics = this.scene.add.graphics();
        graphics.lineStyle(1, 0x000000, 0.9);
        graphics.fillStyle(this.backgroundColor, 1);
        graphics.fillRect(0, 0, this.renderTextureWidth, this.renderTextureHeight);
        graphics.strokeRect(0, 0, this.renderTextureWidth, this.renderTextureHeight);

        return graphics;
    }

    setNumber(number: number) {
        let numberStr = number.toString();
        numberStr = numberStr.padStart(this.digits, '0');
        let nums = numberStr.split('');
        const originY = this.y;

        nums.forEach((digit: string, index: number) => {
            let num = parseInt(digit);

            if (this.digitsArray[index].y != - num * this.gap) {
                let target = this.digitsArray[index];
                let gap = this.gap;

                let tween = this.scene.tweens.add({
                    targets: target,
                    y: originY - num * gap,
                    duration: 1000,
                    ease: 'Power2',
                    onComplete: () => {
                        tween.stop();
                    }
                });
            }
        }); // End foreach
    } // End setNumber

    makeShade(alpha: number) {
        this.shadeOverlay = this.scene.add.renderTexture(this.x, this.y, this.width, this.height);

        let halfRt = this.scene.make.renderTexture({ width: this.width, height: this.height / 2 }).setOrigin(0);
        let graphics = this.scene.make.graphics({});
        graphics.fillStyle(0x000000, alpha);
        graphics.fillRect(0, 0, this.width, this.height / 2);

        halfRt.draw(graphics, 0, 0);

        // Top half shade
        halfRt.setAlpha(1, 1, 0, 0);
        this.shadeOverlay.draw(halfRt, 0, 0);

        // Bottom half shade
        halfRt.setAlpha(0, 0, 1, 1);
        this.shadeOverlay.draw(halfRt, 0, this.height / 2);

        halfRt.destroy();
        graphics.destroy();
    }
}


//// TYPES
interface CounterConfig {
    /**
     * Width of counter in pixels. Default: digits * (fontSize + 4)
     */
    width?: number,
    /**
     * Height of counter in pixels. Default: fontSize * 2
     */
    height?: number,
    /**
     * Number of digits of counter. Default: 6
     */
    digits?: number,
    /**
     * Vertical space between digits in pixels. Default: fontSize/2
     */
    padding?: number,
    /**
     * CSS property "fontSize" of the font used to make the digits. Default: 24
     */
    fontSize?: number,
    /**
     * Color of font in html format (example: '#ff00ff'). Default: '#000000'
     */
    fontColor?: string,
    /**
     * Color of background in hex format (example: 0xff00ff). Default: 0xffffff
     */
    backgroundColor?: number,
    /**
     * Alpha value of shade effect. 0 disables this effect. Default 0.9.
     */
    shade?: number
}