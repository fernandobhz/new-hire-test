import { releases } from "../../repos";

export const postOne = async ({ title, releaseDate, trackCount, upc, label, type, artists }) =>
  releases.upsert({ title, releaseDate, trackCount, upc, label, type, artists });
