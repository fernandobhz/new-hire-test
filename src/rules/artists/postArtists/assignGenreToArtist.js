export const assignGenreToArtist = async ({ transaction, artistId, genreId }) => {
  const request = new sql.Request(transaction);

  return request.query`
        insert into artists_genres(artistId, genreId)
        values(${artistId}, ${genreId})
      `;
};
