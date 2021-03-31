import { artists } from "../../repos";

export const postOne = async ({ id, name, spotifyId, genres }) => artists.upsert({ id, name, spotifyId, genres });
