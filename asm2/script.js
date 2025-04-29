const myVideo = document.querySelector("#custom-video-player");
console.log(myVideo);
//------------------------------------------------------//
const playPauseButton = document.querySelector("#play-pause-btn");
console.log(playPauseButton);

const playPauseImg = document.querySelector("#play-pause-img");
console.log(playPauseImg);

playPauseButton.addEventListener("click", togglePlayback);

function togglePlayback() {
  if (myVideo.paused || myVideo.ended) {
    myVideo.play();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v2.png";
  } else {
    myVideo.pause();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v2.png";
  }
}
//-------------------------------------------------------//
const muteUnmuteButton = document.querySelector("#mute-unmute-button");
console.log(muteUnmuteButton);

const muteUnmuteImg = document.querySelector("#mute-unmute-img");
console.log(muteUnmuteImg);

muteUnmuteButton.addEventListener("click", toggleAudio);

function toggleAudio() {
  myVideo.muted = !myVideo.muted;
  muteUnmuteImg.src = myVideo.muted
    ? "https://img.icons8.com/ios-glyphs/30/no-audio--v1.png"
    : "https://img.icons8.com/ios-glyphs/30/high-volume--v2.png";
}
//--------------------------------------------------------//
const replayButton = document.querySelector("#replay-button");
console.log(replayButton);

replayButton.addEventListener("click", replayVideo);

function replayVideo() {
  myVideo.currentTime = 0;
  myVideo.play();
  playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v2.png";
}
//---------------------------------------------------------//
const progressBar = document.querySelector("#progress-bar-fill");
console.log(progressBar);

myVideo.addEventListener("timeupdate", updateProgress);

function updateProgress() {
  const percentage = (myVideo.currentTime / myVideo.duration) * 100;
  progressBar.style.width = percentage + "%";
}
//----------------------------------------------------------//
const timerSelect = document.querySelector("#timer-select");
console.log(timerSelect);

let timerTimeout = null;

if (timerSelect) {
  timerSelect.addEventListener("change", function () {
    clearTimeout(timerTimeout);
    const selectedTime = parseInt(timerSelect.value);
    if (selectedTime > 0) {
      timerTimeout = setTimeout(() => {
        myVideo.pause();
        playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v2.png";
      }, selectedTime * 1000);
    }
  });
}
