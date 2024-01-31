import withDatabase from "../middlewares/withDatabase.ts";
import withSessionId from "../middlewares/withSessionId.ts";

export const handler = [
  withSessionId,
  withDatabase,
];
