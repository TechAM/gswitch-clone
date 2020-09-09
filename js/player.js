import * as CST from './CST.js'

export default class Player {
    constructor (scene, x, y) {
        this.scene = scene
        this.sprite = scene.physics.add.sprite(x, y, "man")
        this.sprite.body.gravity.y = CST.G
        this.sprite.setVelocityX(CST.X_VEL)        
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
                console.log("winner boi")
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
        this.sprite.tint = Math.random()*0xffffff
    }

	update() {
        if(this.sprite.body.velocity.x==0){
            this.sprite.setVelocityX(CST.X_VEL)        
        }
    }
}
