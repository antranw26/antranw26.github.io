// Fetch the main video element by its ID
const myVideo = document.querySelector("#custom-video-player");
console.log(myVideo);
// For debugging — confirms the video element was selected

// Fetch the play/pause button and its image
const playPauseButton = document.querySelector("#play-pause-btn");
console.log(playPauseButton); // Debugging check
const playPauseImg = document.querySelector("#play-pause-img");
console.log(playPauseImg);
// Add an event listener to toggle between play and pause when the button is clicked
playPauseButton.addEventListener("click", togglePlayback);

// Function to toggle video playback and switch the play/pause icon accordingly
function togglePlayback() {
  if (myVideo.paused || myVideo.ended) {
    myVideo.play();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v2.png";
  } else {
    myVideo.pause();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v2.png";
  }
}
//make the button switch to play and pause icons

// Get the progress bar fill element to update during video playback
const progressBar = document.querySelector("#progress-bar-fill");
console.log(progressBar);

// Add an event listener to update the progress bar as the video plays
myVideo.addEventListener("timeupdate", updateProgress);

// Function to visually update the progress bar fill
function updateProgress() {
  const duration = (myVideo.currentTime / myVideo.duration) * 100;
  progressBar.style.width = duration + "%";
}

// Fetch the replay button
const replayButton = document.querySelector("#replay-button");
console.log(replayButton);

// Add click event to replay the video from the beginning
replayButton.addEventListener("click", replayVideo);

// Function to set video time back to 0 and play again
function replayVideo() {
  myVideo.currentTime = 0;
  myVideo.play();
  playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v2.png";
}

// Select the mute/unmute button and icon image
const muteUnmuteButton = document.querySelector("#mute-unmute-button");
console.log(muteUnmuteButton);
const muteUnmuteImg = document.querySelector("#mute-unmute-img");
console.log(muteUnmuteImg);

// Add event to toggle audio mute status
muteUnmuteButton.addEventListener("click", toggleAudio);

// Function to mute/unmute the video and update the icon
function toggleAudio() {
  myVideo.muted = !myVideo.muted;
  muteUnmuteImg.src = myVideo.muted
    ? "https://img.icons8.com/ios-glyphs/30/no-audio--v1.png" // Show mute icon
    : "https://img.icons8.com/ios-glyphs/30/high-volume--v2.png"; // Show volume icon
}

// Select the theme dropdown menu for background changes
const themeSelector = document.querySelector("#theme-select");
console.log(themeSelector);

// Add change event to dynamically update the page background
themeSelector.addEventListener("change", changeTheme);

// Function to apply selected theme image as page background
function changeTheme(event) {
  document.body.style.backgroundImage = `url('${event.target.value}')`; // select the value that the theme selector is using, so i dont have to use if/else
}
// The JavaScript in this project enhances interactivity and usability by creating a fully functional custom video player.
// It controls basic playback features like play, pause, mute, unmute, and replay, giving users intuitive control over their study session media.
// The script also dynamically updates the progress bar in real-time, visually showing how much of the video has played.
// A theme-switching feature allows users to change the background to match their mood or environment, supporting personalization and comfort.
// The website was designed to be simple and calm with usability, with a relaxed atmosphere of the website
