class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = [];
  }

  connect(url) {
    this.ws = new WebSocket(url);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.listeners.forEach(listener => listener(data));
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      setTimeout(() => this.connect(url), 3000);
    };
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  send(message) {
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