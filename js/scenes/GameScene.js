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
        //load in the appropriate number of spritesheets
        for(let i=0; i<this.numPlayers; i++){
            this.load.spritesheet(`man${i}`, `assets/sprites/man-${CST.SKINS[i]}.png`, {frameWidth: 100, frameHeight: 100})
        }

        this.switchSound = this.sound.add("switch");
        this.finishSound = this.sound.add("finish");
        this.deadSound = this.sound.add("dead");
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
        Player.count = 0
        this.players = []
        for(let i=1; i<=this.numPlayers; i++){
            let newPlayer = new Player(this, CST.VIEW_WIDTH/5, i*CST.VIEW_HEIGHT/(this.numPlayers+1))
            this.players.push(newPlayer)
        }

        for(let i=0; i<this.numPlayers; i++){
            this.anims.create({
                key: `run${i}`,
                frames: this.anims.generateFrameNumbers(`man${i}`, {start: 0, end: 3}),
                frameRate: 10,
                repeat: -1,
            });
        }

        for(let player of this.players){
            player.addPlatformCollider(this.platformLayer)
            player.addFinishOverlap(this.platformLayer)
            player.addCollectiblesOverlap(this.collectibles)
            player.animate(`run${player.id}`)

        }

        //camera
        this.cameras.main.setBackgroundColor('#4a4a4a');
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        
        //input
        this.keys = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN']
        this.keyObj = this.input.keyboard.addKeys(this.keys.join(', '));  // Get key object
        for(let i=0; i<this.numPlayers; i++){
            this.keyObj[this.keys[i]].on('up', e=>{
                if(!this.players[i].dead && !this.players[i].finished)
                    this.players[i].gSwitch()
            })
        }
    }

    update(){
        let totalDead = 0
        for(let player of this.players){
            player.update(this.cameras.main.scrollX)
            totalDead += player.dead ? 1 : 0
        }
        if(totalDead==this.numPlayers) {
            this.scene.start(CST.SCENES.GAME_OVER, {allDead:true})
        }else{
            let furthest
            //camera follows the  player at the front
            if(this.players.filter(player=>!player.dead&&!player.finished).length > 0){ //if there is anyone to follow
                furthest = this.players
                    .filter(player=>!player.dead&&!player.finished)
                    .reduce((prevPlayer, currentPlayer)=>{
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
    }
}