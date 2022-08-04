import {CST} from "../CST";
import{MenuScene} from "./MenuScene";
import { Phaser } from "./phaser.min";
export class LoadScene extends Phaser.Scene{
    constructor(){
        super({
            key:CST.SCENES.LOAD
        })
    }
    init(){

    }
    preload(){
        this.load.image("title_bg", "assets/images/title_bg.jpg");
        this.load.image("options_button", "assets/images/options_button.png");
        this.load.image("title_bg", "assets/images/play_button.png");
        this.load.image("title_bg", "assets/images/logo.png");
        
    }
    create(){
        this.scene.start(CST.SCENES.MENU,"hello from LoadScene");
    }
}