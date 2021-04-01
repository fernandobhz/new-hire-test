/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// Note: When dealing with transaction each request must be send after the previous one has finished
import Joi from "joi";
import { artists } from "../../repos";
import { ExposableError } from "../../core/exposableError";

export const postOne = async params => {
  const schema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    spotifyId: Joi.string().max(40).allow("").required(),
    genres: Joi.array().items(Joi.string().max(300)).optional(),
  });

  const { error, value } = schema.validate(params, {
    abortEarly: false,
  });

  if (error) {
    throw new ExposableError(error.message, 400, error);
  }

  await artists.upsert(value);
};

export const postRows = async rows => {
  for (const row of rows) {
    await postOne(row);
  }
};
