import db from "mssql";

export const upsert = async ({ transaction, id, name, distributor, region }) => {
  let request = new db.Request(transaction);

  const {
    recordset: [existingRow],
  } = await db.query`
    select
      id
    from labels
    where id = ${id}
  `;

  if (existingRow) {
    const doesDatabaseNeedsToBeUpdated =
      name !== existingRow.name || distributor !== existingRow.distributor || region !== existingRow.region;

    if (doesDatabaseNeedsToBeUpdated) {
      request = new db.Request(transaction);

      await request.query`
        update labels set 
          name = ${name}
          , distributor = ${distributor}
          , region = ${region}
        where id = ${id}
      `;
    }

    return existingRow.id;
  }

  request = new db.Request(transaction);

  await request.query`
    insert into labels (
      id
      , name
      , distributor
      , region
    ) values (
      ${id}
      , ${name}
      , ${distributor}
      , ${region}
    );
  `;

  return id;
};
