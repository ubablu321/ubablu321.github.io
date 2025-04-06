// Use importScripts to load the Mediapipe library
importScripts('/scripts/@mediapipe/tasks-genai/genai_bundle.mjs');
//const modelPath = '/models/llm/llama2-7b-chat.gguf';
let llmInference;
//qn:FilesetResolver  Cr:LlmInference;
// Function to load the model
const FilesetResolver = self.qn;
const LlmInference = self.Cr;
async function loadModel(modelPath) {
  try {
    const genaiFileset = await FilesetResolver.forGenAiTasks(
      '/scripts/@mediapipe/tasks-genai/wasm'
    );
    llmInference = await LlmInference.createFromOptions(genaiFileset, {
      baseOptions: { modelAssetPath: modelPath },
    });
    console.log('rescheduler', llmInference);
    // Notify the main thread that the model is loaded
    self.postMessage({ type: 'model-loaded' });
  } catch (error) {
    console.error('Error loading model:', error);
    // Notify the main thread about the error
    self.postMessage({ type: 'error', data: { message: 'Failed to initialize the task.' } });
  }
}

// Function to generate a response
function generateResponse(input) {
  llmInference.generateResponse(input, (partialResults, complete) => {
    // Send partial results back to the main thread
    self.postMessage({
      type: 'partial-result',
      data: { partialResults, complete },
    });
  });
}

// Handle messages from the main thread
self.onmessage = (event) => {
  const { type, input } = event.data;

  if (type === 'generate-response') {
    generateResponse(input);
  }
  if (type === 'stop') {
    llmInference.stop();
  }
  //load models with user input LLms
  if (type === 'load-model') {
    loadModel(input)
  }
};

// Load the model when the worker starts
//loadModel();