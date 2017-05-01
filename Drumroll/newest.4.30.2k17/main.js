var clip = "Cycle Through Beats";
var pic = "808";
var index = 0;
var counter = 0;
var right = 0;
var left = 1;
var phase = 0; //0 = menu, 1 = mode 1, 2 = mode 2, 3 = save/exit menu
var clips = ["AcousticKit", "BreathGhost", "FutureHardRock", "RealHardFunkyRock", "SimpleGroove"];
             //, "808", "808-2", "AcousticHihat", "AwesomeSnare", "AwesomeTom", "BirthDayBrass", "Chant", "Clap", "Clap2", "Crash", "Cymbal", "DigitalKick", "DigitalKick2", "DigitalKick3", "DigitalKick4", "FirstHihat", "Fx", "HandsUpClap", "HiHt2", "HitHt", "HitHt3", "J808", "Kick(PutWitSub)", "Kick", "NewFx", "NewFx2", "NewSoundFX", "NewTrianglePerc", "OpenHat", "OpenHat2", "OpenHat3", "Perc", "RacksOnRacksChant", "RacksOnRacksTom", "Ride","RimShtClean", "SameDamnTimeKick", "SineBeep", "Snap", "Snare", "Snare2", "TM88TrapClap", "Trap808", "TrapClap", "TrapPerc", "TrappinChant", "TrapRimSht", "WindFx"];

var pics = ["resources/bassdrum.png", "resources/cymbal.png", "resources/ftom.png", "resources/ltom.png", "resources/rtom.png", "resources/hihat.png"];

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var canvasMenu = document.getElementById('canvasMenu');
    canvasMenu.width = 1500;
    canvasMenu.height = 600;
var menuctx = canvasMenu.getContext('2d');

function drawMenu(){//drawing squares for modes
    if(phase == 0 || phase == 3){
        document.getElementById("container").style.visibility = "hidden";
        document.getElementById("menu").style.visibility = "visible";
        menuctx.strokeStyle = "cornflowerblue";
        menuctx.strokeRect(150, 10, 500, 300);
        menuctx.strokeRect(900, 10, 500, 300);
        menuctx.fillStyle = "#154eb7";
        menuctx.font = "60px Impact";
        if(phase == 0){ 
            clearMenu();
            menuctx.fillText("Mode 1:", 300, 120);
            menuctx.fillText("Choose a preset", 200, 180);
            menuctx.fillText(" drum recording", 200, 240);
            menuctx.fillText("Mode 2:", 1060, 120);
            menuctx.fillText("Choose an", 1015, 180);
            menuctx.fillText("instrument", 1005, 240)
            //add instructions, make text look prettier    
        }
        else if(phase == 3){
            clearMenu();
            menuctx.fillText("Continue", 285, 180);
            menuctx.fillText("Save and Exit", 1000, 180);
        }
    }
    else{
       document.getElementById("menu").style.visibility = "hidden";
    }
}

function clearMenu(){
        menuctx.clearRect(150, 10, 500, 300);
        menuctx.clearRect(900, 10, 500, 300);
}

document.onkeydown = checkKey;

function checkKey(e){
    e = e || window.event;
    if(e.keyCode == '37'){//left arrow
        if(phase == 0){
            reset();
            phase = 1;
            draw();
        }
        else if(phase == 1 || phase == 2){
            left++;
            cycle();
            play();    
        }
        else if(phase == 3){
            phase = 1;
            stop();
            reset();
            draw();
        }
    }
    else if(e.keyCode == '39'){//right arrow
        if(phase == 0){
            phase = 2;
            reset();
            counter = 0;
            draw();    
          }
        else if(phase == 1 || phase == 2){
            right++;
            stop();
            play(); 
            draw();
            counter = 0;
            glow();
            if(right >= 4){
                phase = 3;
                stop();
                drawMenu();
            }
        }
        else if(phase == 3){
            //output file
            clearMenu();
            phase = 0;
            stop();
            drawMenu();
        }
    }
}

function reset(){//empty box
    ctx.strokeStyle = "silver";
    ctx.lineWidth = 10;
    ctx.strokeRect(510, 10, 1000, 125);
    ctx.fillStyle = "white";
    ctx.fillRect(515, 15, 990, 115);
    right = 0;
    left = 0;
    index = 0;
    counter = 1;
}

function draw(){
    if(phase == 1 || phase == 2){
        document.getElementById("menu").style.visibility = "hidden";
        document.getElementById("container").style.visibility = "visible";
        if(right == 0 && left == 1){//draw box
            ctx.strokeStyle = "silver";
            ctx.lineWidth = 10;
            ctx.strokeRect(510, 10, 1000, 125);
            ctx.fillStyle = "white";
            ctx.fillRect(515, 15, 990, 115);
        }
        else if(right > 0 && right < 5){//fill in rectangle
            ctx.fillStyle = "teal";
            ctx.fillRect(515, 15, right*247.5, 115);
        }
    }
    else{
        document.getElementById("container").style.visibility = "hidden";
    }
}

window.onload = function(){
    document.getElementById("title").innerHTML = clip;
    document.getElementById("picture").innerHTML = pics;
    drawMenu();
}

var audio = document.createElement('audio');

function play(){
    audio.src = 'resources/' + clip + '.M4A';
    audio.play();
}

function pause(){
    audio.src = 'resources/' + clip + '.M4A';
    audio.pause();
}

function stop(){
    audio.src = 'resources/' + clip + '.M4A';
    audio.pause();
    audio.currentTime = 0;
}

document.addEventListener('play', function(e){
    var audios = document.getElementsByTagName('audio');
    for(var i = 0, len = audios.length; i < len;i++){
        if(audios[i] != e.target){
            audios[i].pause();
        }
    }
}, true);

function cycle(){
     index++;
     if (index == clips.length){
        index = 0;
     }
    
    counter++;
    if(counter == pics.length){
        counter = 0;
    }

    clip = clips[index];
    pic = pics[counter];
    document.getElementById("title").innerHTML = clip;
    document.getElementById("picture").src = pic;
}

function glow(){
    document.getElementsByTagName("img")[0].style.boxShadow = "10px 10px 5px cornflowerblue";
    document.getElementById("canvas").style.boxShadow = "10px 10px 5px cornflowerblue";
    var s = setTimeout(function(){
        document.getElementsByTagName("img")[0].style.boxShadow = "0px 0px 0px white";   
        document.getElementById("canvas").style.boxShadow = "0px 0px 0px white";  
    }, 100)   
}