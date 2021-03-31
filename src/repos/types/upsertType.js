import db from "mssql";

export const upsertType = async ({ transaction, type }) => {
  let request = new db.Request(transaction);

  const {
    recordset: [existingType],
  } = await request.query`
      select
        id
      from types
      where name = ${type}
    `;

  if (existingType) return existingType.id;

  request = new db.Request(transaction);

  const {
    recordset: [{ newid }],
  } = await request.query`
      insert into types(name)
      values (${type});

      select scope_identity() as newid
    `;

  return newid;
};
