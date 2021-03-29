var myGamePiece;
var myBackground;

// window.onload = window.onresize = function() {
//   var canvas = document.getElementById('canvas');
//   canvas.width = window.innerWidth * 0.8;
//   canvas.height = window.innerHeight * 0.8;
// }

function startGame() {
    myGamePiece = new component(40, 40, "assets/icon_player1.png", 0, 620, 0 , "image");
    myBackground = new component(700, 700, "Boardnew.jpeg", 0, 0, null, "image");
    myDice = new component(70,70,"assets/dice1.jpg",620,720, null, "image");
    mytest= new component(10,10,"blue",20,20,null,"shape")
    
    //myGameArea.start();
}

$(window).on('load resize', function () {
  console.log("hey");
  window.wwidth = $(window).width();
  var wheight = $(window).height();
  startGame();
  if(wwidth<700){
  myBackground.width = 700;
  myBackground.height = 700;
  myGameArea.start();
  }
  if(wwidth>700){
  myBackground.width = 600;
  myBackground.height = 600;
  myGamePiece.y = 540;
  myDice.x = 620;
  myDice.y = 530;
  myGameArea.start();
  }


 
});

var myGameArea = {
    canvas: document.createElement("canvas",{"id":"canvas"}),
    
    
    
    
    start : function() {
        
        var width = myBackground.width;  // also height
        this.canvas.width = 700;
        this.canvas.height = 900;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        this.context.fillRect(40,40,1,1);
        const board = [];
        let position = 1;
        let count = 1;
        let check = false;
        var widthbuff = width/10 ;          // also heightbuff
        var widthstart = .0615 * width;
        var allsquare = 2 * widthstart;
        var persquare = width - allsquare;
        var permove = persquare / 10  ;
        console.log(widthbuff);
        console.log(widthstart);
        console.log(allsquare);
        console.log(persquare);
        console.log(permove);
//        for (var y = myBackground.height - 70; y >= 43; y-=61.4) {
        for (var y = width - widthbuff; y >= widthstart; y-=permove) {
          let row = [];        
          board.push(row);
//          for (var x = 43; x < myBackground.width - 70; x+=61.4) {
          for (var x = widthstart; x < width - widthbuff; x+=permove) {
            console.log("jjjj")
            
            if(count <= 10){
              if(check){
                position+=11;
                check = false; 
              }
              row.push({x,y,occupied:null,position});
              position ++;
              count++;
            }
            if (count > 10){
              if(count == 11){
              position+=9;
              count++;
              break;
              }
              row.push({x,y,occupied:null,position});
              position --;
              count++;
              if(count == 22){
                count = 1;
                check = true;
              }

            }

          }
        }
        console.log(board)
        
        this.canvas.addEventListener('click', (e) => {
            const pos = {
                 x: e.clientX,
                 y: e.clientY
               };
               //console.log("this is" + pos.x , pos.y);
                 if (isIntersect(pos, myDice)) {
                   rollDie(board);
                   //alert('click on dice');
                 };
             });
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
    
    
}

function component(width, height, color, x, y, playerpos, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    if (type == "image1") {
        this.image = new Image();
        this.image.src = color;
        //this.image.style = "border: 2px solid";
    }
    
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.playerpos = playerpos;   
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }    
}

function updateGameArea() {
    myGameArea.clear();
    myBackground.newPos();    
    myBackground.update();
    myGamePiece.newPos();    
    myGamePiece.update();
    myDice.newPos();
    myDice.update();
}

