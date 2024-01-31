import { Signal } from "@preact/signals";

interface SetupButtonProps {
  name: string;
  setup: Signal<string>;
  targetSetup: string;
}

export default function SetupButton(props: SetupButtonProps) {
  return (
    <button
      onClick={() => {
        props.setup.value = props.targetSetup;
      }}
      text-align="center"
      className="bg-neutral-200 text-black flex justify-center rounded-md w-min whitespace-nowrap p-0.2 m-0.5 self-end"
    >
      {props.name}
    </button>
  );
}
