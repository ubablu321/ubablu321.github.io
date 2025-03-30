// This file implements the speech-to-text functionality using the Web Speech Recognition API.

const startButton = document.getElementById('start-btn'); // Button to start speech recognition
const stopButton = document.getElementById('stop-btn'); // Button to stop speech recognition
const textArea = document.getElementById('speech-text-area'); // Element to display the transcribed text
const saveTextBtn = document.getElementById('save-btn'); // Element to display the transcribed text

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; // Web Speech API compatibility check
const recognition = new SpeechRecognition(); // Create a new instance of SpeechRecognition

recognition.continuous = true; // Enables continuous speech recognition
recognition.interimResults = true; // Allows interim results to be displayed before finalizing

// Event triggered when speech recognition starts
recognition.onstart = () => {
    console.log('Speech recognition service has started.');
    startButton.textContent = "👂Listening..."; // Update button text to indicate listening
    stopButton.disabled = false; // Enable the stop button
};
// Event triggered when speech recognition captures results
recognition.onresult = (event) => {
    const transcript = Array.from(event.results) // Convert results to an array
        .map(result => result[0]) // Get the first alternative from each result
        .map(result => result.transcript) // Extract the transcript text
        .join(''); // Combine all transcripts into a single string
        textArea.value = transcript; // Display the transcribed text in the output element
};
// Event triggered when speech recognition ends
recognition.onend = () => {
    console.log('Speech recognition service has ended.');
    startButton.textContent = "🎤 Start Transcribing"; // Reset the start button text
    stopButton.disabled = true; // Disable the stop button
}
// Event triggered when an error occurs in speech recognition
recognition.onerror = (event) => {
    if(event.error === 'no-speech') return showToast('No speech was detected. Please try again.');
    if(event.error === 'audio-capture') return showToast('No microphone was found. Please ensure that a microphone is installed.');
    if(event.error === 'not-allowed') return showToast('Permission to access the microphone was denied. Please allow the browser to access the microphone.');
    console.error('Error occurred in recognition: ' + event.error); // Log the error
    startButton.textContent = "🎤 Start Transcribing"; // Reset the start button text
    stopButton.disabled = false;
};
// Event listener for the start button to initiate speech recognition
startButton.addEventListener('click', () => {
    recognition.start();
    stopButton.disabled = false;
    startButton.textContent="🎤 Start Transcribing";
    console.log('Speech recognition service has stopped.');
});
// Event listener for the save button to save the transcribed text to a file
saveTextBtn.addEventListener('click', () => {
    const text = document.getElementById('speech-text-area').value;
    if(text === '') {
        showToast('No text to save');
        return;
    }
    // Ask for user confirmation before saving the file
    const userConfirmed = window.confirm('Do you want to save the transcribed text to your device?');
    if (!userConfirmed) {
        console.log('User canceled the save operation.');
        return; // Exit if the user cancels
    }
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcription.txt';
    a.click();
    URL.revokeObjectURL(url);
    console.log('Text saved to hard disk:', text);
});
// Event listener for the stop button to stop speech recognition
stopButton.addEventListener('click', () => {
    console.log('Speech recognition service has stopped.');
    recognition.stop();
    stopButton.disabled = true;
    startButton.textContent="🎤 Start Transcribing";
});
// Function to display a toast message on error
function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 4000);
}