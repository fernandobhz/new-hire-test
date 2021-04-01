import Joi from "joi";
import { artists } from "../../repos";
import { ExposableError } from "../../core/exposableError";

export const get = params => {
  const schema = Joi.object({
    artistId: Joi.number().optional(),
    artistName: Joi.string().optional(),
    typeName: Joi.string().valid("album", "single").optional(),
    labelId: Joi.number().optional(),
    upc: Joi.string().max(50).optional(),
    artistIdList: Joi.array().items(Joi.number()).optional(),
    artistNameList: Joi.array().items(Joi.string().max(300)).optional(),
  });

  const { error, value } = schema.validate(params, {
    abortEarly: false,
  });

  if (error) {
    throw new ExposableError(error.message, 400, error);
  }

  return artists.select(value);
};
