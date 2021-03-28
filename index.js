var myGamePiece;
var myBackground;


function startGame() {
    myGamePiece = new component(40, 40, "assets/icon_player1.png", 0, 630, 0 , "image");
    myBackground = new component(700, 700, "Boardnew.jpeg", 0, 0, null, "image");
    myDice = new component(70,70,"assets/dice1.jpg",0,800, null, "image");
    mytest= new component(10,10,"blue",20,20,null,"shape")
    
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    
    
    start : function() {
        this.canvas.width = 700;
        this.canvas.height = 900;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        this.context.fillRect(40,40,1,1);
        const board = [];
        let position = 1;
        const ladders = [{
          start: 2,
          end: 22
        },{
          start: 50,
          end: 34
        },{
          start: 10,
          end: 44
        },{
          start: 61,
          end: 19
        },{
          start: 70,
          end: 83
        },{
          start:78,
          end: 4
        }];
        
        for (var y = myBackground.height - 70; y >= 43; y-=58.7) {
          let row = [];
          
          board.push(row);
          for (var x = 43; x < myBackground.width - 70; x+=61.4) {
            
            row.push({x,y,occupied:null,position});
            position ++;
          }
        }
        console.log(board)
        
        this.canvas.addEventListener('click', (e) => {
            const pos = {
                 x: e.clientX,
                 y: e.clientY
               };
               console.log("this is" + pos.x , pos.y);
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
        newPos = myGamePiece.playerpos + roll;
        myGamePiece.playerpos = newPos;
        //console.log(newPos);
        for( let tiles of board){
            for( let tile of tiles){
                if(tile.position == newPos){
                    newCords.push(tile);
                    console.log(newCords);
                }
            }
        }
        //console.log(newCords[0].x);
        //console.log(myGamePiece.x);
        myGamePiece.x = newCords[0].x + 10.2  ;
        myGamePiece.y = newCords[0].y - 29.3;
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
    console.log("hey");
    console.log(pos.y);
    console.log(myDice.y);
    if (pos.x > myDice.x && pos.x < myDice.x + 70 && pos.y < myDice.y + 70)
        return true;
    return false;
  }
  
  function rollDie(board) {
      //console.log(board);
    const max = 6;
    const roll = Math.ceil(Math.random() * max);
    console.log("You rolled", roll);
    newdice = "assets/dice"+ roll + ".jpg";
    //console.log(newdice);
    myDice.image.src = newdice;
    move(roll,board);
    
  }
