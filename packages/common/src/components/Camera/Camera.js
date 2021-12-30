import React, { useEffect, useState, useRef } from 'react'
import connect from 'react-redux/es/connect/connect'
import PropTypes from 'prop-types'
import { FACING_MODES, IMAGE_TYPES } from 'jslib-html5-camera-photo'
import { isFunction } from 'lodash'
import {
  CameraWrapper,
  Video,
  DelayOverlay,
  Image,
  NumberCircle,
  WhiteFlash,
} from './styled'
import { useLibCameraPhoto } from '../../customHooks/useLibCameraPhoto'
import DisplayError from './DisplayError'
import clickSound from '../../utils/data/click-sound.base64.json'

/*
 * This camera component is inspired by react-html5-camera-photo, modified according to our need.
 * https://www.npmjs.com/package/react-html5-camera-photo
 * Removals:
 * 1. Coupling with internal button to take photos
 * Additions:
 * 1. Boolean prop to take photo using Camera
 * 2. Delay counter to wait before auto capturing photo
 * 3. Ability to return image as blob data
 */
const IMAGE_DATA_TYPE = {
  BLOB: 'Blob',
  DATA_URI: 'DataUri',
}
const PER_DELAY_DURATION = 1000
let showFlashTimeoutId = null
let delayCounterId = null

function Camera({
  onTakePhoto,
  onTakePhotoAnimationDone,
  onCameraError,
  idealFacingMode,
  idealResolution,
  imageType,
  imageDataType,
  isImageMirror,
  isSilentMode,
  isStartCameraErrorDisplayed,
  imageCompression,
  isMaxResolution,
  sizeFactor,
  onCameraStart,
  onCameraStop,
  isTakingPhoto,
  delayCount,
  testSettings: {
    blockNavigationToAnsweredQuestions,
    blockSaveAndContinue,
    restrictNavigationOut,
    restrictNavigationOutAttemptsThreshold,
  } = {},
}) {
  const [dataUri, setDataUri] = useState('')
  const [isVideoVisible, setIsVideoVisible] = useState(true)
  const [isFlashVisible, setIsFlashVisible] = useState(false)
  const [currentDelayCount, setCurrentDelayCount] = useState(delayCount)
  const [isDelayCounterVisible, setIsDelayCounterVisible] = useState(false)
  const [cameraStartDisplayError, setCameraStartDisplayError] = useState('')
  const videoRef = useRef(null)

  const isAntiCheatingFeaturesEnabled =
    blockNavigationToAnsweredQuestions ||
    blockSaveAndContinue ||
    restrictNavigationOut ||
    restrictNavigationOutAttemptsThreshold > 0

  const [
    mediaStream,
    cameraStartError,
    cameraStopError,
    getDataUri,
  ] = useLibCameraPhoto(
    videoRef,
    idealFacingMode,
    idealResolution,
    isMaxResolution,
    isAntiCheatingFeaturesEnabled
  )

  const playClickAudio = () => {
    const audio = new Audio(`data:audio/mp3;base64,${clickSound.base64}`)
    audio.play()
  }

  /*
   * ---- Functionalities from original library ---
   */
  useEffect(() => {
    if (mediaStream && isFunction(onCameraStart)) {
      onCameraStart(mediaStream)
    } else if (isFunction(onCameraStop)) {
      onCameraStop()
    }
  }, [mediaStream])

  useEffect(() => {
    if (cameraStartError) {
      window.sessionStorage.removeItem('isRequestingCameraAccess')
      setCameraStartDisplayError(
        `${cameraStartError.name} ${cameraStartError.message}`
      )
      if (isFunction(onCameraError)) {
        onCameraError(cameraStartError)
      }
    }
  }, [cameraStartError])

  useEffect(() => {
    if (cameraStopError) {
      window.sessionStorage.removeItem('isRequestingCameraAccess')
      console.info('Camera Stop Error:', cameraStopError.message)
    }
  }, [cameraStopError])

  const clearShowFlashTimeout = () => {
    if (showFlashTimeoutId) {
      clearTimeout(showFlashTimeoutId)
    }
  }

  // Function to take the photo.
  const handleTakePhoto = async () => {
    const configDataUri = {
      sizeFactor,
      imageType,
      imageCompression,
      isImageMirror,
    }

    const newDataUri = getDataUri(configDataUri)

    if (!isSilentMode) {
      playClickAudio()
    }

    // Call the onTakePhoto callback once photo is taken.
    // Blob functionality is added by us.
    if (isFunction(onTakePhoto)) {
      if (IMAGE_DATA_TYPE.BLOB === imageDataType) {
        // get blob from dataUri.
        const photoBlob = await (await fetch(newDataUri)).blob()
        onTakePhoto(photoBlob)
      } else {
        onTakePhoto(newDataUri)
      }
    }

    setDataUri(newDataUri)

    setIsVideoVisible(false)
    setIsFlashVisible(true)

    // Clear any active show flash timeout.
    clearShowFlashTimeout()
    showFlashTimeoutId = setTimeout(() => {
      setIsFlashVisible(false)

      if (isFunction(onTakePhotoAnimationDone)) {
        onTakePhotoAnimationDone(newDataUri)
      }
    }, 900)
  }

  /*
   * ---- Custom added functionalities ---
   */
  // Function to handle countdown before taking photo.
  const handleDelayAndTakePhoto = () => {
    setIsDelayCounterVisible(true)

    delayCounterId = setInterval(() => {
      setCurrentDelayCount((count) => count - 1)
    }, PER_DELAY_DURATION)
  }

  // Handles photo taking when countdown hits 0.
  useEffect(() => {
    // If there is no counter running, return
    if (!delayCounterId) {
      return
    }

    if (currentDelayCount > 0) {
      return
    }

    clearInterval(delayCounterId)
    setIsDelayCounterVisible(false)
    handleTakePhoto()
    // Reset currentDelayCount to initial value.
    setCurrentDelayCount(delayCount)
  }, [currentDelayCount])

  // Allows taking a pic using a boolean prop to Camera component.
  useEffect(() => {
    if (!isTakingPhoto) {
      return
    }

    // If there is error in starting camera, don't try to take photo
    if (cameraStartDisplayError) {
      return
    }

    if (delayCount === 0) {
      handleTakePhoto()
    } else {
      handleDelayAndTakePhoto()
    }
  }, [isTakingPhoto])

  const displayError = isStartCameraErrorDisplayed && (
    <DisplayError errorMsg={cameraStartDisplayError} />
  )

  const delayCounter = isDelayCounterVisible && (
    <DelayOverlay>
      <NumberCircle>{currentDelayCount}</NumberCircle>
    </DelayOverlay>
  )

  const cameraBody = isVideoVisible ? (
    <Video
      ref={videoRef}
      autoPlay
      muted="muted"
      playsInline
      isImageMirror={isImageMirror}
      isVisible={isVideoVisible}
    />
  ) : (
    <Image src={dataUri} isVisible={!isVideoVisible} />
  )

  return (
    <CameraWrapper>
      {cameraStartDisplayError ? (
        <>{displayError}</>
      ) : (
        <>
          <WhiteFlash isFlashVisible={isFlashVisible} />
          {cameraBody}
          {delayCounter}
        </>
      )}
    </CameraWrapper>
  )
}

