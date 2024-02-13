// import MicrophoneStream from 'microphone-stream'
import transcribeConfig from './constants'

const MicrophoneStream = require('microphone-stream').default

const encodePCMChunk = (chunk) => {
  const input = MicrophoneStream.toRaw(chunk)
  let offset = 0
  const buffer = new ArrayBuffer(input.length * 2)
  const view = new DataView(buffer)
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
  return Buffer.from(buffer)
}

export async function* getAudioStream(microphoneStream) {
  for await (const chunk of microphoneStream) {
    if (chunk.length <= transcribeConfig.sampleRate) {
      yield {
        AudioEvent: {
          AudioChunk: encodePCMChunk(chunk),
        },
      }
    }
  }
}
