export const insertArtist = async ({ transaction, id, name, spotifyId }) => {
  const request = new db.Request(transaction);

  return request.query`
    insert into artists (id, name, spotifyId)
    values (${id}, ${name}, ${spotifyId});
  `;
};