function move(roll,board) {

    //myDice.image.src = "assets/icon_dice.png";
    if (roll) {//myGamePiece.speedX = 1;
        //console.log(board);
        newCords = []; 
        let oldPos = myGamePiece.playerpos;
        let newPos = myGamePiece.playerpos + roll;
        if(newPos > 100){
          push_status(0,"No Move. Try Again");
          newPos = oldPos;
        }
        let diff = newPos - oldPos;
        myGamePiece.playerpos = newPos;
        //console.log(newPos);
        for( let tiles of board){
            for( let tile of tiles){
                if(tile.position == newPos){
                    newCords.push(tile);
                    //console.log(newCords);
                }
            }
        }
        //console.log(newCords[0].x);
        //console.log(myGamePiece.x);
        myGamePiece.x = newCords[0].x + 10.2  ;
        myGamePiece.y = newCords[0].y - 29.3;
        checkSnakeorLadder(board);
        //console.log(myGamePiece.x);
        }
    updateGameArea();
    //if (dir == "down") {myGamePiece.speedY = 1; } 
    //if (dir == "left") {myGamePiece.speedX = -1; }
    //if (dir == "right") {myGamePiece.speedX = 1; }
}

function clearmove() {
    //myGamePiece.image.src = "smiley.gif";
    myGamePiece.speedX = 0; 
    myGamePiece.speedY = 0; 
}

function isIntersect(pos, myDice) {
   // console.log("hey");
    console.log("pos y",pos.y);
    console.log("dice y", myDice.y);
    console.log("pos x", pos.x);
    console.log("dice x", myDice.x);
    if (pos.x > myDice.x + 120 && pos.x < myDice.x + 190 && pos.y >myDice.y && pos.y < myDice.y+70)
        return true;
    return false;
  }
  
  function rollDie(board) {
      //console.log(board);
    const max = 6;
    const roll = Math.ceil(Math.random() * max);
    //console.log("You rolled", roll);
    newdice = "assets/dice"+ roll + ".jpg";
    //console.log(newdice);
    myDice.image.src = newdice;
    move(roll,board);
    
    
  }

  function checkSnakeorLadder(board){

    const ladders = [
      {
      start: 3,
      end: 60
    },{
      start: 6,
      end: 27
    },{
      start: 11,
      end: 70
    },{
      start: 35,
      end: 56
    },{
      start: 63,
      end: 96
    },{
      start:68,
      end: 93
    },
      {
      start: 37,
      end: 1
    },{
      start: 25,
      end: 5
    },{
      start: 47,
      end: 12
    },{
      start: 65,
      end: 59
    },{
      start: 82,
      end: 61
    },{
      start:87,
      end: 54
    }
    ,{
      start:89,
      end: 69
    }
  ];
  ladders.forEach(ladder=>{
    //console.log(myGamePiece.playerpos)
    ladCords = [];
    if (ladder.start === myGamePiece.playerpos) {
      console.log("You stepped on a ladder!");
      if(ladder.start> ladder.end){
      push_status(0, "Snake");
      }
      if(ladder.start < ladder.end){
      push_status(1, "Ladder");
      }
      myGamePiece.playerpos = ladder.end;
      for( let tiles of board){
        for( let tile of tiles){
            if(tile.position == myGamePiece.playerpos){
                ladCords.push(tile);
                //console.log(newCords);
            }
        }
    }
    myGamePiece.x = ladCords[0].x + 10.2  ;
    myGamePiece.y = ladCords[0].y - 29.3;
    }
  });
  
  
  if (myGamePiece.playerpos === 100) {
    push_status(1, "Player has won!");
    console.log("Player has won!");
    hasWon = true;
  }

  }

  
function push_status(status_code, message) {
  let root = document.getElementById("status_msg");
  root.className = "snackbar";
  root.innerHTML = "";
  let p = document.createElement("p");
  p.class = "empty";
  p.innerHTML = message;

  if (status_code === 0) {
      let b = document.createElement("b");
      b.innerHTML = " Oh No! ";
      b.style.color = "red";
      root.appendChild(b);
  } else if (status_code === 1) {
      let b = document.createElement("b");
      // let p = document.createElement("p");
      b.innerHTML = "YAY! ";
      b.style.color = "green";
      root.appendChild(b);
  }
  root.appendChild(p);
  setTimeout(function () {
      root.className = "nothing";
  }, 1000);
}
