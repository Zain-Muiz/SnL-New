var myGamePiece;
var myBackground;
var myBanner;
var gameover = false;

// window.onload = window.onresize = function() {
//   var canvas = document.getElementById('canvas');
//   canvas.width = window.innerWidth * 0.8;
//   canvas.height = window.innerHeight * 0.8;
// }

function startGame() {
    myGamePiece = new component(40, 40, "assets/icon_player1.png", 0, 620, 0 , "image");
    myBackground = new component(700, 700, "Boardnew.jpeg", 0, 0, null, "image");
    myDice = new component(70,70,"assets/dice1.jpg",620,720, null, "image");
    myBanner= new component(520,126,"",0,740,null,"image");
    
    //myGameArea.start();
}

$(window).on('load resize', function () {
 // console.log("hey");
  window.wwidth = $(window).width();
  window.wheight = $(window).height();
  startGame();
  if(wwidth<700){
  myBackground.width = 700;
  myBackground.height = 700;
  myBanner.x = 90;
  myBanner.y = 267;
  myGameArea.start();
  }
  if(wwidth>700){
  myBackground.width = 600;
  myBackground.height = 600;
  myGamePiece.y = 540;
  myDice.x = 620;
  myDice.y = 530;
  myBanner.x = 40;
  myBanner.y = 217;
  myGameArea.start();
  }


 
});

