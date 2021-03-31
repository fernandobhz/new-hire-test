import { Router } from "express";
import { labels, artists } from "../rules";

export const router = Router();

router.get("/labels", (req, res, next) => labels.get().then((result) => res.json(result)).catch(next));

router.post("/labels", (req, res, next) =>
  labels
    .post({ id: req.body.id, name: req.body.name, distributor: req.body.distributor, region: req.body.region })
    .then(() => res.status(201).json({ id: req.body.id })).catch(next)
);

router.get("/artists", (req, res, next) => artists.get().then((result) => res.json(result)).catch(next));

router.post("/artists", (req, res, next) =>
  artists
    .post({ id: req.body.id, name: req.body.name, spotifyId: req.body.spotifyId, genres: req.body.genres })
    .then(() => res.status(201).json({ id: req.body.id })).catch(next)
);

