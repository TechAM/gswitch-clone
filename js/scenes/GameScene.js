import * as CST from "../CST.js"
import * as TXT from "../textClasses.js"
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

        this.switchSound = this.sound.add("switch")
        this.finishSound = this.sound.add("finish")
        this.deadSound = this.sound.add("dead")
        this.boostSound = this.sound.add("boost")
        this.slowSound = this.sound.add("slow")
        this.shortBeepSound = this.sound.add("short_beep")
        this.longBeepSound = this.sound.add("long_beep")


        //players
        Player.count = 0
        Player.numDead = 0
        Player.numFinished = 0
        this.players = []
        this.finishOrder = []
    }

    create(){
        //map
        this.map = this.make.tilemap({key:"map"}) //key is referencing the tilemapTiledJSON loaded in preload
        let tileset = this.map.addTilesetImage("platform") //there is a tileset called "platform" in the Tiled editor
        this.platformLayer = this.map.createDynamicLayer("world", tileset, 0, 0) //there is a layer called "world" in the Tiled editor
        this.platformLayer.setCollisionByExclusion([-1, 4])
        
        //collectibles
        this.goodCollectibles = this.map.createFromObjects("collectibles", "good", {key:"good"})
        this.physics.world.enable(this.goodCollectibles)
        for(let collectible of this.goodCollectibles){
            collectible.body.setAllowGravity(false)
        }
        this.badCollectibles = this.map.createFromObjects("collectibles", "bad", {key:"bad"})
        this.physics.world.enable(this.badCollectibles)
        for(let collectible of this.badCollectibles){
            collectible.body.setAllowGravity(false)
        }



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
            player.addCollectiblesOverlap(this.goodCollectibles, CST.COLLECTIBLE_TYPES.FAST)
            player.addCollectiblesOverlap(this.badCollectibles, CST.COLLECTIBLE_TYPES.SLOW)
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
                if(!this.players[i].dead && !this.players[i].finished){
                    //TODO: fix bug where when game is restarted, each press is registered twice for some motherfucking reason
                    this.players[i].gSwitch()
                }
            })
        }

        //3 second countdown before starting game
        for(let player of this.players){
            player.sprite.body.moves = false
        }
        let time = 3
        this.timerLabel = new TXT.Text(this, CST.VIEW_WIDTH/2, CST.VIEW_HEIGHT/2, time)
        let timer = setInterval(e=>{
            if(time>=1){
                this.timerLabel.text = time
                this.shortBeepSound.play()
                time-=1
            }else if(time==0) {
                this.longBeepSound.play()
                this.timerLabel.text = "GO"
                for(let player of this.players){
                    player.sprite.body.moves = true
                }
                setTimeout(()=>{
                    this.timerLabel.text=''
                    clearInterval(timer)
                }, 200)
            }
        }, 1000)

    }

    endGame(){
        for(let key of this.keys){
            this.input.keyboard.removeKey(key)
        }
        this.scene.start(CST.SCENES.GAME_OVER, {finishOrder: this.finishOrder, players: this.players})
    }

    update(){
        for(let player of this.players){
            player.update(this.cameras.main.scrollX)
        }
        if(Player.numDead+Player.numFinished==this.numPlayers) {
            this.endGame()
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