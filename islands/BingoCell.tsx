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

function nextType(type: string) {
  if (type == Type.Normal) return Type.Start;
  if (type == Type.Start) return Type.End;
  return Type.Normal;
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

function handleClick(setup: boolean, type: Signal<string>, state: Signal<string>, roomId: string, position: number) {
  if (setup) {
    type.value = nextType(type.value);
  } else {
    if (state.value !== State.Hidden && state.value !== State.Marked) {
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
  setup: boolean;
  roomId: string;
  position: number;
}

export default function BingoCell({
  type,
  state,
  info,
  setup,
  roomId,
  position,
}: BingoCellProps) {
  return (
    <td onClick={() => handleClick(setup, type, state, roomId, position)} className={`${getColorClass(type.value, state.value)} text-xs leading-3 text-center min-w-24 w-24 h-24 border border-2 border-solid overflow-hidden text-ellipsis`}>
      {setup ? getTypeText(type.value) : (state.value === State.Hidden ? "" : info.text)}
    </td>
  );
}
