import * as CST from "../CST.js"
import * as TXT from "../textClasses.js"

export default class GameOver extends Phaser.Scene{
    init({finishOrder, players}){
        this.finishOrder = finishOrder
        this.players = players
    }

    constructor(){
        super({key:CST.SCENES.GAME_OVER})
    }

    create(){
        this.cameras.main.setBackgroundColor('#757575');
        let text = 'LEADERBOARD:\n\n\n'
        for(let i=0; i<this.finishOrder.length; i++){
            text+= `${i+1}) Player ${this.players[this.finishOrder[i]].id+1}\n`
        }
        for(let i=0; i<this.players.length; i++){
            if(this.players[i].dead) text+=`Player ${i+1} DEAD\n`
        }
        new TXT.Text(this, CST.VIEW_WIDTH/2, CST.VIEW_HEIGHT/3, text)

		this.menuButton = new TXT.Button(this, CST.VIEW_WIDTH/2, 2*CST.VIEW_HEIGHT/3, "MAIN MENU");
		this.menuButton.onClick(()=>{
            this.scene.start(CST.SCENES.MENU);		
		});
    }
}