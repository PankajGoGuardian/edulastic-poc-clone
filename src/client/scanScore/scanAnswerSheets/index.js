import React, { useState, useEffect, useRef, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import PropTypes from 'prop-types'
import qs from 'qs'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Progress, Row, Select, Tooltip } from 'antd'
import { OpenCvProvider, useOpenCv } from 'opencv-react'
import { withRouter } from 'react-router-dom'
import { round } from 'lodash'
import * as Sentry from '@sentry/browser'

import {
  EduButton,
  FlexContainer,
  notification,
  uploadToS3,
  CustomModalStyled,
  FieldLabel,
  SelectInputStyled,
  Checkbox,
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
  linkColor,
  dangerColor,
} from '@edulastic/colors'
import { aws } from '@edulastic/constants'
import ConfirmationModal from '@edulastic/common/src/components/SimpleConfirmModal'
import beepSound from '@edulastic/common/src/utils/data/beep-sound.base64.json'
import { scannerApi } from '@edulastic/api'
import { IconInfo } from '@edulastic/icons'
import { actions, selector } from '../uploadAnswerSheets/ducks'
import { getAnswersFromVideo } from './answer-utils'
import { detectParentRectangle } from './parse-qrcode'
import PageLayout from '../uploadAnswerSheets/PageLayout'
import Spinner from '../../common/components/Spinner'
import RecordVideoStream from './RecordVideoStream'
import {
  IconStep1,
  IconStep2,
  IconStep3,
  IconStep4,
  IconStep5,
} from './icons/StepsIcons'

function useInstructions() {
  const [_instructions, setInstructions] = useState(null)
  const instructionsRef = useRef(null)

  const instructionCb = useCallback((e) => {
    if (instructionsRef.current != e.detail) {
      setInstructions(e.detail)
      instructionsRef.current = e.detail
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setInstructions(null)
      instructionsRef.current = null
    }, 2000)

    return () => clearTimeout(timeout)
  }, [_instructions])

  useEffect(() => {
    window.addEventListener('instructions', instructionCb)

    return () => window.removeEventListener('instructions', instructionCb)
  }, [])

  return _instructions
}

const Option = Select.Option
const audioRef = new Audio(`data:audio/mp3;base64,${beepSound.base64}`)

const videoContstraints = {
  facingMode: { ideal: 'environment' },
}

const steps = [
  {
    icon: <IconStep1 />,
    description:
      'Hold or Place your bubble sheets in front of the camera, so that they are fully visible and the logo Edulastic is on top',
  },
  {
    icon: <IconStep2 />,
    description:
      'Ensure the QR code and response boxes are aligned side by side and fully visible',
  },
  {
    icon: <IconStep3 />,
    description: 'Wait for the Form detected message with a beeper sound.',
  },
  {
    icon: <IconStep4 />,
    description:
      'Once the message is shown, you can put your next bubble sheet to scan.',
  },
  {
    icon: <IconStep5 />,
    description:
      'Click Proceed to next step once all bubble sheets are scanned.',
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
    null,
    `${assignmentId}`,
    true
  )
}

