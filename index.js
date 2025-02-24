/* global Buffer */

'use strict';

Object.defineProperty(exports, 'commentRegex', {
  get: function getCommentRegex () {
    // Deprecated, left for compatibility. Does not comply with RFC 2397.
    return /^\s*\/(?:\/|\*)[@#]\s+sourceMappingURL=data:(?:application|text)\/json;(?:charset[:=]\S+?;)?base64,(?:.*)$/mg;
  }
});

Object.defineProperty(exports, 'commentRegex2', {
  get: function getCommentRegex2 () {
    return /^\s*\/(?:\/|\*)[@#]\s+sourceMappingURL=data:(((?:application|text)\/json)(?:;charset=[^;,]+?)?)?(?:;base64)?,.*$/mg;
  }
});

Object.defineProperty(exports, 'commentRegex3', {
  get: function getCommentRegex3 () {
    // Groups: 1: media type, 2: MIME type, 3: charset, 4: encoding, 5: data.
    return /^\s*\/(?:\/|\*)[@#]\s+sourceMappingURL=data:(((?:application|text)\/json)(?:;charset=([^;,]+)?)?)?(?:;(base64))?,(.*)$/;
  }
});

Object.defineProperty(exports, 'mapFileCommentRegex', {
  get: function getMapFileCommentRegex () {
    // Matches sourceMappingURL in either // or /* comment styles.
    return /(?:\/\/[@#][ \t]+sourceMappingURL=([^\s'"`]+?)[ \t]*$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^*]+?)[ \t]*(?:\*\/){1}[ \t]*$)/mg;
  }
});

var hasOwnProp = Object.prototype.hasOwnProperty;

var decodeBase64 = typeof Buffer !== 'undefined' ? Buffer.from ?
  function decodeBase64(base64) {
    return Buffer.from(base64, 'base64').toString();
  } :
  function decodeBase64(base64) {
    return new Buffer(base64, 'base64').toString();
  } :
  function decodeBase64(base64) {
    return decodeURIComponent(escape(atob(base64)));
  };

function stripComment(sm) {
  return sm.split(',').pop();
}

function readFromFileMap(sm, dir, readMap) {
  var r = exports.mapFileCommentRegex.exec(sm);
  // for some odd reason //# .. captures in 1 and /* .. */ in 2
  var filename = r[1] || r[2];
  var filepath;

  if (dir.endsWith('/')) dir = dir.substring(0, dir.length - 1);
  if (filename.startsWith('/')) filename = filename.substring(1);
  filepath = dir + '/' + filename;

  try {
    sm = readMap(filepath);
    return typeof sm === 'string' ? sm : sm.then(undefined, throwError);
  } catch (e) {
    throwError(e);
  }

  function throwError(e) {
    throw new Error('An error occurred while trying to read the map file at ' + filepath + '\n' + e);
  }
}

function Converter (sm, opts) {
  opts = opts || {};

  if (opts.hasComment) sm = stripComment(sm);
  if (opts.encoding === 'base64') sm = decodeBase64(sm);
  else if (opts.encoding === 'uri') sm = decodeURIComponent(sm);
  if (opts.isJSON || opts.encoding) sm = JSON.parse(sm);

  this.sourcemap = sm;
}

Converter.prototype.toJSON = function (space) {
  return JSON.stringify(this.sourcemap, null, space);
};

Converter.prototype.toURI = function () {
  var json = this.toJSON();
  return encodeURIComponent(json);
};

Converter.prototype.toBase64 = typeof Buffer !== 'undefined' ? Buffer.from ?
  function () {
    var json = this.toJSON();
    return Buffer.from(json, 'utf8').toString('base64');
  } :
  function () {
    var json = this.toJSON();
    return new Buffer(json, 'utf8').toString('base64');
  } :
  function () {
    var json = this.toJSON();
    return btoa(unescape(encodeURIComponent(json)));
  };

Converter.prototype.toComment = function (options) {
  var encoding, content, data;
  if (options && options.encoding === 'uri') {
    encoding = '';
    content = this.toURI();
  } else {
    encoding = ';base64';
    content = this.toBase64();
  }
  data = 'sourceMappingURL=data:application/json;charset=utf-8' + encoding + ',' + content;
  return options && options.multiline ? '/*# ' + data + ' */' : '//# ' + data;
};

// returns copy instead of original
Converter.prototype.toObject = function () {
  return JSON.parse(this.toJSON());
};

Converter.prototype.addProperty = function (key, value) {
  if (hasOwnProp.call(this.sourcemap, key)) throw new Error('property "' + key + '" already exists on the sourcemap, use set property instead');
  return this.setProperty(key, value);
};

Converter.prototype.setProperty = function (key, value) {
  this.sourcemap[key] = value;
  return this;
};

Converter.prototype.getProperty = function (key) {
  return this.sourcemap[key];
};

exports.fromObject = function (obj) {
  return new Converter(obj);
};

exports.fromJSON = function (json) {
  return new Converter(json, { isJSON: true });
};

exports.fromURI = function (uri) {
  return new Converter(uri, { encoding: 'uri' });
};

exports.fromBase64 = function (base64) {
  return new Converter(base64, { encoding: 'base64' });
};

exports.fromComment = function (comment) {
  var m, encoding;
  comment = comment
    .replace(/^\/\*/g, '//')
    .replace(/\*\/$/g, '');
  m = comment.match(exports.commentRegex3);
  encoding = m && m[4] || 'uri';
  return new Converter(comment, { encoding: encoding, hasComment: true });
};

exports.fromMapFileComment = function (comment, dir, readMap) {
  var sm = readFromFileMap(comment, dir, readMap);
  return typeof sm === 'string' ? newConverter(sm) : sm.then(newConverter);

  function newConverter(sm) {
    return new Converter(sm, { isJSON: true });
  }
};

// Finds last sourcemap comment in file or returns null if none was found
exports.fromSource = function (content) {
  var m = content.match(exports.commentRegex2);
  return m ? exports.fromComment(m.pop()) : null;
};

// Finds last sourcemap comment in file or returns null if none was found
exports.fromMapFileSource = function (content, dir, readMap) {
  var m = content.match(exports.mapFileCommentRegex);
  return m ? exports.fromMapFileComment(m.pop(), dir, readMap) : null;
};

exports.removeComments = function (src) {
  return src.replace(exports.commentRegex2, '');
};

exports.removeMapFileComments = function (src) {
  return src.replace(exports.mapFileCommentRegex, '');
};

exports.generateMapFileComment = function (file, options) {
  var data = 'sourceMappingURL=' + file;
  return options && options.multiline ? '/*# ' + data + ' */' : '//# ' + data;
};
