// This file implements the speech-to-text functionality using the Web Speech Recognition API.

const startButton = document.getElementById('start-btn'); // Button to start speech recognition
const stopButton = document.getElementById('stop-btn'); // Button to stop speech recognition
const textArea = document.getElementById('speech-text-area'); // Element to display the transcribed text
const saveTextBtn = document.getElementById('save-btn'); // Element to display the transcribed text
const clearButton = document.getElementById('clear-btn'); // Button to clear the transcribed text


// Check if the Speech Recognition API is supported
if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    // Create and display a modal
    const modal = document.createElement('div');
    modal.id = 'unsupported-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.color = 'white';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    const message = document.createElement('p');
    message.textContent = 'Your browser does not support the Speech Recognition API. Please use a supported browser like Google Chrome , Edge.';
    message.style.textAlign = 'center';
    message.style.margin = '20px';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#dc3545';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';

    closeButton.addEventListener('click', () => {
        modal.remove(); // Remove the modal when the button is clicked
    });

    modal.appendChild(message);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);
}

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
// Event listener for the clear button to clear the transcribed text
clearButton.addEventListener('click', () => {
    const textArea = document.getElementById('speech-text-area');
    textArea.value = ''; // Clear the text area
    recognition.stop(); // Stop speech recognition
    console.log('Text area cleared.');

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