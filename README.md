### Directions
- Setup a database / data store to house the json data provided (labels, artists, releases) 
- Using a data processing implementation, remove any existing duplicates before inserting them into your data repository.
- Create a POST route that validates and saves incoming data 
- Create a GET route that can retrieve and return artist release data based on the following parameters:
    - Return all artist data
    - Return a single artist by name or ID
    - Return multiple artists by names or ID's
    - Filter by "album" or "single"
    - Filter by label id
    - Filter by UPC

For example, when querying for the artist "Banks", the response would include her artist info, releases and label info.

A valid JSON response would comply with the following schema:
```
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "id": { "type": "string", "pattern": "\\d{6}" },
    "name": { "type": "string" },
    "spotifyId": { "type": "string" },
    "genres": { "type": "array", "items": [{ "type": "string" }] },
    "releases": {
      "type": "array",
      "items": [
        {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "release_date": { "type": "string" },
            "track_count": { "type": "integer" },
            "upc": { "type": "string", "pattern": "\\d{12}" },
            "type": { "type": "string", "enum": ["album", "single"] },
            "artists": {
              "type": "array",
              "items": [{ "type": "string", "pattern": "\\d{6}" }]
            },
            "label": {
              "type": "object",
              "properties": {
                "id": { "type": "string", "pattern": "\\d{6}" },
                "distributor": { "type": ["string", "null"] },
                "name": { "type": "string" },
                "region": { "type": "string", "enum": ["CA", "UK", "US"] }
              },
              "required": ["id", "distributor", "name", "region"]
            }
          },
          "required": [
            "title",
            "release_date",
            "track_count",
            "upc",
            "type",
            "artists",
            "label"
          ]
        }
      ]
    }
  },
  "required": ["id", "name", "spotifyId", "genres", "releases"]
}
```

Please commit your code to a public repo and provide instructions on how to setup / run locally. Also, please send request shape examples (cURL or preferably a Postman export). 

Aside from working within node, the db and server-side framework is of your choice. If you have any questions please email casper@verifi.media or ryan@verifi.media

##### Dupe Notes
- 3 versions of "Altar" (2 of 3 contain a null field)
- 2 versions of "Work" (1 array is missing 2nd artist)
- 2 versions of "Divide" (1 upc is an empty string)
- 2 versions of "Goddess" (1 artist array is empty)
- 2 versions of "Hayley Kyoko" (no differences in data)
- 2 versions of "Years & Years" (1 contains an empty genre [])
- 2 version of "Ed Sheeran" (1 has a spotify id w/ an empty string)
- 2 labels intentionally contain a null distributor field
