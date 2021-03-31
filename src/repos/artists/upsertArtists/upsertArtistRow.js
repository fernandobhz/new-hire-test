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

  if (existingRow) return existingRow.id;

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
