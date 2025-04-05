
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