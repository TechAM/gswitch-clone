import * as CST from "./CST.js"
import * as STYLES from './styles.js'

export class Text extends Phaser.GameObjects.Text{
	constructor(scene, x, y, text){
		super(scene, x, y, text, STYLES.MESSAGE_TEXT_STYLE);
		this.setOrigin(0.5, 0.5);
		scene.add.existing(this);
	}
}


export class Button extends Phaser.GameObjects.Text{
	constructor(scene, x, y, text, style=STYLES.BUTTON_STYLE){
		super(scene, x, y, text, style);
		this.setOrigin(0.5, 0.5);
		this.setInteractive()
			.on("pointerover", ()=>this.setColor("white"))
			.on("pointerout", ()=>this.setColor("black"));
		scene.add.existing(this); //add existing game object to the scene
	}

	onClick(func){
		this.on("pointerdown", ()=>{
			this.setColor("white");
			func();
		});
	}
}