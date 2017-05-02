//scaling stuff
var blockGap = parseInt(window.innerWidth*0.0445); //85px
var blockWidth = parseInt(window.innerWidth*0.0395); //75px
var leftOffset = parseInt(window.innerWidth*0.193); //370px
var upgradeWidth = parseInt(window.innerWidth*0.0235); //45px
var upgradeOffset = parseInt(window.innerWidth*0.0079); //15px
var ballTop = blockGap*10; //850px
var ballLeft = parseInt(window.innerWidth*0.4975); //955px
var barrier = parseInt(window.innerWidth*0.2315);//444px
var barrier2 = parseInt(window.innerWidth*0.7685);//1475px
var ballWidth = parseInt(window.innerWidth*0.0053);//10px

document.getElementsByClassName("ball")[0].style.width=ballWidth + "px";
document.getElementsByClassName("ball")[0].style.height=ballWidth + "px";
document.getElementById("arrow").style.width=ballWidth + "px";
document.getElementById("arrow").style.height=ballWidth + "px";
document.getElementById("arrow2").style.width=ballWidth + "px";
document.getElementById("arrow2").style.height=ballWidth + "px";

document.getElementById("cover").style.top=ballTop+5 + "px";
document.getElementById("barrier").style.left=barrier + "px";
document.getElementById("barrier2").style.left=barrier2 + "px";

var score = 0;
var highscore = 0;
var blocks = [];
var row = 0;
var rowblock = 0;
var shooting = false;
var positionY = [ballTop];
var positionX = [ballLeft];
var x,y,shootingX = [0],shootingY = [0];
var direction = ["left"];
var deleted = false;
var gameOverShown = false;
var arrowVisible = true;
var fps = 60;

var newBallSound = new Audio("sound/newball.wav");
var shootSound = new Audio('sound/shoot.wav');
var hitWallSound = new Audio("sound/hitwall.wav");
var fallSound = new Audio("sound/fall.wav");
var hitSound = new Audio("sound/hit"+(Math.floor(Math.random() * 3) + 1)+".wav");
var gameOverSound = new Audio("sound/gameover.wav");
var gameOverAppearSound = new Audio("sound/gameoverappear.wav");
var restartSound = new Audio("sound/restart.wav");

//renders the blocks
function GenerateLevel(levels){
	for(var i=0;i<12;i++){
		var randnum = Math.floor(Math.random() * 30);
		if(randnum != 15){
			blocks.push(randnum);
		} else {
			blocks.push(1);
		}
	}
	
	if(score > 0 && score != 2){
		blocks[12*row+Math.floor(Math.random() * 12)] = 15;
	}
	
	RenderLevel();
}

function RenderLevel(){
	for(i=0+12*row;i<12+12*row;i++){
		rowblock++;
		if(blocks[i] <= 10 && blocks[i] != 0){
			var y = document.createElement("div");
			var num = Math.floor(Math.random() * (score*1.5)) + 1;
			y.innerHTML=num;
			y.style.left=leftOffset+blockGap*rowblock+"px";
			y.style.top=blockGap + "px";
			y.style.opacity=1;
			y.style.width = blockWidth;
			y.style.height = blockWidth;
			y.style.lineHeight = blockWidth + "px";
			y.style.fontSize = blockWidth/3 + "px";
			y.style.backgroundColor="hsl("+(75+(num*15))+", 50%, 50%)";
			y.className="block";
			var blocksDiv = document.getElementById("blocks");
			blocksDiv.appendChild(y);
		}
		if(blocks[i] > 10 && blocks[i] != 15 || blocks[i] == 0){
			var y = document.createElement("div");
			var num = Math.floor(Math.random() * (score*1.5)) + 1;
			y.style.left=leftOffset+blockGap*rowblock+"px";
			y.style.top=blockGap + "px";
			y.style.opacity=0;
			y.style.width = blockWidth;
			y.style.height = blockWidth;
			y.style.backgroundColor="hsl("+(75+(num*15))+", 50%, 50%)";
			y.className="block";
			var blocksDiv = document.getElementById("blocks");
			blocksDiv.appendChild(y);
		}
		if(blocks[i] == 15){
			var y = document.createElement("div");
			y.style.left=leftOffset+blockGap*rowblock+upgradeOffset+"px";
			y.style.top=blockGap+upgradeOffset + "px";
			y.style.opacity=0.8;
			y.style.width=upgradeWidth + "px";
			y.style.height=upgradeWidth + "px";
			y.style.backgroundColor="white";
			y.style.borderRadius="300px";
			y.className="block";
			var blocksDiv = document.getElementById("blocks");
			blocksDiv.appendChild(y);
		}
	}
}

