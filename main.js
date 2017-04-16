var gravity = 0;
var position = 100;
var finalPosition = 0;
var movement = 1000;
var flapPosition = 0;
var score = 0;
var highscore = 0;
var flapping = false;
var wallPos = [];
	
function Flap(){
	gravity = -1;
	flapPosition = position - 100;
	flapping = true;
	var flapAudio = new Audio('flap.wav');
	flapAudio.play();
}

window.setInterval(function(){
	if(score >= 10 && score < 15){
		document.getElementById("background2").style.top=position*2-2000 + "px";
		document.getElementById("background").style.zIndex="-999";
	} else if(score < 10 || score >= 15) {
		document.getElementById("background").style.zIndex="-1";
	}
	if(score > highscore){
		highscore = score;
	}
	document.getElementById("highscore").innerHTML=highscore;
	gravity += 0.02;
	movement -= 1;
	position = position + gravity;
	
	document.getElementById("position").innerHTML="y position: " + Math.floor(position);
	document.getElementById("bird").style.top=position + "px";
	document.getElementById("score").innerHTML=score;
		
	for(var i=0;i<document.getElementsByClassName("wall").length;i++){
		var selectedWall = document.getElementsByClassName("wall")[i];
		selectedWall.style.left=parseInt(selectedWall.style.left, 10) - 1;
		
		/* disabled cos it messes with the collision code
		//check if gone past screen
		if(parseInt(selectedWall.style.left, 10) == 0){
			selectedWall.parentNode.removeChild(selectedWall);
		}
		*/
		
		//check collision
		if(parseInt(selectedWall.style.left, 10) == 200){
			if(position >= wallPos[i]+110 || position <= wallPos[i]){
				Respawn();
			} else {
				score++;
				var scoreAudio = new Audio('score.wav');
				scoreAudio.play();
			}
		}
	}
	
	if(flapping == true){
		if(position > flapPosition){
			position = position - 1;
		} else {
			flapping = false;
		}
	}
	
	if(position >= 890 || position <= 10){
		Respawn();
	}
}, 5);
	
//create walls
window.setInterval(function(){
	CreateWall();
}, 2000);

function CreateWall(){
	var random = Math.floor(Math.random() * 630) + 1;
	wallPos.push(random);
	var textthing = document.createElement("div");
	textthing.style.position="fixed";
	textthing.style.top=random + "px";
	textthing.style.left="1920px";
	textthing.className="wall";
	var walls = document.getElementById("walls");
	walls.appendChild(textthing);
}
	
function CreateStartingWalls(){
	var random = Math.floor(Math.random() * 630) + 1;
	wallPos.push(random);
	var textthing = document.createElement("div");
	textthing.style.position="fixed";
	textthing.style.top=random + "px";
	textthing.style.left="1000px";
	textthing.className="wall";
	var walls = document.getElementById("walls");
	walls.appendChild(textthing);
	var random = Math.floor(Math.random() * 630) + 1;
	wallPos.push(random);
	var textthing = document.createElement("div");
	textthing.style.position="fixed";
	textthing.style.top=random + "px";
	textthing.style.left="1450px";
	textthing.className="wall";
	var walls = document.getElementById("walls");
	walls.appendChild(textthing);
}

function Respawn(){
	document.getElementById("walls").innerHTML="";
	wallPos = [];
	position = 100;
	gravity = 0;
	movement = 1000;
	score = 0;
	CreateStartingWalls()
	var respawnAudio = new Audio('respawn.wav');
	respawnAudio.play();
}

function Save(){
	musicProgress = fart.currentTime;
	var save = {
		'highscore': highscore,
		'musicProgress': musicProgress
	}
	localStorage.setItem("save",JSON.stringify(save));
}
	
function Load(){
	if(localStorage.getItem("save") !== null){
		var savegame = JSON.parse(localStorage.getItem("save"));
		if (typeof savegame.highscore !== "undefined") highscore = savegame.highscore;
		if (typeof savegame.musicProgress !== "undefined") musicProgress = savegame.musicProgress;
	}
}

document.body.onkeydown = function(e){
    if(e.keyCode == 32){
		Flap();
    }
}

window.onbeforeunload = function(){
	Save();
}

console.log("%cno CHEATING !!!","background: cyan;color:red;font-size:50px;font-family: 'Comic Sans MS',cursive,sans-serif");
CreateWall();
CreateStartingWalls()
/*
var minions = new Audio('minions.mp3');
minions.play();
minions.loop=true;
Load();
minions.currentTime = musicProgress;
*/

var fart = new Audio('fart.mp3');
fart.play();
fart.loop=true;
Load();
fart.currentTime = musicProgress;