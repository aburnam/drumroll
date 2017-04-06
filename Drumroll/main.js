var clip = "808";
var pic = "808";
var index = 0;
var counter = 0;
var clips = ["808", "808-2", "AcousticHihat", "AwesomeSnare", "AwesomeTom", "BirthDayBrass", "Chant", "Clap", "Clap2", "Crash", "Cymbal", "DigitalKick", "DigitalKick2", "DigitalKick3", "DigitalKick4", "FirstHihat", "Fx", "HandsUpClap", "HiHt2", "HitHt", "HitHt3", "J808", "Kick(PutWitSub)", "Kick", "NewFx", "NewFx2", "NewSoundFX", "NewTrianglePerc", "OpenHat", "OpenHat2", "OpenHat3", "Perc", "RacksOnRacksChant", "RacksOnRacksTom", "Ride","RimShtClean", "SameDamnTimeKick", "SineBeep", "Snap", "Snare", "Snare2", "TM88TrapClap", "Trap808", "TrapClap", "TrapPerc", "TrappinChant", "TrapRimSht", "WindFx"];

var pics = ["resources/bassdrum.png", "resources/cymbal.png", "resources/ftom.png", "resources/ltom.png", "resources/rtom.png", "resources/hihat.png"];

window.onload = function(){
    document.getElementById("title").innerHTML = clip;
    document.getElementById("picture").innerHTML = pics;
}

function play(){
    var audio = new Audio('resources/' + clip + '.wav');
    audio.play();
    }

window.addEventListener('contextmenu', function() {
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

}, false);

var secs = 30;
var clicks = 0;

function timer(){
    clicks++;
    if(clicks == 1 && secs > 0){
        var id = setInterval(function(){
            secs--; 
            document.getElementById("time").innerHTML = "00:" + n(secs);
            if(secs == 0){
                document.getElementById("time").innerHTML = "00:00<br>Time's up! Starting another loop.";
            }
        }, 1000)
    }
    click = 0;
}

function n(n){
    if(n >= 0){
        if(n < 10){
            return "0" + n;
        }
        else{
            return n;
        }
    }
    else{
        return "00"
    }
}

function glow(){
    document.getElementsByTagName("img")[0].style.boxShadow = "10px 10px 5px white";
    var s = setTimeout(function(){
        document.getElementsByTagName("img")[0].style.boxShadow = "0px 0px 0px white";    
    }, 100)   
}
