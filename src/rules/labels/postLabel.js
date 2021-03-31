import { labels } from "../../repos";

export const postOne = async ({ id, name, distributor, region }) => labels.upsert({ id, name, distributor, region });
