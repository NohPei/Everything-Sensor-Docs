# Agent instructions

This is the public documentation site for the Everything Sensor project
(Astro Starlight, see README.md for structure). Read the README first — this
file only covers rules an agent must not violate when editing docs here.

## Source of truth for content

The sibling `Everything-Sensor` repo (raw hardware/software notes, `sdzwa/`
logger code, systemd services, sensor datasheets, deployment data) is the
working log. This repo is the distilled, public-facing reference built from
it. When asked to update docs from new hardware/software work:

- Pull in what changed, rewritten for a reader who isn't the person who did
  the work — not a copy-paste of raw dev-log notes (timestamps, false
  starts, "come back to this" asides).
- Preserve the existing tone/structure of the page being edited rather than
  reformatting the whole thing.
- If something in `Everything-Sensor` conflicts with what's currently
  documented here (e.g. a sampling rate, a wiring value), flag it — don't
  silently pick one silently.

## Hard rules for this codebase

1. **Internal links must be relative**, never absolute (`../hardware/components/`,
   not `/hardware/components/`). This site's `base` path changes depending on
   host (root locally, `/en/<version>/` on Read the Docs — see
   `astro.config.mjs`), and Starlight does **not** rewrite absolute links
   written directly in markdown content (only its own generated sidebar/
   pagination links get that treatment). An absolute link here silently
   404s under Read the Docs and is easy to miss in local dev where it
   happens to work at root.

2. **Admonitions use Starlight aside syntax**, not MkDocs's `!!!` syntax:
   ```md
   :::caution[Optional title]
   Body text.
   :::
   ```
   Types: `note`, `tip`, `caution`, `danger`.

3. **Every page needs frontmatter** with at least `title` and `description`.

4. **New page → new sidebar entry.** Adding a `.md` file under
   `src/content/docs/` does not add it to the nav — add a matching entry to
   the `sidebar` array in `astro.config.mjs` or it's unreachable from the UI.

5. **Verify before considering a content change done:**
   ```bash
   npm run build
   ```
   must complete without errors/warnings about missing content or broken
   collections. If you touched `astro.config.mjs`, links, or anything
   base-path-related, also build with Read the Docs' env simulated and check
   the output HTML, not just that the build succeeds:
   ```bash
   READTHEDOCS=True READTHEDOCS_VERSION=latest READTHEDOCS_LANGUAGE=en npm run build
   grep -oE '(href|src)="[^"]*"' dist/index.html | sort -u
   ```
   Every internal href should come out prefixed with `/en/latest/`.

## Versioning

Not active yet (only one hardware revision documented). Don't add the
`starlight-versions` plugin or an archived version speculatively — see
`src/content/docs/versioning.md` for the trigger condition and exact steps.
