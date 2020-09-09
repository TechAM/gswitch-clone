import * as CST from './CST.js'

export default class Player {

    constructor (scene, x, y) {
        this.scene = scene
        this.sprite = scene.physics.add.sprite(x, y, "man")
        this.sprite.body.gravity.y = CST.G
        this.sprite.setVelocityX(CST.X_VEL) 
        this.id = Player.count
        Player.count += 1 
    }


    animate(key){
        this.sprite.anims.play(key, true)
    }
    addPlatformCollider(platformLayer){
        this.scene.physics.add.collider(platformLayer, this.sprite)
    }
    addFinishOverlap(platformlayer){
        this.scene.physics.add.overlap(platformlayer, this.sprite, (player, tile)=>{
            if(tile.index == 4){
                console.log(`Player ${this.id+1} finishes`)
            }
        })
    }
    addCollectiblesOverlap(collectibles){
        this.scene.physics.add.overlap(collectibles, this.sprite, (collectible, player)=>{
            collectible.destroy(true)
        })
    }
    gSwitch(){
		this.scene.switchSound.play();
        this.sprite.flipY = !this.sprite.flipY
        this.sprite.body.gravity.y*=-1
    }

	update() {
        if(this.sprite.body.velocity.x==0){
            this.sprite.setVelocityX(CST.X_VEL)        
        }
    }

    destroy(){
        this.sprite.destroy()
    }
}
