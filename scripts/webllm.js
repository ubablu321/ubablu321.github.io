
const input = document.getElementById('input');
const output = document.getElementById('output');
const submit = document.getElementById('submit');

// Create a new Web Worker
const worker = new Worker('/scripts/worker.js');

// Handle messages from the Web Worker
worker.onmessage = (event) => {
  const { type, data } = event.data;

  if (type === 'partial-result') {
    output.textContent += data.partialResults;
    if (data.complete) {
      if (!output.textContent) {
        output.textContent = 'Result is empty';
      }
      submit.disabled = false;
    }
  } else if (type === 'model-loaded') {
    submit.disabled = false;
    submit.value = 'Get Response';
  } else if (type === 'error') {
    alert('Error: ' + data.message);
    submit.disabled = false;
  }
};
//accept model url from user input
document.getElementById('submit-model-btn').addEventListener('click', () => {
  const modelUrl = document.getElementById('model-url').value;
  if (modelUrl) {
      worker.postMessage({ type: 'load-model', input: modelUrl });
  } else {
      alert('Please enter a valid model URL.');
  }
});
//accept model from user local machine
document.getElementById('upload-model-btn').addEventListener('click', () => {
  const fileInput = document.getElementById('model-file');
  const file = fileInput.files[0];

  if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
          const modelData = event.target.result;
          worker.postMessage({ type: 'load-model-file', input: modelData });
      };

      reader.onerror = () => {
          alert('Failed to read the file. Please try again.');
      };

      reader.readAsArrayBuffer(file);
  } else {
      alert('Please select a model file to upload.');
  }
});

// Handle the submit button click
submit.onclick = () => {
  output.textContent = '';
  submit.disabled = true;

  // Send the input value to the Web Worker
  worker.postMessage({
    type: 'generate-response',
    input: input.value,
  });
};