import { Signal } from "@preact/signals";
import BingoCell, { State, Type } from "./BingoCell.tsx";
import { Setup } from "./BingoCell.tsx";
import { useEffect } from "preact/hooks";
import { Cell, CellMarkedMessage, MessageTypes } from "../utils/types.ts";

function getPosition(size: number, i: number, j: number) {
  return i * size + j;
}

function getType(startCells: number[], finishCells: number[], pos: number) {
  if (startCells.includes(pos)) return Type.Start;
  if (finishCells.includes(pos)) return Type.Finish;
  return Type.Normal;
}

function getState(
  cells: Cell[],
  startCells: number[],
  pos: number,
  setup: string,
) {
  if (setup !== Setup.Normal) return State.Hidden;
  const cell = cells[pos];
  if (cell.colors.length !== 0) return State.Marked;
  if (startCells.includes(pos)) return State.Revealed;
  return State.Hidden;
}

interface BingoCardProps {
  id: string;
  size: Signal<number>;
  setup: Signal<string>;
  startCells: Signal<number[]>;
  finishCells: Signal<number[]>;
  cells: Cell[];
}

export default function BingoCard({
  id,
  size,
  setup,
  startCells,
  finishCells,
  cells,
}: BingoCardProps) {
  const cellsType = Array<string>(size.value * size.value);
  const cellsState = Array<string>(size.value * size.value);

  for (let i = 0; i < size.value * size.value; i++) {
    cellsType[i] = getType(startCells.value, finishCells.value, i);
    cellsState[i] = getState(cells, startCells.value, i, setup.value);
  }

  useEffect(() => {
    const events = new EventSource(`/api/room/${id}/connect`);
    events.onmessage = (e: MessageEvent) => {
      const msg = JSON.parse(e.data);
      if (msg.type === MessageTypes.CellMarked) {
        const data = msg as CellMarkedMessage;
        cellsState[data.position] = State.Marked;
      }
    };
  }, []);

  const markCell = (pos: number) => {
    if (cellsState[pos] === State.Marked) {
      const dir = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (let k = 0; k < dir.length; k++) {
        const x = pos % size.value + dir[k][0];
        const y = Math.floor(pos / size.value) + dir[k][1];
        if (x >= 0 && x < size.value && y >= 0 && y < size.value) {
          const pos2 = getPosition(size.value, x, y);
          if (cellsState[pos2] === State.Hidden) {
            cellsState[pos2] = State.Revealed;
          }
        }
      }
    }
  };

  const updateCell = (pos: number, type: string) => {
    if (startCells.value.indexOf(pos) !== -1) {
      startCells.value.splice(startCells.value.indexOf(pos), 1);
    }
    if (finishCells.value.indexOf(pos) !== -1) {
      finishCells.value.splice(finishCells.value.indexOf(pos), 1);
    }
    if (type === Type.Start) {
      startCells.value.push(pos);
    } else if (type === Type.Finish) {
      finishCells.value.push(pos);
    }
    startCells.value = [...startCells.value];
    finishCells.value = [...finishCells.value];
  };

  return (
    <table class="table-fixed border-separate">
      <tbody>
        {[...Array(size.value)].map((_, i) => (
          <tr>
            {[...Array(size.value)].map((_, j) => {
              const pos = getPosition(size.value, i, j);
              return (
                <BingoCell
                  type={cellsType[pos]}
                  state={cellsState[pos]}
                  setup={setup.value}
                  info={cells[pos]}
                  roomId={id}
                  position={pos}
                  updateCell={updateCell}
                />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
