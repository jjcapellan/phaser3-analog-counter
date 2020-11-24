/// <reference types="phaser" />
export default class AnalogCounter {
    scene: Phaser.Scene;
    /**
     * X position of counter in pixels
     */
    private x;
    /**
     * Y position of counter in pixels
     */
    private y;
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
    private gap;
    private renderTextureWidth;
    private digitsArray;
    private renderTextureHeight;
    private mask;
    private maskShape;
    private shadeOverlay;
    private originX;
    private originY;
    private oX;
    private oY;
    constructor(scene: Phaser.Scene, x: number, y: number, config: CounterConfig);
    private getBackground;
    private init;
    private initDigitsArray;
    private initMask;
    private makeShade;
    /**
     * Sets a new number as target of the animation
     * @param number Integer to set the new number
     */
    setNumber(number: number): void;
    /**
     * Sets relative origin
     * @param originX Number between 0 and 1. 0: left, 0.5: center, 1: right
     * @param originY Number between 0 and 1. 0: top, 0.5: center, 1: bottom
     */
    setOrigin(originX: number, originY: number): void;
    /**
     * Sets counter screen position
     * @param x Position x in pixels
     * @param y Position y in pixels
     */
    setPosition(x?: number, y?: number): void;
}
interface CounterConfig {
    /**
     * Width of counter in pixels. Default: digits * (fontSize + 4)
     */
    width?: number;
    /**
     * Height of counter in pixels. Default: fontSize * 2
     */
    height?: number;
    /**
     * Number of digits of counter. Default: 6
     */
    digits?: number;
    /**
     * Vertical space between digits in pixels. Default: fontSize/2
     */
    padding?: number;
    /**
     * CSS property "fontSize" of the font used to make the digits. Default: 24
     */
    fontSize?: number;
    /**
     * Color of font in html format (example: '#ff00ff'). Default: '#000000'
     */
    fontColor?: string;
    /**
     * Color of background in hex format (example: 0xff00ff). Default: 0xffffff
     */
    backgroundColor?: number;
    /**
     * Alpha value of shade effect. 0 disables this effect. Default 0.9.
     */
    shade?: number;
    /**
     * Time interval in milliseconds until reach a number. Default: 1000.
     */
    duration?: number;
}
export {};