function Shoot(){
	if(shooting == false && (y-ballTop)/50 < -0.4){
		for(var i=0;i<document.getElementsByClassName("ball").length;i++){
			shootingX[i] = (x-ballLeft-15)/80;
			shootingY[i] = (y-ballTop)/80;
			positionY[i] = ballTop-5*shootingY[i]*[i];
			positionX[i] = ballLeft-5*shootingX[i]*[i];
			if(shootingX[i] <= 0){
				direction[i] = "left";
			} else {
				direction[i] = "right";
			}
		}
		shootSound.play();
		shooting = true;
		document.getElementById("tutorial").style.opacity=0;
	}
}

window.onmousemove = function (e) {
    x = e.clientX;
    y = e.clientY;
	
    document.getElementById("arrow").style.top = (y + -5) + 'px';
    document.getElementById("arrow").style.left = (x + -5) + 'px';
	
    document.getElementById("arrow2").style.top = (y/2+(ballTop/2)) + 'px';
    document.getElementById("arrow2").style.left = (x/2+(ballLeft/2)) + 'px';
};

var keyState = {};    
window.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;
},true);    

window.addEventListener('keyup',function(e){
    keyState[e.keyCode || e.which] = false;
},true);

function checkAbove1000(pos) {
    return pos >= ballTop;
}

