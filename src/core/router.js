import { Router } from "express";

import * as labels from "../rules";
import * as artists from "../rules";

export const router = Router();

router.get("/labels", labels.get);
router.post("/labels", labels.post);

router.get("/artists", artists.get);
router.post("/artists", artists.post);
