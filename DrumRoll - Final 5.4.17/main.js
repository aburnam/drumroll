var clip = "Press Left: Cycle Through Beats<br>Press Right: Select Beats";
var preset = "Press Left: Cycle Through Instruments<br>Press Right: Select Instrument";
//var pic = "808";
var index = -1;
var counter = 0;
var right = 0;
var left = 1;
var phase = 0; //0 = menu, 1 = mode 1, 2 = mode 2 preset, 3 = save/exit menu, 4 = mode 2 clip
var beat = 0;
var presets = ["Acoustic Kit", "Breath Ghost", "Future Hard Rock", "Real Hard Funky Rock", "Simple Groove"];
var presets2 = ["Funk Rock", "Jazz"];
var clips = ["Acoustic Hit", "Clap", "Cymbal", "Hi Hat", "Snare", "Tom", "Triangle", "Wind"];
var mode2 = 0;

//var pics = ["resources/bassdrum.png", "resources/cymbal.png", "resources/ftom.png", "resources/ltom.png", "resources/rtom.png", "resources/hihat.png"];

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var canvasMenu = document.getElementById('canvasMenu');
canvasMenu.width = 1500;
canvasMenu.height = 600;
var menuctx = canvasMenu.getContext('2d');
var menuctx1 = canvasMenu.getContext('2d');

var firstbeat = true;
var firsttrack = true;
var context;
var source;
var prevsource;
var finalsource;
var soundBuffer = null;

