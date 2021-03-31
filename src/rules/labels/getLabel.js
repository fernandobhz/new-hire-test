import db from "mssql";

export const get = async () => {
  const { recordset: labels } = await db.query`
      select
        id
        , name
        , distributor
        , region
      from labels
    `;

  return labels;
};
