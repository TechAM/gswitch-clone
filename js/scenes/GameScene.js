import * as CST from "../CST.js"
import * as TXT from "../textClasses.js"
import * as STYLES from '../styles.js'
import Player from '../player.js'

export default class GameScene extends Phaser.Scene{
    init(data){
        this.chosenPlayers = data.chosenPlayers.map(name => CST.SKINS.indexOf(name))
        this.currentFastestTimes = data.currentFastestTimes
        this.level = data.level
    }

    constructor(){
        super({key:CST.SCENES.GAME})
    }

    preload(){
        this.textures.remove("platform")
        
        this.load.spritesheet("platform", `assets/tiles/platformTiles${this.level}.png`, {frameWidth:32, frameHeight:32})
        this.load.tilemapTiledJSON(`map${this.level}`, `assets/tiles/level${this.level}.json`)

        //TODO: make it so it loads in only the spritesheets required
        for(let i=0; i<CST.SKINS.length; i++){
            this.load.spritesheet(`man${i}`, `assets/sprites/man-${CST.SKINS[i]}.png`, {frameWidth: 100, frameHeight: 100})
        }
        this.uniqueChosenPlayers = this.chosenPlayers.filter((value, index, self)=>self.indexOf(value)===index) 

        this.switchSound = this.sound.add("switch")
        this.finishSound = this.sound.add("finish")
        this.deadSound = this.sound.add("dead")
        this.boostSound = this.sound.add("boost")
        this.slowSound = this.sound.add("slow")
        this.disableSound = this.sound.add("disable")
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
        this.map = this.make.tilemap({key:`map${this.level}`}) //key is referencing the tilemapTiledJSON loaded in preload
        let tileset = this.map.addTilesetImage("platform") //there is a tileset called "platform" in the Tiled editor
        this.platformLayer = this.map.createStaticLayer("world", tileset, 0, 0) //there is a layer called "world" in the Tiled editor
        this.platformLayer.setCollisionByExclusion([-1, 4])
        

        //collectibles
        this.fastCollectibles = this.map.createFromObjects("collectibles", "fast", {key:"fast"})
        this.physics.world.enable(this.fastCollectibles)
        for(let collectible of this.fastCollectibles){
            collectible.body.setAllowGravity(false)
        }
        this.slowCollectibles = this.map.createFromObjects("collectibles", "slow", {key:"slow"})
        this.physics.world.enable(this.slowCollectibles)
        for(let collectible of this.slowCollectibles){
            collectible.body.setAllowGravity(false)
        }
        this.disableCollectibles = this.map.createFromObjects("collectibles", "disable", {key:"disable"})
        this.physics.world.enable(this.disableCollectibles)
        for(let collectible of this.disableCollectibles){
            collectible.body.setAllowGravity(false)
        }


        for(let i=1; i<=this.chosenPlayers.length; i++){
            let newPlayer = new Player(this, CST.VIEW_WIDTH/5, i*CST.VIEW_HEIGHT/(this.chosenPlayers.length+1), this.chosenPlayers[i-1])
            this.players.push(newPlayer)
            this[`player${i}Label`] = new TXT.Text(this, CST.VIEW_WIDTH/7, i*CST.VIEW_HEIGHT/(this.chosenPlayers.length+1), i, STYLES.PLAYER_CONTROL)
        }

        for(let i of this.uniqueChosenPlayers){
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
            player.addCollectiblesOverlap(this.fastCollectibles, CST.COLLECTIBLE_TYPES.FAST)
            player.addCollectiblesOverlap(this.slowCollectibles, CST.COLLECTIBLE_TYPES.SLOW)
            player.addCollectiblesOverlap(this.disableCollectibles, CST.COLLECTIBLE_TYPES.DISABLE)
            player.animate(`run${player.skinID}`)
        }

        //camera
        this.cameras.main.setBackgroundColor('#4a4a4a');
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        
        //input
        this.keys = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE']
        this.keyObj = this.input.keyboard.addKeys(this.keys.join(', '));  // Get key object
        for(let i=0; i<this.chosenPlayers.length; i++){
            this.keyObj[this.keys[i]].on('up', e=>{
                if(!this.players[i].dead && !this.players[i].finished){
                    this.players[i].gSwitch()
                }
            })
        }

        //3 second countdown before starting game
        for(let player of this.players){
            player.sprite.body.moves = false
        }

        this.gameTime = 0
        //TODO: fix label to camera
        this.gameTimerLabel = new TXT.Text(this, CST.VIEW_WIDTH/2, CST.VIEW_HEIGHT/10, '')
        this.gameTimerLabel.setScrollFactor(0)

        let countDownTime = 3
        this.counterTimerLabel = new TXT.Text(this, CST.VIEW_WIDTH/2, CST.VIEW_HEIGHT/10, countDownTime, STYLES.COUNTDOWN_TEXT_STYLE)

        let startTimer = setInterval(e=>{
            if(countDownTime>=1){
                this.counterTimerLabel.text = countDownTime
                this.shortBeepSound.play()
                countDownTime-=1
            }else if(countDownTime==0) {
                this.longBeepSound.play()
                this.counterTimerLabel.text = "GO"
                for(let player of this.players){
                    player.sprite.body.moves = true
                }                
                setTimeout(()=>{
                    this.counterTimerLabel.text=''
                    clearInterval(startTimer)
                }, 200)

                let start = new Date().getTime();
                this.gameTimer = setInterval(()=>{
                    let now = new Date().getTime();
                    this.gameTime = now-start
                    this.gameTimerLabel.text = this.gameTime/1000
                },10);
            }
        }, 1000)

    }

    endGame(){
        clearInterval(this.gameTimer)

        //to fix the bug where event was triggered twice for some reason
        for(let key of this.keys){
            this.input.keyboard.removeKey(key)
        }
        this.scene.start(CST.SCENES.GAME_OVER, {
            finishOrder: this.finishOrder,
            players: this.players,
            currentFastestTimes: this.currentFastestTimes,
            level: this.level
        })
    }

    update(e){
        for(let player of this.players){
            player.update(this.cameras.main.scrollX, this.gameTime)
        }
        if(Player.numDead+Player.numFinished==this.chosenPlayers.length) {
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