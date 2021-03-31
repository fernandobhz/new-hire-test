/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import db from "mssql";
import { upsertGenre } from "./upsertGenre";
import { assignGenreToArtist } from "./assignGenreToArtist";
import { insertArtist } from "./insertArtist";
import { ExposableError } from "../../../core/exposableError";

export const post = async ({ id, name, spotifyId, genres }) => {
  const transaction = new db.Transaction();
  await transaction.begin();

  try {
    await insertArtist({ transaction, id, name, spotifyId });

    // Note: the sql.Request must be executed after the previous one has been finished.
    for (const genre of genres) {
      const genreId = await upsertGenre({ transaction, genre });
      await assignGenreToArtist({ transaction, artistId: id, genreId });
    }

    transaction.commit();
  } catch (error) {
    transaction.rollback();

    if (error.number === 2627) throw new ExposableError(error.message, 400, error);
    else throw error;
  }
};
