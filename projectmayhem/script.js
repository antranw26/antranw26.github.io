const myVideo = document.querySelector("#custom-video-player");
console.log(myVideo);

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

const progressBar = document.querySelector("#progress-bar-fill");
console.log(progressBar);

myVideo.addEventListener("timeupdate", updateProgress);

function updateProgress() {
  const duration = (myVideo.currentTime / myVideo.duration) * 100;
  progressBar.style.width = duration + "%";
}

const replayButton = document.querySelector("#replay-button");
console.log(replayButton);

replayButton.addEventListener("click", replayVideo);

function replayVideo() {
  myVideo.currentTime = 0;
  myVideo.play();
  playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v2.png";
}

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

const themeSelector = document.querySelector("#theme-select");
console.log(themeSelector);

themeSelector.addEventListener("change", changeTheme);

function changeTheme(event) {
  document.body.style.backgroundImage = `url('${event.target.value}')`;
}
