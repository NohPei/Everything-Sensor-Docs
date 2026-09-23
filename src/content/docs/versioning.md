---
title: Versioning
description: How this site freezes a documentation snapshot per major hardware revision.
---

This site is built with [Starlight](https://starlight.astro.build/) and
hosted on [Read the Docs](https://readthedocs.org/) (via a custom Node build —
see `.readthedocs.yaml`). Right now there's only one hardware revision
documented (the v1 SDZWA deployment), so everything lives under the rolling
"Latest" version — there's nothing to freeze yet.

## Cutting the first (and future) versions

When a hardware revision is far enough along that older docs should be frozen
rather than overwritten (new board rev, new sensor set, new enclosure, etc.),
use the [`starlight-versions`](https://starlight-versions.vercel.app/) plugin:

1. Install it:
   ```bash
   npm install starlight-versions
   ```
2. Add it as a Starlight plugin in `astro.config.mjs`:
   ```js
   import starlightVersions from 'starlight-versions';

   starlight({
     // ...existing config
     plugins: [
       starlightVersions({
         versions: [{ slug: 'v1.0', label: 'v1.0 — SDZWA deployment' }],
       }),
     ],
   })
   ```
3. Follow the plugin's [getting started guide](https://starlight-versions.vercel.app/getting-started/)
   to snapshot the current content into that archived version. `main` keeps
   evolving as "Latest" afterward; the archived version stays frozen.
4. Repeat with a new `slug`/`label` entry for each future hardware revision.

This gives readers a version switcher in the site header (current vs. archived
hardware revisions) without needing separate hosted deployments per version.
