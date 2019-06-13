# ge-slacker
Grand Exchange helper for OSRS

Aims to replicate most of the key features from ge-tracker.com using the RSBuddy API and official API

## TODO
- Fix freeze
- Cleanup UI
- Code refactoring (looking at you DataTable)
- Front page dashboard (favourites, recommendations, graphs)
- High volume item page with recommendations
- Transformation (crafting) flip page
- Store flip page
- Decant flip page
- Repair flip page
- Item sets flip page
- High margin flip page
- Alerts for prices
- Proper backend (Firebase?)

### This project uses
- RSBuddy API
- OSRS-DB
- Dygraphs
- DataTables
- React (using nano react app)
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

## Adding styles

You can use CSS files with simple ES2015 `import` statements in your Javascript:

```js
import "./index.css";
```

## Babel transforms

The Babel preset [babel-preset-nano-react-app](https://github.com/adrianmcli/babel-preset-nano-react-app) and a small amount of configuration is used to support the same transforms that Create React App supports.

The Babel configuration lives inside `package.json` and will override an external `.babelrc` file, so if you want to use `.babelrc` remember to delete the `babel` property inside `package.json`.
