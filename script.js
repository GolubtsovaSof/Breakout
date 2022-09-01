const grid = document.querySelector('.grid')
const pausePlay = document.querySelector('.pauseAndPlay')
const block_W = 10
const block_H = 5
const user_W = 16
const user_H= 5;
const ball_W = 2
const ball_H = (window.innerWidth/window.innerHeight)*2
const userStart = [42,5]
const ballStart = [48,10.5]
let userCurrentPosition = userStart
let ballCurrentPosition = ballStart
let xDir = 0.5
let yDir = 0.5

class Block{
    constructor(xAxis, yAxis){
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + block_W, yAxis]
        this.topLeft = [xAxis, yAxis+block_H]
        this.topRoght = [xAxis+block_W, yAxis+block_H]
    }
}

const blocks=[]
for(let i=0; i<5; i++){
    for (let j=0; j<9; j++){
        blocks.push(new Block(1+11*j,90-7*i))
    }
}
addBlocks()
let allBlocks = Array.from(document.querySelectorAll('.block'))


function addBlocks(xAxis, yAxis) {
    for(let i = 0; i<blocks.length; i++){
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = blocks[i].bottomLeft[0]+'vw'
        block.style.bottom = blocks[i].bottomLeft[1]+'vh'
        grid.appendChild(block)
    }
}

const user = document.createElement('div')
user.classList.add('user')
drawUser();
grid.appendChild(user)

function drawUser(){
    user.style.left = userCurrentPosition[0]+'vw'
    user.style.bottom = userCurrentPosition[1]+'vh'
}

function moveUser(e){
    switch(e.key){
        case 'ArrowLeft':
            if(userCurrentPosition[0]>0){
                userCurrentPosition[0] -= 1
                drawUser()
                break;
            }
    }
    switch(e.key){
        case 'ArrowRight':
            if(userCurrentPosition[0]<100-user_W){
                userCurrentPosition[0] += 1
                drawUser()
                break;
            }
    }
}

document.addEventListener('keydown', moveUser)

const ball = document.createElement('div')
ball.classList.add('ball')
drawBall();
grid.appendChild(ball)

function drawBall(){
    ball.style.left = ballCurrentPosition[0]+'vw'
    ball.style.bottom = ballCurrentPosition[1]+'vh'
}

function moveBall(){
    ballCurrentPosition[0]+=xDir
    ballCurrentPosition[1]+=yDir
    drawBall()
}

timer1 = setInterval(moveBall,30)
timer2 = setInterval(checkCollisoins,30)

function checkCollisoins(){
    if(ballCurrentPosition[0]>=100-ball_W || ballCurrentPosition[0]<=0){
        changeDirection('LeftOrRight')
    }
    else if (ballCurrentPosition[1]>=100-ball_H){
        changeDirection('TopOrBottom')
    }

    for(let i=0; i<blocks.length; i++){
        if(
            (ballCurrentPosition[0]+ball_W>=blocks[i].bottomLeft[0] && ballCurrentPosition[0]<=blocks[i].bottomRight[0])
            &&
            ((ballCurrentPosition[1]<=blocks[i].topLeft[1] && ballCurrentPosition[1]>=blocks[i].topLeft[1]-0.6 && yDir<0)||
             (ballCurrentPosition[1]+ball_H>=blocks[i].bottomLeft[1] && ballCurrentPosition[1]+ball_H<=blocks[i].bottomLeft[1]+0.6 && yDir>0))
        ){
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blocks.splice(i,1)
            changeDirection('TopOrBottom')
        }
        else if(
            (ballCurrentPosition[1]<=blocks[i].topLeft[1] && ballCurrentPosition[1]+ball_H>=blocks[i].bottomLeft[1])
            &&
            ((ballCurrentPosition[0]+ball_W>=blocks[i].bottomLeft[0] && ballCurrentPosition[0]<=blocks[i].bottomRight[0] && xDir>0)||
             (ballCurrentPosition[0]<=blocks[i].bottomRight[0] && ballCurrentPosition[0]>=blocks[i].bottomLeft[0]&&xDir<0))
        ){
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blocks.splice(i,1)
            changeDirection('LeftOrRight')
        }
    }

    //столкновение с user
    if(
        ballCurrentPosition[0]+ball_W>=userCurrentPosition[0] && ballCurrentPosition[0]<=userCurrentPosition[0]+user_W
        &&
        ballCurrentPosition[1]<=userCurrentPosition[1]+user_H && ballCurrentPosition[1]>=userCurrentPosition[1]+user_H-0.6 && yDir<0
    )
    {
        changeDirection('TopOrBottom')
    }
    else if
    (
        ballCurrentPosition[1]<=userCurrentPosition[1]+user_H && ballCurrentPosition[1]>=userCurrentPosition[1]
        &&
        (
            ballCurrentPosition[0]+ball_W>=userCurrentPosition[0] && ballCurrentPosition[0]<=userCurrentPosition[0]+user_W 
            ||
            ballCurrentPosition[0]<=userCurrentPosition[0]+user_W && ballCurrentPosition[0]>=userCurrentPosition[0]
        )
    ){
        changeDirection('LeftOrRight')
    }
    if(blocks.length==0){
        clearInterval(timer1)
        clearInterval(timer2)
        document.removeEventListener('keydown', moveUser)
        document.querySelector('.win').style.visibility = 'visible';
    }

    //проигрыш
    if(ballCurrentPosition[1]<=0){
        clearInterval(timer1)
        clearInterval(timer2)
        document.removeEventListener('keydown', moveUser)
        document.querySelector('.lose').style.visibility = 'visible';
    }
}

function changeDirection(ballSide){     //в качестве параметра - строна шарика, которая была задействована в столкновении (строкой)
    switch(ballSide){
        case 'TopOrBottom':
            if (xDir==-0.5 && yDir==0.5){
                xDir=-0.5
                yDir=-0.5
                break;
            }
            if (xDir==0.5 && yDir==0.5){
                xDir=0.5
                yDir=-0.5
                break;
            }
            if(xDir==0.5 && yDir==-0.5){
                xDir=0.5
                yDir=0.5
                break;
            }
            if(xDir==-0.5 && yDir==-0.5){
                xDir=-0.5
                yDir=0.5
                break;
            }
        case 'LeftOrRight':
            if(xDir==-0.5 && yDir==0.5){
                xDir=0.5
                yDir=0.5
                break;
            }
            if(xDir==-0.5 && yDir==-0.5){
                xDir=0.5
                yDir=-0.5
                break;
            }
            if(xDir==0.5 && yDir==0.5){
                xDir=-0.5
                yDir=0.5
                break;
            }
            if(xDir==0.5 && yDir==-0.5){
                xDir=-0.5
                yDir=-0.5
                break;
            }
        default:
            alert('ERROR')
    }
}
function changeState(){
    if(pausePlay.getAttribute('src') == './pause.png'){
        pausePlay.setAttribute('src', './play.png')
        clearInterval(timer1);
        clearInterval(timer2);
    }
    else{
        pausePlay.setAttribute('src', './pause.png')
        timer1 = setInterval(moveBall,30)
        timer2 = setInterval(checkCollisoins,30)
    }
}