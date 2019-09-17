# ge-slacker
Grand Exchange helper for OSRS

Aims to replicate most of the key features from ge-tracker.com using the RSBuddy API and official API

## Features
- Sortable, searchable table of all tradable items
- Detailed price graphs for items with up to 30 minute resolution

## How to use
- Make sure NodeJS is installed
- Setup proxy server using heroku and cors-anywhere
  - `git clone https://github.com/Rob--W/cors-anywhere.git`
  - `cd cors-anywhere/`
  - `npm install`
  - `heroku create`
  - `git push heroku master`
- Create src/CorsMirror.js with the following contents
  - `export default "https://YOURHEROKUURL.herokuapp.com";`
- Start dev server with `npm start`

## This project uses
- RSBuddy API
- OSRS-DB
- cors-anywhere
- heroku
- React (using nano react app)
- React Tables
- Dygraphs
- Bootstrap (using react-bootstrap)

## nano-react-app-template

The template project for [nano-react-app](https://github.com/adrianmcli/nano-react-app).

- `npm start` — This will spawn a development server with a default port of `1234`.
- `npm run build` — This will output a production build in the `dist` directory.

## Custom port

You can use the `-p` flag to specify a port for development. To do this, you can either run `npm start` with an additional flag:

```
npm start -- -p 3000
```

Or edit the `start` script directly:

```
parcel index.html -p 3000
```

## TODO
- Front page dashboard (favourites, recommendations, graphs)
- Custom filters
- High volume item page with recommendations
- Transformation (crafting) flip page
- Icons everywhere
- Store flip page
- Decant flip page
- Repair flip page
- Item sets flip page
- High margin flip page
- Alerts for prices
- Proper backend (Firebase?) for API caching
