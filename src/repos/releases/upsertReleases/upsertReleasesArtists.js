import db from "mssql";

export const upsertReleasesArtists = async ({ transaction, artistId, releaseId }) => {
  let request = new db.Request(transaction);

  const {
    recordset: [existingRow],
  } = await request.query`
      select
        id
      from releases_artists
      where artistId = ${artistId}
      and releaseId = ${releaseId} 
    `;

  if (existingRow) return { artistId, releaseId };

  request = new db.Request(transaction);

  return request.query`
    insert into releases_artists(
      artistId
      , releaseId
    ) values(
      ${artistId}
      , ${releaseId}
    )
  `;
};
