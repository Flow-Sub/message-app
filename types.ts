
export interface User {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  role: 'user' | 'agent';
  attachments?: Attachment[];
  sources?: Source[];
  confidence?: number;
  metadata?: {
    model?: string;
    responseType?: string;
  };
}

export interface Attachment {
  id: string;
  type: 'image' | 'file';
  url: string;
  name: string;
  mimeType?: string;
  size?: number;
}

export interface Source {
  title: string;
  location: string;
  type: string;
}

export interface ApiRequestPayload {
  sessionId: string;
  user: User;
  message: {
    id: string;
    text: string;
    timestamp: string;
  };
}

export interface ApiResponseSuccess {
  sessionId: string;
  reply: {
    id: string;
    text: string;
    timestamp: string;
  };
  sources: Source[];
  confidence: number;
  metadata: {
    model: string;
    responseType: string;
  };
}

export interface ApiResponseError {
  sessionId: string;
  error: {
    code: string;
    message: string;
  };
}
