audioBg=document.createElement("audio");  
audioBg.setAttribute('src','music.mp3')    
audioBg.loop=true;

audioMove=document.createElement("audio");  
audioMove.setAttribute('src','move.mp3')    


audioFood=document.createElement("audio");  
audioFood.setAttribute('src','food.mp3')    


audioGmover=document.createElement("audio");  
audioGmover.setAttribute('src','gameover.mp3')    


function init()
{
   canvas=document.getElementById('mycanvas');
   pen=canvas.getContext('2d');
   W=canvas.width;
   H=canvas.height;
   
   Score=0;
   myscor=document.getElementById('myscore');
   myscor.innerHTML="Score <br><hr> "+Score;
   
   highscore=localStorage.getItem("highscore");
   myhighscor=document.getElementById('myhighscore');
   myhighscor.innerHTML="High Score <br><hr>"+highscore;

   
  flag=false;

  food=getRandomFood();

        snake= {
         init_length:5,
         color:"yellow",
         cells:[],//cells is a array of objects {x:$,y:$}
         direction:"right",
         createCellsArray:function(){
            for(var i=this.init_length-1;i>=0;i--)
            {
             this.cells.push({x:i,y:0});
            }  
         },
         drawSnake:function(){
          for(var i=0;i<this.cells.length;i++)
          {
            pen.fillStyle=this.color;
            pen.strokeStyle="black";
            pen.lineWidth=5;
            pen.strokeRect(this.cells[i].x*10,this.cells[i].y*10,10,10);
            pen.fillRect(this.cells[i].x*10,this.cells[i].y*10,10,10);
          }
          
         },
         updateSnake:function(){  // is function ke chalne se cells array update ho raha hai;
            var headX=this.cells[0].x;
            var headY=this.cells[0].y;
            
            // food ko khane par
            if(food.x==headX && food.y==headY)
            { audioFood.play();
              food=getRandomFood();
              Score=Score+5;
              myscor.innerHTML="Score <br><hr> "+Score;
              highscore=localStorage.getItem("highscore");
              if(Score>=highscore)
              {
               localStorage.setItem('highscore',Score);
               myhighscor.innerHTML="High Score <br><hr>"+Score;

              }
            }
            else{
              this.cells.pop();
            }
            
           
            if(this.direction=="right")
            {
               nextX=headX+1;
               nextY=headY;
            }
            else if(this.direction=="left")
            {
               nextX=headX-1;
               nextY=headY;
            }
            else if(this.direction=="down")
            {
               nextX=headX;
               nextY=headY+1;
            }
            else
            {
               nextX=headX;
               nextY=headY-1;
            }
            
            // if snake eat itself
            for(var i=0;i<this.cells.length;i++)
            {
               if(this.cells[i].x==nextX && this.cells[i].y==nextY )
               { 
                  
                  gameOver();
                  
               }
            }
               this.cells.unshift({x:nextX,y:nextY});
          
            

            // find out the last coordinates (boundaries)
            var last_x=Math.round(W/10);
            var last_y=Math.round(H/10);

            if(this.cells[0].x<=-1 || this.cells[0].y<=-1 || this.cells[0].x>=last_x || this.cells[0].y>=last_y)
            { 
               gameOver();
              
            }
         }
    };
    snake.createCellsArray();
     
    function keyPressed(e)
    {
       //console.log(e); 
       preKey=snake.direction;
       if(p==0){
         if(e.key=="ArrowRight")
         { 
            if(preKey!="left")
            { 
               snake.direction="right";
               audioMove.play();
            }
            
         }
         else if(e.key=="ArrowLeft")
         {  
            if(preKey!="right") 
            {
               snake.direction="left";
               audioMove.play();
            }
            
         }
         else if(e.key=="ArrowDown")
         {
            if(preKey!="up"){
               snake.direction="down";
               audioMove.play();
            }
           
         }
         else if(e.key=="ArrowUp")
         { 
            if(preKey!="down")
            {
               snake.direction="up";
               audioMove.play();
            }
            
         }
       }
        
         
    }
    // add event listener to my game
    // pure document ko listen karenge
    document.addEventListener('keydown',keyPressed);
    
    
}

function draw()
{   
  
  pen.clearRect(0,0,W,H); //har call me previous snake ko erase kar rahe hai
  snake.drawSnake();     // naya snake bana rahe hai;

  // lets us draw the food
  pen.fillStyle=food.color;
  pen.fillRect(food.x*10,food.y*10,10,10);

}

function update()
{
    snake.updateSnake();
}
function gameloop()
{
    draw();
    update();
    p=0;
    if(flag==true)
    {
      clearInterval(f);
    }
    
}
function getRandomFood(){
  var foodX=Math.round(Math.random()*(W-10)/10);
  var foodY=Math.round(Math.random()*(H-10)/10);
   
  foodColors=["red","green","aqua","coral","orchid"];

  var i=Math.round(Math.random()*(foodColors.length-1));

   var food={
    x:foodX,
    y:foodY,
    color:foodColors[i]
   };

   return food;
}
function gameOver()
{
    //player.start=false;
    audioBg.pause();
    audioGmover.play();

    pen.fillStyle="red";
    pen.strokeStyle="black";
    pen.lineWidth=5;
    pen.strokeRect(snake.cells[1].x*10,snake.cells[1].y*10,10,10);
    pen.fillRect(snake.cells[1].x*10,snake.cells[1].y*10,10,10);

    flag=true;
    startScreen.classList.remove('hide');
    //startScreen.style.cssText="display:block;"
    startScreen.innerHTML="Game Over <br> press here to restart";
}


init();
draw();
p=1;


startScreen=document.querySelector('.startScreen');
startScreen.addEventListener('click',start);

 function start()
 { 
   startScreen.classList.add('hide');
   // audioBg.play(); 
   //startScreen.style.cssText="display:none;"
   if(p==0)
      init();
   f=setInterval(gameloop,200);
 }
