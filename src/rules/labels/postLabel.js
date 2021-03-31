import { labels } from "../../repos";

export const postOne = async ({ id, name, distributor, region }) => labels.upsert({ id, name, distributor, region });

export const postRows = async rows => Promise.all(rows.map(async row => postOne(row)));
