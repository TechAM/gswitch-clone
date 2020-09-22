import * as CST from "../CST.js"
import * as TXT from "../textClasses.js"

export default class SplashScene extends Phaser.Scene{
    constructor(){
        super({key:CST.SCENES.SPLASH})
    }

    preload(){
        this.load.spritesheet("fast", "assets/sprites/chicken.png", {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet("slow", "assets/sprites/donut.png", {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet("disable", "assets/sprites/carrot.png", {frameWidth: 64, frameHeight: 64})

        this.load.audio("switch", "assets/sounds/swish.mp3")
        this.load.audio("finish", "assets/sounds/my_man.mp3")
        this.load.audio("dead", "assets/sounds/aids.mp3")
        this.load.audio("boost", "assets/sounds/car_rev.mp3")
        this.load.audio("slow", "assets/sounds/oh_man.mp3")
        this.load.audio("disable", "assets/sounds/bruh.mp3")
        this.load.audio("short_beep", "assets/sounds/jeff_short.mp3")
        this.load.audio("long_beep", "assets/sounds/jeff.mp3")
        this.load.audio("background", "assets/sounds/embers.mp3")
    }

    create(){
        this.game.music = this.sound.add("background")
        this.game.music.setVolume(0.2)
        this.game.music.setLoop(true)

        this.cameras.main.setBackgroundColor('#757575');

        new TXT.Text(this, CST.VIEW_WIDTH/2, 2*CST.VIEW_HEIGHT/3, "Press spacebar to continue");        

        let keyObj = this.input.keyboard.addKeys('UP, DOWN, SPACE');  // Get key object
        keyObj['SPACE'].on('up', e=>this.nextScene())
    }

    nextScene(){
        //TODO: currently music is playing multiple times over itself when game restarted
        this.game.music.play()
        this.input.keyboard.removeKey('SPACE')

        this.scene.start(CST.SCENES.MENU);		
    }
}