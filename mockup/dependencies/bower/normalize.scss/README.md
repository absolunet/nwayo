## Latest downloadable version

The latest release of _normalize.scss for Sass 3.3 and Compass 1.0 is: [3.0.1+normalize.3.0.1](https://github.com/JohnAlbin/normalize-scss/releases/tag/3.0.1%2Bnormalize.3.0.1).
It combines normalize.css v3.0.1 and normalize v1.1.3.

The latest release of _normalize.scss for Sass 3.2 and Compass 0.12 is: [2.2.0+normalize.2.1.3](https://github.com/JohnAlbin/normalize-scss/releases/tag/2.2.0%2Bnormalize.2.1.3).
It combines normalize.css v2.1.3 and normalize v1.1.3.

## The Compass port of normalize.css

__This project is the Sass/Compass version of Normalize.css__, a collection of HTML
element and attribute rulesets to normalize styles across all browsers. This
port aims to use the best partials from Compass to make Normalize even easier to
integrate with your website. To learn about why Normalize.css is so amazing,
skip to the "normalize.css" section below.

This Sass/Compass port currently utilizes:

* Legacy IE support variables
* CSS3 Box Sizing mixin
* Vertical Rhythm mixins

In addition, Normalize.css has 2 major versions: version 3 (without legacy
browser support) and version 1 (with support for IE 6/7, etc.) This Compass port
combines the two versions into one file so that you can easily toggle between
the two versions using Compass' `$legacy-support-for-ie7` variable.

Did a client wait until the last minute to mention their CEO uses IE 7? Simply
set `$legacy-support-for-ie7` to `true` and recompile your Sass files.

# normalize.css v3

Normalize.css is a customisable CSS file that makes browsers render all
elements more consistently and in line with modern standards.

The project relies on researching the differences between default browser
styles in order to precisely target only the styles that need or benefit from
normalizing.

[View the test file](http://necolas.github.io/normalize.css/latest/test.html)

## Install

Install using one of the following methods:

Download from the [project page](https://github.com/JohnAlbin/normalize-scss/releases).

Install with [Bower](http://bower.io/): `bower install --save normalize.scss`

Install with [Component(1)](http://component.io/): `component install JohnAlbin/normalize-scss`

Install with [Ruby Gem](https://rubygems.org/gems/normalize-scss): `sudo gem install normalize-scss`

## What does it do?

* Preserves useful defaults, unlike many CSS resets.
* Normalizes styles for a wide range of elements.
* Corrects bugs and common browser inconsistencies.
* Improves usability with subtle improvements.
* Explains what code does using detailed comments.

## How to use it

No other styles should come before Normalize.css.

For more information about how to use it, see the [About normalize.css article](http://nicolasgallagher.com/about-normalize-css/).

To use the Compass port of Normalize, simply copy the _normalize.scss file to
your sass directory and follow the article's suggestions:

* __Approach 1:__ use `_normalize.scss` as a starting point for your own project's
base Sass, customising the values to match the design's requirements. (The best
approach, _IMO_.)
* __Approach 2:__ include `_normalize.scss` untouched and build upon it, overriding
the defaults later in your Sass if necessary.

## Browser support

* Google Chrome (latest)
* Mozilla Firefox (latest)
* Mozilla Firefox 4
* Opera (latest)
* Apple Safari 6+
* Internet Explorer 8+
* Internet Explorer 6-7 (when `$legacy-support-for-ie7` or
`$legacy-support-for-ie6` is set to `true`)

[Normalize.css v1 provides legacy browser
support](https://github.com/necolas/normalize.css/tree/v1) (IE 6+, Safari 4+),
but is no longer actively developed.

## Extended details

Additional detail and explanation of the esoteric parts of normalize.css.

#### `pre, code, kbd, samp`

The `font-family: monospace, monospace` hack fixes the inheritance and scaling
of font-size for preformated text. The duplication of `monospace` is
intentional.  [Source](http://en.wikipedia.org/wiki/User:Davidgothberg/Test59).

#### `sub, sup`

Normally, using `sub` or `sup` affects the line-box height of text in all
browsers. [Source](http://gist.github.com/413930).

#### `svg:not(:root)`

Adding `overflow: hidden` fixes IE9's SVG rendering. Earlier versions of IE
don't support SVG, so we can safely use the `:not()` and `:root` selectors that
modern browsers use in the default UA stylesheets to apply this style. [SVG
Mailing List discussion](http://lists.w3.org/Archives/Public/public-svg-wg/2008JulSep/0339.html)

#### `input[type="search"]`

The search input is not fully stylable by default. In Chrome and Safari on
OSX/iOS you can't control `font`, `padding`, `border`, or `background`. In
Chrome and Safari on Windows you can't control `border` properly. It will apply
`border-width` but will only show a border color (which cannot be controlled)
for the outer 1px of that border. Applying `-webkit-appearance: textfield`
addresses these issues without removing the benefits of search inputs (e.g.
showing past searches).

#### `legend`

Adding `border: 0` corrects an IE 8–11 bug where `color` (yes, `color`) is not
inherited by `legend`.

## Contributing
Please read Necolas' [contributing
guidelines](CONTRIBUTING.md).

Updates to most CSS rules should be reported to Necolas' upstream [Normalize.css
project](http://necolas.github.com/normalize.css/). Updates to the Sass should
be reported in the [Normalize-scss project](https://github.com/JohnAlbin/normalize-scss/).

## Acknowledgements

Normalize.css is a project by [Nicolas Gallagher](https://github.com/necolas),
co-created with [Jonathan Neal](https://github.com/jonathantneal).

This Sass/Compass port is a project by [John Albin Wilkins](http://john.albin.net).

## Other ports of Normalize.css

For the record, there are several other Sass or Compass ports as well.
Including:

* https://github.com/waynegraham/compass-normalize-plugin
* https://github.com/ksmandersen/compass-normalize
* https://github.com/hail2u/normalize.scss
* https://github.com/kristerkari/normalize.scss

Some of the above projects convert normalize into Sass mixins. That makes it
impossible to add Normalize using __Approach 1__ (by copying the file into your website
and customizing/overriding for your needs.)

[![Build Status](https://travis-ci.org/JohnAlbin/normalize-scss.png?branch=master)](https://travis-ci.org/JohnAlbin/normalize-scss)
