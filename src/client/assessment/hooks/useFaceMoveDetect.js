
import { useRef, useState } from 'react'

const VIDEO_WIDTH = 480
const RUNNING_MODE = 'VIDEO'
const LOOKING_AWAY_SENSTIVITY = 70
const VIDEO_RECORD_TIME_IN_MS = 5000
const SETTLING_TIME = 5000
const MIRROR_DELAY = 2000

export const useFaceMoveDetect = (isDebugLogEnabled) => {
  //   let _stream: MediaStream | undefined;
  const streamRef = useRef()
  const webcamVideoRef = useRef(null)
  const outputCanvasRef = useRef(null)
  const debugOutRef = useRef(null)
  const intermediaryCanvasRef = useRef(null)
  const delayedMirrorCanvasRef = useRef(null)
  const [isWebcamRunning, setIsWebcamRunning] = useState(false)
  const isWebcamRunningRef = useRef(false)
  const isRecordingRef = useRef(false)
  const shouldRecordRef = useRef(false)
  const startTimeRef = useRef(performance.now())
  const [videoUrls, setVideoUrls] = useState([])
  const [
    isSuspiciousActivityDetected,
    setIsSuspiciousActivityDetected,
  ] = useState(false)
  const [suspiciousActivityMessage, setSuspiciousActivityMessage] = useState(
    'No Suspicious Activity Detected yet!'
  )

  const framesRef = useRef([])

  // Check if webcam access is supported.
  function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  }

//   async function createFaceLandmarker() {
// 	const vision = await window.import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3");
// 	const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;
// 	window.DrawingUtils = DrawingUtils;
//     const filesetResolver = await FilesetResolver.forVisionTasks(
//       'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
//     )
//     const faceLandmarker = await FaceLandmarker.createFromOptions(
//       filesetResolver,
//       {
//         baseOptions: {
//           modelAssetPath: `/models/face_landmarker.task`,
//         },
//         outputFaceBlendshapes: true,
//         runningMode: RUNNING_MODE,
//         numFaces: 2,
//       }
//     )