function Repeat(){
	if(arrowVisible == true){
		if(document.getElementById("arrow").style.opacity < 0.5){
			document.getElementById("arrow").style.opacity = parseFloat(document.getElementById("arrow").style.opacity) + 0.02;
		}
		if(document.getElementById("arrow2").style.opacity < 0.5){
			document.getElementById("arrow2").style.opacity = parseFloat(document.getElementById("arrow2").style.opacity) + 0.02;
		}
	} else {
		if(document.getElementById("arrow").style.opacity > 0){
			document.getElementById("arrow").style.opacity = parseFloat(document.getElementById("arrow").style.opacity) - 0.02;
		}
		if(document.getElementById("arrow2").style.opacity > 0){
			document.getElementById("arrow2").style.opacity = parseFloat(document.getElementById("arrow2").style.opacity) - 0.02;
		}
	}
	
	if(score > highscore){
		highscore = score;
		document.getElementById("highscore").innerHTML = highscore;
	}
	
	for(var balls=0;balls<document.getElementsByClassName("ball").length;balls++){
		if(shooting == true){
			positionY[balls] += shootingY[balls];
			positionX[balls] += shootingX[balls];
			
			if(direction[balls] == "left" && positionX[balls] <= barrier && positionY[balls] <= ballTop){
				direction[balls] = "right";
				shootingX[balls] = -shootingX[balls];
				hitWallSound.play();
			} else if (direction[balls] == "right" && positionX[balls] >= barrier2-20 && positionY[balls] <= ballTop){
				direction[balls] = "left";
				shootingX[balls] = -shootingX[balls];
				hitWallSound.play();
			}
			
			if(positionY[balls] <= 0){
				shootingY[balls] = -shootingY[balls];
				hitWallSound.play();
			}
			
			//generate next line when all balls pass line
			if(positionY.every(checkAbove1000)){
				shooting = false;
				score++;
				document.title = "not ballz | score: " + score;
				document.getElementById("score").innerHTML=score;
				document.getElementById("score").style.opacity=0.75;
				for(i=0;i<document.getElementsByClassName("block").length;i++){
					if(parseFloat(document.getElementsByClassName("block")[i].style.top, 10) < ballTop){
						var y = parseFloat(document.getElementsByClassName("block")[i].style.top, 10);
						if(y>=blockGap*8){
							if(document.getElementsByClassName("block")[i].style.opacity !=0){
								ShowGameOver();
							}
						}
						document.getElementsByClassName("block")[i].style.top=y+blockGap+"px";
					} else if (document.getElementsByClassName("block")[i].style.display != "none"){
						document.getElementsByClassName("block")[i].removeAttribute("style");
						document.getElementsByClassName("block")[i].style.display="none";
					}
				}
		
				if(score > highscore){
					highscore = score;
					document.getElementById("highscore").innerHTML = highscore;
				}
				
				for(i=0;i<document.getElementsByClassName("ball").length;i++){
					positionY[i] = ballTop;
					positionX[i] = ballLeft;
				}
				row++;
				rowblock = 0;
				GenerateLevel();
				arrowVisible = true;
				fallSound.play();
				Save();
			}
		}
		
		var currentX = parseInt(-5/*left*/+positionX[balls]/blockGap);
		var currentY = parseInt(parseInt(positionY[balls]/blockGap)-1);
		var currentBlockY = 1+currentY-(document.getElementsByClassName("block").length/12),currentY;
		var currentBlockX = parseInt(-5/*left*/+positionX[balls]/blockGap);
		var currentBlock = currentBlockX+(currentBlockY*-12);
		
		if(blocks[currentBlock] != 0){
			if(document.getElementsByClassName("block")[currentBlock] != null){
				var blockTop = parseFloat(document.getElementsByClassName("block")[currentBlock].style.top, 10);
			}
			
			//from top
			if(blocks[currentBlock] <= 10 && positionY[balls] <= blockTop+10 && positionY[balls] >= blockTop){
				shootingY[balls] = -shootingY[balls];
				positionY[balls] -= 10;
				if(document.getElementsByClassName("block")[currentBlock].innerHTML <= 1){
					document.getElementsByClassName("block")[currentBlock].style.opacity=0;
					blocks[currentBlock] = 0;
				} else {
					document.getElementsByClassName("block")[currentBlock].innerHTML = parseFloat(document.getElementsByClassName("block")[currentBlock].innerHTML)-1;
				}
				hitSound = new Audio("sound/hit"+(Math.floor(Math.random() * 3) + 1)+".wav");
				hitSound.play();
				document.getElementsByClassName("block")[currentBlock].style.backgroundColor="hsl("+(75+(parseFloat(document.getElementsByClassName("block")[currentBlock].innerHTML)*15))+", 50%, 50%)";
			}
			
			//from side			
			if(blocks[currentBlock] <= 10 && positionY[balls] <= blockTop+blockWidth && positionY[balls] >= blockTop+10){
				shootingX[balls] = -shootingX[balls];
				if(direction[balls] == "left"){
					direction[balls] = "right";
					positionX[balls] += 10;
				} else {
					direction[balls] = "left";
					positionX[balls] -= 10;
				}
				if(document.getElementsByClassName("block")[currentBlock].innerHTML <= 1){
					document.getElementsByClassName("block")[currentBlock].style.opacity=0;
					blocks[currentBlock] = 0;
				} else {
					document.getElementsByClassName("block")[currentBlock].innerHTML = parseFloat(document.getElementsByClassName("block")[currentBlock].innerHTML)-1;
				}
				hitSound = new Audio("sound/hit"+(Math.floor(Math.random() * 3) + 1)+".wav");
				hitSound.play();
				document.getElementsByClassName("block")[currentBlock].style.backgroundColor="hsl("+(75+(parseFloat(document.getElementsByClassName("block")[currentBlock].innerHTML)*15))+", 50%, 50%)";
			}
			
			//from bottom
			if(blocks[currentBlock] <= 10 && positionY[balls] <= blockTop+blockGap && positionY[balls] >= blockTop+blockWidth){
				shootingY[balls] = -shootingY[balls];
				positionY[balls] += 10;
				if(document.getElementsByClassName("block")[currentBlock].innerHTML <= 1){
					document.getElementsByClassName("block")[currentBlock].style.opacity=0;
					blocks[currentBlock] = 0;
				} else {
					document.getElementsByClassName("block")[currentBlock].innerHTML = parseFloat(document.getElementsByClassName("block")[currentBlock].innerHTML)-1;
				}
				hitSound = new Audio("sound/hit"+(Math.floor(Math.random() * 3) + 1)+".wav");
				hitSound.play();
				document.getElementsByClassName("block")[currentBlock].style.backgroundColor="hsl("+(75+(parseFloat(document.getElementsByClassName("block")[currentBlock].innerHTML)*15))+", 50%, 50%)";
			}
		}
		
		//add ball
		
		if(blocks[currentBlock] == 15 && positionY[balls] <= blockTop+blockGap && positionY[balls] >= blockTop){
			document.getElementsByClassName("block")[currentBlock].style.opacity=0;
			blocks[currentBlock] = 0;
			var y = document.createElement("div");
			y.className="ball";
			y.style.top="2000px";
			y.style.width = ballWidth + "px";
			y.style.height = ballWidth + "px";
			document.getElementById("extraballs").appendChild(y);
			positionY[document.getElementsByClassName("ball").length-1] = 2000;
			shootingY[document.getElementsByClassName("ball").length-1] = 10;
			newBallSound.play();
			document.getElementById("ballsAmount").innerHTML = document.getElementsByClassName("ball").length;
			document.getElementById("balltext").style.opacity = 1;
		}
		
		if(positionY[balls] <= 900){
			document.getElementsByClassName("ball")[balls].style.top=positionY[balls]-5 + "px";
			document.getElementsByClassName("ball")[balls].style.left=positionX[balls]+10 + "px";
		}
	}
	requestAnimationFrame(Repeat);
}

