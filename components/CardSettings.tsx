import { ComponentChildren } from "preact";

interface CardSettingsProps {
  title: string;
  children: ComponentChildren
}

export default function CardSettings(props: CardSettingsProps) {
  return (
    <div className="w-40 border border-solid border-1 border-neutral-600 m-1 h-min">
      <div className="bg-neutral-600 text-xl px-1">{props.title}</div>
      <div type="number" min="0">
      {props.children}

      </div>
    </div>
  );
}
