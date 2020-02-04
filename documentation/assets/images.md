# Images
> Images assets are image files (GIF, JPG, PNG, SVG) that will be directly referenced by a page via its URL.


## Paths
- The source files are located under `[NWAYO_ROOT]/components/[NAME]/assets/images/`.
- The built files are located under `[BUILD_ROOT]/images/[NAME]/`.


## Processing
Files are optimized losslessly via [gifsicle](https://www.lcdf.org/gifsicle), [MozJPEG](https://github.com/mozilla/mozjpeg), [optipng](http://optipng.sourceforge.net), [svgo](https://github.com/svg/svgo), which means that they need to be quality-optimized beforehand because this process only shims the extra useless kB.


### High-density images
In addition to the optimization, filenames which ends by `@2x` will have a second file generated without the `@2x` and which will be half the dimension of the original file. This second file will also be losslessly optimized.

For example, a `foo@2x.png (300×300)` file will produce a optimized `foo@2x.png (300×300)` file and a optimized `foo.png (150×150)` file.


## Best practices

### Format selection
- Use PNG for transparent or low color-range images. (GIF shouldn't be use since PNG does it better)
- Use JPG for high color-range images.
- Use SVG for all icons and logo images.

### Manual optimization
- For JPG aim for 60%-80% and use [TinyJPG](https://tinyjpg.com).
- For PNG use [TinyPNG](https://tinypng.com).
- For SVG use these Illustrator settings.
- ![SVG export settings](../../ressources/images/svg-ai-settings.png)


## Usage
In scripts, the path to these files can be access via `app.path.images`.

In styles, these images can be accessed via the [images mixins](../styles/images.md).


## Bundles
Images are selected for build via the `assets` property of the bundle file.


## Tasks
These tasks interact with the images:
- assets
- assets-images
- assets-images-highdensity
- assets-images-optimization
- rebuild
