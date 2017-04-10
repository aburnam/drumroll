var clip = "Cycle";
var pic = "808";
var index = 0;
var counter = 0;
var right = 0;
var left = 1;
var clips = ["AcousticKit", "BreathGhost", "FutureHardRock", "RealHardFunkyRock", "SimpleGroove"];
             //, "808", "808-2", "AcousticHihat", "AwesomeSnare", "AwesomeTom", "BirthDayBrass", "Chant", "Clap", "Clap2", "Crash", "Cymbal", "DigitalKick", "DigitalKick2", "DigitalKick3", "DigitalKick4", "FirstHihat", "Fx", "HandsUpClap", "HiHt2", "HitHt", "HitHt3", "J808", "Kick(PutWitSub)", "Kick", "NewFx", "NewFx2", "NewSoundFX", "NewTrianglePerc", "OpenHat", "OpenHat2", "OpenHat3", "Perc", "RacksOnRacksChant", "RacksOnRacksTom", "Ride","RimShtClean", "SameDamnTimeKick", "SineBeep", "Snap", "Snare", "Snare2", "TM88TrapClap", "Trap808", "TrapClap", "TrapPerc", "TrappinChant", "TrapRimSht", "WindFx"];

var pics = ["resources/bassdrum.png", "resources/cymbal.png", "resources/ftom.png", "resources/ltom.png", "resources/rtom.png", "resources/hihat.png"];

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

document.onkeydown = checkKey;

function checkKey(e){
    e = e || window.event;
    if(e.keyCode == '37'){//left arrow
        left++;
        cycle();
        play();
    }
    else if(e.keyCode == '39'){//right arrow
        right++;
        pause();
        draw();
        play();
        glow();
    }
}

//reset left and right to 0 before starting new loop

function draw(){
    if(right == 0 && left == 1){//draw box
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 10;
        ctx.strokeRect(0, 0, 600, 100);
        ctx.fillStyle = "white";
        ctx.fillRect(5, 5, 590, 95);
//        ctx.font = '48px serif'
//        ctx.fontStyle = "purple";
//        ctx.fillText('1', 74, 45);
//        ctx.fillText('2', 222, 45);
//        ctx.fillText('3', 370, 45);
//        ctx.fillText('4', 518, 45);
    }
    else if(right > 0 && right < 5){//fill in rectangle
        ctx.fillStyle = "purple";
        ctx.fillRect(5, 5, right*147.5, 95);
//        for(var i = 0; i < right; i++){
//            ctx.fontStyle = "white";
//            ctx.fillText(right, 74+right*148, 45);
//        }
        if(right == 4){//clear rectangle for new loop
            //ctx.fillStyle = "white";
            //ctx.fillRect(10. 10, 580, 80);
        }
    }
}

window.onload = function(){
    document.getElementById("title").innerHTML = clip;
    document.getElementById("picture").innerHTML = pics;
    draw();
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
    document.getElementsByTagName("img")[0].style.boxShadow = "10px 10px 5px white";
    var s = setTimeout(function(){
        document.getElementsByTagName("img")[0].style.boxShadow = "0px 0px 0px white";    
    }, 100)   
}