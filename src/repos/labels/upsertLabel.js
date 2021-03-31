import db from "mssql";
import { ExposableError } from "../../core/exposableError";
import { ALL_SQL_EXPOSABLE_ERROR_NUMBERS } from "../../core/constants";

export const upsert = async ({ id, name, distributor, region }) => {
  const transaction = new db.Transaction();
  await transaction.begin();

  try {
    let request = new db.Request(transaction);

    const {
      recordset: [existingRow],
    } = await request.query`
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

      await transaction.commit();
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

    await transaction.commit();
    return id;
  } catch (error) {
    await transaction.rollback().catch(() => {});

    if (ALL_SQL_EXPOSABLE_ERROR_NUMBERS.includes(error.number)) {
      throw new ExposableError(error.message, 400, error);
    } else {
      throw error;
    }
  }
};
