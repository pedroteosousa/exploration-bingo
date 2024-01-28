import { withDatabase } from "../clients/withDatabase.ts";

export const handler = [
  withDatabase,
];