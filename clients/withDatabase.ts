import { MongoClient } from "mongodb";
import { FreshContext } from "$fresh/server.ts";
import { Room } from "../utils/types.ts";
import { crypto } from "https://deno.land/std@0.213.0/crypto/crypto.ts";

export type WithDatabaseContext = FreshContext<{client: DatabaseClient}>;

export interface DatabaseClient {
  rooms(): Promise<Room[]>
  room(id: string): Promise<Room | undefined>
  updateRoom(id: string, room: Room): Promise<void>
  createRoom(name: string, password: string): Promise<string>
}

export async function getDatabaseClient() {
  const client = new MongoClient();
  await client.connect(
    Deno.env.get("MONGODB_URI") ?? "",
  );
  return client.database(Deno.env.get("MONGODB_DB_NAME") ?? "");
}

export async function withDatabase(_: Request, ctx: WithDatabaseContext) {
  const client = await getDatabaseClient();
  ctx.state.client = {
    rooms: async () => {
      const collection = client.collection<Room>("rooms");
      const cursor = collection.find();
      const rooms: Room[] = [];
      for await (const room of cursor) {
        rooms.push(room);
      }
      return rooms;
    },
    room: async (id: string) => {
      const collection = client.collection<Room>("rooms");
      return await collection.findOne({id});
    },
    updateRoom: async (id: string, room: Room) => {
      const collection = client.collection<Room>("rooms");
      await collection.updateOne({id}, {$set: room});
    },
    createRoom: async (name: string, password: string) => {
      const collection = client.collection<Room>("rooms");
      const id = crypto.randomUUID();
      await collection.insertOne({
        name,
        id,
        size: 13,
        startCells: [84],
        finishCells: [0, 12, 156, 168],
        password,
        users: [],
        cells: [],
        seed: Math.random(),
      });
      return id;
    },
  }
  return ctx.next();
}