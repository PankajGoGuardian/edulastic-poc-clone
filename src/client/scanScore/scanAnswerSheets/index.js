import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import qs from 'qs'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Progress } from 'antd'
import { OpenCvProvider, useOpenCv } from 'opencv-react'
import { withRouter } from 'react-router-dom'
import { round } from 'lodash'

import {
  EduButton,
  FlexContainer,
  notification,
  uploadToS3,
} from '@edulastic/common'
import {
  cardBg,
  greyThemeLight,
  greyThemeDark1,
  dragDropUploadText,
  drcThemeColor,
  white,
  secondaryTextColor,
  lightGrey9,
} from '@edulastic/colors'
import { aws } from '@edulastic/constants'
import ConfirmationModal from '@edulastic/common/src/components/SimpleConfirmModal'
import beepSound from '@edulastic/common/src/utils/data/beep-sound.base64.json'
import { scannerApi } from '@edulastic/api'
import { actions, selector } from '../uploadAnswerSheets/ducks'
import { getAnswersFromVideo } from './scannerUtils'
import PageLayout from '../uploadAnswerSheets/PageLayout'
import Spinner from '../../common/components/Spinner'
import { IconEye } from '@edulastic/icons'

const audioRef = new Audio(`data:audio/mp3;base64,${beepSound.base64}`)

const videoContstraints = {
  width: { ideal: 640 },
  height: { ideal: 480 },
  facingMode: { ideal: 'environment' },
}

// TODO: replace IconEye once assets available
const steps = [
  {
    icon: <IconEye />,
    description: 'Hold your bubble sheets so that they are fully visible.',
  },
  {
    icon: <IconEye />,
    description:
      'Ensure the bounding boxes of the response section and the QR code are fully visible and aligned vertically.',
  },
  {
    icon: <IconEye />,
    description: 'Wait for the scanned successful message with a beeper sound.',
  },
  {
    icon: <IconEye />,
    description:
      'Once the message is shown, you can hold your next response sheet to scan.',
  },
  {
    icon: <IconEye />,
    description: 'Click Proceed to next step once all responses are scanned.',
  },
]

/**
 *
 * @param {HTMLCanvasElement} canvas
 */

function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob)
      },
      'image/jpeg',
      0.97 // selected 0.97 (97%) for optimum size & quality
    )
  })
}

/**
 *
 * @param {HTMLCanvasElement} canvas
 */
async function uploadCanvasFrame(canvas, uploadProgress) {
  const { assignmentId } = qs.parse(window.location?.search || '', {
    ignoreQueryPrefix: true,
  })
  const blob = await canvasToBlob(canvas)
  return uploadToS3(
    blob,
    aws.s3Folders.WEBCAM_OMR_UPLOADS,
    uploadProgress,
    `${assignmentId}`
  )
}

