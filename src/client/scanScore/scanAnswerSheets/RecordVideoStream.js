import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'

const recordOptions = { mimeType: 'video/webm' }

function RecordVideoStream({ onVideoUrlReady }, ref) {
  /**
   * @type {React.MutableRefObject<MediaRecorder>}
   */
  const mediaRecorderRef = useRef()
  /**
   * @type {React.MutableRefObject<Blob[]>}
   */
  const recordedChunksRef = useRef([])

  useImperativeHandle(ref, () => ({
    start: (stream) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
        recordedChunksRef.current = []
      }
      mediaRecorderRef.current = new MediaRecorder(stream, recordOptions)
      mediaRecorderRef.current.ondataavailable = function (e) {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.start(100)
    },
  }))

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        try {
          mediaRecorderRef.current.stop()
        } catch (e) {
          console.info('media recorder already stopped')
        }
      }
      if (recordedChunksRef.current.length) {
        const videoUrl = URL.createObjectURL(
          new Blob(recordedChunksRef.current)
        )
        if (onVideoUrlReady) {
          onVideoUrlReady(videoUrl)
        }
        recordedChunksRef.current = []
      }
    }
  }, [])

  return null
}

export default forwardRef(RecordVideoStream)
