# sinanrassam.github.io

Personal portfolio for Sinan Rassam, served by GitHub Pages from the `master` branch at https://sinanrassam.github.io.

It is a single static page with no build step:

- `index.html` holds the content, which mirrors the current CV.
- `styles.css` holds the styling.
- `.nojekyll` tells GitHub Pages to serve the files as they are.

## Preview locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Tests

```sh
node --test tests/*.test.mjs
```

The tests check the page's required content, profile links and local assets, and that no phone number or email address is published.
