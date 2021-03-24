/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
//console.log("hi");
const clueHoldTime = 1000, cluePauseTime = 333, nextClueWaitTime = 1000;
var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;

function startGame() {
  progress = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}

function playTone(btn,len) { 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(stopTone(),len)
}

function startTone(btn) {
  if(!tonePlaying) {
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}

function stopTone() {
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0, context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit")
}

function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit")
}

function playSingleClue(btn) {
  if(gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime;
  for(let i = 0; i <= progress; i++) {
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue, delay, pattern[i])
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function loseGame() {
  stopGame();
  //console.log("Game Over. You lost!");
  alert("Game Over. You lost!");
}

function winGame() {
  stopGame();
  //console.log("Game Over. You Won!");
  alert("Game Over. You Won!");
}

function guess(btn) {
  console.log("user guessed: " + btn);

  if(!gamePlaying) {
    return;
  }

  if(pattern[guessCounter] == btn) {
    console.log("Correct guess!")
    if(guessCounter == progress) {
      if(progress == pattern.length - 1) {
        console.log("Game Over! You Win!");
        winGame();
      }
      
      else {
        progress++;
        playClueSequence();
      }
    }
    
    else {
      guessCounter++;
    }
  }
  
  else {
    console.log("Game Over! You Lose!")
    loseGame();
  }
}