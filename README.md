# README

Javascript Toolbox for Hugo Website Builder, uses:

- <https://github.com/cnichte/hugo-update-lastmod> - track lastmod of images and set lastmod in markdown.
- <https://github.com/cnichte/hugo-clean-cache> - Cleans the Hugo-Cache
- <https://github.com/cnichte/sftp-push-sync> - Upload your Hugo Website with push-sync.

## Setup

```bash
npm i -D hugo-toolbox
``
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
}
```
