import MenuScene from './scenes/MenuScene.js'
import ChoosePlayerScene from './scenes/ChoosePlayerScene.js'
import GameScene from "./scenes/GameScene.js"
import GameoverScene from "./scenes/GameoverScene.js"
import {VIEW_WIDTH, VIEW_HEIGHT, G} from './CST.js'
import ChooseLevelScene from './scenes/ChooseLevelScene.js'
import SplashScene from './scenes/SplashScreen.js'

let config = {
	type: Phaser.AUTO,
	width: VIEW_WIDTH,
	height: VIEW_HEIGHT,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	physics: {
		default: "arcade",
		arcade: {
			gravity: {
				y: 0,
			},
			debug: false
		}
	},
	scene: [
		SplashScene,
		MenuScene,
		ChoosePlayerScene,
		ChooseLevelScene,
		GameScene,
		GameoverScene
	],
}

let game = new Phaser.Game(config);