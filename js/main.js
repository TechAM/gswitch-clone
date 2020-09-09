//TODO: IDK HOW/WHERE TO IMPORT
// import {createStore} from 'redux'
// import reducer from './reducers'
// const store = createStore(reducer)

import MenuScene from './scenes/MenuScene.js'
import GameScene from "./scenes/GameScene.js"
import {VIEW_WIDTH, VIEW_HEIGHT, G} from './CST.js'

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
	scene: [MenuScene, GameScene],
}

let game = new Phaser.Game(config);