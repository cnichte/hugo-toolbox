# README

My Javascript Toolbox for the [Hugo Website Builder](https://gohugo.io):

1. Cleans the Hugo-Cache the smart way. See [git-repo](https://github.com/cnichte/hugo-clean-cache)
1. Track modified dates of images and set lastmod in markdown / frontmatter. See [git-repo](https://github.com/cnichte/hugo-update-lastmod)
1. Check the Website for broken links. See [git-repo](https://github.com/cnichte/hugo-broken-links-checker)
1. Upload your Hugo Website via sftp and a real push-sync. See [git-repo](https://github.com/cnichte/sftp-push-sync)

Please visit the git repos for detailed manuals.

## Install

```bash
npm i -D hugo-toolbox
# or
npm install --save-dev hugo-toolbox
# or
yarn add --dev hugo-toolbox
# or
pnpm add -D hugo-toolbox
```

## Usage

in package.json

```bash
"scripts": {
  "predev": "hugo-toolbox update-lastmod",
  "dev": "hugo server --disableFastRender --noHTTPCache",

  "prebuild": "hugo-toolbox update-lastmod",
  "build": "hugo --minify --gc",

  "clean:cache": "hugo-toolbox clean-cache",

  "sync:staging": "hugo-toolbox sync staging",
  "sync:staging:dry": "hugo-toolbox sync staging --dry-run",
  "ss": "npm run sync:staging",
  "ssd": "npm run sync:staging:dry",

  "sync:prod": "hugo-toolbox sync prod",
  "sync:prod:dry": "hugo-toolbox sync prod --dry-run",
  "sp": "npm run sync:prod",
  "spd": "npm run sync:prod:dry"

  "check-links": "hugo-toolbox check-links carsten-local all",
  "check-links:intern": "hugo-toolbox check-links carsten-local intern",
  "check-links:extern": "hugo-toolbox check-links carsten-local extern",
  "check-links:dry": "hugo-toolbox check-links carsten-local all --dry-run"
}
```

For more options check the repos of the tools:

- <https://github.com/cnichte/hugo-clean-cache>
- <https://github.com/cnichte/hugo-update-lastmod>
- <https://github.com/cnichte/hugo-broken-links-checker>
- <https://github.com/cnichte/sftp-push-sync>