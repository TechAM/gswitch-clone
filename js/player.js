import * as CST from './CST.js'

export default class Player {
    constructor (scene, x, y, skinID) {
        this.scene = scene
        this.skinID = skinID 
        this.id = Player.count
        Player.count += 1
        this.setupSprite(x, y)


        this.finished = false
        this.dead = false
    }

    setupSprite(x, y){
        this.sprite = this.scene.physics.add.sprite(x, y, `man${this.skinID}`)
        this.sprite.body.gravity.y = CST.G
        this.sprite.setVelocityX(CST.X_VEL) 
        this.sprite.body.setSize(68, 98, 16, 0)
    }
    animate(key){
        this.sprite.anims.play(key, true)
    }
    addPlatformCollider(platformLayer){
        this.scene.physics.add.collider(platformLayer, this.sprite)
    }
    addFinishOverlap(platformlayer){
        this.scene.physics.add.overlap(platformlayer, this.sprite, (player, tile)=>{
            if(!this.finished){    
                if(tile.index == 4){
                    this.finished = true
                    this.scene.finishSound.play()
                    Player.numFinished += 1
                    this.scene.finishOrder.push(this.id)
                }
            }
        })
    }
    addCollectiblesOverlap(collectibles, type){
        this.scene.physics.add.overlap(collectibles, this.sprite, (collectible, player)=>{
            collectible.destroy(true)
            
            switch(type){
                case CST.COLLECTIBLE_TYPES.FAST:
                    this.sprite.setVelocityX(this.sprite.body.velocity.x*1.2)
                    this.scene.boostSound.play()
                    break
                case CST.COLLECTIBLE_TYPES.SLOW:
                    this.sprite.setVelocityX(this.sprite.body.velocity.x*0.8)
                    this.scene.slowSound.play()
                    break
            }
        })
    }
    gSwitch(){
		this.scene.switchSound.play();
        this.sprite.flipY = !this.sprite.flipY
        this.sprite.body.gravity.y*=-1
    }

	update(scrollX) {
        if(!this.dead && !this.finished){
            if(this.sprite.body.velocity.x==0){
                this.sprite.setVelocityX(CST.X_VEL)        
            }
        }
        if(!this.dead){
            //if player is of the screen, destroy the sprite and remove from scene
            //TODO: check these boundaries
            let justDied = this.sprite.x-scrollX<=-50 || this.sprite.y>CST.VIEW_HEIGHT+50 || this.sprite.y<-50
            if(justDied){
                this.die()
            }
        }
    }

    die(){
        if(!this.dead){
            this.scene.deadSound.play()
            this.dead = true
            this.sprite.destroy()
            Player.numDead+=1
        }
    }
}
