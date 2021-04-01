/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// Note: When dealing with transaction each request must be send after the previous one has finished
import Joi from "joi";
import { releases } from "../../repos";
import { ExposableError } from "../../core/exposableError";

export const postOne = async params => {
  const schema = Joi.object({
    title: Joi.string().required(),
    releaseDate: Joi.date().required(),
    trackCount: Joi.number().allow(null).optional(),
    upc: Joi.string().max(50).allow(null).allow("").optional(),
    label: Joi.string().max(300).allow(null).required(),
    type: Joi.string().max(300).required(),
    artists: Joi.array().items(Joi.number()).optional(),
  });

  const { error, value } = schema.validate(params, {
    abortEarly: false,
  });

  if (error) {
    throw new ExposableError(error.message, 400, error);
  }

  await releases.upsert(value);
};

export const postRows = async rows => {
  for (const row of rows) {
    await postOne({
      title: row.title,
      upc: row.upc,
      label: row.label,
      type: row.type,
      artists: row.artists,
      releaseDate: row.releaseDate || row.release_date || row["release-date"],
      trackCount: row.trackCount || row.track_count || row["track-count"],
    });
  }
};