function drawMenu(){//drawing squares for modes
    if(phase == 0 || phase == 3){
        document.getElementById("menu").style.visibility = "visible";
        document.getElementById("container").style.visibility = "hidden";
        menuctx.strokeStyle = "cornflowerblue";
        menuctx.strokeRect(150, 10, 500, 300);
        menuctx.strokeRect(900, 10, 500, 300);
        menuctx.fillStyle = "#154eb7";
        menuctx.font = "60px Impact";
        if(phase == 0){ 
            clearMenu();
            menuctx.fillText("Mode 1:", 300, 100);
            menuctx.fillText("Choose a preset", 200, 160);
            menuctx.fillText(" drum recording", 200, 220);
			menuctx.fillStyle = "cornflowerblue";
			menuctx.fillText("Press left", 270, 280);
			menuctx.fillStyle = "#154eb7";
            menuctx.fillText("Mode 2:", 1060, 100);
            menuctx.fillText("Choose a preset", 950, 160);
            menuctx.fillText("and instrument", 965, 220)
			menuctx.fillStyle = "cornflowerblue";
			menuctx.fillText("Press right", 1005, 280); 
        }
        else if(phase == 3){
            clearMenu();
            menuctx.fillText("Continue", 285, 150);
			menuctx.fillStyle = "cornflowerblue";
			menuctx.fillText("Press left", 280, 230);
			menuctx.fillStyle = "#154eb7";
            menuctx.fillText("Save and Exit", 990, 150);
			menuctx.fillStyle = "cornflowerblue";
			menuctx.fillText("Press right", 1010, 230);
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

function init() {
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
}

function appendBuffer(buffer1, buffer2) {
	var numberOfChannels = Math.min( buffer1.numberOfChannels, buffer2.numberOfChannels );
	var tmp = context.createBuffer( numberOfChannels, (buffer1.length + buffer2.length), buffer1.sampleRate );
	for (var i=0; i<numberOfChannels; i++) {
	  var channel = tmp.getChannelData(i);
	  channel.set( buffer1.getChannelData(i), 0);
	  channel.set( buffer2.getChannelData(i), buffer1.length);
	}
	return tmp;
}

function makeBeat(buffer){
	var fps = (buffer.length / buffer.duration) / 2;
	var numberOfChannels = buffer.numberOfChannels;
	var tmp = context.createBuffer(numberOfChannels, fps, buffer.sampleRate);
	for (var i=0; i<numberOfChannels; i++){
		var channel = tmp.getChannelData(i);
		channel.set( buffer.getChannelData(i).slice(0, fps), 0);
	}
	return tmp;
}

function loadSongWebAudioAPI(url, sample) {
	var request = new XMLHttpRequest();

	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	/**
	 * Appends two ArrayBuffers into a new one.
	 * 
	 * @param {ArrayBuffer} data The ArrayBuffer that was loaded.
	 */
	function play(data) {
	  //decode the loaded data
	  context.decodeAudioData(data, function(buf) {
		source = context.createBufferSource();
		if (firstbeat == true){
			finalsource = context.createBufferSource();
		}
		source.connect(context.destination);

		// Concatenate the two buffers into one.
		if(sample == false){
			if(phase == 2){
				prevsource = context.createBufferSource();
				prevsource.buffer = buf;
				firsttrack = false;
				draw();
				phase = 4;
			}
			else if(phase == 4){
				if(firstbeat == false & finalsource.buffer != null){
					var tmpbuf = finalsource.buffer;
					var tmpbuf2 = makeBeat(buf);
					finalsource = context.createBufferSource();
					finalsource.buffer = appendBuffer(tmpbuf, tmpbuf2);
				}
				else{
					finalsource.buffer = makeBeat(buf);
				}
			}
			else if(firstbeat == false & finalsource.buffer != null){
				var tmpbuf = finalsource.buffer;
				finalsource = context.createBufferSource();
				finalsource.buffer = appendBuffer(tmpbuf, buf);
			}
			else{
				finalsource.buffer = buf;
			}
		}
		source.buffer = buf;
		source.loop = false;
		
		if ((right > 3 & phase == 1) || (right > 7 & phase == 4)){
			phase = 3;
			drawMenu();
			var fnl = finalsource.buffer
			finalsource = context.createBufferSource();
			if(firsttrack == true){
				prevsource = context.createBufferSource();
				prevsource.buffer = fnl;
				finalsource.buffer = fnl;
				firsttrack = false;
			}
			else if(firsttrack != true){
				var prev = prevsource.buffer;
				prevsource = context.createBufferSource();
				finalsource.buffer = mix(prev, fnl)
				prevsource.buffer = finalsource.buffer;
			}
			finalsource.connect(context.destination);
			finalsource.start(0);
		}
		else{
			source.start(0);
		}
		source.playbackRate.value = 1;
	  });

	};

	// When the song is loaded asynchronously try to play it.
	request.onload = function() {
	  play(request.response);
	}

	request.send();
}

// Split the buffer --------------------------------------------
function split(abuffer) {

  // calc number of segments and segment length
  var channels = abuffer.numberOfChannels,
      duration = abuffer.duration,
      rate = abuffer.sampleRate,
      segmentLen = 10,
      offset = 0,
      block = duration * rate;
	  
    var url = URL.createObjectURL(bufferToWave(abuffer, offset, block));
	saveData(url, "mybeat.wav");
    //var audio = new Audio(url);
    //audio.controls = true;
    //audio.volume = 1;
    //document.body.appendChild(audio);
}

// Convert a audio-buffer segment to a Blob using WAVE representation
function bufferToWave(abuffer, offset, len) {

  var numOfChan = abuffer.numberOfChannels,
      length = len * numOfChan * 2 + 44,
      buffer = new ArrayBuffer(length),
      view = new DataView(buffer),
      channels = [], i, sample,
      pos = 0;

  // write WAVE header
  setUint32(0x46464952);                         // "RIFF"
  setUint32(length - 8);                         // file length - 8
  setUint32(0x45564157);                         // "WAVE"

  setUint32(0x20746d66);                         // "fmt " chunk
  setUint32(16);                                 // length = 16
  setUint16(1);                                  // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2);                      // block-align
  setUint16(16);                                 // 16-bit (hardcoded in this demo)

  setUint32(0x61746164);                         // "data" - chunk
  setUint32(length - pos - 4);                   // chunk length

  // write interleaved data
  for(i = 0; i < abuffer.numberOfChannels; i++)
    channels.push(abuffer.getChannelData(i));

  while(pos < length) {
    for(i = 0; i < numOfChan; i++) {             // interleave channels
      sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
      view.setInt16(pos, sample, true);          // update data chunk
      pos += 2;
    }
    offset++                                     // next source sample
  }

  // create Blob
  return new Blob([buffer], {type: "audio/wav"});

  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}

var saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (url, fileName) {
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

function mix(buffer1, buffer2) {
  /* Get the maximum length and maximum number of channels accros all buffers, so we can
   * allocate an AudioBuffer of the right size. */
  var maxChannels = Math.max(buffer1.numberOfChannels, buffer2.numberOfChannels);
  var maxDuration = Math.max(buffer1.duration, buffer2.duration)
  var mixed = context.createBuffer(maxChannels,
                                 context.sampleRate * maxDuration,
                                 context.sampleRate);
								 
	var buf1, buf2;
	if(buffer2.duration > buffer1.duration){
		buf1 = buffer2;
		buf2 = buffer1;
	}
	else{
		buf1 = buffer1;
		buf2 = buffer2;
	}
	for (var srcChannel = 0; srcChannel < buf1.numberOfChannels; srcChannel++) {
	  /* get the channel we will mix into */
	  var out = buf1.getChannelData(srcChannel);
	  /* Get the channel we want to mix in */
	  var in1 = buf2.getChannelData(srcChannel);
	  for (var i = 0; i < in1.length; i++) {
		out[i] += in1[i];
	  }
	  mixed.copyToChannel(out, srcChannel, 0);
	}
  return mixed;
}

document.onkeydown = checkKey;

function checkKey(e){
    e = e || window.event;
	try{
		source.stop(0);
	}
	catch(e){
	}
	try{
		finalsource.stop(0);
	}
	catch(e){
	}
    if(e.keyCode == '37'){//left arrow
		if(phase == 0){
			phase = 1;
            reset();
			draw();
		}
		else if(phase == 1){
			left++;
			cycle();
			loadSongWebAudioAPI('resources/' + preset + '.wav', true);
		}
        else if(phase == 2){
			left++;
			cycle();
			loadSongWebAudioAPI('resources/' + preset + '.wav', true);
		}
        else if(phase == 4){
            mode2 = 1;
            clip = "Press Left: Cycle Through Instruments<br>Press Right: Select Instrument";
            document.getElementById("title").innerHTML = clip;
			left++;
			cycle();
			loadSongWebAudioAPI('resources/' + clip + '.wav', true);
		}
		else if(phase == 3){
			firstbeat = true;
            if(mode2 == 1){
                phase = 4;
            }
            else if(mode2 == 0){
                phase = 1;
            }
            reset();
            draw();
		}
    }
    else if(e.keyCode == '39'){//right arrow
		if(phase == 0){
			phase = 2;
			reset();
			draw();
		}
		else if(phase == 1){
			right++;
			loadSongWebAudioAPI('resources/' + preset + '.wav', false);
			draw();
			glow();
			firstbeat = false;
		}
        else if(phase == 2){
            clip = "Press Left: Cycle Through Instruments<br>Press Right: Select Instrument";
            document.getElementById("title").innerHTML = clip;
			loadSongWebAudioAPI('resources/' + preset + '.wav', false);
			glow();
			firstbeat = true;
		}
        else if(phase == 4){
			right++;
			loadSongWebAudioAPI('resources/' + clip + '.wav', false);
			draw();
			glow();
			firstbeat = false;
			if(right >= 8){
                document.getElementById("cycle").style.visibility = "hidden";
                document.getElementById("visual").style.visibility = "hidden";
			}
		}
		else if(phase == 3){
			//output file
			split(finalsource.buffer);
			firstbeat = true;
			firsttrack = true;
			clearMenu();
			phase = 0;
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
    index = -1;
    if(phase == 1 || phase == 2){
        preset = "Press Left: Cycle Through Beats<br>Press Right: Select Beat";
        document.getElementById("title").innerHTML = preset;
    }
    else if(phase == 4){
        clip = "Press Left: Cycle Through Beats<br>Press Right: Select Beats";
        document.getElementById("title").innerHTML = clip;
    }
}

function draw(){
	if(phase == 1){
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
    else if(phase == 2){
        document.getElementById("menu").style.visibility = "hidden";
		document.getElementById("visual").style.visibility = "hidden";
        document.getElementById("cycle").style.visibility = "visible";
    }
    else if(phase == 4){
		document.getElementById("menu").style.visibility = "hidden";
        document.getElementById("container").style.visibility = "visible";
		document.getElementById("visual").style.visibility = "visible";
		document.getElementById("cycle").style.visibility = "visible";
        if(right == 0 && left == 1){//draw box
			ctx.strokeStyle = "silver";
			ctx.lineWidth = 10;
			ctx.strokeRect(510, 10, 1000, 125);
			ctx.fillStyle = "white";
			ctx.fillRect(515, 15, 990, 115);
		}
		else if(right > 0 && right < 9){//fill in rectangle
			ctx.fillStyle = "teal";
			ctx.fillRect(515, 15, right*247.5/2, 115);
		}
    }
	else{
		document.getElementById("container").style.visibility = "hidden";
	}
}

window.onload = function(){
	init();
    if(phase == 1){
        document.getElementById("title").innerHTML = preset;
    }
    else if(phase == 2){
        document.getElementById("title").innerHTML = preset;
        
    }
    else if(phase == 4){
        document.getElementById("title").innerHTML = clip;
    }
    //document.getElementById("picture").innerHTML = pics;
    drawMenu();
}

function cycle(){
    if(phase == 1){
        index++;
        if(index == presets.length){
            index = 0;
        }
        preset = presets[index];
        document.getElementById("title").innerHTML = preset;
    }
    else if(phase == 2){
        index++;
        if(index == presets2.length){
            index = 0;
        }
        preset = presets2[index];
        document.getElementById("title").innerHTML = preset;
    }
    else if(phase == 4){
        index++;
        if(index == clips.length){
            index = 0;
        }   
        clip = clips[index];
        document.getElementById("title").innerHTML = clip;
    }
	//pic = pics[counter];
	//document.getElementById("title").innerHTML = clip;
	//document.getElementById("picture").src = pic;
}

function glow(){
    document.getElementsByTagName("img")[0].style.boxShadow = "10px 10px 5px cornflowerblue";
	document.getElementById("canvas").style.boxShadow = "10px 10px 5px cornflowerblue";
    var s = setTimeout(function(){
        document.getElementsByTagName("img")[0].style.boxShadow = "0px 0px 0px white";
		document.getElementById("canvas").style.boxShadow = "0px 0px 0px white";
    }, 100)   
}