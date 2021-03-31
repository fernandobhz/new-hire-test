import db from "mssql";
import { upsertGenre } from "./upsertGenre";
import { assignGenreToArtist } from "./assignGenreToArtist";
import { insertArtist } from "./insertArtist";

export const post = async (req, res) => {
  const { id, name, spotifyId, genres } = req.body;

  const transaction = new db.Transaction();
  await transaction.begin();

  try {
    await insertArtist({ transaction, id, name, spotifyId });

    for (genre of genres) {
      const genreId = await upsertGenre({ transaction, genre });
      await assignGenreToArtist({ transaction, artistId: id, genreId });
    }

    transaction.commit();
  } catch (error) {
    transaction.rollback();
    throw error;
  }

  res.json({ id, name, spotifyId, genres });
};
