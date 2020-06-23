import { Pen, EventType } from './models';

export class Socket {
  socket: WebSocket;
  constructor(public url: string, public pens: Pen[]) {
    this.init();
  }

  init() {
    this.socket = new WebSocket(this.url);
    this.socket.onmessage = this.onmessage;

    this.socket.onclose = () => {
      console.log('Canvas websocket closed and reconneting...');
      this.init();
    };
  }

  onmessage = (e: MessageEvent) => {
    if (!this.pens.length || !e || !e.data) {
      return;
    }

    let msg: { event: string, data: any; };
    try {
      msg = JSON.parse(e.data);
    } catch (error) {
      msg = e.data;
    }

    for (const item of this.pens) {
      for (const event of item.events) {
        if (event.type === EventType.WebSocket) {
          if (event.name && event.name === msg.event) {
            item.doSocket(event, msg.data, this.socket);
          } else if (!event.name && msg) {
            item.doSocket(event, msg, this.socket);
          }
        }
      }
    }
  };

  close() {
    this.socket.onclose = null;
    this.socket.close();
  }
}
