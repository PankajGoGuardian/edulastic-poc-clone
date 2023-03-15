import { getUserMedia } from '../../../utils/helpers'

class VoiceRecorder {
  constructor() {
    this.audioBlobs = []
    this.mediaRecorder = null
    this.streamBeingCaptured = null
  }

  startRecording = async () => {
    const stream = await getUserMedia({ audio: true })
    this.streamBeingCaptured = stream
    this.mediaRecorder = new MediaRecorder(stream)
    this.audioBlobs = []
    this.mediaRecorder.addEventListener('dataavailable', (event) => {
      this.audioBlobs.push(event.data)
    })
    this.mediaRecorder.start()
  }

  stopRecording = () => {
    return new Promise((resolve) => {
      const mimeType = this.mediaRecorder.mimeType
      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(this.audioBlobs, { type: mimeType })
        resolve(audioBlob)
      })
      this.cancelRecording()
    })
  }

  cancelRecording = () => {
    this.mediaRecorder.stop()
    this.stopStream()
    this.resetRecordingProperties()
  }

  stopStream = () => {
    this.streamBeingCaptured.getTracks().forEach((track) => track.stop())
  }

  resetRecordingProperties = () => {
    this.mediaRecorder = null
    this.streamBeingCaptured = null
  }
}

export default VoiceRecorder
