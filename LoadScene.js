class LoadScene extends Phaser.Scene{
    constructor(){
        super("bootGame");
        
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
        this.scene.start("playGame");
    }
}