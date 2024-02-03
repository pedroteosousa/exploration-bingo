import { Signal, batch } from "@preact/signals";
import BingoCell, { State, Type } from "./BingoCell.tsx";
import { Setup } from "./BingoCell.tsx";
import { useEffect, useState } from "preact/hooks";
import { Cell, CellMarkedMessage, NewCardMessage, MessageTypes } from "../utils/types.ts";

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
) {
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
  cells: Signal<Cell[]>;
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
  const [cellsState, setCellsState] = useState(Array<string>(size.value * size.value));
  const [events, setEvents] = useState<EventSource | null>(null);

  const revealAdjacency = (position: number) => {
    if (cellsState[position] === State.Marked) {
      const dir = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (let k = 0; k < dir.length; k++) {
        const x = Math.floor(position / size.value) + dir[k][0];
        const y = position % size.value + dir[k][1];
        if (x >= 0 && x < size.value && y >= 0 && y < size.value) {
          const pos2 = getPosition(size.value, x, y);
          if (cellsState[pos2] === State.Hidden) {
            cellsState[pos2] = State.Revealed;
            setCellsState([...cellsState]);
          }
        }
      }
    }
  }

  for (let i = 0; i < size.value * size.value; i++) {
    if (setup.value === Setup.Normal)
      cellsState[i] = cellsState[i] ?? getState(cells.value, startCells.value, i);
    cellsType[i] = getType(startCells.value, finishCells.value, i);
  }
  for (let i = 0; i < size.value * size.value; i++) {
    revealAdjacency(i);
  }

  useEffect(() => {
    if (!events || events.readyState === EventSource.CLOSED) {
      const events = new EventSource(`/api/room/${id}/connect`);
      setEvents(events);
    }
  }, [events?.readyState]);

  if (events) {
    events.onmessage = (e: MessageEvent) => {
      const msg = JSON.parse(e.data);
      if (msg.type === MessageTypes.CellMarked) {
        const data = msg as CellMarkedMessage;
        cellsState[data.position] = State.Marked;
        revealAdjacency(data.position);
        setCellsState([...cellsState]);
      } else if (msg.type === MessageTypes.NewCard) {
        const room = (msg as NewCardMessage).room;
        const newCellsState = Array<string>(room.size * room.size);
        for (let i = 0; i < room.size * room.size; i++) {
          newCellsState[i] = getState(room.cells, room.startCells, i);
        }
        batch(() => {
          setCellsState(newCellsState);
          size.value = room.size;
          startCells.value = room.startCells;
          finishCells.value = room.finishCells;
          cells.value = room.cells;
        })
      }
    };
    events.onerror = (error) => {
      console.error(`event source error: ${error}`);
    }
  }

  const updateCell = (pos: number, type: string) => {
    const newStartCells = [...startCells.value];
    const newFinishCells = [...finishCells.value];
    if (newStartCells.indexOf(pos) !== -1) {
      newStartCells.splice(newStartCells.indexOf(pos), 1);
    }
    if (newFinishCells.indexOf(pos) !== -1) {
      newFinishCells.splice(newFinishCells.indexOf(pos), 1);
    }
    if (type === Type.Start) {
      newStartCells.push(pos);
    } else if (type === Type.Finish) {
      newFinishCells.push(pos);
    }
    startCells.value = [...newStartCells];
    finishCells.value = [...newFinishCells];
  };

  return (
    <table class="table-fixed border-separate border-spacing-0 mx-auto">
      <tbody>
        {[...Array(size.value)].map((_, i) => (
          <tr>
            {[...Array(size.value)].map((_, j) => {
              const pos = getPosition(size.value, i, j);
              return (
                <BingoCell
                  type={cellsType[pos]}
                  state={setup.value !== Setup.Normal ? State.Hidden : cellsState[pos]}
                  setup={setup.value}
                  info={cells.value[pos]}
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
