import { DragDrop, notification } from '@edulastic/common'
import { Col } from 'antd'
import { Rnd } from 'react-rnd'
import { round, isEmpty, isEqual } from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { test as testConstants } from '@edulastic/constants'
import { STUDENT } from '@edulastic/constants/const/roleType'
import { removeUserAnswerAction } from '../../../../../assessment/actions/answers'
import { getPreviewSelector } from '../../../../src/selectors/view'
import QuestionItem from '../QuestionItem/QuestionItem'
import CombinedPlayer from './CombinedPlayer'
import MuteUnmute from './MuteUnmute'
import PlayPause from './PlayPause'
import SeekBar from './SeekBar'
import Volume from './Volume'
import { SEEK_DATA } from '../../constants'

import {
  AnnotationsContainer,
  BigPlayButton,
  Droppable,
  PDFPreviewWrapper,
  RelativeContainer,
  StyledPlayerContainer,
  StyledTypographyText,
} from '../../styled-components/VideoPreview'
import {
  formateSecondsToMMSS,
  getCurrentTime,
  getMarks,
  getNumberStyles,
  getVideoDuration,
  getVisibleAnnotation,
  showMarkerArea,
  useStateRef,
} from '../../utils/videoPreviewHelpers'
import appConfig from '../../../../../../app-config'
import { isiOS } from '../../../../../assessment/utils/helpers'
import {
  getUserRole,
  isVideoQuizAndAIEnabledSelector,
} from '../../../../src/selectors/user'
import {
  currentTestActivityIdSelector,
  vqPreventQuestionSkippingSelector,
} from '../../../../../assessment/selectors/test'
import {
  getTestEntitySelector,
  setTestDataAction,
} from '../../../../TestPage/ducks'
import { assessmentPageActions } from '../../../ducks'

const { statusConstants } = testConstants
const { DRAFT } = statusConstants

const { DragPreview } = DragDrop

