import { MongoClient } from "mongodb";
import { FreshContext } from "$fresh/server.ts";
import { Room, User } from "../utils/types.ts";
import { crypto } from "std/crypto/crypto.ts";
import { generateBoard } from "../utils/board.ts";

export type WithDatabaseContext = FreshContext<{client: DatabaseClient}>;

export interface DatabaseClient {
  rooms(): Promise<Room[]>
  room(id: string): Promise<Room | undefined>
  createRoom(name: string, password: string, userId: string, username: string): Promise<string>
  joinRoom(id: string, username: string, userId: string, password: string): Promise<boolean>
  markCell(id: string, position: number, color: string): Promise<boolean>
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
    createRoom: async (name: string, password: string, userId: string, username: string) => {
      const collection = client.collection<Room>("rooms");
      const id = crypto.randomUUID();
      const size = 13;
      const seed = Math.random();
      const cells = generateBoard(size, seed);
      await collection.insertOne({
        name,
        id,
        size,
        startCells: [84],
        finishCells: [0, 12, 156, 168],
        password,
        users: [{
          name: username,
          id: userId,
          color: "green",
        }],
        cells,
        seed,
      });
      return id;
    },
    joinRoom: async (id: string, username: string, userId: string, password: string) => {
      const collection = client.collection<Room>("rooms");
      const user: User = {
        name: username,
        id: userId,
        color: "green",
      };
      const response = await collection.updateOne({id, password}, {$push: {users: user}});
      if (response.modifiedCount === 0) {
        return false;
      }
      return true;
    },
    markCell: async (id: string, position: number, color: string) => {
      const collection = client.collection<Room>("rooms");
      const result = await collection.updateOne({id}, {$push: {[`cells.${position}.colors`]: color}});
      return result.modifiedCount !== 0;
    },
  }
  return ctx.next();
}