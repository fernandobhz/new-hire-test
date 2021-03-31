/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// Note: When dealing with transaction each request must be send after the previous one has finished
import db from "mssql";
import { upsertReleasesArtists } from "./upsertReleasesArtists";
import { upsertReleaseRow } from "./upsertReleaseRow";
import { ExposableError } from "../../../core/exposableError";
import { ALL_SQL_EXPOSABLE_ERROR_NUMBERS } from "../../../core/constants";

export const upsert = async ({ title, releaseDate, trackCount, upc, label, type, artists }) => {
  const transaction = new db.Transaction();
  await transaction.begin();

  try {
    const releaseId = await upsertReleaseRow({ transaction, title, releaseDate, trackCount, upc, label, type });

    for (const artistId of artists) {
      await upsertReleasesArtists({ transaction, artistId, releaseId });
    }

    await transaction.commit();

    return releaseId;
  } catch (error) {
    await transaction.rollback().catch(() => {});

    if (ALL_SQL_EXPOSABLE_ERROR_NUMBERS.includes(error.number)) {
      throw new ExposableError(error.message, 400, error);
    } else {
      throw error;
    }
  }
};