requestAnimationFrame(Repeat);

function ShowGameOver(){
	if(gameOverShown == false){
		gameOverShown = true;
		score--;
		gameOverSound.play();
		
		setTimeout(function (){
			document.getElementById("container").style.opacity=1;
			document.getElementById("gameover").style.opacity=1;
			document.getElementById("gameover").style.pointerEvents="auto";
			document.getElementById("finalScore").innerHTML=score;
			document.getElementById("score").innerHTML="0";
			document.getElementById("score").style.opacity=0;
			document.getElementById("container").style.opacity=0;
			document.getElementById("overlay").style.opacity=1;
			document.getElementById("overlay").style.pointerEvents="auto";
			gameOverAppearSound.play();
		}, 500);
	}
}

function HideGameOver(){
	document.getElementById("gameover").style.opacity=0;
	document.getElementById("gameover").style.pointerEvents="none";
	document.getElementById("overlay").style.opacity=0;
	document.getElementById("overlay").style.pointerEvents="none";
	document.getElementById("score").style.opacity=0;
	document.getElementById("container").style.opacity=1;
	restartSound.play();
	gameOverShown = false;
	
	for(i=0;i<document.getElementsByClassName("block").length;i++){
		positionY[0] = ballTop;
		positionX[0] = ballLeft;
		score = 0;
		row = 0;
		rowblock = 0;
	}
	document.getElementById("extraballs").innerHTML="";
	document.getElementById("ballsAmount").innerHTML = document.getElementsByClassName("ball").length;
	document.getElementById("balltext").style.opacity = 0;
	shooting = false;
	blocks = [];
	document.getElementById("blocks").innerHTML="";
	document.title = "not ballz | score: " + score;
	GenerateLevel();
	arrowVisible = true;
	Save();
}

function Save(){
	var save = {
		'highscore': highscore,
		'extraballssave': document.getElementById("extraballs").innerHTML,
		'blockssave': document.getElementById("blocks").innerHTML,
		'blocks': blocks,
		'row': row,
		'rowblock': rowblock,
		'score': score
	}
	localStorage.setItem("save",JSON.stringify(save));
}

function DeleteSave(){
	if (confirm('are you sure you want to delete all progress')) {
		deleted = true;
		localStorage.removeItem("save");
		setTimeout(function (){
			location.reload();
		}, 50);
	}
}
	
function Load(){
	if(localStorage.getItem("save") !== null){
		var savegame = JSON.parse(localStorage.getItem("save"));
		if (typeof savegame.highscore !== "undefined") highscore = savegame.highscore;
		if (typeof savegame.extraballssave !== "undefined") document.getElementById("extraballs").innerHTML = savegame.extraballssave;
		if (typeof savegame.blockssave !== "undefined") document.getElementById("blocks").innerHTML = savegame.blockssave;
		if (typeof savegame.blocks !== "undefined") blocks = savegame.blocks;
		if (typeof savegame.row !== "undefined") row = savegame.row;
		if (typeof savegame.rowblock !== "undefined") rowblock = savegame.rowblock;
		if (typeof savegame.score !== "undefined") score = savegame.score;
	}
	document.getElementById("highscore").innerHTML = highscore;
	if(blocks.length == 0){
		GenerateLevel();
	}
	if(document.getElementsByClassName("ball").length > 1){
		document.getElementById("ballsAmount").innerHTML = document.getElementsByClassName("ball").length;
		document.getElementById("balltext").style.opacity = 1;
	}
	if(score > 0){
		document.getElementById("score").innerHTML = score;
		document.getElementById("score").style.opacity = 1;
	}
}

Load();
setTimeout(function (){
	document.getElementById("container").style.opacity=1;
}, 0);
console.log("%cno CHEATING !!!","background: cyan;color:red;font-size:50px;font-family: 'Comic Sans MS',cursive,sans-serif");