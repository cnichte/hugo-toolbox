# README

My Javascript Toolbox for the [Hugo Website Builder](https://gohugo.io):

- Track modified dates of images and set lastmod in markdown / frontmatter. See [git-repo](https://github.com/cnichte/hugo-update-lastmod)
- Cleans the Hugo-Cache the smart way. See [git-repo](https://github.com/cnichte/hugo-clean-cache)
- Upload your Hugo Website via sftp and a real push-sync. See [git-repo](https://github.com/cnichte/sftp-push-sync)

For details, please visit the respective git repo.

## Setup

```bash
npm i -D hugo-toolbox
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
}
```
