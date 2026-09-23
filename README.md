# Everything Sensor Docs

Public documentation site for the [Everything Sensor](https://github.com/jgers32/everything-sensor)
project, built with [Astro Starlight](https://starlight.astro.build/).

**Status:** local-only for now — not currently published on Read the Docs
while content and hardware docs are still being finalized. `.readthedocs.yaml`
is in place and ready for whenever it's re-imported.

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

```
astro.config.mjs        # site title, nav sidebar, Read the Docs base-path handling
src/content.config.ts    # Starlight content collection config (don't need to touch this)
src/content/docs/
  index.md                # home page
  hardware/components.md
  software/{overview,board-setup,data-logging,networking}.md
  research-notes.md
  versioning.md
```

Every file under `src/content/docs/` becomes a page at the matching URL
(`software/overview.md` → `/software/overview/`). Sidebar order and labels are
separate from file layout — they're set in the `sidebar` array in
`astro.config.mjs`, so adding a new `.md` file also means adding an entry
there or it won't show up in the nav.

## Updating content

This repo is the polished, public-facing distillation of the raw build
notes, code, and data in the sibling `Everything-Sensor` repo (hardware
README, `sdzwa/` logger code, systemd services, datasheets, etc.). When
something changes over there — new hardware revision, new sensor, corrected
setup step — pull the relevant update into the matching page here rather
than dumping the raw notes in; that repo is the working log, this one is the
reference doc.

**Internal links must be relative** (`../hardware/components/`, not
`/hardware/components/`). Read the Docs serves this site under a version
subpath (e.g. `/en/latest/`); absolute links break under that prefix. See
`astro.config.mjs` for how `base` is derived from Read the Docs' build
environment.

**Admonitions** use Starlight's aside syntax, not MkDocs's:

```md
:::caution[Optional title]
Body text.
:::
```

Available types: `note`, `tip`, `caution`, `danger`.

## Versioning

Not set up yet — there's only one hardware revision (v1) documented so far.
See the [Versioning](src/content/docs/versioning.md) page for the plan
(`starlight-versions` plugin) for when a v2 needs its own frozen snapshot.