const ScanAnswerSheetsInner = ({
  history,
  assignmentTitle,
  classTitle,
  getOmrUploadSessions,
  setWebCamScannedDocs,
  setRecordedVideo,
  enableOmrSessionRecording = false,
}) => {
  let arrLengthOfAnswer = []
  const { cv, loaded: isOpencvLoaded } = useOpenCv()

  const [confirmScanCompletion, setConfirmScanCompletion] = useState(false)
  const [videoSetting, setVideoSettings] = useState({ width: 640, height: 480 })
  const [isLoading, setIsLoading] = useState(true)
  const [isCameraLoaded, setIsCameraLoad] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isStart, setIsStart] = useState(false)
  const arrAnswersRef = useRef([])
  const fileUrls = useRef([])
  const debugFileUrls = useRef([])
  const hideFailureNotificationsRef = useRef(false)
  const [uploadingToS3, setUploadingToS3] = useState(false)
  const [dc, setDc] = useState(0)
  const [limitCameraModePopUp, setlimitCameraModePopUp] = useState(false)
  const recordingEnabled = enableOmrSessionRecording

  /**
   * uncomment the following line while debugging
   * window.arrAnswersRef = arrAnswersRef
   */
  const [isHelpModalVisible, setHelpModal] = useState(
    !localStorage.getItem('omrUploadHelpVisibility')
  )

  const [answersList, setAnswers] = useState(null)
  const [scannedResponses, setScannedResponses] = useState([])
  const [scanningPercent, setScanningPercent] = useState(0)
  const [cameraList, setCameraList] = useState([])
  const [selectedCamera, setSelectedCamera] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [isFrontFacing, setIsFrontFacing] = useState(false)
  const instructions = useInstructions()

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const debugCanvasRef = useRef(null)
  const streamRef = useRef(null)
  const isFrontFacingRef = useRef(false)
  const recorderRef = useRef()

  function supressFailureNotifications(time) {
    hideFailureNotificationsRef.current = true
    setTimeout(() => {
      if (hideFailureNotificationsRef?.current) {
        hideFailureNotificationsRef.current = false
      }
    }, time)
  }

  async function processVideo(vc) {
    const arrAnswers = arrAnswersRef.current
    if (vc) {
      const matSrc = new cv.Mat(
        videoSetting.height,
        videoSetting.width,
        cv.CV_8UC4
      )
      vc.read(matSrc)
      const debugMatSrc = matSrc.clone()
      let result = null
      const parentRectangle = detectParentRectangle(cv, matSrc)
      let rectanglePosition
      let qrCodeData
      if (parentRectangle) {
        rectanglePosition = parentRectangle.rectanglePosition
        qrCodeData = parentRectangle.qrCodeData
      } else {
        cv.imshow('canvasOutput', matSrc)
        matSrc.delete()
        debugMatSrc.delete()
        requestAnimationFrame(() =>
          processVideo(vc).catch((e) => {
            console.log('process video opencv error')
            console.log('err', e)
          })
        )
        return
      }
      if (answersList) {
        cv.imshow('canvasOutput', matSrc)
      } else {
        result = getAnswersFromVideo(
          cv,
          matSrc,
          rectanglePosition,
          qrCodeData.location,
          debugMatSrc
        )
      }
      matSrc.delete()
      debugMatSrc.delete()
      requestAnimationFrame(() =>
        processVideo(vc).catch(() => {
          console.log('process video opencv error')
        })
      )
      if (!result) {
        return
      }
      result.qrCode = qrCodeData.data
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
                if (!hideFailureNotificationsRef.current) {
                  notification({
                    msg: `This Form is already scanned. Please change and continue.`,
                    duration: 3,
                    type: 'warning',
                    messageKey: 'alreadyParsedAnswerSheet',
                  })
                  supressFailureNotifications(3000)
                }
              } else {
                supressFailureNotifications(3000)
                setScanningPercent(0.1)
                arrAnswersRef.current.push(result)
                notification({
                  type: 'success',
                  msg: 'Form successfully scanned. Please scan the next one.',
                })
                audioRef.play()
                if (canvasRef.current) {
                  let fileUrl
                  try {
                    setUploadingToS3(true)
                    fileUrl = await uploadCanvasFrame(
                      canvasRef.current,
                      (uploadEvent) => {
                        const percent =
                          (uploadEvent.loaded / uploadEvent.total) * 100
                        setScanningPercent(round(percent, 2))
                      }
                    )
                    setUploadingToS3(false)
                    fileUrls.current.push(fileUrl)
                    setScanningPercent(0)
                  } catch (error) {
                    Sentry.withScope((scope) => {
                      scope.setExtra('file Url', fileUrl)
                      scope.setExtra('qr code', qrCodeData)
                      Sentry.captureException(error)
                    })
                    throw error
                  }
                }
                if (debugCanvasRef.current) {
                  const fileUrl = await uploadCanvasFrame(
                    debugCanvasRef.current
                  )
                  debugFileUrls.current.push(fileUrl)
                }

                const temp = []
                result.answers.forEach((item, index) => {
                  temp.push(`${index + 1}: ${item}`)
                })
                setScannedResponses((x) => x + 1)
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
        .getUserMedia({
          video: {
            ...videoContstraints,
            ...(selectedCamera ? { deviceId: { exact: selectedCamera } } : {}),
          },
          audio: false,
        })
        .then((stream) => {
          setIsCameraLoad(true)
          setIsError(false)
          const { width, height } = stream.getTracks()[0].getSettings()
          setVideoSettings({ width, height })
          return navigator.mediaDevices.enumerateDevices()
        })
        .then((devices) => {
          const videoDevices = devices
            .filter((device) => device.kind === 'videoinput')
            .map(({ deviceId, label }) => ({ id: deviceId, name: label }))
          setCameraList(videoDevices)
        })
        .catch((err) => {
          setIsError(true)
          console.log(`Error While accessing camera: ${err}`)
        })
    }
  }, [selectedCamera])

  useEffect(() => {
    if (isCameraLoaded && isOpencvLoaded) {
      setIsLoading(false)
    }
    if (isOpencvLoaded) {
      // to force streaming after openCvloaded & ready
      // Simply using isOpencvLoaded not working as expected
      // this is an equivalent of forceRender
      setDc((c) => c + 1)
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
          if (recordingEnabled && recorderRef.current) {
            recorderRef.current.start(stream)
          }
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
                  processVideo(
                    new cv.VideoCapture(videoRef.current)
                  ).catch(() => console.warn('opencv error'))
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
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [videoRef, videoRef?.current, cv, selectedCamera, isOpencvLoaded, dc])

  useEffect(() => {
    isFrontFacingRef.current = isFrontFacing
  }, [isFrontFacing])

  const scannedForms = scannedResponses.length

  useEffect(() => {
    if (scannedForms > 99) {
      setlimitCameraModePopUp(true)
    }
  }, [scannedForms])

  const breadcrumbData = [
    {
      title: 'Scan Bubble Sheets',
      to: `/uploadAnswerSheets${window.location.search || ''}`,
    },
    {
      title: 'Scan Using Camera',
    },
  ]

  const triggerCompleteConfirmation = () => {
    if (!arrAnswersRef.current?.length) {
      notification({ type: 'warning', msg: 'No Forms scanned so far.' })
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
    cv.imshow('canvasOutput', matSrc)
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
    arrAnswersRef.current.forEach((response, index) => {
      response.imageUri = fileUrls.current[index]
      response.originalImgUri = debugFileUrls.current[index]
    })
    setlimitCameraModePopUp(false)
    const { assignmentId, groupId } = qs.parse(window.location?.search || '', {
      ignoreQueryPrefix: true,
    })
    setWebCamScannedDocs(arrAnswersRef.current)
    let session
    try {
      setIsLoading(true)
      session = await scannerApi.generateWebCamOmrSession({
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
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setExtra('assignmentInfo', { assignmentId, groupId, session })
        Sentry.captureException(error)
      })
      throw error
    }
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
  const flipCameraViewStyle = isFrontFacing
    ? { transform: `scale(-1,1)`, transformOrigin: 'center center' }
    : {}

  return (
    <PageLayout
      assignmentTitle={assignmentTitle}
      classTitle={classTitle}
      breadcrumbData={breadcrumbData}
      showCameraSettings={!isLoading}
      setShowSettings={setShowSettings}
      hideTitle
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <CameraUploaderWrapper>
          {recordingEnabled ? (
            <>
              <RecordingIndicator>Recording...</RecordingIndicator>
              <RecordVideoStream
                ref={recorderRef}
                onVideoUrlReady={(_url) => {
                  const { assignmentId, groupId } = qs.parse(
                    window.location?.search || '',
                    {
                      ignoreQueryPrefix: true,
                    }
                  )
                  setRecordedVideo({
                    url: _url,
                    filename: `recorded_${assignmentId}_${groupId}.webm`,
                  })
                }}
              />
            </>
          ) : null}
          <Title>
            Put your bubble sheet forms in front of the camera{' '}
            <HelpIcon onClick={openHelpModal}>?</HelpIcon>
          </Title>
          {instructions ? (
            <SubTitleDark width="350px" className="instructions">
              <strong>{instructions}</strong>
            </SubTitleDark>
          ) : null}
          <SubTitle>
            Ensure the forms are fully visible and wait for the Form detected
            message with a beeper sound.
          </SubTitle>
          <FlexContainer width={`${videoSetting.width}px`}>
            <Progress
              percent={scanningPercent}
              size="small"
              style={{ visibility: scanningPercent > 0 ? 'visible' : 'hidden' }}
            />
            <SubTitleDark width="350px">
              SCANNED FORMS: {scannedResponses.length}
            </SubTitleDark>
          </FlexContainer>
          <CameraModule width={videoSetting.width} height={videoSetting.height}>
            <FlexContainer justifyContent="center">
              <canvas
                id="canvasOutput"
                ref={canvasRef}
                style={{
                  width: videoSetting.width,
                  height: videoSetting.height,
                  border: '2px solid #ececec',
                  ...flipCameraViewStyle,
                }}
              />
              <canvas
                id="debugCanvasOutput"
                ref={debugCanvasRef}
                style={{
                  display: 'none',
                  width: videoSetting.width,
                  height: videoSetting.height,
                  border: '2px solid #ececec',
                }}
              />
              <canvas
                id="workingCanvas"
                style={{
                  display: 'none',
                  width: 280,
                  height: 450,
                  border: '2px solid #ececec',
                }}
              />
              <canvas
                id="rowCanvas"
                style={{
                  display: 'none',
                  width: 280,
                  height: 30,
                  border: '2px solid #ececec',
                }}
              />
              <video
                ref={videoRef}
                id="video"
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

          <EduButton
            disabled={uploadingToS3}
            isGhost
            onClick={triggerCompleteConfirmation}
            style={{ marginTop: 15 }}
          >
            Proceed to Scan Results
          </EduButton>
        </CameraUploaderWrapper>
      )}
      {confirmScanCompletion && (
        <ConfirmationModal
          visible={confirmScanCompletion}
          title="Scan Finished Confirmation"
          description="Have you scanned all Bubble Sheet Forms?"
          buttonText="YES, PROCEED"
          cancelText="No, I have more to scan"
          onCancel={closeScanConfirmationModal}
          onProceed={handleScanComplete}
        />
      )}
      <CustomModalStyled
        title="Settings"
        centered
        visible={showSettings}
        onCancel={() => setShowSettings(false)}
        footer={[
          <EduButton onClick={() => setShowSettings(false)}>CLOSE</EduButton>,
        ]}
      >
        <Row>
          <FieldLabel>SELECT CAMERA</FieldLabel>
          <SelectInputStyled
            disabled={cameraList.length === 1}
            value={cameraList.length === 1 ? cameraList[0].id : selectedCamera}
            onChange={(v) => {
              setSelectedCamera(v)
            }}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          >
            <Option value={null}>Select Camera</Option>
            {cameraList.map((x) => (
              <Option value={x.id}>{x.name}</Option>
            ))}
          </SelectInputStyled>
        </Row>
        <br />
        <Row>
          <Tooltip title="Check this option if the camera is facing you. This will mirror the image horizontally so that you can scan more easily.">
            <Checkbox
              checked={isFrontFacing}
              onChange={() => {
                setIsFrontFacing((x) => !x)
              }}
              label={
                <CheckBoxLabel>
                  <strong>I AM USING A LAPTOP WEBCAM</strong>
                  <Tooltip
                    title="Tick to horizontally flip the camera recording to help you see and scan easily"
                    placement="right"
                  >
                    <IconInfo />
                  </Tooltip>
                </CheckBoxLabel>
              }
            />
          </Tooltip>
        </Row>
      </CustomModalStyled>
      {isHelpModalVisible && (
        <ConfirmationModal
          width="900px"
          visible={isHelpModalVisible}
          title="Steps to Scan Your Bubble Sheet Forms"
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
      {limitCameraModePopUp && (
        <CustomModalStyled
          visible={limitCameraModePopUp}
          title="Maximum Limit Reached"
          closable={false}
          footer={[<EduButton onClick={handleScanComplete}>NEXT</EduButton>]}
        >
          <p>
            Maximum 100 sheets can be scanned at a time. Please click next to
            process these 100 sheets now. You can start again later if you want
            to scan more sheets
          </p>
        </CustomModalStyled>
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
  connect(
    (state) => ({
      ...selector(state),
      enableOmrSessionRecording: state?.user?.user?.enableOmrSessionRecording,
    }),
    {
      ...actions,
    }
  )
)

export default enhance(ScanAnswerSheets)

const CameraUploaderWrapper = styled.div`
  min-height: 756px;
  background: ${cardBg} 0% 0% no-repeat padding-box;
  background: transparent;
  border-radius: 10px;
  margin: 40px auto;
  margin: 0px auto;

  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  padding: 10px;
  border: 0px dashed ${greyThemeLight};
`

const Title = styled.h3`
  text-align: center;
  font: normal normal bold 18px Open Sans;
  letter-spacing: -0.9px;
  color: ${greyThemeDark1};
  opacity: 1;
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

const SubTitleDark = styled(SubTitle)`
  color: ${linkColor};
  padding-bottom: 15px;
  &.instructions {
    color: ${dangerColor};
    font-size: 15px;
  }
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

const blinking = keyframes`
  0%{
    opacity: 0;
  }
  25% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 0.5
  }
  100%{
    opacity: 0;
  }
`

const RecordingIndicator = styled.div`
  background-color: red;
  color: white;
  width: 120px;
  height: 50px;
  line-height: 50px;

  text-align: center;
  border-radius: 5px;
  animation: ${blinking} 1s linear infinite;
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

const CheckBoxLabel = styled.span`
  svg {
    margin-left: 10px;
    margin-bottom: -2px;
  }
`
