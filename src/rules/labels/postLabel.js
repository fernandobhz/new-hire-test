import db from "mssql";
import { ExposableError } from "../../core/exposableError"

export const post = async ({ id, name, distributor, region }) => {
  try {
    await db.query`
      insert into labels (id, name, distributor, region)
      values (${id}, ${name}, ${distributor}, ${region});
    `;
  } catch (error) {
    if (error.number === 2627) throw new ExposableError(error.message, 400, error);
    else throw error;
  }
};
