import { Signal } from "@preact/signals";
import { Setup } from "./BingoCell.tsx";

interface SetupButtonProps {
    name: string;
    setup: Signal<string>;
    targetSetup: string;

  }
  
  export default function SetupButton(props: SetupButtonProps) {
    return (
      <button onClick={() => {props.setup.value = props.targetSetup}}>
        {props.name}
      </button>
    );
  }
  