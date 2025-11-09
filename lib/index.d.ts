/**
 * Provides a fresh RegExp each time it is accessed. Can be used to find source map comments.
 * Deprecated, left for compatibility. Does not comply with RFC 2397.
 */
export function getCommentRegex(): RegExp

/**
 * Provides a fresh RegExp each time it is accessed.
 * Can be used to find source map comments.
 */
export function getCommentRegex2(): RegExp

/**
 * Breaks down a source map comment into groups:
 * Groups: 1: media type, 2: MIME type, 3: charset, 4: encoding, 5: data.
 */
export function getCommentRegex3(): RegExp

/**
 * Provides a fresh RegExp each time it is accessed.
 * Can be used to find source map comments pointing to map files.
 */
export function getMapFileCommentRegex(): RegExp

export interface CommentOptions {
  multiline?: true
}

export interface EncodedCommentOptions extends CommentOptions {
  encoding?: 'uri'
}

export interface Converter {
  /** Converts source map to json string. If space is given (optional), this will be passed to JSON.stringify */
  toJSON(space?: string): string

  /** Converts source map to uri encoded json string */
  toURI(): string

  /** Converts source map to base64 encoded json string */
  toBase64(): string

  /**
   * Converts source map to an inline comment that can be appended to the source-file.
   * By default, the comment is formatted like: //# sourceMappingURL=...
   * When options.encoding == 'uri', the data will be uri encoded, otherwise base64 encoded.
   * When options.multiline == true, the comment is formatted like: /*# sourceMappingURL=... *\/
   */
  toComment(options?: EncodedCommentOptions): string

  /** Returns a copy of the underlying source map */
  toObject(): Record<string, any>

  /** Adds given property to the source map. Throws an error if property already exists */
  addProperty(key: string, value: any): Converter

  /** Sets given property to the source map. If property doesn't exist it is added, otherwise its value is updated */
  setProperty(key: string, value: any): Converter

  /** Gets given property of the source map */
  getProperty(key: string): any
}

/** Returns source map converter from given object */
export function fromObject(obj: Record<string, any>): Converter

/** Returns source map converter from given json string */
export function fromJSON(json: string): Converter

/** Returns source map converter from given uri encoded json string */
export function fromURI(uri: string): Converter

/** Returns source map converter from given base64 encoded json string */
export function fromBase64(base64: string): Converter

/** Returns source map converter from given base64 or uri encoded json string prefixed with //# sourceMappingURL=... */
export function fromComment(comment: string): Converter

export type ReadMap = (file: string) => string | Promise<string>

/**
 * Returns source map converter from given filename by parsing //# sourceMappingURL=filename
 * @param comment The sourceMappingURL comment
 * @param dir The directory containing the source map file
 * @param readMap Function to read the source map file, can return string or Promise<string>
 */
export function fromMapFileComment(comment: string, dir: string, readMap: ReadMap): Converter | Promise<Converter>

/** Finds last sourcemap comment in file and returns source map converter or returns null if no source map comment was found */
export function fromSource(content: string): Converter

/**
 * Finds last sourcemap comment in file and returns source map converter or returns null if no source map comment was found.
 * The sourcemap will be read from the map file found by parsing # sourceMappingURL=file comment
 */
export function fromMapFileSource(content: string, dir: string, readMap: ReadMap): Converter | Promise<Converter>

/** Returns src with all source map comments removed */
export function removeComments(src: string): string

/** Returns src with all source map comments pointing to map files removed */
export function removeMapFileComments(src: string): string

/**
 * Returns a comment that links to an external source map via file.
 * By default, the comment is formatted like: //# sourceMappingURL=...
 * When options.multiline == true, the comment is formatted like: /*# sourceMappingURL=... *\/
 */
export function generateMapFileComment(file: string, options?: CommentOptions): string
