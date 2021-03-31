import db from "mssql";

export const upsertGenre = async ({ transaction, genre }) => {
  let request = new db.Request(transaction);

  const {
    recordset: [existingRow],
  } = await request.query`
      select
        id
      from genres
      where name = ${genre}
    `;

  if (existingRow) return existingRow.id;

  request = new db.Request(transaction);

  const {
    recordset: [{ newid }],
  } = await request.query`
      insert into genres(name)
      values (${genre});

      select scope_identity() as newid
    `;

  return newid;
};
