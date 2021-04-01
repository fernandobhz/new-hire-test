import db from "mssql";
import { mainCommandText } from "./mainCommandText";

export const select = async ({
  artistId,
  artistName,
  typeName,
  labelId,
  upc,
  artistIdList = [],
  artistNameList = [],
}) => {
  const request = new db.Request();

  // Regular Parameters
  request.input("artistId", db.Int, artistId);
  request.input("artistName", db.NVarChar, artistName);
  request.input("typeName", db.NVarChar, typeName);
  request.input("labelId", db.Int, labelId);
  request.input("upc", db.VarChar, upc);

  // Artists Ids Dynamic Parameters
  const idListCommandText = artistIdList.length
    ? `
      and (a.id in (${artistIdList.map((value, index) => `@id_${index}`).join(", ")}))
    `
    : "";

  artistIdList.forEach((value, index) => request.input(`id_${index}`, db.Int, value));

  // Artists Names Dynamic Parameters
  const nameListCommandText = artistNameList.length
    ? `
    and (a.name in (${artistNameList.map((value, index) => `@name_${index}`).join(", ")}))
  `
    : "";

  artistNameList.forEach((value, index) => request.input(`name_${index}`, db.NVarChar, value));

  // Dynamic commandText
  const commandText = `
     ${mainCommandText}
     ${idListCommandText}
     ${nameListCommandText}
   `;

  // Query execution
  const { recordset: rows } = await request.query(commandText);

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    spotifyId: row.spotifyId,
    genres: JSON.parse(row.genres || "[]").map(genre => genre.name),
    releases: JSON.parse(row.releases || "[]").map(release => ({
      title: release.title,
      release_date: release.release_date,
      track_count: release.track_count,
      upc: release.upc,
      type: release.type,
      artists: release.artists.map(artist => artist.id),
    })),
  }));
};
