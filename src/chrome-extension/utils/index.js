export const contains = (selector, text) => {
  const elements = document.querySelectorAll(selector)
  return [].filter.call(elements, (element) =>
    RegExp(text).test(element.textContent)
  )
}

export const generateUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

export const ab2str = (buf) =>
  String.fromCharCode.apply(null, new Int8Array(buf))

export const base64ToArrayBuffer = (base64) => {
  const binary_string = window.atob(base64)
  const len = binary_string.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) bytes[i] = binary_string.charCodeAt(i)
  return bytes.buffer
}

export const strToArrayBuffer = (mystr) => {
  const len = mystr.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) bytes[i] = mystr.charCodeAt(i)
  return bytes.buffer
}

export const arrayBufferToBase64 = (buffer) => {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i])
  return window.btoa(binary)
}

export const keyBy = (array, key) =>
  (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {})

export const deviceIdRegEx = /@spaces\/.*\/devices\/([a-f,0-9,-]*)/
export const spaceIdRegEx = /@spaces\/(.*?)\/devices\//
export const updaterIdRegExp = /@spaces\/.*\/devices\/([a-f,0-9,-]*).*\^https/g
