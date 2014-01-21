/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true,
 newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true, regexp:true, undef:true,
 unused:true, strict:true, trailing:true, indent:2, quotmark:single, esnext:true, node:true */
var es = require('event-stream');
var clone = require('clone');
var zopfli = require('node-zopfli');

const PLUGIN_NAME = 'gulp-zopfli';

module.exports = function(opts) {
  'use strict';

  var format = (
                 opts !== undefined
                 ) ? opts.format : 'gzip';

  var ext;

  if(format === 'gzip') {
    ext = '.gz';
  } else if(format === 'deflate') {
    ext = '.deflate';
  } else if(format === 'zlib') {
    ext = '.zz';
  }

  // default options
  var options = opts || {};

  // delete format option
  if(options.format !== null) {
    delete options.format;
  }

  var compress = function(file, callback) {

    // pass along empty files
    if(file.isNull()) {
      return callback(null, file);
    }

    // clone file and append the extension
    var newFile = clone(file);
    newFile.path += ext;
    newFile.shortened += ext;

    // Check if file is a buffer or a stream
    if(file.isBuffer()) {

      // File contents is a buffer
      var zcb = function(err, buffer) {
        if(!err) {
          newFile.contents = buffer;
          callback(null, newFile);
        } else {
          callback(err, null);
        }
      };

      if(format === 'gzip') {
        zopfli.gzip(file.contents, options, zcb);
      } else if(format === 'deflate') {
        zopfli.deflate(file.contents, options, zcb);
      } else if(format === 'zlib') {
        zopfli.zlib(file.contents, options, zcb);
      }
    } else if(file.isStream()) {

      // File contains a stream

      var z;
      if(format === 'gzip') {
        z = zopfli.createGzip(options);
      } else if(format === 'deflate') {
        z = zopfli.createDeflate(options);
      } else if(format === 'zlib') {
        z = zopfli.createZlib(options);
      }
      newFile.contents = file.contents
        .pipe(z);
      // .pipe(es.through());
      callback(null, newFile);
    }
  };

  return es.map(compress);
};
