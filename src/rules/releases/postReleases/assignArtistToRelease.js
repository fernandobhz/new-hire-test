import db from "mssql";

export const assignArtistToRelease = async ({ transaction, artistId, releaseId }) => {
  const request = new db.Request(transaction);

  return request.query`
    insert into releases_artists(artistId, releaseId)
    values(${artistId}, ${releaseId})
  `;
};
