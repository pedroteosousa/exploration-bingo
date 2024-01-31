import { batch, Signal } from "@preact/signals";
import { Fragment } from "preact/jsx-runtime";
import { Setup } from "./BingoCell.tsx";
import Box from "../components/Box.tsx";
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
    batch(() => {
      size.value = room.size;
      seed.value = "";
      startCells.value = room.startCells;
      finishCells.value = room.finishCells;
      editing.value = false;
    })
  };

  if (editing.value === false) {
    setup.value = Setup.Normal;
  } else if (setup.value === Setup.Normal) {
    setup.value = Setup.Start;
  }

  return (
    <Box title="Edit Card">
      {editing.value === false
        ? (
          <div className="flex justify-center m-2">
            <button
                  className="bg-neutral-200 text-black rounded-md whitespace-nowrap p-1 m-1 self-end w-36"
              onClick={() => {
                editing.value = true;
              }}
            >
              Start Editing
            </button>
          </div>
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
                placeholder="Leave blank for random seed"
                onInput={(event) => {
                  seed.value = event.currentTarget.value;
                }}
              />
            </div>
            <div className="flex justify-around m-1">
              <button
                onClick={() => {
                  setup.value = Setup.Start;
                }}
                text-align="center"
                className={`flex justify-center rounded-md whitespace-nowrap p-1 m-1 self-end w-36 ${setup.value === Setup.Start ? "bg-blue-700 text-white" : "bg-neutral-200 text-black"}`}
              >
                {setup.value === Setup.Start ? "Editing Start Cells" : "Edit Start Cells"}
              </button>
              <button
                onClick={() => {
                  setup.value = Setup.Finish;
                }}
                text-align="center"
                className={`flex justify-center rounded-md whitespace-nowrap p-1 m-1 self-end w-36 ${setup.value === Setup.Finish ? "bg-blue-700 text-white" : "bg-neutral-200 text-black"}`}
              >
                {setup.value === Setup.Finish ? "Editing Finish Cells" : "Edit Finish Cells"}
              </button>
            </div>
            <div className="flex justify-around m-1">
            <button
                className="bg-red-700 text-white flex justify-center rounded-md whitespace-nowrap p-1 m-1 self-end w-36"
             onClick={cancelChanges}>Cancel</button>
            <button
                className="bg-green-700 text-white flex justify-center rounded-md whitespace-nowrap p-1 m-1 self-end w-36"
            onClick={saveChanges}>Save</button>
            </div>
          </Fragment>
        )}
    </Box>
  );
}
