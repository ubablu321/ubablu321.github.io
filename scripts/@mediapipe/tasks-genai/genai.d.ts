/// <reference types="@webgpu/types" />

/**
 * Copyright 2022 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Options to configure MediaPipe model loading and processing. */
declare interface BaseOptions_2 {
    /**
     * The model path to the model asset file. Only one of `modelAssetPath` or
     * `modelAssetBuffer` can be set.
     */
    modelAssetPath?: string | undefined;
    /**
     * A buffer or stream reader containing the model asset. Only one of
     * `modelAssetPath` or `modelAssetBuffer` can be set.
     */
    modelAssetBuffer?: Uint8Array | ReadableStreamDefaultReader | undefined;
    /** Overrides the default backend to use for the provided model. */
    delegate?: "CPU" | "GPU" | undefined;
}

/**
 * Resolves the files required for the MediaPipe Task APIs.
 *
 * This class verifies whether SIMD is supported in the current environment and
 * loads the SIMD files only if support is detected. The returned filesets
 * require that the Wasm files are published without renaming. If this is not
 * possible, you can invoke the MediaPipe Tasks APIs using a manually created
 * `WasmFileset`.
 */
export declare class FilesetResolver {
    /**
     * Returns whether SIMD is supported in the current environment.
     *
     * If your environment requires custom locations for the MediaPipe Wasm files,
     * you can use `isSimdSupported()` to decide whether to load the SIMD-based
     * assets.
     *
     * @export
     * @return Whether SIMD support was detected in the current environment.
     */
    static isSimdSupported(): Promise<boolean>;
    /**
     * Creates a fileset for the MediaPipe Audio tasks.
     *
     * @export
     * @param basePath An optional base path to specify the directory the Wasm
     *    files should be loaded from. If not specified, the Wasm files are
     *    loaded from the host's root directory.
     * @return A `WasmFileset` that can be used to initialize MediaPipe Audio
     *    tasks.
     */
    static forAudioTasks(basePath?: string): Promise<WasmFileset>;
    /**
     * Creates a fileset for the MediaPipe GenAI tasks.
     *
     * @export
     * @param basePath An optional base path to specify the directory the Wasm
     *    files should be loaded from. If not specified, the Wasm files are
     *    loaded from the host's root directory.
     * @return A `WasmFileset` that can be used to initialize MediaPipe GenAI
     *    tasks.
     */
    static forGenAiTasks(basePath?: string): Promise<WasmFileset>;
    /**
     * Creates a fileset for the MediaPipe GenAI Experimental tasks.
     *
     * @export
     * @param basePath An optional base path to specify the directory the Wasm
     *    files should be loaded from. If not specified, the Wasm files are
     *    loaded from the host's root directory.
     * @return A `WasmFileset` that can be used to initialize MediaPipe GenAI
     *    tasks.
     */
    static forGenAiExperimentalTasks(basePath?: string): Promise<WasmFileset>;
    /**
     * Creates a fileset for the MediaPipe Text tasks.
     *
     * @export
     * @param basePath An optional base path to specify the directory the Wasm
     *    files should be loaded from. If not specified, the Wasm files are
     *    loaded from the host's root directory.
     * @return A `WasmFileset` that can be used to initialize MediaPipe Text
     *    tasks.
     */
    static forTextTasks(basePath?: string): Promise<WasmFileset>;
    /**
     * Creates a fileset for the MediaPipe Vision tasks.
     *
     * @export
     * @param basePath An optional base path to specify the directory the Wasm
     *    files should be loaded from. If not specified, the Wasm files are
     *    loaded from the host's root directory.
     * @return A `WasmFileset` that can be used to initialize MediaPipe Vision
     *    tasks.
     */
    static forVisionTasks(basePath?: string): Promise<WasmFileset>;
}

/**
 * Options to configure the model loading and processing for LLM Inference task.
 */
export declare interface LlmBaseOptions extends BaseOptions_2 {
    gpuOptions?: WebGpuOptions;
}

/**
 * Performs LLM Inference on text.
 */
