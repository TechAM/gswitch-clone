import * as CST from "../CST.js"
import Player from '../player.js'

export default class GameScene extends Phaser.Scene{

    constructor(){
        super({key:CST.SCENES.GAME})
    }

    init(data){
        this.numPlayers = data.numPlayers
    }

    preload(){
    }

    create(){

        //map
        this.map = this.make.tilemap({key:"map"}) //key is referencing the tilemapTiledJSON loaded in preload
        let tileset = this.map.addTilesetImage("platform") //there is a tileset called "platform" in the Tiled editor
        this.platformLayer = this.map.createDynamicLayer("world", tileset, 0, 0) //there is a layer called "world" in the Tiled editor
        this.platformLayer.setCollisionByExclusion([-1, 4])
        
        //collectibles
        this.collectibles = this.map.createFromObjects("collectibles", "collectible1", {key:"collectible1"})
        this.physics.world.enable(this.collectibles)
        for(let collectible of this.collectibles){
            collectible.body.setAllowGravity(false)
        }

        //players
        this.players = []
        for(let i=1; i<=this.numPlayers; i++){
            this.players.push(new Player(this, CST.VIEW_WIDTH/5, i*CST.VIEW_HEIGHT/(this.numPlayers+1)))
        }

        this.anims.create({
			key: "run",
			frames: this.anims.generateFrameNumbers("man", {start: 0, end: 3}),
			frameRate: 10,
			repeat: -1,
        });
    
        for(let player of this.players){
            player.animate("run")
            player.addPlatformCollider(this.platformLayer)
            player.addFinishOverlap(this.platformLayer)
            player.addCollectiblesOverlap(this.collectibles)
        }
    

        //camera
        this.cameras.main.setBackgroundColor('#ccccff');
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)

        
        
        //input
        let keys = ['SPACE', 'Q']
        let keyObj = this.input.keyboard.addKeys(keys.join(', '));  // Get key object
        for(let i=0; i<this.numPlayers; i++){
            keyObj[keys[i]].on('up', e=>this.players[i].gSwitch());
        }


    }

    update(){
        for(let player of this.players){
            player.update()
        }

        let furthest = this.players.reduce((prevPlayer, currentPlayer, i)=>{
            if(currentPlayer.sprite.x >= prevPlayer.sprite.x){
                return currentPlayer
            }else{
                return prevPlayer
            }
        })
        this.cameras.main.setDeadzone(furthest.sprite.width, CST.VIEW_HEIGHT)
        this.cameras.main.startFollow(furthest.sprite, false, 1, 1, -200, 0)
    }
}