const ScanAnswerSheetsInner = ({
  history,
  assignmentTitle,
  classTitle,
  getOmrUploadSessions,
  setWebCamScannedDocs,
}) => {
  let arrLengthOfAnswer = []

  const [confirmScanCompletion, setConfirmScanCompletion] = useState(false)
  const [videoSetting, setVideoSettings] = useState({ width: 640, height: 480 })
  const [isLoading, setIsLoading] = useState(true)
  const [isCameraLoaded, setIsCameraLoad] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isStart, setIsStart] = useState(false)
  const arrAnswersRef = useRef([])
  const { cv, loaded: isOpencvLoaded } = useOpenCv()
  /**
   * uncomment the following line while debugging
   * window.arrAnswersRef = arrAnswersRef
   */
  const [isHelpModalVisible, setHelpModal] = useState(true)

  const [answersList, setAnswers] = useState(null)
  const [scannedResponses, setScannedResponses] = useState([])
  const [scanningPercent, setScanningPercent] = useState(0)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  async function processVideo(vc) {
    const arrAnswers = arrAnswersRef.current
    if (vc) {
      const matSrc = new cv.Mat(480, 640, cv.CV_8UC4)
      vc.read(matSrc)
      let result = null
      if (answersList) {
        cv.imshow('canvas', matSrc)
      } else {
        result = getAnswersFromVideo(cv, matSrc)
      }
      matSrc.delete()
      requestAnimationFrame(() => processVideo(vc))
      if (!result) {
        return
      }
      const { answers } = result
      if (answers) {
        if (answers.length > 0) {
          if (!answersList) {
            const count = arrLengthOfAnswer.filter(
              (item) => item === answers.length
            ).length
            if (count >= 3) {
              const filterCount = arrAnswers.filter(
                (item) => item.qrCode === result.qrCode
              ).length
              if (filterCount > 0) {
                notification({
                  msg: `It is already parsed. Please change the bubble sheet and continue.`,
                  duration: 3,
                  type: 'warning',
                  messageKey: 'alreadyParsedAnswerSheet',
                })
              } else {
                setScanningPercent(0.1)
                arrAnswersRef.current.push(result)
                notification({
                  type: 'success',
                  msg: 'answers detected. Scanning in progress',
                })
                audioRef.play()
                if (canvasRef.current) {
                  const fileUrl = await uploadCanvasFrame(
                    canvasRef.current,
                    (uploadEvent) => {
                      const percent =
                        (uploadEvent.loaded / uploadEvent.total) * 100
                      setScanningPercent(round(percent, 2))
                    }
                  )
                  arrAnswersRef.current[
                    arrAnswersRef.current.length - 1
                  ].imageUri = fileUrl
                  setScanningPercent(0)
                }
                const temp = []
                result.answers.forEach((item, index) => {
                  temp.push(`${index + 1}: ${item}`)
                })
                setScannedResponses((x) => x + 1)
                notification({
                  msg: `Scan Succesful`,
                  description: `${
                    result.qrCode
                  } \n ${result.answers.toString()}`,
                  duration: 3,
                  type: 'success',
                })

                arrLengthOfAnswer = []
                console.log(result)
              }
            } else {
              arrLengthOfAnswer.push(answers.length)
            }
          }
        }
      }
    }
  }

  useEffect(() => {
    const { assignmentId, groupId, sessionId } = qs.parse(
      window.location?.search || '',
      { ignoreQueryPrefix: true }
    )
    getOmrUploadSessions({ assignmentId, groupId, sessionId, fromWebcam: true })
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: videoContstraints, audio: false })
        .then((stream) => {
          setIsCameraLoad(true)
          setIsError(false)
          const { width, height } = stream.getTracks()[0].getSettings()
          setVideoSettings({ width, height })
          stream.getTracks().forEach((track) => track.stop())
        })
        .catch((err) => {
          setIsError(true)
          console.log(`Error While accessing camera: ${err}`)
        })
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    if (isCameraLoaded && isOpencvLoaded) {
      setIsLoading(false)
    }
  }, [isCameraLoaded, isOpencvLoaded])

  useEffect(() => {
    if (
      navigator.mediaDevices.getUserMedia &&
      videoRef &&
      videoRef.current &&
      !isStart
    ) {
      navigator.mediaDevices
        .getUserMedia({ video: videoContstraints, audio: false })
        .then((stream) => {
          setIsStart(true)
          setIsError(false)
          streamRef.current = stream
          // start receiving stream from webcam
          videoRef.current.srcObject = stream
          videoRef.current.play()
          videoRef.current.addEventListener(
            'canplay',
            function () {
              if (cv) {
                const { videoWidth, videoHeight } = videoRef.current || {}
                videoRef.current.setAttribute('width', videoWidth)
                videoRef.current.setAttribute('height', videoHeight)
                // Start Video Processing
                requestAnimationFrame(() =>
                  processVideo(new cv.VideoCapture(videoRef.current))
                )
              }
            },
            false
          )
        })
        .catch((err) => {
          setIsError(true)
          console.log(`Error While accessing camera: ${err}`)
        })
    }
  }, [videoRef, videoRef?.current, cv])

  const breadcrumbData = [
    {
      title: 'Upload Responses',
      onClick: () =>
        history.push({
          pathname: '/uploadAnswerSheets',
          search: window.location.search,
        }),
    },
  ]

  const triggerCompleteConfirmation = () => {
    if (!arrAnswersRef.current?.length) {
      notification({ type: 'warning', msg: 'No answer sheets scanned so far' })
    } else {
      setConfirmScanCompletion(true)
    }
  }

  const closeScanConfirmationModal = () => setConfirmScanCompletion(false)

  const stopCamera = () => {
    const matSrc = new cv.Mat(480, 640, cv.CV_8UC4)
    cv.rectangle(
      matSrc,
      { x: 0, y: 0 },
      { x: 640, y: 480 },
      [255, 255, 255, 255],
      -1
    )
    cv.imshow('canvas', matSrc)
    matSrc.delete()
    videoRef.current.pause()
    if (videoRef.current.srcObject !== null) {
      videoRef.current.srcObject.getVideoTracks()[0].stop()
    }
    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, ctx.width, ctx.height)
    videoRef.current.srcObject = null
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
  }

  const handleScanComplete = async () => {
    const { assignmentId, groupId } = qs.parse(window.location?.search || '', {
      ignoreQueryPrefix: true,
    })
    setWebCamScannedDocs(arrAnswersRef.current)
    setIsLoading(true)
    const session = await scannerApi.generateWebCamOmrSession({
      assignmentId,
      groupId,
    })
    setIsLoading(false)
    setAnswers(null)
    stopCamera()
    closeScanConfirmationModal()
    history.push({
      pathname: `/uploadAnswerSheets/scanProgress`,
      search: `?assignmentId=${assignmentId}&groupId=${groupId}&sessionId=${session._id}&scanning=1`,
    })
  }

  const closeHelpModal = () => {
    localStorage.setItem('omrUploadHelpVisibility', true)
    setHelpModal(false)
  }

  const openHelpModal = () => {
    setHelpModal(true)
  }

  if (isError) {
    return <h1>Please, Enable Camera Access To Continue</h1>
  }

  return (
    <PageLayout
      assignmentTitle={assignmentTitle}
      classTitle={classTitle}
      breadcrumbData={breadcrumbData}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <CameraUploaderWrapper>
          <Title>
            Hold your bubble sheets in front of the camera{' '}
            <HelpIcon onClick={openHelpModal}>?</HelpIcon>
          </Title>
          <SubTitle>
            Ensure the sheets are fully visible and wait for the scan successful
            message.
          </SubTitle>
          <FlexContainer width={`${videoSetting.width}px`}>
            <Progress
              percent={scanningPercent}
              size="small"
              style={{ visibility: scanningPercent > 0 ? 'visible' : 'hidden' }}
            />
            <SubTitle width="350px">
              SCANNED RESPONSES: {scannedResponses.length}
            </SubTitle>
          </FlexContainer>
          <CameraModule width={videoSetting.width} height={videoSetting.height}>
            <FlexContainer justifyContent="center">
              <canvas
                id="canvas"
                ref={canvasRef}
                style={{
                  width: videoSetting.width,
                  height: videoSetting.height,
                  border: '2px solid #ececec',
                }}
              />
              <canvas
                id="cropped"
                style={{
                  display: 'none',
                  width: 280,
                  height: 487,
                  border: '2px solid #ececec',
                }}
              />
              <video
                id="video"
                ref={videoRef}
                style={{
                  display: 'none',
                  width: videoSetting.width,
                  height: videoSetting.height,
                  border: '2px solid #ececec',
                }}
                autoPlay
              />
            </FlexContainer>
          </CameraModule>

          <EduButton isGhost onClick={triggerCompleteConfirmation}>
            PROCEED TO NEXT STEP
          </EduButton>
        </CameraUploaderWrapper>
      )}
      {confirmScanCompletion && (
        <ConfirmationModal
          visible={confirmScanCompletion}
          title="Scan Confirmation"
          description="Have you scanned all response sheets?"
          buttonText="YES, PROCEED"
          cancelText="NO, LET ME FINISH"
          onCancel={closeScanConfirmationModal}
          onProceed={handleScanComplete}
        />
      )}
      {isHelpModalVisible && (
        <ConfirmationModal
          width="900px"
          visible={isHelpModalVisible}
          title="Broad Steps Are"
          description={
            <FlexContainer
              alignItems="center"
              justifyContent="space-evenly"
              flexWrap="wrap"
            >
              {steps.map((step, index) => (
                <Step>
                  {step.icon}
                  <h3>Step {index + 1}</h3>
                  <p>{step.description}</p>
                </Step>
              ))}
            </FlexContainer>
          }
          buttonText="CLOSE"
          onCancel={closeHelpModal}
          onProceed={closeHelpModal}
          hideCancelBtn
        />
      )}
    </PageLayout>
  )
}

