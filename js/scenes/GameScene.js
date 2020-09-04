import * as CST from "../CST.js"

export default class GameScene extends Phaser.Scene{

    constructor(){
        super({key:CST.SCENES.GAME})
    }

    preload(){
    }

    create(){
        //map
        this.map = this.make.tilemap({key:"map"}) //key is referencing the tilemapTiledJSON loaded in preload
        let tileset = this.map.addTilesetImage("platform") //there is a tileset called "platform" in the Tiled editor
        this.platformLayer = this.map.createDynamicLayer("world", tileset, 0, 0) //there is a layer called "world" in the Tiled editor
        this.platformLayer.setCollisionByExclusion([-1, ])


        //player
        this.player = this.physics.add.sprite(CST.VIEW_WIDTH/5, CST.VIEW_HEIGHT/2, "man")
        
        this.player.setVelocityX(CST.X_VEL)
        this.anims.create({
			key: "flap",
			frames: this.anims.generateFrameNumbers("man", {start: 0, end: 3}),
			frameRate: 10,
			repeat: -1,
        });
        this.player.anims.play("flap", true);
        this.physics.add.collider(this.platformLayer, this.player, (player, tile)=>{
            this.collision = true;
            if(tile.properties.flipper){
                this.changeDirection(player)
            }
        })

        // this.physics.add.overlap(this.finishTiles, this.player(player, tile)=>{})
        
        //collectibles
        this.collectibles = this.map.createFromObjects("collectibles", "collectible1", {key:"collectible1"})
        this.physics.world.enable(this.collectibles)
        for(let collectible of this.collectibles){
            collectible.body.setAllowGravity(false)
        }
        this.physics.add.overlap(this.collectibles, this.player, (collectible, player)=>{
            collectible.destroy(true)
        })

        //input
		this.cursors = this.input.keyboard.createCursorKeys();

        //camera
        this.cameras.main.setBackgroundColor('#ccccff');
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.cameras.main.setDeadzone(this.player.width, CST.VIEW_HEIGHT)
        this.cameras.main.startFollow(this.player, false, 1, 1, -200, 0)
    }

    update(){
        this.cursors.space.onUp = e=>this.gSwitch(e)
        if(this.player.body.velocity.x==0) this.player.setVelocityX(CST.X_VEL)
    }

    gSwitch(e){
        this.player.setVelocityY(0)
        this.player.flipY = !this.player.flipY
        this.physics.world.gravity.y *= -1
    }

    changeDirection(player){
        this.physics.world.gravity.y = 0
        this.physics.world.gravity.x = -CST.G
    }


}