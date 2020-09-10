import * as CST from "../CST.js"
import * as TXT from "../textClasses.js"

export default class GameOver extends Phaser.Scene{
    init(data){
        this.allDead = data.allDead
    }

    constructor(){
        super({key:CST.SCENES.GAME_OVER})
    }

    create(){
        this.cameras.main.setBackgroundColor('#757575');

        let text = this.allDead ? "You're all shite!" : "random text bruh"
        new TXT.Text(this, CST.VIEW_WIDTH/2, CST.VIEW_HEIGHT/3, text)

		this.menuButton = new TXT.Button(this, CST.VIEW_WIDTH/2, 2*CST.VIEW_HEIGHT/3, "MAIN MENU");
		this.menuButton.onClick(()=>{
            this.scene.start(CST.SCENES.MENU);		
		});
    }
}