import * as CST from "../CST.js"
import * as TXT from "../textClasses.js"

export default class MenuScene extends Phaser.Scene{
    constructor(){
        super({key:CST.SCENES.MENU})
    }

    preload(){
        this.load.spritesheet("man", "assets/spritesNew/man.png", {frameWidth: 100, frameHeight: 100})
        this.load.spritesheet("platform", "assets/tilesNew/platformTiles.png", {frameWidth:32, frameHeight:32})
        this.load.tilemapTiledJSON("map", "assets/tilesNew/tilemap.json")
    }

    create(){
		this.startButton = new TXT.Button(this, CST.VIEW_WIDTH/2, CST.VIEW_HEIGHT/2, "START");
		this.startButton.onClick(()=>{
            this.scene.start(CST.SCENES.GAME);			
		});
    }

    update(){
    }
}