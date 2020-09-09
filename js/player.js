import * as CST from './CST.js'

export default class Player {
    constructor (scene, x, y) {
        this.scene = scene
        this.sprite = scene.physics.add.sprite(x, y, "man")
        this.sprite.body.gravity.y = CST.G
        this.sprite.setVelocityX(CST.X_VEL)        
        // this.jumpSFX = scene.sound.add("jump");
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
        console.log("hello there")
        this.sprite.flipY = !this.sprite.flipY
        this.sprite.body.gravity.y*=-1

    }

	update() {
        if(this.sprite.body.velocity.x==0){
            // console.log("stopped bro")
            this.sprite.setVelocityX(CST.X_VEL)        
        }
            // this.cursors.space.onUp = e=>{

        //     console.log("hello there")
        //     this.gSwitch(e)
        // }

		// if (this.cursors.left.isDown) {
		// 	direction = 0;
		// }
		// this.jumpSFX.play();
		// this.sprite.setVelocityX(xvel);
        // // this.setAnimation();
    }
}
