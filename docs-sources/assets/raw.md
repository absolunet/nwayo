# Raw
> Raw assets are any file that doesn't want processing and that will be directly referenced by a page via its URL.


## Paths
- The source files are located under `[NWAYO_ROOT]/components/[NAME]/assets/raw/`.
- The built files are located under `[BUILD_ROOT]/raw/[NAME]/`.


## Processing
Files are only copied.


## Best practices
- Use this for any file types unsupported by nwayo (PDF, MP3, etc.)
- Use this as a workaround for any circumstances where the nwayo architecture gets in the way:
	- JS/CSS file that has to be referenced directly.
	- Image file that needs to be kept untouched.
	- Resource file that needs to be kept unprocessed.
	- etc.


## Usage
In scripts, the path to these files can be access via `app.path.raw`.

In styles, the path to these files can be access via `konstan-get('path-raw')`.


## Bundles
Raw files are selected for build via the `assets` property of the bundle file.


## Tasks
These tasks interact with the raw files:
- assets
- assets-raw
- rebuild
