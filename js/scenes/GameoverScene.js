import * as CST from "../CST.js"
import * as TXT from "../textClasses.js"

export default class GameOver extends Phaser.Scene{
    init({finishOrder, players, currentFastestTime}){
        this.finishOrder = finishOrder
        this.players = players
        this.currentFastestTime = currentFastestTime
    }

    constructor(){
        super({key:CST.SCENES.GAME_OVER})
    }

    create(){
        this.cameras.main.setBackgroundColor('#757575');
        let text = 'LEADERBOARD:\n\n\n'
        for(let i=0; i<this.finishOrder.length; i++){
            let player = this.players[this.finishOrder[i]]
            text+= `${i+1}) Player ${player.id+1} (${CST.SKINS[player.skinID]}) ${player.finishTime/1000} seconds\n`
        }
        for(let i=0; i<this.players.length; i++){  
            let player = this.players[i] 
            if(player.dead) text+=`Player ${i+1} (${CST.SKINS[player.skinID]}) DEAD\n`
        }
        new TXT.Text(this, CST.VIEW_WIDTH/2, CST.VIEW_HEIGHT/3, text)

		this.menuButton = new TXT.Button(this, CST.VIEW_WIDTH/2, 2*CST.VIEW_HEIGHT/3, "MAIN MENU");
		this.menuButton.onClick(()=>{
            this.scene.start(CST.SCENES.MENU);		
        });

        let keyObj = this.input.keyboard.addKeys('SPACE');  // Get key object
        keyObj['SPACE'].on('up', e=>{
            this.input.keyboard.removeKey('SPACE')
            let fastestTime = this.players.reduce((p1, p2)=>Math.max(p1.finishTime, p2.finishTime)).finishTime
            this.scene.start(CST.SCENES.MENU, {
                numPlayers: this.players.length,
                currentFastestTime: (fastestTime < this.currentFastestTime ? fastestTime : this.currentFastestTime)
            })
        })
    }
}