import MicrophoneStream from 'microphone-stream'
import {
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
} from '@aws-sdk/client-transcribe-streaming'

import { getUserMedia } from '../../../assessment/utils/helpers'
import transcribeConfig from './constants'
import { getAudioStream } from './utils'

class TranscribeController {
  constructor() {
    this.microphoneStream = null
    this.rawMediaStream = null
    this.transcribeClient = null
  }

  createMicrophoneStream = async () => {
    this.microphoneStream = new MicrophoneStream()
    this.rawMediaStream = await getUserMedia({
      video: false,
      audio: {
        sampleRate: transcribeConfig.sampleRate,
      },
    })
    await this.microphoneStream.setStream(this.rawMediaStream)
  }

  createTranscribeClient = (configData) => {
    console.log('configData', configData)
    this.transcribeClient = new TranscribeStreamingClient({
      region: configData.region,
      credentials: {
        accessKeyId: configData.accessKeyId,
        secretAccessKey: configData.secretAccessKey,
        sessionToken: configData.sessionToken,
      },
    })
  }

  startStreaming = async ({
    preferredLanguage,
    updateText,
    updateTranscribeSessionId,
  }) => {
    const command = new StartStreamTranscriptionCommand({
      LanguageCode: transcribeConfig.language[preferredLanguage],
      MediaEncoding: transcribeConfig.mediaEncoding,
      MediaSampleRateHertz: transcribeConfig.sampleRate,
      AudioStream: getAudioStream(this.microphoneStream),
    })
    const response = await this.transcribeClient.send(command)
    const { SessionId = null } = response
    updateTranscribeSessionId(SessionId)

    console.log('recognition started', response)

    if (response.TranscriptResultStream) {
      for await (const event of response.TranscriptResultStream) {
        const results = event.TranscriptEvent?.Transcript?.Results
        if (results && results.length > 0) {
          const [result] = results
          const final = !result.IsPartial
          const alternatives = result.Alternatives

          if (alternatives && alternatives.length > 0) {
            const [alternative] = alternatives
            const text = alternative.Transcript
            updateText({ text, final })
          }
        }
      }
    }
  }

  startSpeechToText = async ({
    configData,
    preferredLanguage,
    updateText,
    updateTranscribeSessionId,
  }) => {
    try {
      console.log('startSpeechToText started=============')
      this.createMicrophoneStream()
      this.createTranscribeClient(configData)
      await this.startStreaming({
        preferredLanguage,
        updateText,
        updateTranscribeSessionId,
      })
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  stopSpeechToText = () => {
    console.log('stopSpeechToText******')
    this.microphoneStream?.stop()
    this.microphoneStream?.destroy()
    this.microphoneStream = undefined
    this.rawMediaStream = undefined

    this.transcribeClient?.destroy()
    this.transcribeClient = undefined
  }
}

export default TranscribeController
