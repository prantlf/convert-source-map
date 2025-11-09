# Changes

## [3.0.2](https://github.com/prantlf/convert-source-map/compare/v3.0.1...v3.0.2) (2025-11-09)

### Bug Fixes

* Add TypeScript types to package.json ([2218051](https://github.com/prantlf/convert-source-map/commit/2218051bdea6c7cc3eb02fceec745ae6c11e09a8))

## [3.0.1](https://github.com/prantlf/convert-source-map/compare/v3.0.0...v3.0.1) (2025-11-09)

### Bug Fixes

* Add default export to ESM output - object with all functions ([85e3442](https://github.com/prantlf/convert-source-map/commit/85e34425ddc6939b70b50e06a73372561076ffc9))

## [3.0.0](https://github.com/prantlf/convert-source-map/compare/v2.1.0...v3.0.0) (2025-11-09)

### Features

* Add ESM and UMD module export formats and TypeScript types ([590c3bd](https://github.com/prantlf/convert-source-map/commit/590c3bdf68a0ee3e0e4915678bf7046c8a20b452))

### Bug Fixes

* Fix stripComment for when data uri contains commas ([8ce44d6](https://github.com/prantlf/convert-source-map/commit/8ce44d67fe615c897f5e1e15e46fb8bc879a00eb))

### BREAKING CHANGES

Properties `commentRegex`, `commentRegex2`, `commentRegex3` and `mapFileCommentRegex` were converted to functions `getCommentRegex`, `getCommentRegex2`, `getCommentRegex3` and `getMapFileCommentRegex`. This was needed for adding the ESM export format, whcih doesn't allow exporting properties with getters.

## [2.1.0](https://github.com/prantlf/convert-source-map/compare/v2.0.0...v2.1.0) (2025-05-14)

### Features

* Upgrade dependencies ([ae07940](https://github.com/prantlf/convert-source-map/commit/ae07940713eeb689c604d2ef3f817b7187e4a1de))

## [2.0.0](https://github.com/prantlf/convert-source-map/compare/v1.8.0...v2.0.0) (2022-01-15)

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
