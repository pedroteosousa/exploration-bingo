import { Signal, useSignal, useSignalEffect } from "@preact/signals";
import BingoCell, { Type, State } from "./BingoCell.tsx";
import { generateBoard } from "../utils/board.ts";
import { Room } from "../utils/types.ts";

function getPosition(size: number, i: number, j: number) {
  return i * size + j;
}

function getType(room: Room, pos: number) {
  if (room.startCells.includes(pos)) return Type.Start;
  if (room.finishCells.includes(pos)) return Type.End;
  return Type.Normal;
}

interface BingoCardProps {
  room: Room,
}

export default function BingoCard(props: BingoCardProps) {
  const size = useSignal(props.room.size);
  const cells = generateBoard(size.value, props.room.seed);
  const cellsType = Array<Signal<string>>(size.value * size.value);
  const cellsState = Array<Signal<string>>(size.value * size.value);

  for (let i = 0; i < size.value * size.value; i++) {
    cellsType[i] = useSignal(getType(props.room, i));
    cellsState[i] = useSignal(props.room.startCells.includes(i) ? State.Revealed : State.Hidden);
  }

  useSignalEffect(() => {
    for (let i = 0; i < size.value; i++) {
      for (let j = 0; j < size.value; j++) {
        const pos = getPosition(size.value, i, j);
        if (cellsState[pos].value === State.Marked) {
          const dir = [[-1, 0], [1, 0], [0, -1], [0, 1]];
          for (let k = 0; k < dir.length; k++) {
            const x = i + dir[k][0];
            const y = j + dir[k][1];
            if (x >= 0 && x < size.value && y >= 0 && y < size.value) {
              const pos2 = getPosition(size.value, x, y);
              if (cellsState[pos2].value === State.Hidden) {
                cellsState[pos2].value = State.Revealed;
              }
            }
          }
        }
      }
    }
  });

  return (
    <table class="table-fixed border-separate">
      <tbody>
        {
          [...Array(size.value)].map((_, i) => (
            <tr>
              {
                [...Array(size.value)].map((_, j) => {
                  const pos = getPosition(size.value, i, j);
                  return (
                    <BingoCell type={cellsType[pos]} state={cellsState[pos]} setup={false} info={cells[pos]}/>
                  )
                })
              }
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}
