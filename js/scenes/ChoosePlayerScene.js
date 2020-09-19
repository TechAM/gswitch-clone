import * as CST from "../CST.js"
import * as TXT from "../textClasses.js"

export default class ChoosePlayerScene extends Phaser.Scene{
    init(data){
        this.numPlayers = data.numPlayers
        this.currentFastestTime = data.currentFastestTime
    }
    constructor(){
        super({key: CST.SCENES.CHOOSE_PLAYER})
    }

    preload(){
        this.chosenPlayers = []
    }

    create(){
        this.cameras.main.setBackgroundColor('#757575');

        new TXT.Text(this, CST.VIEW_WIDTH/2, CST.VIEW_HEIGHT/10, "Choose player with up/down arrow keys then press space") //title

        let playersChosen = false
        let playerNumber = 1; //index of the player choosing
        new TXT.Text(this, CST.VIEW_WIDTH/3, (2+playerNumber)*CST.VIEW_HEIGHT/11, `Player 1: `)
        let currentPlayerIndex = 0 //index of the player shown in the list of available players
        this.currentPlayer = new TXT.Text(this, 2*CST.VIEW_WIDTH/3, (3+playerNumber-1)*CST.VIEW_HEIGHT/11, CST.SKINS[currentPlayerIndex])

        
        let keyObj = this.input.keyboard.addKeys('UP, DOWN, SPACE');
        keyObj['UP'].on('up', e=>{
            currentPlayerIndex = (CST.SKINS.length+currentPlayerIndex + 1)%CST.SKINS.length
            this.currentPlayer.text=CST.SKINS[currentPlayerIndex]
        })
        keyObj['DOWN'].on('up', e=>{
            currentPlayerIndex = (CST.SKINS.length+currentPlayerIndex - 1)%CST.SKINS.length
            this.currentPlayer.text=CST.SKINS[currentPlayerIndex]
        })

        keyObj['SPACE'].on('up', e=>{
            if(!playersChosen){
                this.chosenPlayers.push(this.currentPlayer.text)
                playerNumber += 1

                if(playerNumber==this.numPlayers+1){
                    playersChosen = true
                }else{
                    new TXT.Text(this, CST.VIEW_WIDTH/3, (2+playerNumber)*CST.VIEW_HEIGHT/11, `Player ${playerNumber}: `)
                    this.currentPlayer.y = (2+playerNumber)*CST.VIEW_HEIGHT/11
                    new TXT.Text(this, 2*CST.VIEW_WIDTH/3, (1+playerNumber)*CST.VIEW_HEIGHT/11, this.currentPlayer.text)
                }

            }
            if(playersChosen) this.nextScene()
        })


        new TXT.Text(this, CST.VIEW_WIDTH/2, 4*CST.VIEW_HEIGHT/5, "Press spacebar to continue");
    }

    
    nextScene(){
        this.input.keyboard.removeKey('UP')
        this.input.keyboard.removeKey('DOWN')
        this.input.keyboard.removeKey('SPACE')

        this.scene.start(CST.SCENES.CHOOSE_LEVEL, {chosenPlayers: this.chosenPlayers, currentFastestTime: this.currentFastestTime});		
    }
}