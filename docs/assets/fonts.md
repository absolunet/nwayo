# Fonts
> Fonts assets are font files (WOFF, WOFF2) that will be directly referenced by a page via its URL.


## Paths
- The source files are located under `[NWAYO_ROOT]/components/[NAME]/assets/fonts/`.
- The built files are located under `[BUILD_ROOT]/fonts/[NAME]/`.


## Processing
Files are only copied since optimization has to be done manually.


## Best practices
- Do not use CDN if possible (paid services only).
- Never convert fonts files, ask clients for WOFF/WOFF2.
- For Google Fonts use [this helper](https://google-webfonts-helper.herokuapp.com/fonts) to download fonts.


## Usage
In scripts, the path to these files can be access via `app.path.fonts`.

In styles, these fonts can be accessed via the [fonts mixin](../styles/fonts.md).


## Bundles
Fonts are selected for build via the `assets` property of the bundle file.


## Tasks
These tasks interact with the fonts:
- assets
- assets-fonts
- rebuild
