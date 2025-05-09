// Block access to this page if user is not logged in
(function () {
  const token = localStorage.getItem('patreon_token');

  if (!token) {
    // Redirect to homepage or custom "please log in" page
      sessionStorage.setItem('login_required', 'true');
      window.location.href = '/index.html';
  }
})();

let audioContext;
let oscillator;
let gainNode;
let panNode;

function setupAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (oscillator) {
    stopTone();
  }
}

function setPresetFrequency(frequency) {
  document.getElementById('tonegen-customFreqSlider').value = frequency;
  document.getElementById('tonegen-customFreqInput').value = frequency;
  updateCustomFreqLabel();
  liveUpdateTone();
}

function updateCustomFreqLabel() {
  const freq = document.getElementById('tonegen-customFreqSlider').value;
  document.getElementById('tonegen-customFreqLabel').textContent = `${freq} Hz`;
  document.getElementById('tonegen-customFreqInput').value = freq;
}

function syncSliderToInput() {
  const input = document.getElementById('tonegen-customFreqInput').value;
  if (input >= 20 && input <= 6000) {
    document.getElementById('tonegen-customFreqSlider').value = input;
    updateCustomFreqLabel();
    liveUpdateTone();
  }
}

function playTone() {
  setupAudioContext();

  const frequency = parseFloat(document.getElementById('tonegen-customFreqSlider').value);
  const waveform = document.getElementById('tonegen-waveformSelect').value;
  const volume = parseFloat(document.getElementById('tonegen-volumeSlider').value);
  const panValue = parseFloat(document.getElementById('tonegen-panSlider').value);

  oscillator = audioContext.createOscillator();
  gainNode = audioContext.createGain();
  panNode = audioContext.createStereoPanner();

  oscillator.type = waveform;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  panNode.pan.setValueAtTime(panValue, audioContext.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(panNode);
  panNode.connect(audioContext.destination);

  oscillator.start();
}

function stopTone() {
  if (oscillator) {
    oscillator.stop();
    oscillator.disconnect();
    oscillator = null;
  }
  if (gainNode) {
    gainNode.disconnect();
    gainNode = null;
  }
  if (panNode) {
    panNode.disconnect();
    panNode = null;
  }
}

function liveUpdateTone() {
  if (!oscillator) {
    playTone();
  } else {
    const frequency = parseFloat(document.getElementById('tonegen-customFreqSlider').value);
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    updateCustomFreqLabel();
  }
}

function updateVolume() {
  if (gainNode) {
    const volume = parseFloat(document.getElementById('tonegen-volumeSlider').value);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  }
}

function updatePan() {
  if (panNode) {
    const panValue = parseFloat(document.getElementById('tonegen-panSlider').value);
    panNode.pan.setValueAtTime(panValue, audioContext.currentTime);
  }
}

function setPresetFrequency(frequency) {
  document.getElementById('tonegen-customFreqSlider').value = frequency;
  document.getElementById('tonegen-customFreqInput').value = frequency;
  updateCustomFreqLabel();
  liveUpdateTone();

  // Highlight active button
  const buttons = document.querySelectorAll(
    '.tonegen-buttons-guitar button, .tonegen-buttons-bass button, .tonegen-buttons-presets button'
  );
  buttons.forEach(btn => btn.classList.remove('tonegen-active'));
  

  const match = Array.from(buttons).find(b => b.textContent.includes(`${frequency}`));
  if (match) match.classList.add('tonegen-active');
}

function liveUpdateTone() {
  if (!oscillator) {
    playTone();
  } else {
    const frequency = parseFloat(document.getElementById('tonegen-customFreqSlider').value);
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    updateCustomFreqLabel();
  }

  // Bars and Tone Joke
  const body = document.querySelector('.tonegen-body');
  const currentFreq = parseFloat(document.getElementById('tonegen-customFreqSlider').value);
  if (currentFreq === 1000) {
    body.classList.add('bars-and-tone');
  } else {
    body.classList.remove('bars-and-tone');
  }
}
