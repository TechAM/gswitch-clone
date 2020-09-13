import * as CST from "../CST.js"
import * as TXT from "../textClasses.js"

export default class ChoosePlayerScene extends Phaser.Scene{
    init(data){
        this.numPlayers = data.numPlayers
    }
    constructor(){
        super({key: CST.SCENES.CHOOSE_PLAYER})
    }

    preload(){
        this.availablePlayers = [...CST.SKINS]
        this.chosenPlayers = []
    }

    create(){
        this.cameras.main.setBackgroundColor('#757575');

        new TXT.Text(this, CST.VIEW_WIDTH/2, CST.VIEW_HEIGHT/10, "CHOOSE PLAYERS") //title

        let playersChosen = false
        let playerNumber = 1; //index of the player choosing
        new TXT.Text(this, CST.VIEW_WIDTH/3, (2+playerNumber)*CST.VIEW_HEIGHT/11, `Player 1: `)
        let currentPlayerIndex = 0 //index of the player shown in the list of available players
        this.currentPlayer = new TXT.Text(this, 2*CST.VIEW_WIDTH/3, (3+playerNumber-1)*CST.VIEW_HEIGHT/11, this.availablePlayers[currentPlayerIndex])

        let keyObj = this.input.keyboard.addKeys('UP, DOWN, SPACE');  // Get key object
        keyObj['UP'].on('up', e=>{
            currentPlayerIndex = (this.availablePlayers.length+currentPlayerIndex + 1)%this.availablePlayers.length
            this.currentPlayer.text=this.availablePlayers[currentPlayerIndex]
        })
        keyObj['DOWN'].on('up', e=>{
            currentPlayerIndex = (this.availablePlayers.length+currentPlayerIndex - 1)%this.availablePlayers.length
            this.currentPlayer.text=this.availablePlayers[currentPlayerIndex]
        })

        keyObj['SPACE'].on('up', e=>{
            console.log(playerNumber, this.numPlayers)

            if(!playersChosen){
                this.chosenPlayers.push(this.currentPlayer.text)
                console.log(this.chosenPlayers)
                playerNumber += 1

                if(playerNumber==this.numPlayers+1){
                    playersChosen = true
                }else{
                    new TXT.Text(this, CST.VIEW_WIDTH/3, (2+playerNumber)*CST.VIEW_HEIGHT/11, `Player ${playerNumber}: `)
                    this.currentPlayer.y = (2+playerNumber)*CST.VIEW_HEIGHT/11
                    new TXT.Text(this, 2*CST.VIEW_WIDTH/3, (1+playerNumber)*CST.VIEW_HEIGHT/11, this.currentPlayer.text)
                }

            }else{
                this.startGame()
            }
        })


        this.startButton = new TXT.Button(this, CST.VIEW_WIDTH/2, 4*CST.VIEW_HEIGHT/5, "START");
		this.startButton.onClick(()=>this.startGame());
    }

    
    startGame(){
        this.input.keyboard.removeKey('UP')
        this.input.keyboard.removeKey('DOWN')
        this.input.keyboard.removeKey('SPACE')

        this.scene.start(CST.SCENES.GAME, {numPlayers: this.numPlayers, chosenPlayers: this.chosenPlayers});		
    }
}