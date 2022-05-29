let c = document.getElementById('canvas');
let ctx = c.getContext('2d');
const ROW = 19;
const COL = 12;
const SQ = 30;
const COLOR = 'lightblue';
let score = 0;
let gameOver = false;
let playing = false;
let interval;
let interval2 ;

function drawSquare (x,y,color) {
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ)
    ctx.strokeStyle = '#ccc';
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ) ;
}
let board =[];
for(let r=0; r < ROW; r++) {
    board[r] = [];
    for (let c=0; c < COL;c++){
        board[r][c] = COLOR;
    }
}
function drawBoard() {
    for (let r=0;r < ROW; r++){
        for (let c=0; c < COL; c++){
            drawSquare(c,r,board[r][c]);
        }
    }
}
drawBoard();