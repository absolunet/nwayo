> [Work in progress]

# CLI - Assets
## assets-fonts
```shell
$ nwayo run assets-fonts
```
Move a copy of the font in the build directory

## assets-images-optimization
```shell
$ nwayo run assets-images-optimization
```
Optimize images with [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin).
Move the optimized images to the build directory.

## assets-images-highdensity
```shell
$ nwayo run assets-images-highdensity
```
Generate a high density version of the images. Optimize images with [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin).
Move the optimized images to the build directory.

## assets-raw
```shell
$ nwayo run assets-raw
```
Move the assets as is to the build directory.

## assets-images
```shell
$ nwayo run assets-images
```
Rebuild the images available in all or specific bundles. Will generate optimized and high desity images.

## assets
Rebuild the assets available in all or specific bundles. Will generate fonts, images and raw assets.
