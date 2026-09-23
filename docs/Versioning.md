# Versioning

This site is hosted on [Read the Docs](https://readthedocs.org/), which builds
a separate copy of the docs for every active **branch** and **tag** in this
repo and shows a version switcher (bottom-left flyout menu) on the live site.

- **`latest`** always tracks the `main` branch — it's the rolling, most
  up-to-date docs and updates on every push.
- **Tagged versions** (`v1.0`, `v2.0`, ...) are frozen snapshots, one per major
  hardware revision. They stop changing once cut, so old builds stay
  reproducible even after `main` moves on.

## Cutting a new version

When a hardware revision is far enough along that it's worth freezing (new
board rev, new sensor set, new enclosure, etc.):

1. Make sure `main` reflects that revision's docs.
2. Tag it:
   ```bash
   git tag vX.0 -m "vX.0 — <short description of the hardware revision>"
   git push origin vX.0
   ```
3. In the Read the Docs project dashboard: **Admin → Versions**, find `vX.0`
   under "Activate a version," and activate it. It'll build automatically and
   appear in the version switcher.

`main`/`latest` keeps evolving as usual after the tag is cut — only the
tagged version is frozen.