Camera.propTypes = {
  onTakePhoto: PropTypes.func,
  onTakePhotoAnimationDone: PropTypes.func,
  onCameraError: PropTypes.func,
  idealFacingMode: PropTypes.string,
  idealResolution: PropTypes.object,
  imageType: PropTypes.string,
  imageDataType: PropTypes.string,
  isImageMirror: PropTypes.bool,
  isSilentMode: PropTypes.bool,
  isStartCameraErrorDisplayed: PropTypes.bool,
  imageCompression: PropTypes.number,
  isMaxResolution: PropTypes.bool,
  sizeFactor: PropTypes.number,
  onCameraStart: PropTypes.func,
  onCameraStop: PropTypes.func,
  delayCount: PropTypes.number,
}

Camera.defaultProps = {
  onTakePhoto: () => null,
  onTakePhotoAnimationDone: () => null,
  onCameraError: () => null,
  idealFacingMode: FACING_MODES.USER,
  idealResolution: {},
  imageType: IMAGE_TYPES.PNG,
  imageDataType: IMAGE_DATA_TYPE.BLOB,
  isImageMirror: false,
  isSilentMode: false,
  isStartCameraErrorDisplayed: true,
  imageCompression: 0.9,
  isMaxResolution: true,
  sizeFactor: 1,
  onCameraStart: () => null,
  onCameraStop: () => null,
  delayCount: 0,
}

export { Camera, FACING_MODES, IMAGE_TYPES, IMAGE_DATA_TYPE }

export default connect((state) => ({
  testSettings: state.test?.settings,
}))(Camera)
