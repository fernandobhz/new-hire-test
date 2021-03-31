require("dotenv/config");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const sql = require("mssql");

const { MSSQL_HOST, MSSQL_USERNAME, MSSQL_PASSWORD, MSSQL_DBNAME, EXPRESS_PORT } = process.env;

sql
  .connect({
    server: MSSQL_HOST,
    user: MSSQL_USERNAME,
    password: MSSQL_PASSWORD,
    database: MSSQL_DBNAME,
    options: { enableArithAbort: true },
  })
  .then(() => {
    console.info("Successfully connected to SQL Server");
  })
  .catch((error) => {
    console.error(error);
    process.exit(err.code || 1);
  });

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

app.listen(EXPRESS_PORT, () => console.log(new Date(), `Server up at port ${EXPRESS_PORT}`));

app.get("/labels", async (req, res) => {
  /**
   * TODO:
   *   - Move this code to a controller
   *   - A better error handling than just the default one
   */
  const { recordset: labels } = await sql.query`
    select
      id
      , name
      , distributor
      , region
    from labels
  `;

  res.json(labels);
});

app.post("/labels", async (req, res) => {
  /**
   * TODO:
   *   - Move this code to a controller
   *   - A better error handling than just the default one
   */
  const { id, name, distributor, region } = req.body;

  // That code is sql injection free: https://www.npmjs.com/package/mssql#es6-tagged-template-literals
  await sql.query`
    insert into labels (id, name, distributor, region)
    values (${id}, ${name}, ${distributor}, ${region});
  `;

  res.json({ id, name, distributor, region });
});

app.get("/artists", async (req, res) => {
  /**
   * TODO:
   *   - Move this code to a controller
   *   - A better error handling than just the default one
   */
  const { recordset: artists } = await sql.query`
    select
      id
      , name
      , spotifyId      
    from artists as a
  `;

  const artistsWithGenres = await Promise.all(
    artists.map(async (artist) => {
      const { recordset: genres } = await sql.query`
      select
        g.name
      from genres as g 
      join artists_genres as ag on ag.genreId = g.id
      and ag.artistId = ${artist.id}      
    `;

      return {
        ...artist,
        genres: genres.map((genre) => genre.name),
      };
    })
  );

  res.json(artistsWithGenres);
});

app.post("/artists", async (req, res) => {
  /**
   * TODO:
   *   - Move this code to a controller
   *   - A better error handling than just the default one
   */
  const { id, name, spotifyId, genres } = req.body;

  const transaction = new sql.Transaction();
  await transaction.begin();

  let request = new sql.Request(transaction);

  // That code is sql injection free: https://www.npmjs.com/package/mssql#es6-tagged-template-literals
  await request.query`
    insert into artists (id, name, spotifyId)
    values (${id}, ${name}, ${spotifyId});
  `;

  // TODO: move that function to another place
  const upsertGenre = async (genre) => {
    let request = new sql.Request(transaction);

    const {
      recordset: [existingGenre],
    } = await request.query`
      select
        id
      from genres
      where name = ${genre}
    `;

    if (existingGenre) return existingGenre.id;

    request = new sql.Request(transaction);

    const {
      recordset: [{ newid }],
    } = await request.query`
      insert into genres(name)
      values (${genre});

      select scope_identity() as newid
    `;
    
    return newid;
  };

  request = new sql.Request(transaction);

  // TODO: move that function to another place
  const assignGenreToArtist = async (artistId, genreId) => {
    let request = new sql.Request(transaction);

    return request.query`
      insert into artists_genres(artistId, genreId)
      values(${artistId}, ${genreId})
    `;
  };

  for (genre of genres) {
    const genreId = await upsertGenre(genre);
    await assignGenreToArtist(id, genreId);
  }

  transaction.commit();

  res.json({ id, name, spotifyId, genres });
});
