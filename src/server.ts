import { Server as sio } from 'socket.io';
import http from 'http';
import { Event } from './event';
import { CID } from 'multiformats';

export class Server {
  #server: http.Server;
  #io: sio;
  #eventList: Event[];

  constructor(eventList: Event[]) {
    this.#server = http.createServer();
    this.#eventList = eventList
    console.log(eventList)
    this.#io = new sio(this.#server)
    this.#io.on('connection', (socket) => {
      console.log('a user connected');
      // get event from client
      socket.on('event', (message) => {
        const event = this.parse(message)
        if (!event) return
        this.#eventList.push(event)
        this.emit(event)
      });
      socket.on('inquiry', async (message) => {
        const event = await this.inquiry(message)
        if (!event) return
        this.#eventList.push(event)
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
  emit(event: Event) {
    console.log('event', event.toJSON())
    return this.#io.emit('event', event.toJSON())
  }
  // emit all
  emitAll() {
    return this.#eventList.map(event => this.emit(event))
  }
  private parse(message: string) {
    try {
      const event = new Event(JSON.parse(message))
      return event
    } catch (error) {
      console.error('Error parsing event', error)
    }
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