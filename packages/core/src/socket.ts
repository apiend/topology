import { EventType, TopologyData } from './models';

export class Socket {
  socket: WebSocket;
  constructor(public url: string, public data: TopologyData) {
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
    if (!this.data.pens.length || !e || !e.data) {
      return;
    }

    let msg: { event: string, data: any; };
    try {
      msg = JSON.parse(e.data);
    } catch (error) {
      msg = e.data;
    }

    for (const item of this.data.pens) {
      for (const event of item.events) {
        if (event.type === EventType.WebSocket) {
          if (event.name && event.name === msg.event) {
            item.doSocketMqtt(event, msg.data, this.socket);
          } else if (!event.name && msg) {
            item.doSocketMqtt(event, msg, this.socket);
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
