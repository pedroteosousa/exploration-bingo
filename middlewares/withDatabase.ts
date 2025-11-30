import { FreshContext } from "$fresh/server.ts";
import { crypto } from "std/crypto/crypto.ts";
import { Room } from "../utils/types.ts";
import { generateBoard } from "../utils/board.ts";
import { createClient } from "npm:@supabase/supabase-js@2.77.0";
import { Database } from "../utils/supabase.types.ts"

export type WithDatabaseContext = FreshContext<{ client: DatabaseClient }>;

function getPosition(size: number, i: number, j: number) {
  return i * size + j;
}

const getAdjacent = (position: number, size: number) => {
  const positions = []
  const dir = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (let k = 0; k < dir.length; k++) {
    const x = Math.floor(position / size) + dir[k][0];
    const y = position % size + dir[k][1];
    if (x >= 0 && x < size && y >= 0 && y < size) {
      const pos = getPosition(size, x, y);
      positions.push(pos)
    }
  }
  return positions
}

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

export default function withDatabase(_: Request, ctx: WithDatabaseContext) {
  const supabase = createClient<Database, 'public'>(
      "https://bwqgcpmtjjpdocrieixv.supabase.co",
      Deno.env.get("SUPABASE_SECRET_KEY") ?? "",
  );
  ctx.state.client = {
    rooms: async () => {
      const { data, error } = await supabase.from("rooms").select("id, name, size, start_cells, finish_cells, seed, users: room_user(id, username, color), cells(visible, name, marked)")
      if (error) throw error
      return data.map<Room>(d => ({
        id: d.id,
        name: d.name,
        size: d.size,
        startCells: d.start_cells,
        finishCells: d.finish_cells,
        users: d.users.map(u => ({
          id: u.id,
          name: u.username ?? "ANON",
          color: u.color ?? "green",
        })),
        seed: d.seed,
        cells: d.cells.map(c => ({
          text: c.visible ? c.name ?? "" : "",
          colors: c.marked ? ["green"] : [],
        })),
      }))
    },
    room: async (id: string) => {
      const { data: d, error } = await supabase.from("rooms").select("id, name, size, start_cells, finish_cells, seed, users: room_user(id, username, color), cells(visible, marked, name, position)").eq("id", id).maybeSingle()
      if (error) throw error
      if (!d) throw new Error("room not found")
      return {
        id: d.id,
        name: d.name,
        size: d.size,
        startCells: d.start_cells,
        finishCells: d.finish_cells,
        users: d.users.map(u => ({
          id: u.id,
          name: u.username ?? "ANON",
          color: u.color ?? "green",
        })),
        cells: d.cells.sort((a, b) => (a.position ?? 0) - (b.position ?? 0)).map(c => ({
          text: c.visible ? c.name ?? "" : "",
          colors: c.marked ? ["green"] : [],
        })),
        seed: d.seed,
      }
    },
    createRoom: async (
      name: string,
      password: string,
      userId: string,
      username: string,
    ) => {
      const id = crypto.randomUUID();
      const seed = Math.random();
      const size = 7
      const start_cells = [24]
      const finish_cells = [0, 6, 42, 48]
      const { error } = await supabase.from("rooms").insert({
        id,
        name,
        seed,
        start_cells,
        finish_cells,
      })
      if (error) throw error
      const { error: setPasswordError } = await supabase.from("room_secret").insert({
        room_id: id,
        password,
      })
      if (setPasswordError) throw setPasswordError
      const { error: userError } = await supabase.from("room_user").insert({
        id: userId,
        username,
        color: "green",
        room_id: id,
      })
      if (userError) throw userError
      const cells = generateBoard(size, seed);
      await Promise.all(
        cells.map((c, index) => {
          return supabase.from("cells").insert({
            name: c.text,
            position: index,
            visible: start_cells.includes(index),
            room_id: id,
          })
        })
      )
      return id;
    },
    joinRoom: async (
      id: string,
      username: string,
      userId: string,
      password: string,
    ) => {
      const { data: roomSecret, error: roomError } = await supabase.from("room_secret").select("password").eq("room_id", id).maybeSingle()
      if (roomError) return false
      if (password != roomSecret?.password) return false
      const { error } = await supabase.from("room_user").insert({
        id: userId,
        username,
        color: "green",
        room_id: id,
      })
      if (error) return false
      return true;
    },
    markCell: async (id: string, position: number, _color: string) => {
      const { data: roomData, error: roomError } = await supabase.from("rooms").select("size").eq("id", id).maybeSingle()
      if (roomError) return false
      const { data: cellData, error: fetchCellError } = await supabase.from("cells").select("marked, visible").eq("room_id", id).eq("position", position).maybeSingle()
      if (fetchCellError) return false
      if (cellData?.marked) return true
      if (!cellData?.visible) return false
      const { error } = await supabase.from("cells").update({
        marked: true
      }).eq("room_id", id).eq("position", position)
      if (error) return false
      const positions = getAdjacent(position, roomData?.size ?? 0)
      await Promise.all(
        positions.map(p => {
          return supabase.from("cells").update({
            visible: true
          }).eq("room_id", id).eq("position", p)
        })
      )
      return true
    },
    updateRoom: async (id: string, fields: Partial<Room>) => {
      const { data: roomData, error: roomError } = await supabase.from("rooms").select("size, seed, start_cells, finish_cells").eq("id", id).maybeSingle()
      if (roomError || !roomData) return false
      const size = fields.size ?? roomData.size
      const seed = fields.seed ?? roomData.seed
      const startCells = fields.startCells ?? roomData.start_cells
      const finishCells = fields.finishCells ?? roomData.finish_cells
      if (!fields.cells || fields.cells?.length === 0) {
        fields.cells = generateBoard(size, seed);
      }
      const { error } = await supabase.from("rooms").update({
        size,
        seed,
        start_cells: startCells,
        finish_cells: finishCells,
      }).eq("id", id)
      if (error) return false
      const { error: deleteCellError } = await supabase.from("cells").delete().eq("room_id", id)
      if (deleteCellError) return false
      await Promise.all(
        fields.cells.map((c, index) => {
          return supabase.from("cells").insert({
            name: c.text,
            position: index,
            visible: startCells.includes(index),
            room_id: id,
          })
        })
      )
      return true
    },
  };
  return ctx.next();
}
