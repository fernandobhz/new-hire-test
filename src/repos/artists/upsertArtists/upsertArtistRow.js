import db from "mssql";

export const upsertArtistRow = async ({ transaction, id, name, spotifyId }) => {
  let request = new db.Request(transaction);

  const {
    recordset: [existingRow],
  } = await request.query`
      select
        id
      from artists
      where id = ${id}
    `;

  if (existingRow) {
    const doesDatabaseNeedsToBeUpdated = name !== existingRow.name || spotifyId !== existingRow.spotifyId;

    if (doesDatabaseNeedsToBeUpdated) {
      request = new db.Request(transaction);

      await request.query`
        update artists set
          name = ${name}
          , spotifyId = ${spotifyId}
        where id = ${id} 
      `;
    }

    return existingRow.id;
  }

  request = new db.Request(transaction);

  return request.query`
    insert into artists (
      id
      , name
      , spotifyId
    ) values (
      ${id}
      , ${name}
      , ${spotifyId}
    );
  `;
};
