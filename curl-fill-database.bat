curl -i -X POST -H "Content-Type: application/json" --data-binary "@data/labels.json" localhost:3000/labels
curl -i -X POST -H "Content-Type: application/json" --data-binary "@data/artists.json" localhost:3000/artists
curl -i -X POST -H "Content-Type: application/json" --data-binary "@data/releases.json"  localhost:3000/releases
