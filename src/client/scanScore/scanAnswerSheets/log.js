export default function log(...args) {
  if (
    typeof process === 'object' &&
    typeof process['sendToConsole'] === 'function'
  ) {
    console.log('args', args)
    process['sendToConsole'](...args)
  }
}
