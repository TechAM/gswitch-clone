import * as CST from "../CST.js"
import * as TXT from "../textClasses.js"

export default class ChooseLevelScene extends Phaser.Scene{
    init(data){
        this.data = data
        this.currentFastestTimes = data.currentFastestTimes
        this.level = data.level
    }
    constructor(){
        super({key: CST.SCENES.CHOOSE_LEVEL})
    }

    preload(){
    }

    create(){
        this.cameras.main.setBackgroundColor('#757575');

        new TXT.Text(this, CST.VIEW_WIDTH/2, CST.VIEW_HEIGHT/10, "Choose level with up/down arrow keys then press space") //title

        this.currentLevel = this.data.level ?? 1
        this.currentLevelLabel = new TXT.Text(this, CST.VIEW_WIDTH/2, CST.VIEW_HEIGHT/2, this.currentLevel)

        this.timeToBeatLabel = new TXT.Text(this, CST.VIEW_WIDTH/2, 3*CST.VIEW_HEIGHT/5, '');
        if(this.level) this.timeToBeatLabel.text = `Time to beat for level ${this.level} is ${this.currentFastestTimes[this.level-1]/1000}s`
        
        let keyObj = this.input.keyboard.addKeys('UP, DOWN, SPACE');
        keyObj['UP'].on('up', e=>{
            this.currentLevel = CST.NUM_LEVELS-(this.currentLevel+1)%CST.NUM_LEVELS
            this.currentLevelLabel.text=this.currentLevel
            this.timeToBeatLabel.text = `Time to beat for level ${this.currentLevel} is ${this.currentFastestTimes[this.currentLevel-1]/1000}s`
        })
        keyObj['DOWN'].on('up', e=>{
            this.currentLevel = CST.NUM_LEVELS-(this.currentLevel-1)%CST.NUM_LEVELS
            this.currentLevelLabel.text=this.currentLevel
            this.timeToBeatLabel.text = `Time to beat for level ${this.currentLevel} is ${this.currentFastestTimes[this.currentLevel-1]/1000}s`
        })

        keyObj['SPACE'].on('up', e=>{
            this.startGame()
        })

        new TXT.Text(this, CST.VIEW_WIDTH/2, 4*CST.VIEW_HEIGHT/5, "Press spacebar to start");
    }

    
    startGame(){
        this.input.keyboard.removeKey('UP')
        this.input.keyboard.removeKey('DOWN')
        this.input.keyboard.removeKey('SPACE')

        this.scene.start(CST.SCENES.GAME, {...this.data, level:this.currentLevel});		
    }
}