import { MongoClient } from "mongodb";
import { FreshContext } from "$fresh/server.ts";
import { crypto } from "std/crypto/crypto.ts";
import { Room, User, MessageTypes } from "../utils/types.ts";
import { generateBoard } from "../utils/board.ts";

export type WithDatabaseContext = FreshContext<{ client: DatabaseClient }>;

export interface DatabaseClient {
  rooms(): Promise<Room[]>;
  room(id: string): Promise<Room | undefined>;
  createRoom(
    name: string,
    password: string,
    userId: string,
    username: string,
  ): Promise<string>;
  updateRoom(id: string, fields: Partial<Room>): Promise<boolean>;
  joinRoom(
    id: string,
    username: string,
    userId: string,
    password: string,
  ): Promise<boolean>;
  markCell(id: string, position: number, color: string): Promise<boolean>;
}

export async function getDatabaseClient() {
  const client = new MongoClient();
  await client.connect(
    Deno.env.get("MONGODB_URI") ?? "",
  );
  return client.database(Deno.env.get("MONGODB_DB_NAME") ?? "");
}

export default async function withDatabase(_: Request, ctx: WithDatabaseContext) {
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
      return await collection.findOne({ id });
    },
    createRoom: async (
      name: string,
      password: string,
      userId: string,
      username: string,
    ) => {
      const collection = client.collection<Room>("rooms");
      const id = crypto.randomUUID();
      const size = 14;
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
    joinRoom: async (
      id: string,
      username: string,
      userId: string,
      password: string,
    ) => {
      const collection = client.collection<Room>("rooms");
      const user: User = {
        name: username,
        id: userId,
        color: "green",
      };
      const response = await collection.updateOne({ id, password }, {
        $push: { users: user },
      });
      if (response.modifiedCount === 0) {
        return false;
      }
      return true;
    },
    markCell: async (id: string, position: number, color: string) => {
      const collection = client.collection<Room>("rooms");
      const result = await collection.updateOne({id}, {$push: {[`cells.${position}.colors`]: color}});
      const success = result.modifiedCount !== 0;
      if (success) {
        const channel = new BroadcastChannel(`room:${id}`);
        channel.postMessage({type: MessageTypes.CellMarked, position, color});
        channel.close();
      }
      return success;
    },
    updateRoom: async (id: string, fields: Partial<Room>) => {
      const collection = client.collection<Room>("rooms");
      const oldRoom = await client.collection<Room>("rooms").findOne({ id });
      if (oldRoom === undefined) {
        return false;
      }
      if (fields.cells?.length === 0) {
        fields.cells = generateBoard(
          fields.size ?? oldRoom.size,
          fields.seed ?? oldRoom.seed,
        );
      }
      const result = await collection.updateOne({ id }, { $set: fields });
      const success = result.modifiedCount !== 0;
      if (success) {
        const newRoom = await client.collection<Room>("rooms").findOne({ id });
        const channel = new BroadcastChannel(`room:${id}`);
        channel.postMessage({type: MessageTypes.NewCard, room: {
          ...newRoom,
          password: undefined,
        }});
        channel.close();
      }
      return success;
    },
  };
  return ctx.next();
}
