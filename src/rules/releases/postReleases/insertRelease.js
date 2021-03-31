import db from "mssql";
import { upsertType } from "./upsertType";

export const insertRelease = async ({ transaction, title, releaseDate, trackCount, upc, label, type }) => {
  const request = new db.Request(transaction);

  const typeId = await upsertType({ transaction, type });

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
