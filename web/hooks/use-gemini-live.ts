import { useEffect, useRef, useState, useCallback } from "react";
import { AudioRecorder, AudioPlayer } from "@/lib/audio-streamer";
import {
    LiveConfig,
    ServerContentMessage,
    ToolCallMessage,
    RealtimeInputMessage,
    ToolResponseMessage,
} from "@/types/gemini";

const HOST = "generativelanguage.googleapis.com";
const URI = `wss://${HOST}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

interface UseGeminiLiveProps {
    apiKey?: string;
    onToolCall?: (name: string, args: any) => Promise<any>;
    systemInstruction?: string;
}

export function useGeminiLive({ apiKey, onToolCall, systemInstruction }: UseGeminiLiveProps) {
    const [isActive, setIsActive] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const recorderRef = useRef<AudioRecorder | null>(null);
    const playerRef = useRef<AudioPlayer | null>(null);

    const connect = useCallback(async () => {
        if (!apiKey) {
            console.error("No API Key provided");
            return;
        }

        const url = `${URI}?key=${apiKey}`;
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = async () => {
            console.log("Connected to Gemini Live");
            setIsActive(true);

            // Initialize Audio
            playerRef.current = new AudioPlayer();
            recorderRef.current = new AudioRecorder((data) => {
                if (ws.readyState === WebSocket.OPEN) {
                    const b64 = arrayBufferToBase64(data);
                    const msg: RealtimeInputMessage = {
                        realtimeInput: {
                            mediaChunks: [
                                {
                                    mimeType: "audio/pcm;rate=16000",
                                    data: b64,
                                },
                            ],
                        },
                    };
                    ws.send(JSON.stringify(msg));
                }
            });
            await recorderRef.current.start();

            // Send Setup Message
            const setupMsg: { setup: LiveConfig } = {
                setup: {
                    model: "models/gemini-2.0-flash-exp", // or generic gemini-2.0-flash-exp
                    generationConfig: {
                        responseModalities: ["audio"],
                        speechConfig: {
                            voiceConfig: {
                                prebuiltVoiceConfig: {
                                    voiceName: "Puck"
                                }
                            }
                        }
                    },
                    systemInstruction: systemInstruction
                        ? {
                            parts: [{ text: systemInstruction }],
                        }
                        : undefined,
                    tools: [
                        {
                            functionDeclarations: [
                                {
                                    name: "update_order_quantity",
                                    description: "Update the quantity of the product (Green Mask Stick) in the cart.",
                                    parameters: {
                                        type: "object",
                                        properties: {
                                            quantity: { type: "number", description: "The new total quantity." },
                                        },
                                        required: ["quantity"],
                                    },
                                },
                                {
                                    name: "ask_checkout",
                                    description: "User wants to checkout or buy the items.",
                                    parameters: {
                                        type: "object",
                                        properties: {},
                                    },
                                },
                            ],
                        },
                    ],
                },
            };
            ws.send(JSON.stringify(setupMsg));
        };

        ws.onmessage = async (event) => {
            let data = event.data;
            if (data instanceof Blob) {
                data = await data.text();
            }

            try {
                const response = JSON.parse(data);

                // Handle Server Content (Audio)
                if (response.serverContent) {
                    const content = response.serverContent as ServerContentMessage["serverContent"];
                    if (content.modelTurn?.parts) {
                        for (const part of content.modelTurn.parts) {
                            if (part.inlineData && part.inlineData.mimeType.startsWith("audio/pcm")) {
                                const buffer = base64ToArrayBuffer(part.inlineData.data);
                                playerRef.current?.play(new Int16Array(buffer));
                            }
                        }
                    }
                }

                // Handle Tool Calls
                if (response.toolCall) {
                    const toolCall = response.toolCall as ToolCallMessage["toolCall"];
                    const responses: any[] = [];

                    for (const fc of toolCall.functionCalls) {
                        console.log("Tool call:", fc.name, fc.args);
                        let result = { result: "ok" };
                        if (onToolCall) {
                            const output = await onToolCall(fc.name, fc.args);
                            if (output) result = output;
                        }
                        responses.push({
                            id: fc.id,
                            response: result
                        });
                    }

                    const toolResponseStr = JSON.stringify({
                        toolResponse: {
                            functionResponses: responses
                        }
                    });
                    ws.send(toolResponseStr);
                }
            } catch (e) {
                console.error("Error parsing message", e);
            }
        };

        ws.onclose = () => {
            console.log("Gemini connection closed");
            setIsActive(false);
            disconnect();
        };

        ws.onerror = (e) => {
            console.error("WebSocket error:", e);
        };
    }, [apiKey, onToolCall, systemInstruction]);

    const disconnect = useCallback(() => {
        if (recorderRef.current) {
            recorderRef.current.stop();
            recorderRef.current = null;
        }
        if (playerRef.current) {
            playerRef.current.stop();
            playerRef.current = null;
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setIsActive(false);
    }, []);

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return { connect, disconnect, isActive };
}
