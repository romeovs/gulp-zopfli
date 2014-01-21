/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true,
 newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true, regexp:true, undef:true,
 unused:true, strict:true, trailing:true, indent:2, quotmark:single, esnext:true, node:true */
/*global describe, it*/
'use strict';
var zopfli = require('../');
var zlib = require('zlib');
var should = require('should');
var gulp = require('gulp');
var es = require('event-stream');
var fs = require('fs');
var Stream = require('stream');

require('mocha');

describe('gulp-zopfli', function() {
  describe('compress', function() {

    it('should append gz to the file extension', function(done) {
      gulp.src('*.txt')
        .pipe(zopfli())
        .pipe(es.map(function(file, callback) {
          // Check if file properties end with .gz
          file.path.should.endWith('gz');
          file.shortened.should.endWith('gz');
          callback(null, null);
          done();
        }));
    });

    it('should return file contents as a buffer in buffer mode', function(done) {
      gulp.src('*.txt')
        .pipe(zopfli())
        .pipe(es.map(function(file, callback) {
          // Check if file contents is a Buffer object
          file.contents.should.be.instanceof(Buffer); // should.have.type didn't work
          callback(null, null);
          done();
        }));
    });

    it('should return file contents as a stream in stream mode', function(done) {
      gulp.src('*.txt', {buffer: false})
        .pipe(zopfli())
        .pipe(es.map(function(file, callback) {
          // Check if file contents is a Buffer object
          file.contents.should.be.instanceof(Stream); // should.have.type didn't work
          callback(null, null);
          done();
        }));
    });

    it('should create a .gz file in buffer mode', function(done) {
      var outStream = gulp.dest('./');

      // Capture close event of the write stream so we know when gulp.dest finishes
      outStream.on('close', function() {
        // Get the compressed file
        fs.readFile('./input.txt.gz', function(err, file) {

          // Check if the file was found
          should.not.exist(err);
          should.exist(file);
          file.should.not.be.empty;

          done();
        });
      });
      gulp.src('*.txt')
        .pipe(zopfli())
        .pipe(outStream);
    });

    it('should create a .gz file in stream mode', function(done) {

      var outStream = gulp.dest('./');

      // Capture close event of the write stream so we know when gulp.dest finishes
      outStream.on('close', function() {
        // Get the compressed file
        fs.readFile('./input.txt.gz', function(err, file) {

          // console.log(util.inspect(file));

          // Check if the file was found
          should.not.exist(err);
          should.exist(file);
          file.should.not.be.empty;

          done();
        });
      });
      gulp.src('*.txt', {buffer: false})
        .pipe(zopfli())
        .pipe(outStream);
    });

    it('should match uncompressed file with original file (gzip)', function(done) {

      var outStream = gulp.dest('./');

      // Capture close event of the write stream so we know when gulp.dest finishes
      outStream.on('close', function() {

        // Get the compressed file
        fs.readFile('./input.txt.gz', function(err, file) {
          // Uncompress the file
          zlib.gunzip(file, function(err, uncompressedFileBuffer) {
            // Convert buffer to utf8 string
            var uncompressedFile = uncompressedFileBuffer.toString('utf8', 0, uncompressedFileBuffer.length);
            // console.log(util.inspect(uncompressedFile));

            // Get original file as utf8 string
            fs.readFile('./input.txt', {encoding: 'utf8'}, function(err, originalFile) {
              // console.log(util.inspect(originalFile));

              // Compare the original file to the uncompressed .gz file
              originalFile.should.equal(uncompressedFile);

              done();
            });
          });
        });
      });
      gulp.src('*.txt')
        .pipe(zopfli())
        .pipe(outStream);
    });

    it('should match uncompressed file with original file (zlib)', function(done) {

      var outStream = gulp.dest('./');

      // Capture close event of the write stream so we know when gulp.dest finishes
      outStream.on('close', function() {

        // Get the compressed file
        fs.readFile('./input.txt.zz', function(err, file) {
          // Uncompress the file
          zlib.unzip(file, function(err, uncompressedFileBuffer) {
            // Convert buffer to utf8 string
            var uncompressedFile = uncompressedFileBuffer.toString('utf8', 0, uncompressedFileBuffer.length);
            // console.log(util.inspect(uncompressedFile));

            // Get original file as utf8 string
            fs.readFile('./input.txt', {encoding: 'utf8'}, function(err, originalFile) {
              // console.log(util.inspect(originalFile));

              // Compare the original file to the uncompressed .gz file
              originalFile.should.equal(uncompressedFile);

              done();
            });
          });
        });
      });
      gulp.src('*.txt')
        .pipe(zopfli({format: 'zlib'}))
        .pipe(outStream);
    });

    it('should match uncompressed file with original file (deflate)', function(done) {

      var outStream = gulp.dest('./');

      // Capture close event of the write stream so we know when gulp.dest finishes
      outStream.on('close', function() {

        // Get the compressed file
        fs.readFile('./input.txt.deflate', function(err, file) {
          // Uncompress the file
          zlib.inflateRaw(file, function(err, uncompressedFileBuffer) {
            // Convert buffer to utf8 string
            var uncompressedFile = uncompressedFileBuffer.toString('utf8', 0, uncompressedFileBuffer.length);
            // console.log(util.inspect(uncompressedFile));

            // Get original file as utf8 string
            fs.readFile('./input.txt', {encoding: 'utf8'}, function(err, originalFile) {

              // Compare the original file to the uncompressed .gz file
              originalFile.should.equal(uncompressedFile);

              done();
            });
          });
        });
      });
      gulp.src('*.txt')
        .pipe(zopfli({format: 'deflate'}))
        .pipe(outStream);
    });

    it('should match uncompressed file with original file in stream mode', function(done) {

      var outStream = gulp.dest('./', {buffer: false});

      // Capture close event of the write stream so we know when gulp.dest finishes
      outStream.on('close', function() {

        // Get the compressed file
        fs.readFile('./input.txt.gz', function(err, file) {
          // Uncompress the file
          zlib.gunzip(file, function(err, uncompressedFileBuffer) {
            // Convert buffer to utf8 string
            var uncompressedFile = uncompressedFileBuffer.toString('utf8', 0, uncompressedFileBuffer.length);
            // console.log(util.inspect(uncompressedFile));

            // Get original file as utf8 string
            fs.readFile('./input.txt', {encoding: 'utf8'}, function(err, originalFile) {
              if(err) {
                throw err;
              }
              // Compare the original file to the uncompressed .gz file
              originalFile.should.equal(uncompressedFile);

              done();
            });
          });
        });
      });
      gulp.src('*.txt', {buffer: false})
        .pipe(zopfli())
        .pipe(outStream);
    });
  });
});
