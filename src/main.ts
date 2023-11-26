import { FsBlockstore } from "blockstore-fs";
import { Event, createEvent } from "./event";
import { json } from "@helia/json"
import { Server } from "./server";
import createClient from "socket.io-client";


const main = async () => {
  const eventList = [] as Event[]
  const server = new Server(eventList)
  const j = json({
    blockstore: new FsBlockstore('./data')
  })
  server.start(8888)

  // archive all events every 60 seconds
  setInterval(() => {
    const event = createEvent({
      type: 'create-new-post',
      publisher: 'user:1',
      data: {
        title: 'Hello World',
        content: 'This is my first post'
      }
    }).toJSON()
    client.emit('event', JSON.stringify(event))
    j.add(event)
    server.archiveAll()
  }, 1000)
   

  const client = createClient('http://localhost:8888')
}

main()
