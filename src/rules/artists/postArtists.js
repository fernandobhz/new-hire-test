/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// Note: When dealing with transaction each request must be send after the previous one has finished
import { artists } from "../../repos";

export const postOne = async ({ id, name, spotifyId, genres }) => artists.upsert({ id, name, spotifyId, genres });

export const postRows = async rows => {
  for (const row of rows) {
    await postOne(row);
  }
};
