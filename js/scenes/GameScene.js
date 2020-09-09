import * as CST from "../CST.js"
import Player from '../player.js'

export default class GameScene extends Phaser.Scene{

    constructor(){
        super({key:CST.SCENES.GAME})
    }

    init(data){
        console.log(data.numPlayers)
    }

    preload(){
    }

    create(){

        //map
        this.map = this.make.tilemap({key:"map"}) //key is referencing the tilemapTiledJSON loaded in preload
        let tileset = this.map.addTilesetImage("platform") //there is a tileset called "platform" in the Tiled editor
        this.platformLayer = this.map.createDynamicLayer("world", tileset, 0, 0) //there is a layer called "world" in the Tiled editor
        this.platformLayer.setCollisionByExclusion([-1, 4])

        //players
        this.player = new Player(this, CST.VIEW_WIDTH/5, CST.VIEW_HEIGHT/2);

        // this.input.on('pointerdown', e=>this.gSwitch());

        this.anims.create({
			key: "run",
			frames: this.anims.generateFrameNumbers("man", {start: 0, end: 3}),
			frameRate: 10,
			repeat: -1,
        });
        this.player.animate("run")
        this.player.addPlatformCollider(this.platformLayer)
        this.player.addFinishOverlap(this.platformLayer)
        
        //collectibles
        this.collectibles = this.map.createFromObjects("collectibles", "collectible1", {key:"collectible1"})
        this.physics.world.enable(this.collectibles)
        for(let collectible of this.collectibles){
            collectible.body.setAllowGravity(false)
        }

        this.player.addCollectiblesOverlap(this.collectibles)

        //input
		this.cursors = this.input.keyboard.createCursorKeys();

        //camera
        this.cameras.main.setBackgroundColor('#ccccff');
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.cameras.main.setDeadzone(this.player.sprite.width, CST.VIEW_HEIGHT)
        this.cameras.main.startFollow(this.player.sprite, false, 1, 1, -200, 0)
    }

    update(){
        this.player.update()
        this.cursors.space.onUp = e=>this.player.gSwitch()
    }
}