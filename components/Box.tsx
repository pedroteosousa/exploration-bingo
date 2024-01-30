import { ComponentChildren } from "preact";

interface BoxProps {
  title: string;
  children: ComponentChildren
}

export default function Box(props: BoxProps) {
  return (
    <div className="w-96 border border-solid border-neutral-600 m-4 h-min">
      <div className="bg-neutral-600 text-xl px-2">{props.title}</div>
      {props.children}
    </div>
  );
}
