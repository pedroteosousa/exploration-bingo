import { Signal, batch } from "@preact/signals";
import BingoCell, { State, Type } from "./BingoCell.tsx";
import { Setup } from "./BingoCell.tsx";
import { useEffect, useState } from "preact/hooks";
import { Cell } from "../utils/types.ts";
import { supabase } from "../utils/supabase.ts"

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
  pos: number,
) {
  const cell = cells[pos];
  if (cell.colors.length !== 0) return State.Marked;
  if (cell.text !== "") return State.Revealed;
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

  useEffect(() => {
    const receivedCell = (name: string, marked: boolean, position: number) => {
      batch(() => {
        cells.value[position].text = name
        cells.value[position].colors = marked ? ["green"] : []
        if (marked) {
          cellsState[position] = State.Marked
          setCellsState([...cellsState])
        } else {
          cellsState[position] = State.Revealed
          setCellsState([...cellsState])
        }
      })
    }

    const subscriptionCells = supabase
      .channel(`cells:${id}`)
      .on<{marked: boolean, position: number, name: string}>(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "cells",
          filter: `room_id=eq.${id}`,
        },
        (payload) => {
          receivedCell(payload.new.name, payload.new.marked, payload.new.position)
        }
      )
      .subscribe();
    const subscriptionRoom = supabase
      .channel(`room:${id}`)
      .on<{size: number, start_cells: number[], finish_cells: number[]}>(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          batch(() => {
            size.value = payload.new.size
            startCells.value = payload.new.start_cells
            finishCells.value = payload.new.finish_cells
            cells.value = new Array(size.value * size.value).fill(null).map(() => ({ text: "", colors: [] }));
            setCellsState(new Array(size.value * size.value).fill(null).map(() => (State.Hidden)))
          })
        }
      )
      .subscribe();
      return () => {
        subscriptionCells.unsubscribe()
        subscriptionRoom.unsubscribe()
      }
  }, [id])

  for (let i = 0; i < size.value * size.value; i++) {
    if (setup.value === Setup.Normal)
      cellsState[i] = cellsState[i] ?? getState(cells.value, i);
    cellsType[i] = getType(startCells.value, finishCells.value, i);
  }

  useEffect(() => {
    if (!events || events.readyState === EventSource.CLOSED) {
      const events = new EventSource(`/api/room/${id}/connect`);
      setEvents(events);
    }
  }, [events?.readyState]);

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
