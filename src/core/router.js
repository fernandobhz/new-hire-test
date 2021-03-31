import { Router } from "express";
// eslint-disable-next-line import/named
import { labels, artists, releases } from "../rules";

export const router = Router();

router.get("/labels", (req, res, next) =>
  labels
    .get()
    .then(result => res.json(result))
    .catch(next)
);
router.post("/labels", (req, res, next) =>
  labels
    .post({ id: req.body.id, name: req.body.name, distributor: req.body.distributor, region: req.body.region })
    .then(() => res.status(201).json({ id: req.body.id }))
    .catch(next)
);

router.get("/artists", (req, res, next) =>
  artists
    .get()
    .then(result => res.json(result))
    .catch(next)
);
router.post("/artists", (req, res, next) =>
  artists
    .post({ id: req.body.id, name: req.body.name, spotifyId: req.body.spotifyId, genres: req.body.genres })
    .then(() => res.status(201).json({ id: req.body.id }))
    .catch(next)
);

router.get("/releases", (req, res, next) =>
  releases
    .get()
    .then(result => res.json(result))
    .catch(next)
);
router.post("/releases", (req, res, next) =>
  releases
    .post({
      title: req.body.title,
      releaseDate: req.body.releaseDate,
      trackCount: req.body.trackCount,
      upc: req.body.upc,
      label: req.body.label,
      type: req.body.type,
      artists: req.body.artists,
    })
    .then(() => res.status(201).json({ id: req.body.id }))
    .catch(next)
);
