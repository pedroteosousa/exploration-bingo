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
}

export type CellMarkedMessage = {
  type: string;
  position: number;
  color: string;
}

export type ChannelMessage = CellMarkedMessage;
