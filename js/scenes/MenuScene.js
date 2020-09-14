import * as CST from "../CST.js"
import * as TXT from "../textClasses.js"

export default class MenuScene extends Phaser.Scene{
    constructor(){
        super({key:CST.SCENES.MENU})
    }

    preload(){
        this.load.spritesheet("good", "assets/sprites/chicken.png", {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet("bad", "assets/sprites/donut.png", {frameWidth: 64, frameHeight: 64})

        this.load.spritesheet("platform", "assets/tiles/platformTiles1.png", {frameWidth:32, frameHeight:32})
        this.load.tilemapTiledJSON("map", "assets/tiles/level1.json")

        this.load.audio("switch", "assets/sounds/swish.mp3")
        this.load.audio("finish", "assets/sounds/my_man.mp3")
        this.load.audio("dead", "assets/sounds/aids.mp3")
        this.load.audio("boost", "assets/sounds/car_rev.mp3")
        this.load.audio("slow", "assets/sounds/oh_man.mp3")
        this.load.audio("short_beep", "assets/sounds/jeff_short.mp3")
        this.load.audio("long_beep", "assets/sounds/jeff.mp3")
        this.load.audio("background", "assets/sounds/embers.mp3")


    }

    create(){
        this.game.music = this.sound.add("background")
        this.game.music.setVolume(0.2)
        this.game.music.setLoop(true)

        this.cameras.main.setBackgroundColor('#757575');

        this.numPlayers = 1
        new TXT.Text(this, CST.VIEW_WIDTH/2, CST.VIEW_HEIGHT/4, "Choose number of players with up/down arrow keys")
        this.numPlayerLabel = new TXT.Text(this, CST.VIEW_WIDTH/2, CST.VIEW_HEIGHT/2, this.numPlayers)

        this.increasePlayersButton = new TXT.Button(this, CST.VIEW_WIDTH/2+50, CST.VIEW_HEIGHT/3, "+")
		this.increasePlayersButton.onClick(()=>this.incrementPlayers());
        this.decreasePlayersButton = new TXT.Button(this, CST.VIEW_WIDTH/2-50, CST.VIEW_HEIGHT/3, "-")
		this.decreasePlayersButton.onClick(()=>this.decrementPlayers());

        new TXT.Text(this, CST.VIEW_WIDTH/2, 2*CST.VIEW_HEIGHT/3, "Press spacebar to continue");        

        let keyObj = this.input.keyboard.addKeys('UP, DOWN, SPACE');  // Get key object
        keyObj['UP'].on('up', e=>this.incrementPlayers())
        keyObj['DOWN'].on('up', e=>this.decrementPlayers())
        keyObj['SPACE'].on('up', e=>this.nextScene())

    }

    incrementPlayers(){
        if(this.numPlayers<CST.MAX_PLAYERS) this.numPlayers++
        this.numPlayerLabel.text = this.numPlayers
    }

    decrementPlayers(){
        if(this.numPlayers>1) this.numPlayers--
        this.numPlayerLabel.text = this.numPlayers
    }

    nextScene(){
        this.game.music.play()

        this.input.keyboard.removeKey('UP')
        this.input.keyboard.removeKey('DOWN')
        this.input.keyboard.removeKey('SPACE')

        this.scene.start(CST.SCENES.CHOOSE_PLAYER, {numPlayers: this.numPlayers});		
    }
}