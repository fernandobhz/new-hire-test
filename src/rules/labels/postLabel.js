/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// Note: When dealing with transaction each request must be send after the previous one has finished
import Joi from "joi";
import { labels } from "../../repos";
import { ExposableError } from "../../core/exposableError";

export const postOne = async params => {
  const schema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    distributor: Joi.string().allow(null).optional(),
    region: Joi.string().valid("CA", "UK", "US").required(),
  });

  const { error, value } = schema.validate(params, {
    abortEarly: false,
  });

  if (error) {
    throw new ExposableError(error.message, 400, error);
  }

  await labels.upsert(value);
};

export const postRows = async rows => {
  for (const row of rows) {
    await postOne(row);
  }
};