//     return faceLandmarker
//   }

  function drawBlendShapes(blendShapes) {
    if (!blendShapes.length || !debugOutRef.current) {
      return
    }
    if (isDebugLogEnabled) {
      console.log(blendShapes[0])
    }

    let htmlMaker = ``
    blendShapes[0].categories.map((shape) => {
      htmlMaker += `
				<li style="flex-basis:25%;">
				  <span style="font-weight: bold;">${
            shape.displayName || shape.categoryName
          }</span>
				  <progress value="${+shape.score * 100}" max="100" >+${parseInt(
        `${shape.score * 100}`
      )}</progress>
				  <span>${parseInt(`${shape.score * 100}`)}</span>
				</li>
			  `
    })
    htmlMaker += ``

    el.innerHTML = htmlMaker
  }

  const getCategoryScore = (categories, categoryName) => {
    for (const category of categories) {
      if (category.categoryName === categoryName) {
        return parseInt(`${category.score * 100}`)
      }
    }
    return 0
  }

  const recordActivity = () => {
    if (isRecordingRef.current !== true) {
      shouldRecordRef.current = true
    }
  }

  const detectSuspiciousActivity = (blendShapes) => {
    const timePassed = performance.now() - startTimeRef.current
    if (
      !blendShapes.length &&
      timePassed >= SETTLING_TIME &&
      isWebcamRunningRef.current
    ) {
      console.log('got no blendShapes>>>>>>>>>>>>>>')
      recordActivity()
      setIsSuspiciousActivityDetected(true)
      setSuspiciousActivityMessage(
        'Suspicious Activity Detected! Person seems to have left the seat.'
      )
    } else if (blendShapes.length > 1) {
      console.log('got multiple blendShapes>>>>>>>>>>>>>>')
      recordActivity()
      setIsSuspiciousActivityDetected(true)
      setSuspiciousActivityMessage(
        'Suspicious Activity Detected! More than one person detected'
      )
    } else if (
      blendShapes?.[0]?.categories &&
      ((getCategoryScore(blendShapes[0].categories, 'eyeLookInLeft') >
        LOOKING_AWAY_SENSTIVITY &&
        getCategoryScore(blendShapes[0].categories, 'eyeLookOutRight') >
          LOOKING_AWAY_SENSTIVITY) ||
        (getCategoryScore(blendShapes[0].categories, 'eyeLookInRight') >
          LOOKING_AWAY_SENSTIVITY &&
          getCategoryScore(blendShapes[0].categories, 'eyeLookOutLeft') >
            LOOKING_AWAY_SENSTIVITY) ||
        getCategoryScore(blendShapes[0].categories, 'eyeSquintRight') >
          LOOKING_AWAY_SENSTIVITY ||
        getCategoryScore(blendShapes[0].categories, 'eyeSquintLeft') >
          LOOKING_AWAY_SENSTIVITY)
    ) {
      console.log('detected person looking away >>>>>>>>>>>>>>')
      //If person is looking away
      recordActivity()
      setIsSuspiciousActivityDetected(true)
      setSuspiciousActivityMessage(
        'Suspicious Activity Detected! Looking away from screen'
      )
    } else {
      setIsSuspiciousActivityDetected(false)
      setSuspiciousActivityMessage('No Suspicious Activity Detected yet!')
    }
  }

  const saveVideo = (blob) => {
    const videoUrl = window.URL.createObjectURL(blob)
    const timestamp = new Date()
    const dateTime = Date.now();
    setVideoUrls((videoUrls) => [
      ...videoUrls,
      { timestamp: dateTime, url: videoUrl },
    ])
  }

  const startRecording = () => {
    const videoElement = delayedMirrorCanvasRef.current

    if (videoElement) {
      const videoStream = videoElement.captureStream()
      const mediaRecorder = new MediaRecorder(videoStream, {
        mimeType: 'video/webm',
      })
      mediaRecorder.ondataavailable = (e) => {
        saveVideo(e.data)
      }
      setTimeout(() => {
        mediaRecorder.stop()
        isRecordingRef.current = false
      }, VIDEO_RECORD_TIME_IN_MS)
      mediaRecorder.start()
    }
  }

  const stopWebCam = async () => {
    isWebcamRunningRef.current = false
    setIsWebcamRunning(false)

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop()
      })
    }
  }

  async function startWebCam() {
    startTimeRef.current = performance.now()
    const video = webcamVideoRef.current
    const canvasElement = outputCanvasRef.current

    const canvasCtx = canvasElement.getContext('2d')
    const intermediaryCanvas = intermediaryCanvasRef.current
    const intermediaryCTx = intermediaryCanvas.getContext('2d', {
      willReadFrequently: true,
    })
    const delayedMirrorCanvas = delayedMirrorCanvasRef.current
    const delayedCtx = delayedMirrorCanvas.getContext('2d')

    setIsWebcamRunning(true)
    isWebcamRunningRef.current = true

    const faceLandmarker = await createFaceLandmarker()
    const constraints = {
      video: true,
    }

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      streamRef.current = stream
      video.srcObject = stream
      video.addEventListener('loadeddata', () => {
        predictWebcam()
      })
    })

    let lastVideoTime = -1
    let results = undefined
    const drawingUtils = new DrawingUtils(canvasCtx)
    const predictWebcam = async () => {
      //console.time('frame took');
      if (!isRecordingRef.current && shouldRecordRef.current) {
        isRecordingRef.current = true
        shouldRecordRef.current = false
        startRecording()
      }
      const ratio = video.videoHeight / video.videoWidth
      video.style.width = VIDEO_WIDTH + 'px'
      video.style.height = VIDEO_WIDTH * ratio + 'px'
      canvasElement.style.width = VIDEO_WIDTH + 'px'
      canvasElement.style.height = VIDEO_WIDTH * ratio + 'px'

      delayedMirrorCanvas.width = intermediaryCanvas.width = canvasElement.width =
        video.videoWidth
      delayedMirrorCanvas.height = intermediaryCanvas.height = canvasElement.height =
        video.videoHeight
      if (!(intermediaryCTx && delayedCtx)) {
        window.requestAnimationFrame(predictWebcam)
        return
      }
      intermediaryCTx.drawImage(
        video,
        0,
        0,
        video.videoWidth,
        video.videoHeight
      )
      const data = intermediaryCTx.getImageData(
        0,
        0,
        video.videoWidth,
        video.videoWidth
      )
      const now = Date.now()
      framesRef.current.push([now, data])
      // Discard out of date images and copy head of queue to second canvas
      while (
        framesRef.current.length >= 2 &&
        framesRef.current[0][0] < now - MIRROR_DELAY
      ) {
        framesRef.current.shift()
      }
      delayedCtx.putImageData(framesRef.current[0][1], 0, 0)

      // Now let's start detecting the stream.

      await faceLandmarker.setOptions({ runningMode: RUNNING_MODE })

      let startTimeMs = performance.now()
      if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime
        // console.time('core')
        results = faceLandmarker.detectForVideo(video, startTimeMs)
        //console.timeEnd('core')
      }

      if (results.faceLandmarks) {
        for (const landmarks of results.faceLandmarks) {
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_TESSELATION,
            { color: '#C0C0C070', lineWidth: 1 }
          )
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
            { color: '#FF3030' }
          )
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
            { color: '#FF3030' }
          )
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
            { color: '#30FF30' }
          )
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
            { color: '#30FF30' }
          )
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
            { color: '#E0E0E0' }
          )
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LIPS,
            { color: '#E0E0E0' }
          )
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
            { color: '#FF3030' }
          )
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
            { color: '#30FF30' }
          )
        }
      }

      //drawBlendShapes( results.faceBlendshapes);
      detectSuspiciousActivity(results.faceBlendshapes)

      // Call this function again to keep predicting when the browser is ready.
      if (isWebcamRunningRef.current === true) {
        window.requestAnimationFrame(predictWebcam)
      }
      //console.timeEnd('frame took');
    }
  }

  return {
    isDetecting: !!isWebcamRunning,
    startDetection: startWebCam,
    stopDetection: stopWebCam,
    checkWebcamSupport: hasGetUserMedia,
    isSuspiciousActivityDetected,
    suspiciousActivityMessage,
    videoUrls,
    webcamVideoRef,
    delayedMirrorCanvasRef,
    intermediaryCanvasRef,
    outputCanvasRef,
	debugOutRef,
  }
}
