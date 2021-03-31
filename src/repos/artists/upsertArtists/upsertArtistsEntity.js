/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// Note: When dealing with transaction each request must be send after the previous one has finished
import db from "mssql";
import { upsertGenre } from "../../genres";
import { upsertArtistsGenres } from "./upsertArtistsGenres";
import { upsertArtistRow } from "./upsertArtistRow";
import { ExposableError } from "../../../core/exposableError";
import { ALL_SQL_EXPOSABLE_ERROR_NUMBERS } from "../../../core/constants";

export const upsert = async ({ id, name, spotifyId, genres }) => {
  const transaction = new db.Transaction();
  await transaction.begin();

  try {
    await upsertArtistRow({ transaction, id, name, spotifyId });

    for (const genre of genres) {
      const genreId = await upsertGenre({ transaction, genre });
      await upsertArtistsGenres({ transaction, artistId: id, genreId });
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback().catch(() => {});

    if (ALL_SQL_EXPOSABLE_ERROR_NUMBERS.includes(error.number)) {
      throw new ExposableError(error.message, 400, error);
    } else {
      throw error;
    }
  }
};
