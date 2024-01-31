import { generateBoard } from "../utils/board.ts";
import { Room } from "../utils/types.ts";

interface NewCardButtonProps {
  name: string;
  size: number;
  seed: number;
  room: Room;
}

export default function NewCardButton(props: NewCardButtonProps) {
  if (props.seed === null) props.seed = Math.random();
  return (
    <button
      onClick={() => {
        generateBoard(props.size, props.seed);
      }}
    >
      Generate Card
    </button>
  );
}