const VideoPreview = ({
  annotations,
  onDropAnnotation,
  questionsById,
  answersById,
  viewMode,
  previewMode,
  testMode,
  reportMode,
  highlighted,
  onDragStart,
  review,
  itemId,
  currentAnnotationTool,
  onHighlightQuestion,
  isEditable,
  videoUrl,
  pathname,
  handleRemoveAnnotation,
  editMode,
  updateVideoQuizQuestionsToDisplay,
  questionClickSeekTime,
  handleUpdateSeektime,
  studentWork = false,
  clearHighlighted,
  forwardedVideoRef,
  startAt,
  vqEnableYouTubeEd,
  vqPreventSkipping,
  isVideoQuizAndAIEnabled,
  setTestData,
  test: { status, videoDuration: vqVideoDuration },
  setIsVideoEnded,
  currentTestActivityId,
  userRole,
}) => {
  const previewContainer = useRef()
  const annotationContainer = useRef()
  const videoRef = forwardedVideoRef
  const markerArea = useRef()
  const annotationsRef = useRef()
  const sliderRef = useRef()
  const isSeekBarFocusedRef = useRef(false)

  const [
    visibleAnnotation,
    setVisibleAnnotation,
    visibleAnnotationRef,
  ] = useStateRef([])

  const [playing, setPlaying] = useState(false)
  const [volumne, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isReady, setIsReady] = useState(0)

  const handleSetIsSeekBarFocused = (isFocused) => {
    isSeekBarFocusedRef.current = isFocused
  }

  const onReady = () => {
    setIsReady(true)
  }

  const onPlay = () => {
    const duration = getVideoDuration(videoRef)
    if (duration > 0 && status === DRAFT && !vqVideoDuration) {
      setTestData({
        videoDuration: duration,
      })
    }

    setPlaying(true)
    if (markerArea?.current && markerArea?.current?.isOpen) {
      // Getting any unsaved MarkerJS annotation on play and saving same
      markerArea.current?.blur?.()
      const markerState = markerArea.current?.getState?.()
      const annotationsValue = annotationsRef?.current || []

      if (markerState?.markers?.length) {
        const foundAnnotation = annotationsValue.find((item) => {
          /**
           * Delete the notes field as this field is coming as undefined sometimes.
           * This is causing the isEqual check to fail and adds a redundant annotation.
           */
          ;(item.markerJsData || []).forEach((mark) => delete mark.notes)
          ;(markerState.markers || []).forEach((mark) => delete mark.notes)

          return (
            item.markerJsData && isEqual(item.markerJsData, markerState.markers)
          )
        })

        // saving annotation on pause if not already saved
        if (!foundAnnotation) {
          onDropAnnotation(
            {
              x: markerState.markers?.[0]?.left,
              y: markerState.markers?.[0]?.top,
              markerJsData: markerState.markers,
              time: Math.floor(videoRef.current?.getCurrentTime?.()),
              toolbarMode: 'markerJs',
            },
            'video'
          )
        }
      }

      markerArea.current.close()
    }

    /**
     * Issue with ipad. It doesn't play video when we try to play video programatically.
     * Following is the workaround to make it work.
     */
    if (isiOS()) {
      if (videoRef?.current?.isMuted?.()) {
        videoRef?.current?.unMute?.()
        videoRef?.current?.mute?.()
      } else {
        videoRef?.current?.mute?.()
        videoRef?.current?.unMute?.()
      }
    }
  }

  const onPause = () => {
    setPlaying(false)
    if (
      viewMode !== 'review' &&
      (!markerArea || !markerArea?.current?.isOpen)
    ) {
      showMarkerArea(
        annotationContainer,
        markerArea,
        viewMode,
        onDropAnnotation,
        videoRef
      )
    }
  }

  const handleResize = ({ ref, questionId }) => {
    const targetAnnotation = (annotations || []).find(
      (annotation) =>
        annotation?.toolbarMode === 'question' &&
        annotation?.questionId === questionId
    )

    let updatedMinHeight = null
    if (targetAnnotation) {
      const targetElement = document.getElementById(
        `video-player-question-item-${questionId}`
      )
      if (!isEmpty(targetElement)) {
        updatedMinHeight =
          typeof targetElement?.offsetHeight === 'number'
            ? targetElement.offsetHeight + 45 // remove video from question height + padding
            : null
      }

      onDropAnnotation(
        {
          ...targetAnnotation,
          ...(typeof updatedMinHeight === 'number'
            ? { initialHeight: updatedMinHeight }
            : {}),
          ...(typeof ref?.offsetWidth === 'number'
            ? { width: ref.offsetWidth }
            : {}),
          ...(typeof ref?.offsetHeight === 'number'
            ? { height: ref.offsetHeight }
            : {}),
        },
        'video'
      )
    }
  }

  const onProgress = (state) => {
    const _currentTime = Math.round(state.playedSeconds)
    setCurrentTime(_currentTime)

    let annotationsValue = []
    if (annotationsRef?.current) {
      annotationsValue = annotationsRef.current
    }

    let newVisibleAnnotations = annotationsValue.filter(
      (annotation) =>
        annotation.time && _currentTime === Math.floor(annotation.time)
    )

    newVisibleAnnotations = newVisibleAnnotations?.length
      ? newVisibleAnnotations
      : []

    const questionAnnotations = newVisibleAnnotations.filter(
      (annotation) => annotation.toolbarMode === 'question'
    )

    updateVideoQuizQuestionsToDisplay(questionAnnotations || [])

    if (
      newVisibleAnnotations.length > 0 &&
      visibleAnnotationRef.current.length === 0
    ) {
      onPause()
      if (questionAnnotations.length > 0) {
        onHighlightQuestion(questionAnnotations[0].questionId, true)
      }
      setVisibleAnnotation(newVisibleAnnotations)
    } else if (newVisibleAnnotations.length === 0) {
      if (!state.paused && visibleAnnotationRef.current.length > 0) {
        setVisibleAnnotation([])
      }
    }
  }

  const volumeTo = (volume) => {
    setVolume(volume)
  }

  const seekTo = (time) => {
    if (videoRef) {
      setCurrentTime(time)
      videoRef.current?.seekTo?.(time)
    }
    if (visibleAnnotation?.length) {
      setVisibleAnnotation([])
    }
  }

  const handleKeyboardSeek = (direction) => {
    const isSeekBarFocused = isSeekBarFocusedRef.current
    if (!isSeekBarFocused && videoRef.current) {
      sliderRef?.current?.focus?.()
      const videoDuration = getVideoDuration(videoRef)
      let _currentTime = getCurrentTime(videoRef)
      let updatedCurrentTime = _currentTime
      if (direction === SEEK_DATA.FORWARD) {
        if (vqPreventSkipping) {
          notification({ type: 'info', messageKey: 'preventVQForwardSeek' })
          return
        }
        updatedCurrentTime = _currentTime + SEEK_DATA.SEEK_STEP_COUNT
        _currentTime =
          updatedCurrentTime > videoDuration ? _currentTime : updatedCurrentTime
        seekTo(_currentTime)
      } else if (direction === SEEK_DATA.BACKWARD) {
        updatedCurrentTime = _currentTime - SEEK_DATA.SEEK_STEP_COUNT
        _currentTime =
          updatedCurrentTime < 1 ? _currentTime : updatedCurrentTime
        seekTo(_currentTime)
      }
    }
  }

  const onEnded = () => {
    seekTo(0)
    onPause()
    if (userRole === STUDENT) {
      setIsVideoEnded(currentTestActivityId)
    }
  }

  const handleDropQuestion = ({ data, itemRect }) => {
    if (annotationContainer.current) {
      const { x: clientX, y: clientY } = itemRect

      const containerRect = annotationContainer.current.getBoundingClientRect()

      let x = clientX - containerRect.x - 10
      let y = clientY - containerRect.y - 10

      x = (x * 100) / containerRect.width
      y = (y * 100) / containerRect.height

      x = round(x / 1, 2)
      y = round(y / 1, 2)

      onPause()

      const targetAnnotation = (annotations || []).find(
        (annotation) =>
          annotation?.toolbarMode === 'question' &&
          annotation?.questionId === data.id
      )
      let width = null
      let height = null
      let initialWidth = null
      let initialHeight = null

      const targetElement = document.getElementById(
        `video-quiz-question-item-${data.id}`
      )
      if (!isEmpty(targetElement)) {
        initialWidth =
          typeof targetElement?.offsetWidth === 'number'
            ? targetElement.offsetWidth + 20 // padding
            : null
        initialHeight =
          typeof targetElement?.offsetHeight === 'number'
            ? targetElement.offsetHeight + 45 // remove video from question height + padding
            : null
      }

      if (!isEmpty(targetAnnotation)) {
        const {
          width: originalWidth = null,
          height: originalHeight = null,
        } = targetAnnotation
        width = originalWidth
        height = originalHeight
      }

      onDropAnnotation(
        {
          x,
          y,
          questionId: data.id,
          qIndex: data.index,
          time: Math.floor(videoRef.current?.getCurrentTime?.()),
          ...(typeof initialWidth === 'number' ? { initialWidth } : {}),
          ...(typeof initialHeight === 'number' ? { initialHeight } : {}),
          ...(typeof width === 'number' ? { width } : {}),
          ...(typeof height === 'number' ? { height } : {}),
        },
        'video'
      )
    }
  }

  const removeQuestionAnnotation = (questionId) => {
    const updatedVisibleAnnotations = visibleAnnotation.filter(
      (annotation) => annotation?.questionId !== questionId
    )
    handleRemoveAnnotation(questionId)
    setVisibleAnnotation(updatedVisibleAnnotations)
  }

  useEffect(() => {
    if (startAt > 1 && isReady) {
      seekTo(startAt - 1)
    }
  }, [startAt, isReady])

  useEffect(() => {
    annotationsRef.current = annotations
    if (!playing) {
      const _currentTime = getCurrentTime(videoRef)

      let newVisibleAnnotations = getVisibleAnnotation(
        annotations,
        _currentTime
      )

      newVisibleAnnotations = newVisibleAnnotations?.length
        ? newVisibleAnnotations
        : []
      const questionAnnotations = newVisibleAnnotations.filter(
        (annotation) => annotation.toolbarMode === 'question'
      )
      updateVideoQuizQuestionsToDisplay(questionAnnotations || [])

      if (newVisibleAnnotations.length > 0) {
        onPause()
        onHighlightQuestion(newVisibleAnnotations[0].questionId, true)
        setVisibleAnnotation(newVisibleAnnotations)
      }
    }
  }, [annotations])

  const handleHighlight = (questionId) => () => {
    onHighlightQuestion(questionId, true)
  }

  useEffect(() => {
    const uiAnnotaions = (visibleAnnotation || []).filter(
      (annotation) => annotation.time && annotation.toolbarMode == 'markerJs'
    )
    if (uiAnnotaions.length > 0) {
      showMarkerArea(
        annotationContainer,
        markerArea,
        viewMode,
        onDropAnnotation,
        videoRef,
        uiAnnotaions
      )
    }
  }, [visibleAnnotation])

  useEffect(() => {
    if (typeof questionClickSeekTime === 'number') {
      setCurrentTime(questionClickSeekTime)
      seekTo(questionClickSeekTime - 1)
      onPlay()
      handleUpdateSeektime(null)
    }
  }, [questionClickSeekTime])

  const duration = getVideoDuration(videoRef)
  const marks = getMarks(annotations)

  useEffect(() => {
    if (duration > 0 && status === DRAFT && !vqVideoDuration) {
      setTestData({ videoDuration: duration })
    }
  }, [duration, vqVideoDuration])

  const containerRect = annotationContainer?.current?.getBoundingClientRect()

  const handleOnPause = () => {
    onPause()
  }

  useEffect(() => {
    window?.addEventListener('blur', handleOnPause)
    window?.addEventListener('visibilitychange', handleOnPause)

    return () => {
      window?.addEventListener('blur', handleOnPause)
      window?.removeEventListener('visibilitychange', handleOnPause)
    }
  }, [])

  return (
    <PDFPreviewWrapper
      review={review}
      testMode={testMode}
      reportMode={reportMode}
      viewMode={viewMode === 'report'}
      ref={previewContainer}
    >
      <Droppable
        drop={handleDropQuestion}
        className={`${currentAnnotationTool}-tool-selected`}
      >
        <RelativeContainer>
          <CombinedPlayer
            onReady={onReady}
            url={videoUrl}
            playing={playing}
            controls={false}
            ref={videoRef}
            height="100%"
            width="100%"
            onEnded={onEnded}
            config={{
              youtube: {
                playerVars: {
                  iv_load_policy: 3,
                  rel: 0,
                  autoplay: playing ? 1 : 0,
                  controls: 0,
                  playsinline: 1,
                  api_key: appConfig.edYouTubePlayerKey,
                },
                // 0: Off, 1: Moderate, 2: Strict Content filter
                embedConfig: { contentFilter: 0 },
              },
            }}
            onPause={onPause}
            onPlay={onPlay}
            progressInterval={1000}
            onProgress={onProgress}
            volume={volumne}
            muted={muted}
            handleKeyboardSeek={handleKeyboardSeek}
            isVideoQuizAndAIEnabled={
              isVideoQuizAndAIEnabled || vqEnableYouTubeEd
            }
          />
          {!playing && currentTime === 0 && (
            <BigPlayButton>
              <PlayPause
                isPlaying={playing}
                onPlay={onPlay}
                onPause={onPause}
              />
            </BigPlayButton>
          )}
        </RelativeContainer>
        <AnnotationsContainer
          className="annotations-container"
          ref={annotationContainer}
          enableDrag={viewMode === 'edit' && isEditable && !testMode}
          data-cy="AnnotationsContainer"
        >
          {visibleAnnotation
            .filter(
              (item) =>
                !studentWork &&
                item.toolbarMode === 'question' &&
                item.x !== -1 &&
                item.y !== -1
            )
            .map(
              ({
                uuid,
                qIndex,
                x,
                y,
                questionId,
                width,
                height,
                initialWidth,
                initialHeight,
              }) => (
                <div
                  key={uuid}
                  className="annotation-item unselectable-text-container"
                  onClick={handleHighlight(questionId)}
                  style={getNumberStyles(
                    (containerRect.width * x) / 100,
                    (containerRect.height * y) / 100,
                    1
                  )}
                >
                  <Rnd
                    size={{
                      ...(typeof width === 'number' ? { width } : {}),
                      ...(typeof height === 'number' ? { height } : {}),
                    }}
                    minWidth={initialWidth}
                    minHeight={initialHeight}
                    enableResizing={
                      viewMode === 'edit' && isEditable && !testMode
                        ? {
                            bottomLeft: false,
                            bottomRight: true,
                            topLeft: false,
                            topRight: false,
                            bottom: true,
                            left: false,
                            right: true,
                            top: false,
                          }
                        : false
                    }
                    onResizeStop={(e, direction, ref) =>
                      handleResize({ ref, questionId })
                    }
                    bounds=".annotations-container"
                    disableDragging
                  >
                    <QuestionItem
                      onPlay={onPlay}
                      key={questionId}
                      index={qIndex}
                      questionIndex={qIndex}
                      data={questionsById[questionId]}
                      answer={answersById[`${itemId}_${questionId}`]}
                      previewMode={viewMode === 'edit' ? 'clear' : previewMode}
                      onDragStart={() => {
                        onDragStart(questionId)
                      }}
                      groupId={pathname.split('/')[5]}
                      testMode={testMode}
                      highlighted={highlighted === questionId}
                      viewMode={viewMode}
                      zoom={1}
                      review
                      qId={0}
                      itemId={itemId}
                      handleRemoveAnnotation={removeQuestionAnnotation}
                      editMode={editMode}
                      onCreateOptions={() => {}}
                      clearHighlighted={clearHighlighted}
                      draggble
                      disableAutoHightlight
                      isSnapQuizVideoPlayer
                    />
                  </Rnd>
                </div>
              )
            )}
        </AnnotationsContainer>
      </Droppable>
      <StyledPlayerContainer viewMode={viewMode} type="flex" gutter={16}>
        <Col style={{ flex: '0 0 auto' }}>
          <PlayPause isPlaying={playing} onPlay={onPlay} onPause={onPause} />
        </Col>
        <Col style={{ flex: '0 0 auto' }}>
          <StyledTypographyText strong data-cy="timeDisplay">
            {formateSecondsToMMSS(currentTime)}/{formateSecondsToMMSS(duration)}
          </StyledTypographyText>
        </Col>
        <Col
          style={{ flex: '1', minWidth: '0', height: '0px' }}
          data-cy="videoSlider"
        >
          <SeekBar
            marks={marks}
            duration={duration}
            currentTime={currentTime}
            seekTo={seekTo}
            sliderRef={sliderRef}
            handleSetIsSeekBarFocused={handleSetIsSeekBarFocused}
            vqPreventSkipping={vqPreventSkipping}
          />
        </Col>
        <Col style={{ flex: '0 0 auto' }}>
          <MuteUnmute
            volume={muted ? 0 : volumne}
            muted={muted}
            setMuted={setMuted}
          />
        </Col>
        <Col style={{ flex: '0 0 auto' }}>
          <Volume volume={muted ? 0 : volumne} volumeTo={volumeTo} />
        </Col>
      </StyledPlayerContainer>
      <br />
      <DragPreview />
    </PDFPreviewWrapper>
  )
}

VideoPreview.propTypes = {
  annotations: PropTypes.array,
  onDropAnnotation: PropTypes.func.isRequired,
  onHighlightQuestion: PropTypes.func.isRequired,
  clearHighlighted: PropTypes.func.isRequired,
}

VideoPreview.defaultProps = {
  annotations: [],
}

export default connect(
  (state) => ({
    pathname: state.router.location.pathname,
    previewMode: getPreviewSelector(state),
    isVideoQuizAndAIEnabled: isVideoQuizAndAIEnabledSelector(state),
    vqPreventSkipping: vqPreventQuestionSkippingSelector(state),
    vqEnableYouTubeEd: state.studentAssignment.vqEnableYouTubeEd,
    test: getTestEntitySelector(state),
    currentTestActivityId: currentTestActivityIdSelector(state),
    userRole: getUserRole(state),
  }),
  {
    removeAnswers: removeUserAnswerAction,
    setTestData: setTestDataAction,
    setIsVideoEnded: assessmentPageActions.setIsVideoEnded,
  }
)(withRouter(VideoPreview))
