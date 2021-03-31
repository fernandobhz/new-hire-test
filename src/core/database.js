import db from "mssql";

const { MSSQL_HOST, MSSQL_USERNAME, MSSQL_PASSWORD, MSSQL_DBNAME } = process.env;

export const connect = () =>
  db
    .connect({
      server: MSSQL_HOST,
      user: MSSQL_USERNAME,
      password: MSSQL_PASSWORD,
      database: MSSQL_DBNAME,
      options: { enableArithAbort: true },
    })
    .then(() => {
      // eslint-disable-next-line no-console
      console.info("Successfully connected to SQL Server");
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error(error);
      process.exit(error.code || 1);
    });
