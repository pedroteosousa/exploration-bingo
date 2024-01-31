import { batch, Signal } from "@preact/signals";
import SetupButton from "./SetupButton.tsx";
import { Setup } from "./BingoCell.tsx";
import { Fragment } from "preact/jsx-runtime";
import { Room } from "../utils/types.ts";

interface CardSettingsProps {
  id: string;
  size: Signal<number>;
  seed: Signal<string>;
  setup: Signal<string>;
  startCells: Signal<number[]>;
  finishCells: Signal<number[]>;
  editing: Signal<boolean>;
  room: Room;
}

export default function CardSettings({
  id,
  size,
  seed,
  setup,
  startCells,
  finishCells,
  editing,
  room,
}: CardSettingsProps) {
  const saveChanges = () => {
    const numberSeed = seed.value === "" ? Math.random() : parseInt(seed.value);
    const body = JSON.stringify({
      startCells: startCells.value,
      finishCells: finishCells.value,
      size: size.value,
      seed: numberSeed,
      cells: [],
    });
    fetch(`/api/room/${id}/update`, { method: "POST", body }).then((res) => {
      console.log("update room status code:", res.status);
    });
    editing.value = false;
  };

  const cancelChanges = () => {
    size.value = room.size;
    seed.value = room.seed.toString();
    startCells.value = room.startCells;
    finishCells.value = room.finishCells;
    editing.value = false;
  };

  if (editing.value === false) {
    setup.value = Setup.Normal;
  } else {
    setup.value = Setup.Start;
    seed.value = "";
  }

  return (
    <div className="w-40 border border-solid border-1 border-neutral-600 m-1 h-min">
      <div className="bg-neutral-600 text-xl px-1">Edit Card</div>
      {editing.value === false
        ? (
          <button
            onClick={() => {
              editing.value = true;
            }}
          >
            Start Edit
          </button>
        )
        : (
          <Fragment>
            <div className="m-1 flex flex-col">
              Size
              <input
                type="number"
                className="text-black"
                name="size"
                min="5"
                max="14"
                value={size.value}
                onInput={(event) => {
                  let targetSize = parseInt(event.currentTarget.value) || 0;
                  targetSize = Math.min(Math.max(targetSize, 5), 14);
                  if (size.value !== targetSize) {
                    batch(() => {
                      size.value = targetSize;
                      startCells.value = [0];
                      finishCells.value = [size.value * size.value - 1];
                    });
                  }
                }}
              />
            </div>
            <div className="m-1 flex flex-col">
              Seed
              <input
                type="number"
                className="text-black"
                name="seed"
                onInput={(event) => {
                  seed.value = event.currentTarget.value;
                }}
              />
            </div>
            <SetupButton
              name="Set Start"
              setup={setup}
              targetSetup={Setup.Start}
            />
            <SetupButton
              name="Set Finish"
              setup={setup}
              targetSetup={Setup.Finish}
            />
            <button onClick={cancelChanges}>Cancel</button>
            <button onClick={saveChanges}>Save</button>
          </Fragment>
        )}
    </div>
  );
}
