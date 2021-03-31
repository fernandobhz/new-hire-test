/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// Note: When dealing with transaction each request must be send after the previous one has finished
import { releases } from "../../repos";

export const postOne = async ({ title, releaseDate, trackCount, upc, label, type, artists }) =>
  releases.upsert({ title, releaseDate, trackCount, upc, label, type, artists });

export const postRows = async rows => {
  for (const row of rows) {
    await postOne({
      ...row,
      releaseDate: row.releaseDate || row.release_date || row["release-date"],
      trackCount: row.trackCount || row.track_count || row["track-count"],
    });
  }
};
