# Icons
> Icons assets are image files that will be used to generated all imagery needed for favicon, touch icon, generic share images, etc.


## Paths
- The source files are located under `[NWAYO_ROOT]/components/[NAME]/assets/icons/`.
- The built files are located under `[BUILD_ROOT]/icons/[NAME]/`.


## Processing
Files are optimized losslessly via [optipng](http://optipng.sourceforge.net).

### Favicon (IE / Windows / Safari)
The source file must be a 64×64 PNG file named `favicon.png` with a transparent background.

It will produce a file named `favicon.ico` containing a:
- **16×16** version for IE9 address bar, Pinned site Jump List/Toolbar/Overlay
- **24×24** version for IE9 Pinned site browser UI
- **32×32** version for New tab page in IE, taskbar button in Win 7+, Safari Read Later sidebar
- **48×48** version for Windows site icons
- **64×64** version for Windows site icons, Safari Reading List sidebar in HiDPI/Retina


### Touch (iOS)
The source file must be a 512×512 PNG file named `touch.png` with a full background.

It will produce 10 files:
- `touch-57.png`  a   **57×57** version for non-Retina (@1× display) iPhone, iPod Touch, and Android 2.1+ devices
- `touch-72.png`  a   **72×72** version for the iPad mini and the first- and second-generation iPad (@1× display) on iOS ≤ 6
- `touch-76.png`  a   **76×76** version for the iPad mini and the first- and second-generation iPad (@1× display) on iOS ≥ 7
- `touch-114.png` a **114×114** version for iPhone with @2× display running iOS ≤ 6:
- `touch-120.png` a **120×120** version for iPhone with @2× display running iOS ≥ 7
- `touch-144.png` a **144×144** version for iPad with @2× display running iOS ≤ 6
- `touch-152.png` a **152×152** version for iPad with @2× display running iOS ≤ 7
- `touch-167.png` a **167×167** version for iPad Pro with @2× display running iOS ≤ 9
- `touch-180.png` a **180×180** version for iPhone 6 Plus with @3× display
- `touch-512.png` a **512×512** version for a general share icon


### Icon (Windows, Google TV, Android, Coast and all Modern browsers)
The source file must be a 256×256 PNG file named `icon.png` with a transparent background.

It will produce 6 files:
- `ìcon-64.png`  a   **64×64** version for Windows site icons, Safari Reading List, Modern browsers
- `ìcon-96.png`  a   **96×96** version for Google TV Favicon
- `ìcon-192.png` a **192×192** version for Chrome for Android
- `ìcon-195.png` a **195×195** version for Opera Speed Dial icon
- `ìcon-196.png` a **196×196** version for Chrome for Android home screen icon
- `ìcon-228.png` a **228×228** version for Coast for iOS


### Tile (Windows metro)
The source file must be a 558×558 PNG file named `tile.png` with a transparent background and a white image.

It will produce 4 files:
- `tile-small.png`  a **128×128** version (Officially:   70×70 but this is the recommended size)
- `tile-medium.png` a **270×270** version (Officially: 150×150 but this is the recommended size)
- `tile-large.png`  a **558×558** version (Officially: 310×310 but this is the recommended size)
- `tile-wide.png`   a **558×270** version (Officially: 310×150 but this is the recommended size)


### Large (Default generic sharing)
The source file must be a 1200×630 PNG file named `large.png` with a full background.

It will produce a optimized file named `large.png`.



## Usage
In HTML, use the example in the `SAMPLE-HTML/index.html` to add these files.

In scripts, the path to these files can be access via `app.path.icons`.


## Bundles
Images are selected for build via the `assets` property of the bundle file.


## Tasks
These tasks interact with the images:
- icons
- icons-favicon
- icons-icon
- icons-large
- icons-tile
- icons-touch
- rebuild
