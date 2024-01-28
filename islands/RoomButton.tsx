interface RoomButtonProps {
  name: string;
  id: string;
}

export default function RoomList(props: RoomButtonProps) {
  return (
    <div onClick={() => window.location.href = `/room/${props.id}`}>
      {props.name}
    </div>
  );
}
