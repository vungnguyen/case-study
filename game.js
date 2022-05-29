
class Piece {
    constructor(tetromino,color) {
        this.tetromino = tetromino;
        this.color = color;
        this.tetrominoN= 0; //chí số góc quay đầu tiên
        this.activeTetromino = this.tetromino[this.tetrominoN];

        this.x = 4;
        this.y = -2;
        this.audio = new Audio("audio/a.mp3");
        this.audio2 = new Audio("audio/cuoi.mp3");
    }
    fill(color) {
        for (let r=0; r < this.activeTetromino.length;r++) {
            for (let c=0; c < this.activeTetromino.length; c++) {
                if (this.activeTetromino[r][c]){
                    drawSquare(this.x + c, this.y + r, color);
                }
            }
        }
    }

    draw() {
        this.fill(this.color)
    }
    unDraw() {
        this.fill(COLOR)
    }
    moveDown() {
        if (! this.collision(0,1,this.activeTetromino)){
            this.unDraw();
            this.y++;
            this.draw();
        }else {
            this.lock();
            p = randomPiece();
        }
    }
    moveLeft() {
        if (! this.collision(-1,0,this.activeTetromino)){
            this.unDraw();
            this.x--;
            this.draw();
        }
    }
    moveRight() {
        if (!this.collision(1,0,this.activeTetromino)) {
            this.unDraw();
            this.x++;
            this.draw();
        }
    }

    // check va chạm
    collision(x,y,piece) {
        for (let r = 0; r < piece.length; r++) {
            for (let c = 0;c < piece.length; c++){
                if ( !piece[r][c] ) {
                    continue;
                }

                let newX = this.x + c + x;        //cập nhật tọa độ mới của x sau khi di chuyen
                let newY = this.y + r + y;
                if (newX < 0 || newX >= COL || newY >= ROW) {
                    return true;
                }
                if (newY < 0) {
                    continue;
                }
                if (board[newY][newX] !== COLOR) {        //tại vị trí newX,Y khác COLOR ->có hình ở đây
                    return true;
                }
            }
        }
        return false;
    }

    //quay hình
    rotate() {
        let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
        let move = 0;
        if (this.collision(0,0,nextPattern)) {
            if (this.x > COL/2){
                move = -1;
            }else {
                move = 1;
            }
        }
        if (!this.collision(0,0,nextPattern)) {
            this.unDraw();
            this.x += move;
            this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;    //cập nhật chỉ số của hình
            this.activeTetromino = this.tetromino[this.tetrominoN];
            this.draw();
        }
    }

    lock() {
        for (let r=0; r < this.activeTetromino.length; r++){
            for (let c=0; c < this.activeTetromino.length; c++) {
                if (!this.activeTetromino[r][c]) {                                 //ở vị trí [r][c] k có dữ liệu
                    continue;
                }
                // check game over
                if (this.y + r < 0) {
                    this.audio2.play();
                    gameOver = true;
                    alert('Game Over');
                    break;
                }

                // khóa chuyển động của hình
                board[this.y + r][this.x + c] = this.color;
            }
        }

                //xử lý ăn điêm
        for (let r = 0; r < ROW; r++) {
            let isFull = true;
            for (let c = 0; c < COL; c++) {
                isFull = isFull && (board[r][c] !== COLOR);

            }
            if (isFull) {
                for (let y = r; y > 1; y--){
                    for (let c = 0; c < COL; c++) {
                        board[y][c] = board[y-1][c];
                    }
                }
                for (let c = 0; c < COL; c++) {
                    board[0][c]= COLOR
                }
                this.audio.play();
                score += 10;
            }
        }
        drawBoard();
        if (maxScore < score) {
            maxScore = score;
            localStorage.setItem("maxScore", `${maxScore}`);
        }
        document.querySelector('#score').innerText = score;
        checkMaxScore();
    }

}

document.addEventListener('keydown' , function (event){
    if (event.keyCode === 37) {
        p.moveLeft();
    }else if (event.keyCode === 39) {
        p.moveRight();
    }else if (event.keyCode === 38){
        p.rotate();
    }else if (event.keyCode === 40) {
        p.moveDown();
    }else if (event.keyCode === 32) {
        interval2 = setInterval(() => {
            p.moveDown();
        },250)

    }

})
function randomPiece() {
    let r = Math.floor(Math.random() * PIECES.length);
    console.log(r)
    return new Piece(PIECES[r][0] , PIECES[r][1]);
}
let p = randomPiece();

          // hàm thả roi
function drop() {
    interval = setInterval(function() {
        if (!gameOver) {
            p.moveDown();
        }else {
            clearInterval(interval)
        }
    },400)
}
drop();
let maxScore;

function checkMaxScore() {
    if (typeof (Storage) !== "undefined") {
        if (localStorage.getItem("maxScore")) {
            maxScore = localStorage.getItem("maxScore");
        } else {
            maxScore = 0;
            localStorage.setItem("maxScore", `${maxScore}`);
        }
        document.getElementById("max-score").innerText = maxScore;
    } else {
        document.getElementsByClassName("score")[1].hidden = true;
    }
}

function resetMaxScore() {
    localStorage.removeItem("maxScore");
    checkMaxScore();
}
