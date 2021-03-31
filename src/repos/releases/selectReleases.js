import db from "mssql";

export const select = async () => {
  const { recordset: releases } = await db.query`
      select
        r.id
        , r.title
        , r.releaseDate
        , r.trackCount
        , r.upc
        , l.name as label
        , t.name as type
      from releases as r
      join labels as l on l.id = r.labelId
      join types as t on t.id = r.typeId
    `;

  const releasesWithArtists = await Promise.all(
    releases.map(async release => {
      const { recordset: artists } = await db.query`
            select
              a.name
            from artists as a
            join releases_artists as ra on ra.artistId = a.id
            and ra.releaseId = ${release.id}      
          `;

      return {
        ...release,
        artists: artists.map(artist => artist.name),
      };
    })
  );

  return releasesWithArtists;
};
