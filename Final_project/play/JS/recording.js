let mediaRecorder;
let audioChunks = [];

document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('startRecording').onclick = startRecording;
  document.getElementById('pauseRecording').onclick = pauseRecording;
  document.getElementById('stopRecording').onclick = stopRecording;
  document.getElementById('downloadLink').onclick = downloadRecording;
});

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const destination = audioContext.createMediaStreamDestination();
    source.connect(destination);
    mediaRecorder = new MediaRecorder(destination.stream);

    mediaRecorder.ondataavailable = event => {
      audioChunks.push(event.data);
    };

    mediaRecorder.start();
  } catch (error) {
    console.error('Error accessing media devices.', error);
  }
}

function pauseRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.pause();
  } else if (mediaRecorder && mediaRecorder.state === 'paused') {
    mediaRecorder.resume();
  }
}

function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const downloadLink = document.getElementById('downloadLink');
      downloadLink.dataset.url = audioUrl;
      downloadLink.style.display = 'block';
      audioChunks = [];
    };
  }
}

function downloadRecording() {
  const downloadLink = document.getElementById('downloadLink');
  const audioUrl = downloadLink.dataset.url;
  const a = document.createElement('a');
  a.href = audioUrl;
  a.download = 'recording.webm';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}