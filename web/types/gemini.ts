export type LiveConfig = {
  model?: string;
  systemInstruction?: {
    parts: {
      text: string;
    }[];
  };
  generationConfig?: {
    responseModalities?: "audio"[] | "image"[];
    speechConfig?: {
      voiceConfig?: {
        prebuiltVoiceConfig?: {
          voiceName: "Puck" | "Charon" | "Kore" | "Fenrir" | "Aoede";
        };
      };
    };
  };
  tools?: Array<{
    googleSearch?: {};
    functionDeclarations?: Array<{
      name: string;
      description: string;
      parameters?: {
        type: string;
        properties: Record<string, any>;
        required?: string[];
      };
    }>;
  }>;
};

export type RealtimeInputMessage = {
  realtimeInput: {
    mediaChunks: Array<{
      mimeType: string;
      data: string;
    }>;
  };
};

export type ClientContentMessage = {
  clientContent: {
    turns: Array<{
      role: string;
      parts: Array<{
        text: string;
      }>;
    }>;
    turnComplete: boolean;
  };
};

export type ToolResponseMessage = {
  toolResponse: {
    functionResponses: Array<{
      response: object;
      id: string;
    }>;
  };
};

export type SetupMessage = {
  setup: LiveConfig;
};

// Server messages
export type ServerContentMessage = {
  serverContent: {
    turnComplete: boolean;
    interrupted: boolean;
    modelTurn: {
      parts: Array<{
        text?: string;
        inlineData?: {
          mimeType: string;
          data: string;
        };
      }>;
    };
  };
};

export type ToolCallMessage = {
  toolCall: {
    functionCalls: Array<{
      id: string;
      name: string;
      args: object;
    }>;
  };
};
