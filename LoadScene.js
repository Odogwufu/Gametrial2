class LoadScene extends Phaser.Scene{
    constructor(){
        super("bootGame");
        
    }
    init(){

    }
    preload(){
        this.load.image("title_bg", "assets/images/title.jpg");
        this.load.image("option", "assets/images/play_button2.png");
        this.load.image("play_button", "assets/images/play_button1.png");
        this.load.image("logo", "assets/images/logo1.png");
        
    }
    create(){
        this.scene.start("playGame");
    }
}