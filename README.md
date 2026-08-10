# code-art.js

`code-art.js` analyzes a JavaScript source file and turns its identifiers and
function references into two visualizations:

- a directed graph of functions and the external calls they make; and
- a word cloud weighted by function size and global-variable usage.

The analyzer writes JSON artifacts to the repository, and the included Express
server displays those artifacts in a browser.

> **Project status:** this is an experimental command-line tool and visualizer.
> It is not currently exposed as an importable Node.js library.

## Requirements

- [Node.js](https://nodejs.org/) 20 or 22
- npm (included with Node.js)
- A modern web browser
- Internet access when using the browser interface, because some front-end
  assets are loaded from public CDNs

Node.js 20 and 22 are tested automatically in GitHub Actions.

## Quick start

Clone the repository and install the exact dependencies from the lockfile:

```bash
git clone https://github.com/ManuChalela/code-art.js.git
cd code-art.js
npm ci
```

Analyze one of the included samples:

```bash
node code-art.js test/abs.js
```

Start the visualizer:

```bash
node server/server.js
```

Open [http://localhost:8080](http://localhost:8080), then use **Create graph**
or **Create wordcloud**. Stop the server with `Ctrl+C`.

## Analyze your own JavaScript

Run the analyzer from the repository root and pass one JavaScript file:

```bash
node code-art.js path/to/source.js
```

For example:

```bash
node code-art.js ./src/example.js
```

The input must be JavaScript syntax supported by Esprima 4. The analyzer reads
one file per run; it does not recursively scan directories or follow imports.

### Important: generated files are overwritten

The analyzer writes results relative to the current working directory. Run it
from the repository root, where the `views/` directory exists. Every analysis
overwrites the previous generated artifacts, including files tracked in Git:

| File | Purpose |
| --- | --- |
| `functionList.json` | Functions with their local, global, and external identifiers |
| `grapho.json` | Serialized reference graph |
| `nodes.json` | Nodes consumed by the graph visualizer |
| `links.json` | Directed links consumed by the graph visualizer |
| `views/list.json` | Function and global-variable weights |
| `views/edges.json` | External-reference counts |
| `views/edgesLog.json` | Log-scaled external-reference counts |
| `views/finalList.json` | Final weighted and styled word-cloud entries |

If you only wanted to experiment and do not want to keep those generated
changes, restore them with Git after stopping the server:

```bash
git restore functionList.json grapho.json nodes.json links.json \
  views/list.json views/edges.json views/edgesLog.json views/finalList.json
```

## Web visualizer

Start the server after analyzing a file:

```bash
node server/server.js
```

The server listens on `http://localhost:8080` and provides:

| Route | Description |
| --- | --- |
| `/` | Graph and word-cloud interface |
| `/getGraph` | JSON containing the generated nodes and edges |
| `/getWordCloud` | JSON used to render the generated word cloud |
| `/saveGraph` | Most recently loaded graph data |

The server is intended for local development. It has no authentication and
should not be exposed directly to the public internet.

## Development and verification

Install dependencies and run the smoke test:

```bash
npm ci
npm test
```

The test runs the CLI against a sample in an isolated temporary directory and
checks that every expected artifact contains valid JSON.

To inspect known dependency advisories:

```bash
npm audit
```

GitHub Actions runs `npm ci` and `npm test` on Node.js 20 and 22 for pushes and
pull requests.

## Project layout

```text
code-art.js              JavaScript analyzer and artifact generator
server/server.js         Local Express server
test/                    Sample JavaScript inputs and smoke test
views/                   Browser interface, styles, scripts, and generated data
nodes.json               Generated graph nodes
links.json               Generated graph edges
functionList.json        Generated function analysis
grapho.json              Generated serialized graph
```

## Troubleshooting

### `ENOENT` or a missing `views/` directory

Run the analyzer from the repository root, not from another working directory:

```bash
cd path/to/code-art.js
node code-art.js path/to/source.js
```

### The input cannot be parsed

Confirm that the path points to a readable JavaScript file and that its syntax
is supported by Esprima 4. The current CLI does not provide a friendly error
message for a missing or invalid input file.

### Port 8080 is already in use

Stop the process using port 8080, or stop another running copy of the server,
then run:

```bash
node server/server.js
```

### The page loads but the visualizations do not appear

1. Run the analyzer before starting the server.
2. Check that `nodes.json`, `links.json`, and `views/finalList.json` contain data.
3. Confirm that the browser can reach the external CDNs used by the page.
4. Check the browser developer console for blocked or failed requests.

## Known limitations

- One input file is analyzed per run.
- Generated results overwrite the previous analysis.
- Output colors and fonts are selected randomly, so visual styling can differ
  between runs.
- The CLI is not yet registered as an npm executable and has limited input
  validation.
- Some visualization dependencies are legacy packages retained for
  compatibility with the original interface.

## Contributing

1. Create a branch from `master`.
2. Make a focused change.
3. Run `npm test`.
4. Open a pull request describing the behavior and validation performed.

Please report bugs and feature requests through
[GitHub Issues](https://github.com/ManuChalela/code-art.js/issues).

## License

Released under the [MIT License](LICENSE). Copyright © 2017 Emanuel Chalela.
