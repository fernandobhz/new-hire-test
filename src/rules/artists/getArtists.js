import { artists } from "../../repos";

export const get = async () => artists.select();
