
import * as mqtt from './mqtt.min.js';

import { Pen, EventType } from './models';

export class MQTT {
  client: any;
  constructor(public url: string, public options: any, public topics: string, public pens: Pen[]) {
    this.init();
  }

  init() {
    this.client = mqtt.connect(this.url, this.options);
    this.client.on('message', this.onmessage);

    if (this.topics) {
      this.client.subscribe(this.topics.split(','));
    }
  }

  onmessage = (topic: string, message: any) => {
    if (!this.pens.length || !topic) {
      return;
    }

    for (const item of this.pens) {
      for (const event of item.events) {
        if (event.type === EventType.Mqtt) {
          if (event.name && topic.indexOf(event.name) > -1) {
            item.doMqtt(event, message, this.client);
          }
        }
      }
    }
  };

  publish(topic: string, message: string) {
    this.client.publish(topic, message);
  }

  close() {
    this.client.end();
  }
}