var myGameArea = {
    canvas: document.createElement("canvas",{"id":"canvas"}),
    
    
    
    
    start : function() {
        
        var width = myBackground.width;  // also height
        this.canvas.width = 700;
        this.canvas.height = 800;
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
        let newcount = 1;
        let newboard = [];
        for(let tiles of board ){
          console.log(tiles.length);

          if(newcount % 2 == 1){
            newboard.push(tiles);
          }
          
          if(newcount % 2 == 0){
            
            let temp = [];
            console.log(tiles.length);
            for (i=0;i<tiles.length;i++){
              //console.log(tiles[tiles.length -1 -i]);
            temp.push(tiles[tiles.length -1 -i]);
            }
            newboard.push(temp);
             
          }
          newcount++;
        }
        console.log(newboard);
        console.log(board)
        let stopcallback = false;
        this.canvas.addEventListener('click', async(e) => {
          if(!stopcallback){
            //stopcallback = true;
            const pos = {
                 x: e.clientX,
                 y: e.clientY
               };
               //console.log("this is" + pos.x , pos.y);
                 if (isIntersect(pos, myDice)) {
                   let roll = await rollDie(newboard);
                   await new Promise(resolve => setTimeout(resolve,750));
                   await move(roll,newboard);
                   //alert('click on dice');
                 };
            stopcallback = false;
                }});
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
    myBanner.newPos();
    myBanner.update();
}

function move(roll,newboard) {
  return new Promise(async(resolve,reject) =>{ 
    //myDice.image.src = "assets/icon_dice.png";
    if (roll ) {//myGamePiece.speedX = 1;
        //console.log(board);
        newCords = []; 
        let oldPos = myGamePiece.playerpos;
        let newPos = myGamePiece.playerpos + roll;
        if( newPos > 100){
          if(oldPos == 100){
            push_status(0,"Game Over. Click Play Again.");
          }
          else{
          push_status(0,"No Move. Try Again");
          }
          newPos = oldPos;
        }
        let diff = newPos - oldPos;
        myGamePiece.playerpos = newPos;
        console.log("oldp",oldPos);
        console.log("newp",newPos);
        for( let tiles of newboard){
            for( let tile of tiles){
                if(oldPos < tile.position){
                  if( tile.position <= newPos){
                    newCords.push(tile);
                    console.log(newCords);
                }}
            }
          }

        var movepiecesound = new Audio('movepiece' + roll + '.mp3');
           
            for(i=0; i < newCords.length; i++){
              console.log("hey");
              myGamePiece.x = newCords[i].x + 10.2  ;
              myGamePiece.y = newCords[i].y - 29.3;
              movepiecesound.play();
              await new Promise(resolve => setTimeout(resolve,750));
            }
          
        
        
        await checkSnakeorLadder(newboard);
        resolve();
        }});
    updateGameArea();
}

function clearmove() {
    myGamePiece.speedX = 0; 
    myGamePiece.speedY = 0; 
}

function isIntersect(pos, myDice) {
   var diceroll = new Audio('dice.mp3');
     console.log("pos y",pos.y);
     console.log("dice y", myDice.y);
     console.log("pos x", pos.x);
     console.log("dice x", myDice.x);
    if(myBackground.width >600){
      console.log("mobile");
      var finalheight;
      if(window.wwidth<454){
      hieghtbuffer = window.wheight/100;
      finalheight = 33 * hieghtbuffer;
      }
      else{
        finalheight = 0;
      }
      if (pos.x > myDice.x && pos.x < myDice.x + 70 && pos.y >myDice.y+finalheight && pos.y < myDice.y+70+finalheight){
        diceroll.play();  
        return true;
          
      }
      else{
        return false;
      }
    }
    else if(myBackground.width<=600){
      console.log("desk");
      extracanvasspace = window.wwidth - 700;
      precanvasbuff = extracanvasspace / 2 ; 
      if (pos.x > myDice.x + precanvasbuff && pos.x < myDice.x + precanvasbuff + 70 && pos.y >myDice.y && pos.y < myDice.y+70){
        diceroll.play();  
        return true;
          
      }
      else {
        return false;
      }
    }
  }
  
  function rollDie(newboard) {
    let stopcallback = false;
    return new Promise(async(resolve,reject) =>{ 
    if(!stopcallback){ 
    stopcallback = true;
    const max = 6;
    const roll = Math.ceil(Math.random() * max);
    console.log("You rolled", roll);
    newdice = "assets/dice"+ roll + ".jpg";
    console.log(newdice);
    myDice.image.src = newdice;
    await new Promise(resolve => setTimeout(resolve,750));
    resolve(roll);
   // await move(roll,newboard);
    stopcallback = false;}
    })
    
    
  }

  function checkSnakeorLadder(newboard){

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
  var laddersound = new Audio('Laddersound.mp3');
  var snakesound = new Audio('SnakeOhno.mp3');
  ladders.forEach(ladder=>{
    //console.log(myGamePiece.playerpos)
    ladCords = [];
    if (ladder.start === myGamePiece.playerpos) {
      console.log("You stepped on a ladder!");
      if(ladder.start> ladder.end){
      snakesound.play();
      myBanner.image.src = "assets/sndl"+ ladder.start + ".png";
      setTimeout(function () {
        myBanner.image.src = "";
    }, 2000);
      
      }
      if(ladder.start < ladder.end){
      laddersound.play();
      myBanner.image.src = "assets/sndl"+ ladder.start + ".png";
      setTimeout(function () {
        myBanner.image.src = "";
    }, 2000);
      
      }
      myGamePiece.playerpos = ladder.end;
      for( let tiles of newboard){
        for( let tile of tiles){
            if(tile.position == myGamePiece.playerpos){
                ladCords.push(tile);
                console.log(newCords);
            }
        }
    }
    myGamePiece.x = ladCords[0].x + 10.2  ;
    myGamePiece.y = ladCords[0].y - 29.3;
    console.log(myGamePiece.y);
    }
  });
  
  
  if (!gameover && myGamePiece.playerpos === 100) {
    myBanner.image.src = "assets/sndl"+ myGamePiece.playerpos + ".png";
    var btn = document.createElement("BUTTON");   // Create a <button> element
    btn.innerHTML = "PLAY AGAIN"  ;
    btn.onclick = playagain;                 // Insert text
    document.body.appendChild(btn); 
    gameover = true;
  }

  }

  
  function push_status(status_code, message) {
    let root = document.getElementById("status_msg");
    root.className = "snackbar";
    root.innerHTML = "";
    let p = document.createElement("p");
    p.className = "empty";
    p.innerHTML = message;

    if (status_code === 0) {
        let b = document.createElement("b");
        b.innerHTML = "Oh No! ";
        b.style.color = "red";
        root.appendChild(b);
    } else if (status_code === 1) {
        let b = document.createElement("b");
        // let p = document.createElement("p");
        b.innerHTML = "SUCCESS: ";
        b.style.color = "green";
        root.appendChild(b);
    }
    root.appendChild(p);
    setTimeout(function () {
        root.className = "nothing";
    }, 1000);
}

function playagain(){
   window.location.reload();
}