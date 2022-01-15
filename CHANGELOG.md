# [2.0.0](https://github.com/prantlf/convert-source-map/compare/v1.8.0...v2.0.0) (2022-01-15)

### Bug Fixes

* Replace SafeBuffer with Buffer, support BASE64 in the browser ([c2919ce](https://github.com/prantlf/convert-source-map/commit/c2919ce77b40c3b42a3945b0ff8d31336357efa3))
* Support uri encoded source maps ([e4e814a](https://github.com/prantlf/convert-source-map/commit/e4e814ac35f88921d89cbd69a3171a3a4768a9f8))

### Features

* Let a function for reading the source map be specified instead of depending on fs ([1a4d6f1](https://github.com/prantlf/convert-source-map/commit/1a4d6f1d1e3510b73d26c3c438674b2a5b73d4bf))

### BREAKING CHANGES

* Methods fromMapFileComment and fromMapFileSource
                 require an additional parameter - readMap - to
		 read the source map content. They behave synchronously
		 or asynchronously depending on the behaviour
		 of the readMap function.

This is the first release after forking the original project.
