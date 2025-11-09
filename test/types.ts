import {
  fromBase64, fromComment, fromJSON, fromMapFileComment, fromMapFileSource,
  fromObject, fromSource, fromURI, generateMapFileComment, getCommentRegex,
  getCommentRegex2, getCommentRegex3, getMapFileCommentRegex, removeComments,
  removeMapFileComments, type Converter
} from '../lib'

let _c: Converter = fromBase64('')
_c = fromComment('')
_c = fromJSON('{}')
_c = fromURI('')
_c = fromObject({})
_c = fromSource('')
_c = fromMapFileComment('', '', () => '') as Converter
_c = fromMapFileSource('', '', () => '') as Converter

let _p: Promise<Converter> = fromMapFileComment('', '', async () => '') as Promise<Converter>
_p = fromMapFileSource('', '', async () => '') as Promise<Converter>

let _s: string = removeComments('')
_s = removeMapFileComments('')

_s = generateMapFileComment('')
_s = generateMapFileComment('', { multiline: true })

let _r: RegExp = getCommentRegex()
_r = getCommentRegex2()
_r = getCommentRegex3()
_r = getMapFileCommentRegex()

_c = _c.addProperty('', {})
_c = _c.setProperty('', {})
let _v: any = _c.getProperty('')
_s = _c.toBase64()
_s = _c.toComment()
_s = _c.toComment({ multiline: true })
_s = _c.toComment({ encoding: 'uri' })
_s = _c.toJSON()
_s = _c.toJSON('')
_s = _c.toURI()
let _o: Record<string, any> = _c.toObject()
