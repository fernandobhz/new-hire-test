import db from "mssql";
import { upsertType } from "../../types";

export const upsertReleaseRow = async ({ transaction, title, releaseDate, trackCount, upc, label, type }) => {
  let request = new db.Request(transaction);

  const typeId = await upsertType({ transaction, type });

  const {
    recordset: [existingRow],
  } = await request.query`
      select
        id
        , title
        , releaseDate
        , trackCount
        , upc
        , labelId
        , typeId
      from releases
      where (upc = ${upc}) or (title = ${title} and releaseDate = ${releaseDate})
    `;

  if (existingRow) {
    const isMissingUPCValueOnDatabase = !existingRow.upc;
    const haveReceivedNewUPCValue = !!upc;
    const doesDatabaseNeedsUPCUpdate = isMissingUPCValueOnDatabase && haveReceivedNewUPCValue;

    if (doesDatabaseNeedsUPCUpdate) {
      request = new db.Request(transaction);

      await request.query`
        update releases set 
          upc = ${upc}
        where title = ${title} and releaseDate = ${releaseDate} 
      `;
    }

    const doesDatabaseNeedsToBeUpdated =
      trackCount !== existingRow.trackCount || label !== existingRow.labelId || typeId !== existingRow.typeId;

    if (doesDatabaseNeedsToBeUpdated) {
      request = new db.Request(transaction);

      await request.query`
        update releases set 
          trackCount = ${trackCount || existingRow.trackCount}
          , labelId = ${label || existingRow.labelId}
          , typeId = ${typeId || existingRow.typeId}
        where (upc = ${upc}) or (title = ${title} and releaseDate = ${releaseDate})
      `;
    }

    return existingRow.id;
  }

  request = new db.Request(transaction);

  const {
    recordset: [{ newid }],
  } = await request.query`
    insert into releases (
      title
      , releaseDate
      , trackCount 
      , upc
      , labelId
      , typeId
    ) values (
      ${title}
      , ${releaseDate}
      , ${trackCount}
      , ${upc}
      , ${label}
      , ${typeId}
    );

    select scope_identity() as newid;
  `;

  return newid;
};
