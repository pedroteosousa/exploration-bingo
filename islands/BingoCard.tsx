import { Signal, useSignal, useSignalEffect } from "@preact/signals";
import BingoCell, { Type, State } from "./BingoCell.tsx";
import { generateBoard } from "../utils/board.ts";
import { Room } from "../utils/types.ts";

function getPosition(size: number, i: number, j: number) {
  return i * size + j;
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
    cellsType[i] = useSignal(Type.Normal);
    cellsState[i] = useSignal(State.Hidden);
  }
  const corners = [[0, 0], [size.value - 1, 0], [0, size.value - 1], [size.value - 1, size.value - 1]];
  for (let i = 0; i < corners.length; i++) {
    cellsType[getPosition(size.value, corners[i][0], corners[i][1])] = useSignal(Type.End);
  }
  cellsType[getPosition(size.value, Math.floor(size.value / 2), Math.floor(size.value / 2))] = useSignal(Type.Start);
  cellsState[getPosition(size.value, Math.floor(size.value / 2), Math.floor(size.value / 2))] = useSignal(State.Revealed);


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
