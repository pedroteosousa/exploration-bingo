import type { Signal } from "@preact/signals";
import { Cell } from "../utils/types.ts";

export const State = {
  Hidden: "hidden",
  Revealed: "revealed",
  Focused: "focused",
  Marked: "marked",
};

export const Type = {
  Normal: "normal",
  Start: "start",
  Finish: "finish",
};

export const Setup = {
  Normal: "normal",
  Start: "start",
  Finish: "finish",
};

function toggleStart(type: string) {
  if (type === Type.Start) return Type.Normal;
  return Type.Start;
}

function toggleFinish(type: string) {
  if (type === Type.Finish) return Type.Normal;
  return Type.Finish;
}

function getColorClass(type: string, state: string) {
  let classes = "";
  if (type == Type.Start) classes += "border-indigo-900 ";
  else if (type == Type.Finish) classes += "border-amber-500 ";
  else classes += "border-stone-800 ";

  if (state === State.Marked) classes += "bg-green-900 ";

  return classes;
}

function getTypeText(type: string) {
  if (type === Type.Start) return "Start";
  if (type === Type.Finish) return "Finish";
  return "";
}

function handleClick(
  setup: string,
  type: string,
  state: string,
  roomId: string,
  position: number,
  updateCell: (pos: number, type: string) => void,
) {
  if (setup == Setup.Start) {
    updateCell(position, toggleStart(type));
  } else if (setup == Setup.Finish) {
    updateCell(position, toggleFinish(type));
  } else {
    if (state === State.Marked) {
      // TODO: Unmark cell
    } else if (state !== State.Hidden && state !== State.Marked) {
      const body = JSON.stringify({ position });
      fetch(`/api/room/${roomId}/select`, { method: "POST", body })
    }
  }
}

interface BingoCellProps {
  type: string;
  state: string;
  info: Cell;
  setup: string;
  roomId: string;
  position: number;
  updateCell: (pos: number, type: string) => void;
}

export default function BingoCell({
  type,
  state,
  info,
  setup,
  roomId,
  position,
  updateCell,
}: BingoCellProps) {
  return (
    <td
      onClick={() =>
        handleClick(setup, type, state, roomId, position, updateCell)}
      className={`${
        getColorClass(type, state)
      } text-xs leading-3 text-center min-w-24 w-24 h-24 border border-4 border-solid overflow-hidden text-ellipsis`}
    >
      {setup !== Setup.Normal
        ? getTypeText(type)
        : (state === State.Hidden ? "" : info.text)}
    </td>
  );
}
