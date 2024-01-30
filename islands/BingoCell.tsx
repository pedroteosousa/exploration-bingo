import type { Signal } from "@preact/signals";
import { Cell } from "../utils/types.ts";

export const State = {
	Hidden: "hidden",
	Revealed: "revealed",
  Focused: "focused",
	Marked: "marked",
}

export const Type = {
  Normal: "normal",
  Start: "start",
  End: "end",
}

export const Setup = {
  Normal: "normal",
  Start: "start",
  Finish: "finish",
}

function toggleStart(type: string) {
  if (type === Type.Start) return Type.Normal;
  return Type.Start;
}

function toggleFinish(type: string) {
  if (type === Type.End) return Type.Normal;
  return Type.End;
}

function getColorClass(type: string, state: string) {
  let classes = "";
  if (type == Type.Start) classes += "border-indigo-900 ";
  else if (type == Type.End) classes += "border-amber-500 ";
  else classes +=  "border-stone-900 ";

  if (state === State.Marked) classes += "bg-green-900 ";

  return classes;
}

function getTypeText(type: string) {
  if (type === Type.Start) return "Start";
  if (type === Type.End) return "End";
  return "";
}

function handleClick(setup: string, type: Signal<string>, state: Signal<string>, roomId: string, position: number, updateCell: (pos: number, type: string) => void) {
  if (setup == Setup.Start) {
    type.value = toggleStart(type.value);
    updateCell(position, type.value);
  } else if (setup == Setup.Finish) {
    type.value = toggleFinish(type.value);
    updateCell(position, type.value);
  } else {
    if (state.value === State.Marked) {
      state.value 
    } else if (state.value !== State.Hidden && state.value !== State.Marked) {
      const body = JSON.stringify({ position });
      fetch(`/api/room/${roomId}/select`, { method: "POST", body }).then(res => {
        if (res.status === 200) {
          state.value = State.Marked;
        }
      })
    }
  }
}

interface BingoCellProps {
  type: Signal<string>;
  state: Signal<string>;
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
    <td onClick={() => handleClick(setup, type, state, roomId, position, updateCell)} className={`${getColorClass(type.value, state.value)} text-xs leading-3 text-center min-w-24 w-24 h-24 border border-2 border-solid overflow-hidden text-ellipsis`}>
      {setup ? getTypeText(type.value) : (state.value === State.Hidden ? "" : info.text)}
    </td>
  );
}
