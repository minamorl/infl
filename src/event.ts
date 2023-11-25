import { JSON, json } from "@helia/json";
import { v4 as uuidv4 } from "uuid";
import { FsBlockstore } from "blockstore-fs";
import { CID } from "multiformats";

// InflEvent is a base type of infl database
export interface InflEventInput {
  id: string;
  type: string;
  timestamp: number;
  publisher: string;
  data: Record<string, any>;
}

export class Event {
  #id: string;
  #type: string;
  #timestamp: number;
  #publisher: string;
  #data: Record<string, any>;

  constructor({ id, type, timestamp, publisher, data }: InflEventInput) {
    this.#id = id; // Generate uuid
    this.#type = type;
    this.#publisher = publisher;
    this.#timestamp = timestamp;
    this.#data = data;
  }

  get id() {
    return this.#id;
  }

  get publisher() {
    return this.#publisher.toString();
  }

  get type() {
    return this.#type;
  }

  get timestamp() {
    return this.#timestamp;
  }

  get data() {
    return this.#data;
  }

  save() {
    const j = json({blockstore: new FsBlockstore('./data')})
    j.add(this.toJSON())
  }

  static async fromCID(cid: string) {
    const j = json({blockstore: new FsBlockstore('./data')})
    const event = await j.get<InflEventInput>(CID.parse(cid))
    return new Event(event)
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      publisher: this.publisher,
      timestamp: this.timestamp,
      data: this.data,
    };
  }
}

export const createEvent = ({
  type,
  publisher,
  data,
}: Omit<InflEventInput, "id" | "timestamp">) =>
  new Event({
    id: uuidv4(),
    type,
    timestamp: Date.now(),
    publisher,
    data,
  });