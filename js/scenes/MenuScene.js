import * as CST from "../CST.js"
import * as TXT from "../textClasses.js"

export default class MenuScene extends Phaser.Scene{
    constructor(){
        super({key:CST.SCENES.MENU})
    }

    preload(){
        this.load.spritesheet("collectible1", "assets/sprites/chicken.png", {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet("platform", "assets/tiles/platformTiles.png", {frameWidth:32, frameHeight:32})
        this.load.tilemapTiledJSON("map", "assets/tiles/tilemap.json")

        this.load.audio("switch", "assets/sounds/swish.mp3")
        this.load.audio("finish", "assets/sounds/my_man.mp3")
        this.load.audio("dead", "assets/sounds/aids.mp3")
    }

    create(){
        this.cameras.main.setBackgroundColor('#757575');

        //TODO: find better way of doing radio selection
        let numPlayers
        this.onePlayer = new TXT.Button(this, CST.VIEW_WIDTH/4, CST.VIEW_HEIGHT/3, "ONE PLAYER")
		this.onePlayer.onClick(()=>{
            numPlayers = 1
        });
        this.twoPlayer = new TXT.Button(this, 2*CST.VIEW_WIDTH/4, CST.VIEW_HEIGHT/3, "TWO PLAYER")
		this.twoPlayer.onClick(()=>{
            numPlayers = 2
        });
        this.threePlayer = new TXT.Button(this, 3*CST.VIEW_WIDTH/4, CST.VIEW_HEIGHT/3, "THREE PLAYER")
		this.threePlayer.onClick(()=>{
            numPlayers = 3
        });

		this.startButton = new TXT.Button(this, CST.VIEW_WIDTH/2, 2*CST.VIEW_HEIGHT/3, "START");
		this.startButton.onClick(()=>{
            this.scene.start(CST.SCENES.GAME, {numPlayers});		
		});
    }
}