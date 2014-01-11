gulp-zopfli
===========

a [Zopfli](http://en.wikipedia.org/wiki/Zopfli) plugin for [gulp](https://github.com/wearefractal/gulp),
based on [node-zopfli](https://npmjs.org/package/node-zopfli).

## Install

```
npm install --save-dev gulp-zopfli
```

## Options

You can pass an options array to the zopfli object. These options are
passed on to `node-zopfli` library, except for one: the `format` options is 
used to pick a compression format. The possible formats are: `"deflate"`, `"zlib"` or `"gzip"`.

The defaults options are:
```javascript
{
    format: "gzip",
    verbose: false,
    verbose_more: false,
    numiterations: 15,
    blocksplitting: true,
    blocksplittinglast: false,
    blocksplittingmax: 15
};
```

## Examples

```javascript
var gulp = require("gulp");
var zopfli = require("gulp-zopfli");

gulp.task("compress", function() {
	gulp.src("./dev/scripts/*.js")
	.pipe(zopfli())
	.pipe(gulp.dest("./public/scripts"));
});

gulp.task("default", function() {
  gulp.run("compress");
});
```
Since the plugin is based largely on it,
if you're already using [gulp-gzip](https://github.com/jstuckey/gulp-gzip),
switching to `zopfli` should be as easy as replacing

```javascript
var gzip = require("gulp-gzip");
```
by
```javascript
var gzip = require("gulp-zopfli");
```


Credit
======

This plugin was based largely on [gulp-gzip](https://github.com/jstuckey/gulp-gzip),
I basically just replaced `gzip` by `zopfli` so all credit is due to Jeremy.