export declare class LlmInference extends TaskRunner {
    /**
     * Initializes the Wasm runtime and creates a new `LlmInference` based
     * on the provided options.
     * @export
     * @param wasmFileset A configuration object that provides the location of the
     *     Wasm binary and its loader.
     * @param llmInferenceOptions The options for LLM Inference. Note that
     *     either a path to the TFLite model or the model itself needs to be
     *     provided (via `baseOptions`).
     */
    static createFromOptions(wasmFileset: WasmFileset, llmInferenceOptions: LlmInferenceOptions): Promise<LlmInference>;
    /**
     * Initializes the Wasm runtime and creates a new `LlmInference` based
     * on the provided model asset buffer.
     * @export
     * @param wasmFileset A configuration object that provides the location of the
     *     Wasm binary and its loader.
     * @param modelAssetBuffer An array or a stream containing a binary
     *    representation of the model.
     */
    static createFromModelBuffer(wasmFileset: WasmFileset, modelAssetBuffer: Uint8Array | ReadableStreamDefaultReader): Promise<LlmInference>;
    /**
     * Initializes the Wasm runtime and creates a new `LlmInference` based
     * on the path to the model asset.
     * @export
     * @param wasmFileset A configuration object that provides the location of the
     *     Wasm binary and its loader.
     * @param modelAssetPath The path to the model asset.
     */
    static createFromModelPath(wasmFileset: WasmFileset, modelAssetPath: string): Promise<LlmInference>;
    private constructor();
    /**
     * Create WebGPU device with high performance configurations.
     * @export
     */
    static createWebGpuDevice(): Promise<GPUDevice>;
    /**
     * Sets new options for the LLM inference task.
     *
     * Calling `setOptions()` with a subset of options only affects those options.
     * You can reset an option back to its default value by explicitly setting it
     * to `undefined`.
     *
     * @export
     * @param options The options for the LLM Inference task.
     */
    setOptions(options: LlmInferenceOptions): Promise<void>;
    /**
     * Returns whether the LlmInference instance is idle.
     *
     * @export
     */
    get isIdle(): boolean;
    /**
     * Performs LLM Inference on the provided text and waits
     * asynchronously for the response. Only one call to `generateResponse()` can
     * run at a time.
     *
     * @export
     * @param text The text to process.
     * @return The generated text result.
     */
    generateResponse(text: string): Promise<string>;
    /**
     * Performs LLM Inference on the provided text and waits
     * asynchronously for the response. Only one call to `generateResponse()` can
     * run at a time.
     *
     * @export
     * @param text The text to process.
     * @param progressListener A listener that will be triggered when the task has
     *     new partial response generated.
     * @return The generated text result.
     */
    generateResponse(text: string, progressListener?: ProgressListener): Promise<string>;
    /**
     * Performs LLM Inference on the provided text and waits
     * asynchronously for the response. Only one call to `generateResponse()` can
     * run at a time.
     *
     * @export
     * @param text The text to process.
     * @param loraModel The LoRA model to apply on the text generation.
     * @return The generated text result.
     */
    generateResponse(text: string, loraModel?: LoraModel): Promise<string>;
    /**
     * Performs LLM Inference on the provided text and waits
     * asynchronously for the response. Only one call to `generateResponse()` can
     * run at a time.
     *
     * @export
     * @param text The text to process.
     * @param loraModel The LoRA model to apply on the text generation.
     * @param progressListener A listener that will be triggered when the task has
     *     new partial response generated.
     * @return The generated text result.
     */
    generateResponse(text: string, loraModel?: LoraModel, progressListener?: ProgressListener): Promise<string>;
    /**
     * Similar to `generateResponse()` but can return multiple responses for the
     * given prompt if the task is initialized with a value for `numResponses`
     * greater than 1.
     *
     * @export
     * @param text The text to process.
     * @return The generated results.
     */
    generateResponses(text: string): Promise<string[]>;
    /**
     * Similar to `generateResponse()` but can return multiple responses for the
     * given prompt if the task is initialized with a value for `numResponses`
     * greater than 1.
     *
     * @export
     * @param text The text to process.
     * @param progressListener A listener that will be triggered when the task has
     *     new partial response generated.
     * @return The generated results.
     */
    generateResponses(text: string, progressListener: MultiResponseProgressListener): Promise<string[]>;
    /**
     * Similar to `generateResponse()` but can return multiple responses for the
     * given prompt if the task is initialized with a value for `numResponses`
     * greater than 1.
     *
     * @export
     * @param text The text to process.
     * @param loraModel The LoRA model to apply on the text generation.
     * @return The generated results.
     */
    generateResponses(text: string, loraModel: LoraModel): Promise<string[]>;
    /**
     * Similar to `generateResponse()` but can return multiple responses for the
     * given prompt if the task is initialized with a value for `numResponses`
     * greater than 1.
     *
     * @export
     * @param text The text to process.
     * @param loraModel The LoRA model to apply on the text generation.
     * @param progressListener A listener that will be triggered when the task has
     *     new partial response generated.
     * @return The generated results.
     */
    generateResponses(text: string, loraModel: LoraModel, progressListener: MultiResponseProgressListener): Promise<string[]>;
    /**
     * Runs an invocation of *only* the tokenization for the LLM, and returns
     * the size (in tokens) of the result. Cannot be called while
     * a `generateResponse()` query is active. Runs synchronously.
     *
     * @export
     * @param text The text to tokenize.
     * @return The number of tokens in the resulting tokenization of the text.
     *         May return undefined if an error occurred.
     */
    sizeInTokens(text: string): number | undefined;
    /**
     * Load a LoRA model to the LLM Inference Task and the LoRA model can be used
     * by `generateResponse()`. The returned LoRA model can be applied only to the
     * current LLM Inference task.
     *
     * @export
     * @param modelAsset The URL to the model, Blob or the ArrayBuffer of the
     *     model content.
     * @return A loaded LoRA model.
     */
    loadLoraModel(modelAsset: string | Uint8Array | Blob): Promise<LoraModel>;
    close(): void;
}

