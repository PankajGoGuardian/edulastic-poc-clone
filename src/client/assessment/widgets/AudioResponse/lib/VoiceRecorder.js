import Recorder from 'recorder-js'
import { getUserMedia } from '../../../utils/helpers'

class VoiceRecorder {
  constructor() {
    this.streamBeingCaptured = null
    this.recorder = null
  }

  startRecording = async () => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)()
    this.recorder = new Recorder(audioContext)
    const stream = await getUserMedia({ audio: true })
    this.recorder.init(stream)
    this.streamBeingCaptured = stream
    this.recorder.start()
  }

  stopRecording = () => {
    return new Promise((resolve) => {
      this.recorder.stop().then(({ blob }) => {
        resolve(blob)
        this.cancelRecording()
      })
    })
  }

  cancelRecording = () => {
    this.stopStream()
    this.resetRecordingProperties()
  }

  stopStream = () => {
    this.streamBeingCaptured.getTracks().forEach((track) => track.stop())
  }

  resetRecordingProperties = () => {
    this.recorder = null
    this.streamBeingCaptured = null
  }
}

export default VoiceRecorder
