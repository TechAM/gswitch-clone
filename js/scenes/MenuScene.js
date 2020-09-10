import * as CST from "../CST.js"
import * as TXT from "../textClasses.js"

export default class MenuScene extends Phaser.Scene{
    constructor(){
        super({key:CST.SCENES.MENU})
    }

    preload(){
        this.load.spritesheet("man", "assets/sprites/man.png", {frameWidth: 100, frameHeight: 100})
        this.load.spritesheet("collectible1", "assets/sprites/chicken.png", {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet("platform", "assets/tiles/platformTiles.png", {frameWidth:32, frameHeight:32})
        this.load.tilemapTiledJSON("map", "assets/tiles/tilemap.json")

        this.load.audio("switch", "assets/sounds/swish.mp3")
        this.load.audio("finish", "assets/sounds/my_man.mp3")
        this.load.audio("dead", "assets/sounds/aids.mp3")
    }

    create(){
		this.startButton = new TXT.Button(this, CST.VIEW_WIDTH/2, CST.VIEW_HEIGHT/2, "START");
		this.startButton.onClick(()=>{
            this.scene.start(CST.SCENES.GAME, {numPlayers: 2});		
		});
    }

    update(){
    }
}