/// <reference path="../node_modules/phaser/types/phaser.d.ts" />

export default class AnalogCounter {
    scene: Phaser.Scene;
    /**
     * X position of counter in pixels
     */
    private x: number;
    /**
     * Y position of counter in pixels
     */
    private y: number;
    /**
     * Width of counter in pixels. Default: digits * (fontSize + 4)
     */
    readonly width: number;
    /**
     * Height of counter in pixels. Default: fontSize * 2
     */
    readonly height: number;
    /**
     * Number of digits of counter. Default: 6
     */
    readonly digits: number;
    /**
     * Vertical space between digits in pixels. Default: fontSize/2
     */
    readonly padding: number;
    /**
     * CSS property "fontSize" of the font used to make the digits. Default: 24
     */
    readonly fontSize: number;
    /**
     * Color of font in html format (example: '#ff00ff'). Default: '#000000'
     */
    readonly fontColor: string;
    /**
     * Color of background in hex format (example: 0xff00ff). Default: 0xffffff
     */
    readonly backgroundColor: number;
    /**
     * Alpha value of shade effect. 0 disables this effect. Default 0.9.
     */
    readonly shade: number;
    /**
     * Time interval in milliseconds until reach a number. Default: 1000.
     */
    duration: number;

    private gap: number;
    private renderTextureWidth: number;
    private digitsArray: Phaser.GameObjects.RenderTexture[];
    private renderTextureHeight: number;
    private mask: Phaser.Display.Masks.GeometryMask;
    private maskShape: Phaser.GameObjects.Graphics;
    private shadeOverlay: Phaser.GameObjects.RenderTexture;
    private originX: number = 0;
    private originY: number = 0;
    private oX: number;
    private oY: number;

    constructor(scene: Phaser.Scene, x: number, y: number, config: CounterConfig) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        let conf: CounterConfig = config || {};

        this.backgroundColor = conf.backgroundColor != undefined ? config.backgroundColor : 0xffffff;
        this.fontColor = conf.fontColor != undefined ? config.fontColor : '#000000';
        this.fontSize = conf.fontSize || 24;
        this.padding = conf.padding || Math.round(this.fontSize / 2);
        this.digits = conf.digits || 6;
        this.height = conf.height || this.fontSize * 2;
        if (this.height > this.fontSize * 2) {
            this.height = this.fontSize * 2;
        }
        this.width = conf.width || this.digits * (this.fontSize + 4);
        this.shade = conf.shade != undefined ? conf.shade : 0.9;
        this.duration = conf.duration != undefined ? conf.duration : 1000;

        this.oX = this.x - this.originX * this.width;
        this.oY = this.y - this.originY * this.height;

        this.init();
    } // End constructor



    private getBackground(): Phaser.GameObjects.Graphics {
        let graphics = this.scene.add.graphics();
        graphics.lineStyle(1, 0x000000, 0.9);
        graphics.fillStyle(this.backgroundColor, 1);
        graphics.fillRect(0, 0, this.renderTextureWidth, this.renderTextureHeight);
        graphics.strokeRect(0, 0, this.renderTextureWidth, this.renderTextureHeight);

        return graphics;
    }



    private init() {

        this.gap = Math.ceil(this.padding + this.fontSize / 2);
        this.renderTextureWidth = Math.ceil(this.width / this.digits);
        this.renderTextureHeight = this.height / 2 + 10 * this.gap;

        this.initMask();

        this.initDigitsArray();

        if (this.shade) {
            this.makeShade(this.shade);
        }
    }



    private initDigitsArray() {
        this.digitsArray = [];
        let background = this.getBackground();
        const style = { fontFamily: 'Arial', fontSize: this.fontSize, fontStyle: 'bold', color: this.fontColor };

        for (let i = 0; i < this.digits; i++) {
            // Create one render texture for each digit
            let rt = this.scene.add.renderTexture(this.oX + i * this.renderTextureWidth, this.oY, this.renderTextureWidth, this.renderTextureHeight)
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



    private initMask() {
        this.maskShape = this.scene.make.graphics({})
            .fillStyle(0xffffff)
            .fillRect(this.oX, this.y, this.width, this.height);
        this.mask = this.maskShape.createGeometryMask();
    }



    private makeShade(alpha: number) {
        this.shadeOverlay = this.scene.add.renderTexture(this.oX, this.y, this.width, this.height);

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





    //// PUBLIC METHODS

    /**
     * Sets a new number as target of the animation
     * @param number Integer to set the new number
     */
    setNumber(number: number) {
        const duration = this.duration;

        let numberStr = number.toString();
        numberStr = numberStr.padStart(this.digits, '0');
        let nums = numberStr.split('');
        const originY = this.oY;

        nums.forEach((digit: string, index: number) => {
            let num = parseInt(digit);

            if (this.digitsArray[index].y != - num * this.gap) {
                let target = this.digitsArray[index];
                let gap = this.gap;

                let tween = this.scene.tweens.add({
                    targets: target,
                    y: originY - num * gap,
                    duration: duration,
                    ease: 'Power2',
                    onComplete: () => {
                        tween.stop();
                    }
                });
            }
        }); // End foreach
    } // End setNumber



    /**
     * Sets relative origin
     * @param originX Number between 0 and 1. 0: left, 0.5: center, 1: right
     * @param originY Number between 0 and 1. 0: top, 0.5: center, 1: bottom
     */
    setOrigin(originX: number, originY: number) {
        if (originY == undefined) {
            this.originX = originX;
            this.originY = originX;
        } else {
            this.originX = originX;
            this.originY = originY;
        }
        this.setPosition(this.x, this.y);
    }



    /**
     * Sets counter screen position
     * @param x Position x in pixels
     * @param y Position y in pixels
     */
    setPosition(x?: number, y?: number) {
        let deltaX = 0;
        let deltaY = 0;
        if (x != undefined) {
            let newoX = x - this.originX * this.width;
            deltaX = newoX - this.oX;
            this.x = x;
            this.oX = newoX;
        }
        if (y != undefined) {
            let newoY = y - this.originY * this.height;
            deltaY = newoY - this.oY;
            this.y = y;
            this.oY = newoY;
        }

        // Render texture digits position
        this.digitsArray.forEach((rt) => {
            rt.x += deltaX,
                rt.y += deltaY
        });
        // Shade position
        if (this.shade) {
            this.shadeOverlay.setPosition(this.oX, this.oY);
        }
        //Mask position
        this.mask.geometryMask.x += deltaX;
        this.mask.geometryMask.y += deltaY;

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
    /**
     * Time interval in milliseconds until reach a number. Default: 1000.
     */
    duration?: number;
}