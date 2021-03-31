import db from "mssql";

export const post = async (req, res) => {
  const { id, name, distributor, region } = req.body;

  await sql.query`
        insert into labels (id, name, distributor, region)
        values (${id}, ${name}, ${distributor}, ${region});
      `;

  res.json({ id, name, distributor, region });
};
