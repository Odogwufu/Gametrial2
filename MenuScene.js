 class MenuScene extends Phaser.Scene{
    constructor(){
       super("playGame");
    }
    init(data){
        console.log(data);
        console.log("data here")
    }
    create(){
        this.add.image(0,0,"title_bg").setOrigin(0)
    }
}