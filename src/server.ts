import { Server as sio } from 'socket.io';
import http from 'http';
import { Event } from './event';

export class Server {
  private server: http.Server;
  private io: sio;

  constructor() {
    this.server = http.createServer();
    this.io = new sio(this.server)
    this.io.on('connection', (socket) => {
      console.log('a user connected');
      // get event from client
      socket.on('event', (message) => {
        const event = this.parse(message)
        if (!event) return
        // pass it to all clients
        this.io.emit('event', event.toJSON())
        console.log('event', event.toJSON())
      });
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    })
  }
  private parse(message: string) {
    try {
      const event = new Event(JSON.parse(message))
      return event
    } catch (error) {
      console.error('Error parsing event', error)
    }
  }

  public start(port: number) {
    this.server.listen(port, () => {
      console.log(`🚀Server started on port ${port}`);
    });
  }

  public stop() {
    this.server.close();
  }


}