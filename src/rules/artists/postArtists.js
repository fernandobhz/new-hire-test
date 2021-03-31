import { artists } from "../../repos";

export const post = async ({ id, name, spotifyId, genres }) => artists.upsert({ id, name, spotifyId, genres });
