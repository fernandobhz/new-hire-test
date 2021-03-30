require("dotenv/config");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const sql = require("mssql");

const { MSSQL_HOST, MSSQL_USERNAME, MSSQL_PASSWORD, MSSQL_DBNAME, EXPRESS_PORT } = process.env;

sql
  .connect({
    server: MSSQL_HOST,
    user: MSSQL_USERNAME, 
    password: MSSQL_PASSWORD,
    database: MSSQL_DBNAME,
    options: { enableArithAbort: true },
  })
  .then(() => {
    console.info("Successfully connected to SQL Server");
  })
  .catch((error) => {
    console.error(error);
    process.exit(err.code || 1);
  });

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

app.listen(EXPRESS_PORT, () => console.log(new Date(), `Server up at port ${EXPRESS_PORT}`));

app.get("/labels", async (req, res) => {
  /**
   * TODO:
   *   - Move this code to a controller
   *   - A better error handling than just the default one
   */
  const { recordset } = await sql.query`
    select
      id
      , name
      , distributor
      , region
    from labels
  `;

  res.json(recordset);
});

app.post("/labels", async (req, res) => {
  /**
   * TODO:
   *   - Move this code to a controller
   *   - A better error handling than just the default one
   */
  const { id, name, distributor, region } = req.body;

   // That code is sql injection free: https://www.npmjs.com/package/mssql#es6-tagged-template-literals
   const result = await sql.query`
    insert into labels (name, distributor, region)
    values (${name}, ${distributor}, ${region});

    select scope_identity() as newid
  `;

  const {
    recordset: [{ newid }],
  } = result

  res.json({ newid });
});
