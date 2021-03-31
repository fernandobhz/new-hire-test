/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// Note: When dealing with transaction each request must be send after the previous one has finished
import { labels } from "../../repos";

export const postOne = async ({ id, name, distributor, region }) => labels.upsert({ id, name, distributor, region });

export const postRows = async rows => {
  for (const row of rows) {
    await postOne(row);
  }
};
