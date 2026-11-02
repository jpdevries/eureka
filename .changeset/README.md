# Changesets

Versioning and changelogs for the `@eureka/*` packages, which release in
lockstep (one `fixed` group). See [docs/releasing.md](../docs/releasing.md).

- `npx changeset` records what changed and how to bump (one file per change).
- `npm run version-packages` applies the pending changesets: versions,
  internal dependency ranges, `CHANGELOG.md` files.
- `npm run release` builds and publishes what is not on npm yet.

The `v3` line is in alpha pre-release mode (`pre.json`), so versions are
`3.0.0-alpha.N` until `npx changeset pre exit`.
