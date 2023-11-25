import { FsBlockstore } from "blockstore-fs";
import { Event, createEvent } from "./event";
import { json } from "@helia/json"
import { Server } from "./server";
import createClient from "socket.io-client";


const main = async () => {
  const eventList = [
    createEvent({
      type: 'create-new-post',
      publisher: 'user:1',
      data: {
        title: 'Hello World',
        content: 'This is my first post'
      }
    }),
  ]
  const server = new Server(eventList)
  server.start(8888)
   

  const client = createClient('http://localhost:8888')
  client.emit('event', JSON.stringify(eventList[0].toJSON()))
}

main()
