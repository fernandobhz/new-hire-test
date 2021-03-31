/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import db from "mssql";
import { assignArtistToRelease } from "./assignArtistToRelease";
import { insertRelease } from "./insertRelease";
import { ExposableError } from "../../../core/exposableError";

export const post = async ({ title, releaseDate, trackCount, upc, label, type, artists }) => {
  const transaction = new db.Transaction();
  await transaction.begin();

  try {
    const releaseId = await insertRelease({ transaction, title, releaseDate, trackCount, upc, label, type });

    // Note: the sql.Request must be executed after the previous one has been finished.
    for (const artistId of artists) {
      await assignArtistToRelease({ transaction, artistId, releaseId });
    }

    await transaction.commit();

    return releaseId;
  } catch (error) {
    if (error.number === 2627) throw new ExposableError(error.message, 400, error);
    else throw error;
  }
};