const ScanAnswerSheets = (props) => {
  return (
    <OpenCvProvider openCvPath="https://cdn.edulastic.com/modified/opencv/opencv.js">
      {' '}
      <ScanAnswerSheetsInner {...props} />{' '}
    </OpenCvProvider>
  )
}

ScanAnswerSheets.propTypes = {
  history: PropTypes.object.isRequired,
  totalStudents: PropTypes.number,
  assignmentTitle: PropTypes.string.isRequired,
  classTitle: PropTypes.string.isRequired,
  getOmrUploadSessions: PropTypes.func.isRequired,
}

ScanAnswerSheets.defaultProps = {
  totalStudents: 0,
}

const enhance = compose(
  withRouter,
  connect((state) => ({ ...selector(state) }), {
    ...actions,
  })
)

export default enhance(ScanAnswerSheets)

const CameraUploaderWrapper = styled.div`
  width: 800px;
  min-height: 756px;
  background: ${cardBg} 0% 0% no-repeat padding-box;
  border-radius: 10px;
  margin: 40px auto;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  padding: 10px;
  border: 1px dashed ${greyThemeLight};
`

const Title = styled.h3`
  text-align: center;
  font: normal normal bold 18px Open Sans;
  letter-spacing: -0.9px;
  color: ${greyThemeDark1};
  opacity: 1;
  margin-bottom: -20px;
`

const SubTitle = styled.p`
  text-align: center;
  font: normal normal bold 13px Open Sans;
  letter-spacing: 0px;
  color: ${dragDropUploadText};
  opacity: 1;
  line-height: 20px;
  width: ${({ width }) => width};
`

const CameraModule = styled.div`
  background: ${white};
  display: 'flex';
  justify-content: 'center';
`
const HelpIcon = styled.span`
  width: 30px;
  height: 30px;
  background: ${drcThemeColor};
  font: normal normal 700 14px Open Sans;
  text-align: center;
  line-height: 30px;

  margin-left: 10px;
  padding: 0 8px;
  color: ${white};
  border-radius: 100px;
  cursor: pointer;
`

const Step = styled.div`
  margin: 20px 0px;
  width: 209px;
  height: 151px;

  svg {
    display: block;
    margin: 20px auto;
  }

  h3 {
    text-align: center;
    font: normal normal bold 14px/19px Open Sans;
    letter-spacing: 0px;
    color: ${secondaryTextColor};
    opacity: 1;
  }

  p {
    text-align: center;
    font: normal normal normal 11px/18px Open Sans;
    letter-spacing: 0px;
    color: ${lightGrey9};
    opacity: 1;
  }
`
