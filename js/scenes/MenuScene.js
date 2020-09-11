import * as CST from "../CST.js"
import * as TXT from "../textClasses.js"

export default class MenuScene extends Phaser.Scene{
    constructor(){
        super({key:CST.SCENES.MENU})
    }

    preload(){
        this.load.spritesheet("good", "assets/sprites/chicken.png", {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet("bad", "assets/sprites/donut.png", {frameWidth: 64, frameHeight: 64})

        this.load.spritesheet("platform", "assets/tiles/platformTiles.png", {frameWidth:32, frameHeight:32})
        this.load.tilemapTiledJSON("map", "assets/tiles/tilemap.json")

        this.load.audio("switch", "assets/sounds/swish.mp3")
        this.load.audio("finish", "assets/sounds/my_man.mp3")
        this.load.audio("dead", "assets/sounds/aids.mp3")
        this.load.audio("boost", "assets/sounds/car_rev.mp3")
        this.load.audio("slow", "assets/sounds/oh_man.mp3")
        this.load.audio("short_beep", "assets/sounds/jeff_short.mp3")
        this.load.audio("long_beep", "assets/sounds/jeff.mp3")

    }

    create(){
        this.cameras.main.setBackgroundColor('#757575');

        let numPlayers = 1
        new TXT.Text(this, CST.VIEW_WIDTH/2, CST.VIEW_HEIGHT/3-40, "Choose number of players")
        this.numPlayerLabel = new TXT.Text(this, CST.VIEW_WIDTH/2, CST.VIEW_HEIGHT/2, numPlayers)

        this.increasePlayers = new TXT.Button(this, CST.VIEW_WIDTH/2+50, CST.VIEW_HEIGHT/3, "+")
		this.increasePlayers.onClick(()=>{
            if(numPlayers<CST.MAX_PLAYERS) numPlayers++
            this.numPlayerLabel.text = numPlayers
        });
        this.decreasePlayers = new TXT.Button(this, CST.VIEW_WIDTH/2-50, CST.VIEW_HEIGHT/3, "-")
		this.decreasePlayers.onClick(()=>{
            if(numPlayers>1) numPlayers--
            this.numPlayerLabel.text = numPlayers
        });

        this.startButton = new TXT.Button(this, CST.VIEW_WIDTH/2, 2*CST.VIEW_HEIGHT/3, "START");
		this.startButton.onClick(()=>{
            this.scene.start(CST.SCENES.GAME, {numPlayers});		
		});
    }
}