/** Options to configure the MediaPipe LLM Inference Task */
export declare interface LlmInferenceOptions extends TaskRunnerOptions {
    /** Options to configure the LLM model loading and processing. */
    baseOptions?: LlmBaseOptions;
    /**
     * Maximum number of the combined input and output tokens.
     */
    maxTokens?: number;
    /**
     * The number of candidate tokens to sample from the softmax output in top-k
     * sampling.
     */
    topK?: number;
    /**
     * The temperature used to scale the logits before computing softmax.
     */
    temperature?: number;
    /**
     * Random seed for sampling tokens.
     */
    randomSeed?: number;
    /**
     * The LoRA ranks that will be used during inference.
     */
    loraRanks?: number[];
    /**
     * The number of responses to generate for 'generateResponses' calls,
     * defaulting to 1.
     * In order to ensure variation of responses, you should set topK > 1 and
     * temperature > 0 in the task options; otherwise sampling will collapse to
     * greedy sampling, resulting in all generated responses having the same
     * results.
     * Also, note that increasing this will slow down `generateResponse` calls,
     * because it will still generate many responses, even though it only returns
     * the top result.
     */
    numResponses?: number;
}

/**
 * The LoRA model to be used for `generateResponse()` of a LLM Inference task.
 */
export declare class LoraModel {
    readonly owner: LlmInference;
    readonly loraModelId: number;
    constructor(owner: LlmInference);
}

/**
 * A listener that receives the newly generated partial results for multiple
 * responses and an indication whether the generation is complete.
 */
export declare type MultiResponseProgressListener = (partialResult: string[], done: boolean) => unknown;

/**
 * A listener that receives the newly generated partial result and an indication
 * whether the generation is complete.
 */
export declare type ProgressListener = (partialResult: string, done: boolean) => unknown;

/** Base class for all MediaPipe Tasks. */
declare abstract class TaskRunner {
    protected constructor();
    /** Configures the task with custom options. */
    abstract setOptions(options: TaskRunnerOptions): Promise<void>;
    /**
     * Closes and cleans up the resources held by this task.
     * @export
     */
    close(): void;
}

/** Options to configure MediaPipe Tasks in general. */
declare interface TaskRunnerOptions {
    /** Options to configure the loading of the model assets. */
    baseOptions?: BaseOptions_2;
}

/**
 * Copyright 2022 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** An object containing the locations of the Wasm assets */
declare interface WasmFileset {
    /** The path to the Wasm loader script. */
    wasmLoaderPath: string;
    /** The path to the Wasm binary. */
    wasmBinaryPath: string;
    /** The optional path to the asset loader script. */
    assetLoaderPath?: string;
    /** The optional path to the assets binary. */
    assetBinaryPath?: string;
}

/**
 * Options to configure the WebGPU device for LLM Inference task.
 */
export declare interface WebGpuOptions {
    /**
     * The WebGPU device to perform the LLM Inference task.
     * `LlmInference.createWebGpuDevice()` provides the device with
     * performance-prioritized configurations.
     */
    device?: GPUDevice;
    /**
     * The information of WebGPU adapter, which will be used to optimize the
     * performance for LLM Inference task.
     */
    adapterInfo?: GPUAdapterInfo;
}

export { }
