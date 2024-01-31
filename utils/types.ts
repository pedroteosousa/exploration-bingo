export interface Cell {
  colors: string[];
  text: string;
}

export interface User {
  name: string;
  id: string;
  color: string;
}

export interface Room {
  name: string;
  id: string;
  size: number;
  startCells: number[];
  finishCells: number[];
  password: string;
  users: User[];
  cells: Cell[];
  seed: number;
}

export const MessageTypes = {
  CellMarked: "cell-marked",
  NewCard: "new-card",
  Room: "room",
}

export type CellMarkedMessage = {
  type: string;
  position: number;
  color: string;
}

export type NewCardMessage = {
  type: string;
  room: Room;
}

export type RoomMessage = {
  type: string;
  room: Room;
}