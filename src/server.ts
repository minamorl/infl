import { Server as sio } from 'socket.io';
import http from 'http';
import { Event, InflEventInput } from './event';
import { CID } from 'multiformats';
import { filter } from './filter';

export class Server {
  #server: http.Server;
  #io: sio;
  #eventList: Event[];

  constructor(eventList: Event[]) {
    this.#server = http.createServer();
    this.#eventList = eventList
    console.log(eventList)
    this.#io = new sio(this.#server, {
      cors: {
        origin: '*',
        methods: ["GET", "POST"]
      }
    })
    // cors
    this.#io.on('connection', (socket) => {
      console.log('a user connected');
      // get event from client
      socket.on('event', (message) => {
        try {
          const event = new Event(JSON.parse(message))
          if (!event) return
          this.emit(event)
        } finally {
        }
      });
      socket.on('inquiry', async (message) => {
        const event = await this.inquiry(message)
        if (!event) return
        this.emit(event)
      });
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    })
  }
  async inquiry(cid: string) {
    const event = await Event.fromCID(cid)
    if (!event) return 
    return event
  }
  archiveAll() {
    this.#eventList.map(event => event.archive())
  }
  emit(event: Event) {
    console.log('event', event.toJSON())
    this.#eventList.push(event)
    return this.#io.emit('event', event.toJSON())
  }
  // emit all
  emitAll() {
    return this.#eventList.map(event => this.emit(event))
  }
  start(port: number) {
    this.#server.listen(port, () => {
      console.log(`🚀Server started on port ${port}`);
    });
  }

  stop() {
    this.#server.close();
  }
}