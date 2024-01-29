// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $api_room_id_select from "./routes/api/room/[id]/select.ts";
import * as $api_room_create from "./routes/api/room/create.ts";
import * as $index from "./routes/index.tsx";
import * as $room_id_ from "./routes/room/[id].tsx";
import * as $BingoCard from "./islands/BingoCard.tsx";
import * as $BingoCell from "./islands/BingoCell.tsx";
import * as $RoomButton from "./islands/RoomButton.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/_middleware.ts": $_middleware,
    "./routes/api/room/[id]/select.ts": $api_room_id_select,
    "./routes/api/room/create.ts": $api_room_create,
    "./routes/index.tsx": $index,
    "./routes/room/[id].tsx": $room_id_,
  },
  islands: {
    "./islands/BingoCard.tsx": $BingoCard,
    "./islands/BingoCell.tsx": $BingoCell,
    "./islands/RoomButton.tsx": $RoomButton,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
