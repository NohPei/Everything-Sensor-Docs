# Everything Sensor Docs

Public documentation site for the [Everything Sensor](https://github.com/jgers32/everything-sensor)
project, built with [Astro Starlight](https://starlight.astro.build/) and
hosted on [Read the Docs](https://readthedocs.org/).

## Local development

Requires Node.js 22+.

```bash
npm install
npm run dev      # http://localhost:4321
```

```bash
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```

## Structure

Pages live under `src/content/docs/`, organized to match the site nav
(`hardware/`, `software/`, plus top-level Research Notes and Versioning
pages). Sidebar order/labels are configured in `astro.config.mjs`.

See [Versioning](src/content/docs/versioning.md) for how documentation
snapshots are frozen per hardware revision.
