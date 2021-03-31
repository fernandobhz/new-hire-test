import db from "mssql";

export const get = async (req, res) => {
  const { recordset: labels } = await db.query`
      select
        id
        , name
        , distributor
        , region
      from labels
    `;

  res.json(labels);
};
