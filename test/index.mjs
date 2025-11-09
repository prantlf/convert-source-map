import {
  fromBase64, fromComment, fromJSON, fromMapFileComment, fromMapFileSource,
  fromObject, fromSource, fromURI, generateMapFileComment, getCommentRegex,
  getCommentRegex2, getCommentRegex3, getMapFileCommentRegex, removeComments,
  removeMapFileComments
} from '../lib/index.mjs'

let _c = fromBase64('e30=')
_c = fromComment('//#sourceMappingURL=data:application/json,{}')
_c = fromJSON('{}')
_c = fromURI('{}')
_c = fromSource('')
_c = fromMapFileComment('//# sourceMappingURL=index.js.map', '', () => '{}')
_c = fromMapFileSource('', '', () => '')
_c = await fromMapFileComment('//# sourceMappingURL=index.js.map', '', async () => '{}')
_c = await fromMapFileSource('', '', async () => '')
_c = fromObject({})

let _s = removeComments('')
_s = removeMapFileComments('')

_s = generateMapFileComment('')
_s = generateMapFileComment('', { multiline: true })

let _r = getCommentRegex()
_r = getCommentRegex2()
_r = getCommentRegex3()
_r = getMapFileCommentRegex()

_c = _c.addProperty('', {})
_c = _c.setProperty('', {})
let _v = _c.getProperty('')
_s = _c.toBase64()
_s = _c.toComment()
_s = _c.toComment({ multiline: true })
_s = _c.toComment({ encoding: 'uri' })
_s = _c.toJSON()
_s = _c.toJSON('')
_s = _c.toURI()
let _o = _c.toObject()
