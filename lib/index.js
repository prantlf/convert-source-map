export function getCommentRegex() {
  // Deprecated, left for compatibility. Does not comply with RFC 2397.
  return /^\s*\/(?:\/|\*)[@#]\s+sourceMappingURL=data:(?:application|text)\/json;(?:charset[:=]\S+?;)?base64,(?:.*)$/mg
}

export function getCommentRegex2() {
  return /^\s*\/(?:\/|\*)[@#]\s+sourceMappingURL=data:(((?:application|text)\/json)(?:;charset=[^;,]+?)?)?(?:;base64)?,.*$/mg
}

export function getCommentRegex3() {
  // Groups: 1: media type, 2: MIME type, 3: charset, 4: encoding, 5: data.
  return /^\s*\/(?:\/|\*)[@#]\s+sourceMappingURL=data:(((?:application|text)\/json)(?:;charset=([^;,]+)?)?)?(?:;(base64))?,(.*)$/
}

export function getMapFileCommentRegex() {
  // Matches sourceMappingURL in either // or /* comment styles.
  return /(?:\/\/[@#][ \t]+sourceMappingURL=([^\s'"`]+?)[ \t]*$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^*]+?)[ \t]*(?:\*\/){1}[ \t]*$)/mg
}

var decodeBase64 = typeof Buffer !== 'undefined' ?
  function decodeBase64(base64) {
    // eslint-disable-next-line no-undef
    return Buffer.from(base64, 'base64').toString()
  /* c8 ignore next 4 (old node) */
  } :
  /* c8 ignore next 3 (browser) */
  function decodeBase64(base64) {
    return new TextDecoder().decode(Uint8Array.fromBase64(base64))
  }

function stripComment(sm) {
  return sm.substring(sm.indexOf(',') + 1)
}

function readFromFileMap(sm, dir, readMap) {
  var r = getMapFileCommentRegex().exec(sm)
  // for some odd reason //# .. captures in 1 and /* .. */ in 2
  var filename = r[1] || r[2]
  var filepath

  /* c8 ignore next 2 (incomplete test) */
  if (dir.endsWith('/')) dir = dir.substring(0, dir.length - 1)
  if (filename.startsWith('/')) filename = filename.substring(1)
  filepath = `${dir}/${filename}`

  try {
    sm = readMap(filepath)
    return typeof sm === 'string' ? sm : sm.then(undefined, throwError)
  /* c8 ignore next 7 (missing test) */
  } catch (e) {
    throwError(e)
  }

  function throwError(e) {
    throw new Error(`An error occurred while trying to read the map file at ${filepath}\n${e}`)
  }
}

class Converter {
  constructor(sm, opts) {
    opts = opts || {}

    if (opts.hasComment) sm = stripComment(sm)
    if (opts.encoding === 'base64') sm = decodeBase64(sm)
    else if (opts.encoding === 'uri') sm = decodeURIComponent(sm)
    if (opts.isJSON || opts.encoding) sm = JSON.parse(sm)

    this.sourcemap = sm
  }

  toJSON(space) {
    return JSON.stringify(this.sourcemap, null, space)
  }

  toURI() {
    var json = this.toJSON()
    return encodeURIComponent(json)
  }

  toComment(options) {
    var encoding, content, data
    if (options && options.encoding === 'uri') {
      encoding = ''
      content = this.toURI()
    } else {
      encoding = ';base64'
      content = this.toBase64()
    }
    data = `sourceMappingURL=data:application/json;charset=utf-8${encoding},${content}`
    return options?.multiline ? `/*# ${data} */` : `//# ${data}`
  }

  // returns copy instead of original
  toObject() {
    return JSON.parse(this.toJSON())
  }

  addProperty(key, value) {
    if (Object.hasOwn(this.sourcemap, key)) throw new Error(`property "${key}" already exists on the sourcemap, use set property instead`)
    return this.setProperty(key, value)
  }

  setProperty(key, value) {
    this.sourcemap[key] = value
    return this
  }

  getProperty(key) {
    return this.sourcemap[key]
  }
}

// Keep conditional assignment for toBase64 method
Converter.prototype.toBase64 = typeof Buffer !== 'undefined' ?
  function () {
    var json = this.toJSON()
    // eslint-disable-next-line no-undef
    return Buffer.from(json, 'utf8').toString('base64')
  /* c8 ignore next 5 (old node) */
  } :
  /* c8 ignore next 4 (browser) */
  function () {
    var json = this.toJSON()
    return new TextEncoder().encode(json).toBase64()
  }

export function fromObject(obj) {
  return new Converter(obj)
}

export function fromJSON(json) {
  return new Converter(json, { isJSON: true })
}

export function fromURI(uri) {
  return new Converter(uri, { encoding: 'uri' })
}

export function fromBase64(base64) {
  return new Converter(base64, { encoding: 'base64' })
}

export function fromComment(comment) {
  var m, encoding
  comment = comment
    .replace(/^\/\*/g, '//')
    .replace(/\*\/$/g, '')
  m = comment.match(getCommentRegex3())
  encoding = m?.[4] || 'uri'
  return new Converter(comment, { encoding: encoding, hasComment: true })
}

export function fromMapFileComment(comment, dir, readMap) {
  var sm = readFromFileMap(comment, dir, readMap)
  return typeof sm === 'string' ? newConverter(sm) : sm.then(newConverter)

  function newConverter(sm) {
    return new Converter(sm, { isJSON: true })
  }
}

// Finds last sourcemap comment in file or returns null if none was found
export function fromSource(content) {
  var m = content.match(getCommentRegex2())
  return m ? fromComment(m.pop()) : null
}

// Finds last sourcemap comment in file or returns null if none was found
export function fromMapFileSource(content, dir, readMap) {
  var m = content.match(getMapFileCommentRegex())
  /* c8 ignore next (incomplete tests) */
  return m ? fromMapFileComment(m.pop(), dir, readMap) : null
}

export function removeComments(src) {
  return src.replace(getCommentRegex2(), '')
}

export function removeMapFileComments(src) {
  return src.replace(getMapFileCommentRegex(), '')
}

export function generateMapFileComment(file, options) {
  var data = `sourceMappingURL=${file}`
  return options?.multiline ? `/*# ${data} */` : `//# ${data}`
}

export default {
  fromBase64, fromComment, fromJSON, fromMapFileComment, fromMapFileSource,
  fromObject, fromSource, fromURI, generateMapFileComment, getCommentRegex,
  getCommentRegex2, getCommentRegex3, getMapFileCommentRegex, removeComments,
  removeMapFileComments
}
