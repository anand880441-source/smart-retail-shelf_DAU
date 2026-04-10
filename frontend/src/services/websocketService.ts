class WebSocketService {
  private ws: WebSocket | null;
  private listeners: Array<(data: any) => void>;

  constructor() {
    this.ws = null;
    this.listeners = [];
  }

  connect(url: string) {
    this.ws = new WebSocket(url);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    this.ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      this.listeners.forEach(listener => listener(data));
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      setTimeout(() => this.connect(url), 3000);
    };
  }

  addListener(callback: (data: any) => void) {
    this.listeners.push(callback);
  }

  removeListener(callback: (data: any) => void) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default new WebSocketService();