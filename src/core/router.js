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
router.post("/label", (req, res, next) =>
  labels
    .postOne({ id: req.body.id, name: req.body.name, distributor: req.body.distributor, region: req.body.region })
    .then(() => res.status(201).json({ id: req.body.id }))
    .catch(next)
);

router.get("/artists", (req, res, next) =>
  artists
    .get()
    .then(result => res.json(result))
    .catch(next)
);
router.post("/artist", (req, res, next) =>
  artists
    .postOne({ id: req.body.id, name: req.body.name, spotifyId: req.body.spotifyId, genres: req.body.genres })
    .then(() => res.status(201).json({ id: req.body.id }))
    .catch(next)
);

router.get("/releases", (req, res, next) =>
  releases
    .get()
    .then(result => res.json(result))
    .catch(next)
);
router.post("/release", (req, res, next) =>
  releases
    .postOne({
      title: req.body.title,
      releaseDate: req.body.releaseDate || req.body.release_date || req.body["release-date"],
      trackCount: req.body.trackCount || req.body.track_count || req.body["track-count"],
      upc: req.body.upc,
      label: req.body.label,
      type: req.body.type,
      artists: req.body.artists,
    })
    .then(id => res.status(201).json({ id }))
    .catch(next)
);
