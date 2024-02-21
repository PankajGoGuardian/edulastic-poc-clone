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

  createTranscribeClient = async (configData) => {
    this.transcribeClient = new TranscribeStreamingClient({
      region: configData.region,
      credentials: {
        accessKeyId: configData.AccessKeyId,
        secretAccessKey: configData.SecretAccessKey,
        sessionToken: configData.SessionToken,
      },
    })
  }

  startStreaming = async ({
    preferredLanguage,
    updateTextRef,
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

    if (response.TranscriptResultStream) {
      for await (const event of response.TranscriptResultStream) {
        const results = event.TranscriptEvent?.Transcript?.Results
        if (results && results.length > 0) {
          const [result] = results
          const isFinal = !result.IsPartial
          const alternatives = result.Alternatives

          if (alternatives && alternatives.length > 0) {
            const [alternative] = alternatives
            const text = alternative.Transcript
            updateTextRef?.current?.(text, isFinal)
          }
        }
      }
    }
  }

  startSpeechToText = async ({
    configData,
    preferredLanguage,
    updateTextRef,
    updateTranscribeSessionId,
  }) => {
    try {
      await this.createMicrophoneStream()
      await this.createTranscribeClient(configData)
      await this.startStreaming({
        preferredLanguage,
        updateTextRef,
        updateTranscribeSessionId,
      })
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  stopSpeechToText = () => {
    this.stopAudioStream()
    this.microphoneStream?.stop()
    this.microphoneStream?.destroy()
    this.microphoneStream = undefined
    this.rawMediaStream = undefined

    this.transcribeClient?.destroy()
    this.transcribeClient = undefined
  }

  stopAudioStream = () => {
    ;(this.rawMediaStream?.getAudioTracks?.() || []).forEach((track) => {
      track?.stop()
      this.rawMediaStream?.removeTrack?.(track)
    })
  }
}

export default TranscribeController
