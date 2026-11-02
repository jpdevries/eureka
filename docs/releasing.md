# Releasing Eureka 3

The `@eureka/*` packages version together (a Changesets `fixed` group) and
publish from the `v3` branch. Node 22, npm workspaces.

## Every change

1. Make the change, with its spec amendment and tests.
2. `npx changeset` and describe it. Pick the bump for the group; while
   `v3` is in alpha pre-release mode every bump produces the next
   `3.0.0-alpha.N`.
3. Commit the `.changeset/*.md` file with the change.

CI (`.github/workflows/ci.yml`) runs on every push and pull request to
`v3`: typecheck, unit tests, build, schema validation, a dry-run `npm pack`
of every package, and the v3 conformance suite in Chromium, uploading the
Playwright results on failure.

## Publishing

Two workflows, so a push never publishes by itself:

- `.github/workflows/release.yml` ("Version packages") runs on every push
  to `v3`. With pending changesets it opens or updates the **Version
  packages** pull request (`npm run version-packages`: versions, internal
  dependency ranges, `CHANGELOG.md` files). Merging that PR lands the bump.
- `.github/workflows/publish.yml` ("Publish to npm") is started by hand
  from the Actions tab or with `gh workflow run publish.yml --ref v3`. It
  typechecks, tests, builds, refuses to run while changesets are pending,
  then `changeset publish` releases every package whose version is not on
  npm yet (with provenance, tagged `alpha` while in pre mode) and pushes
  the git tags.

Setup once: an npm org or user that owns the `@eureka` scope; an npm
granular access token with publish rights on it, stored as the
`NPM_TOKEN` secret in a GitHub environment named `npm` (the publish job
uses that environment, so required reviewers can be added there);
`publishConfig.access` is already `public` in every package.

The first alpha (`3.0.0-alpha.1`) is already versioned in the tree, so
the first publish is: set the secret, then start "Publish to npm".

By hand, for the first publish or when CI cannot:

```bash
npm login
npm run build
npm run version-packages   # if changesets are pending
npx changeset publish      # publishes and tags
git push --follow-tags
```

## Leaving alpha

```bash
npx changeset pre exit
npx changeset             # a major changeset for the 3.0.0 release notes
npm run version-packages  # 3.0.0-alpha.N -> 3.0.0
```

Then `npm dist-tag add @eureka/element@3.0.0 latest` is not needed:
`changeset publish` tags non-prerelease versions `latest` and prerelease
versions `alpha`.

## What ships

Each package's `files` list: built `dist/`, the TypeScript `src/`, and
for `@eureka/core` the `i18n/` catalogs, for `@eureka/css` the `assets/`
icon sprite, for `@eureka/element` the `demo/` page. `dist/` is gitignored
and produced by `npm run build`, so publishing always runs the build first.
`npm pack --dry-run -w packages/element` shows the exact file list.

The legacy `eureka-browser` package (2.0, `release-2.0` branch) is not
part of this flow and keeps its own version line.
