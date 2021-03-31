import { releases } from "../../repos";

export const get = async () => releases.select();
