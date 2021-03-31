import { labels } from "../../repos";

export const post = async ({ id, name, distributor, region }) => labels.upsert({ id, name, distributor, region });
