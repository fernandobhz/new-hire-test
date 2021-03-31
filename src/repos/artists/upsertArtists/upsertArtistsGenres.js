import db from "mssql";

export const upsertArtistsGenres = async ({ transaction, artistId, genreId }) => {
  let request = new db.Request(transaction);

  const {
    recordset: [existingRow],
  } = await request.query`
      select
        id
      from artists_genres
      where artistId = ${artistId}
      and genreId = ${genreId} 
    `;

  if (existingRow) return { artistId, genreId };

  request = new db.Request(transaction);

  await request.query`
    insert into artists_genres(
      artistId
      , genreId
    ) values (
      ${artistId}
      , ${genreId}
    )
  `;

  return { artistId, genreId };
};
