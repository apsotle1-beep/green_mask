export class AudioRecorder {
    private audioContext: AudioContext | null = null;
    private mediaStream: MediaStream | null = null;
    private processor: ScriptProcessorNode | null = null;
    private source: MediaStreamAudioSourceNode | null = null;
    private onDataAvailable: (data: ArrayBuffer) => void;

    constructor(onDataAvailable: (data: ArrayBuffer) => void) {
        this.onDataAvailable = onDataAvailable;
    }

    async start() {
        try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                },
            });

            this.audioContext = new AudioContext({
                sampleRate: 16000,
            });

            this.source = this.audioContext.createMediaStreamSource(this.mediaStream);

            // Use ScriptProcessor for wide compatibility (AudioWorklet is better but more complex setup in some envs)
            // Buffer size 512 gives ~32ms chunks
            this.processor = this.audioContext.createScriptProcessor(512, 1, 1);

            this.processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                // Convert Float32 to Int16
                const pcm16 = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    const s = Math.max(-1, Math.min(1, inputData[i]));
                    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                }
                this.onDataAvailable(pcm16.buffer);
            };

            this.source.connect(this.processor);
            this.processor.connect(this.audioContext.destination);

        } catch (error) {
            console.error("Error starting audio recording:", error);
            throw error;
        }
    }

    stop() {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach((track) => track.stop());
            this.mediaStream = null;
        }
        if (this.source) {
            this.source.disconnect();
            this.source = null;
        }
        if (this.processor) {
            this.processor.disconnect();
            this.processor = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }
}

export class AudioPlayer {
    private audioContext: AudioContext | null = null;
    private queue: Float32Array[] = [];
    private isPlaying = false;
    private nextStartTime = 0;

    constructor(sampleRate: number = 24000) {
        // Gemini typically responds with 24000Hz PCM
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: sampleRate
        });
    }

    play(pcmData: Int16Array) {
        if (!this.audioContext) return;

        const float32Data = new Float32Array(pcmData.length);
        for (let i = 0; i < pcmData.length; i++) {
            float32Data[i] = pcmData[i] / 32768.0;
        }

        const buffer = this.audioContext.createBuffer(1, float32Data.length, this.audioContext.sampleRate);
        buffer.copyToChannel(float32Data, 0);

        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);

        const currentTime = this.audioContext.currentTime;
        // Schedule just after the previous chunk
        const start = Math.max(currentTime, this.nextStartTime);
        source.start(start);

        // Update next start time
        this.nextStartTime = start + buffer.duration;
    }

    stop() {
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        this.queue = [];
        this.nextStartTime = 0;
    }
}
