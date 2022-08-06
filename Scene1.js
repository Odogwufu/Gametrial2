class Scene1 extends Phaser.Scene{
    constructor(){
        super('game')
    }

turnText = document.getElementById(`playerTurn`);
 board = new Array(6); // Board variable to keep track of available slots.
 xList = [31, 115, 199, 283, 367, 451, 535];
 yList = [23, 107, 191, 275, 359, 443];
 enemyTurn = false;
 gameDone = false;
 singlePlayer = true;
 piece;
 hasControl = true;
 timeout = 0; 


 initBoard() {  // initalize the board coordinates.
    for (var i = 0; i < 6; i++) {
        this.board[i] = [0, 0, 0, 0, 0, 0, 0];
    }
}


 getSections(board) {
    var sections = new Array();
    // horizontal sections
    for (var j = 0; j < 4; j++){
        for (var i = 0; i<6; i++) {
            sections.push([board[i][j], board[i][j+1], board[i][j+2], board[i][j+3]]);
        }
    }
    // vertical sections
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 7; j++) {
            sections.push([board[i][j], board[i+1][j], board[i+2][j], board[i+3][j]]);
        }
    }
    // forward-diagonal
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 4; j++) {
            sections.push([board[i][j], board[i+1][j+1], board[i+2][j+2], board[i+3][j+3]]);
        }
    }
    // backward-diagonal
    for (var i = 3; i < 6; i++) {
        for (var j = 0; j < 4; j++) {
            sections.push([board[i][j], board[i-1][j+1], board[i-2][j+2], board[i-3][j+3]]);
        }
    }

    return sections; 
}


 isWinner(board, player) {
    var sections = this.getSections(board);
    for (i = 0; i < sections.length; i++) {
        var possible = true;
        for (j = 0; j < 4; j++) {
            if (sections[i][j] != player) {
                possible = false;
            }
        }
        if (possible) return true;
    }
    return false;
}

 boardFull(board) {
    for (var j = 0; j < 7; j++) {
        if (board[0][j] == 0) return false;
    }
    return true;
}

// AI code created by iammanish17
 sectionScore(section, player) {    
    // Assigns a score to a section based on how likely player is to win/lose
    var score = 0;          
    var selfCount = 0,      
        opponentCount = 0,  
        empty = 0;          

    for (var i = 0; i < 4; i++) {   
        if (section[i] == player) selfCount++;             
        else if (section[i] == 3 - player) opponentCount++; 
        else empty++;                                       
    }

    if (selfCount == 4) score += 100;                   
    if (selfCount == 3 && empty == 1) score += 5;       
    if (selfCount == 2 && empty == 2) score += 2;       
    if (opponentCount == 3 && empty == 1) score -= 4;   

    return score;
}

getScore(board, player) {  
    // Function to assign a score to a board
    var score = 0;
    var sections = this.getSections(board);

    for (var i = 0; i < sections.length; i++)  
        score += sectionScore(sections[i], player);    

    for (var i = 0; i < 6; i++)     
        if (board[i][3] == player) score += 3; 

    return score;
}

 miniMax(board, depth, alpha, beta, player) {
    // Minimax Algorithm for AI to recursively find an optimal move
    if (this.isWinner(board, 2)) return [-1, 99999999];
    if (this.isWinner(board, 1)) return [-1, -99999999];
    if (this.boardFull(board)) return [-1, 0];
    if (depth == 0) return [-1, this.getScore(board, 2)];

    if (player == 2) {
        // Maximizing player
        var value = Number.NEGATIVE_INFINITY;
        var col = -1;
        for (var i = 0; i < 7; i++) {
            if (board[0][i] == 0) {
                var boardCopy = new Array(6);
                for (var k = 0; k < board.length; k++)
                    boardCopy[k] = board[k].slice();
                var j = 5;
                for (j; j >= 0; j--) {
                    if (boardCopy[j][i] == 0)
                        break;
                }
                boardCopy[j][i] = player;
                var newScore = this.miniMax(boardCopy, depth - 1, alpha, beta, 3 - player)[1];
                if (newScore > value) {
                    value = newScore;
                    col = i;
                }
                alpha = Math.max(alpha, value);
                if (alpha >= beta) break;
            }
        }
        return [col, value];
    } else {
        // Minimizing player
        var value = Number.POSITIVE_INFINITY;
        var col = -1;
        for (var i = 0; i < 7; i++) {
            if (board[0][i] == 0) {
                var boardCopy = new Array(6);
                for (var k = 0; k < board.length; k++)
                    boardCopy[k] = board[k].slice();
                var j = 5;
                for (j; j >= 0; j--) {
                    if (boardCopy[j][i] == 0)
                        break;
                }
                boardCopy[j][i] = player;
                var newScore = this.miniMax(boardCopy, depth - 1, alpha, beta, 3 - player)[1];
                if (newScore < value) {
                    value = newScore;
                    col = i;
                }
                beta = Math.min(beta, value);
                if (alpha >= beta) break;
            }
        }
        return [col, value];
    }
}
// End of AI code

create() {
    this.initBoard();
    this.add.sprite(0,0,"bg-color").setOrigin(0);
    this.add.sprite(325,275,"background");
    
}

update() {
    
    var pieceColor;
    var playerValue;
    game.canvas.style.cursor = "default";
    this.timeout--;

    if (this.gameDone) return;

    if (this.enemyTurn) {
        pieceColor = 'yellow';
        playerValue = 2;
        this.turnText.textContent = "Player 2's Turn";
    } else {
        pieceColor = 'red';
        playerValue = 1;
        this.turnText.textContent = "Player 1's Turn";
    }

    if (this.timeout <= 0) {
        // finding the player's cursor
        var mouse = this.input.activePointer;
        var column = -1;
        var xpos = mouse.worldX;
        var ypos = mouse.worldY;
        if (this.enemyTurn && this.singlePlayer) {
            var move = this.miniMax(board, 5, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 2)[0];
            console.log(move);
            for (i = 5; i >= 0; i--) {
                if (board[i][move] == 0) {
                    board[i][move] = playerValue;
                    this.piece = this.add.sprite(this.xList[move], this.yList[i], pieceColor).setOrigin(0,0);
                    this.timeout = 35;
                    this.enemyTurn = !this.enemyTurn;
                    break;
                }
            }
        }
        for (var i = 0; i < 7; i++) {
            var dist = xpos - this.xList[i];
            if (0 <= dist && dist <= 83 && 23 <= ypos && ypos <= 527) {
                game.canvas.style.cursor = "pointer";
                column = i;
                break;
            }
        }

        if (column != -1 && mouse.primaryDown) {
            for (i = 5; i >= 0; i--) {
                if (this.board[i][column] == 0) {
                    this.board[i][column] = playerValue;
                    this.piece = this.add.sprite(this.xList[column], this.yList[i], pieceColor).setOrigin(0,0);
                    this.timeout = 35;
                    this.enemyTurn = !this.enemyTurn;
                    console.log(`${this.enemyTurn}, ${pieceColor}, ${playerValue}`);
                    break;
                }
            }
        }


        if (this.isWinner(this.board, playerValue)) {
            this.turnText.textContent = `Player ${playerValue} is the Winner!!`;
            this.gameDone = true;
        } else if (boardFull(board)) {
            this.turnText.textContent = `Draw!`;
            this.gameDone = true;
        }
    }
}

}


