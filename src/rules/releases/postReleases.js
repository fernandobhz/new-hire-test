import { releases } from "../../repos";

export const postOne = async ({ title, releaseDate, trackCount, upc, label, type, artists }) =>
  releases.upsert({ title, releaseDate, trackCount, upc, label, type, artists });

export const postRows = async rows =>
  Promise.all(
    rows.map(async row =>
      postOne({
        ...row,
        releaseDate: row.releaseDate || row.release_date || row["release-date"],
        trackCount: row.trackCount || row.track_count || row["track-count"],
      })
    )
  );
