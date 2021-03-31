import db from "mssql";

export const get = async () => {
  const { recordset: artists } = await db.query`
        select
          id
          , name
          , spotifyId      
        from artists as a
      `;

  const artistsWithGenres = await Promise.all(
    artists.map(async (artist) => {
      const { recordset: genres } = await db.query`
          select
            g.name
          from genres as g 
          join artists_genres as ag on ag.genreId = g.id
          and ag.artistId = ${artist.id}      
        `;

      return {
        ...artist,
        genres: genres.map((genre) => genre.name),
      };
    })
  );

  return artistsWithGenres;
};
