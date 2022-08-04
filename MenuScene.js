import {CST} from "../CST";
import { Phaser } from "./phaser.min";
export class MenuScene extends Phaser.Scene{
    constructor(){
        super({
            key:CST.SCENES.MENU

        })
    }
    init(data){
        console.log(data);
        console.log("data here")
    }
    create(){
        this.add.image(0,0,"title_bg").setOrigin(0)
    }
}