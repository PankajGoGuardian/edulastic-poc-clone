import { DragDrop } from '@edulastic/common'
import { Col } from 'antd'
import { round } from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { removeUserAnswerAction } from '../../../../assessment/actions/answers'
import { getPreviewSelector } from '../../../src/selectors/view'
import QuestionItem from '../QuestionItem/QuestionItem'
import CombinedPlayer from './CombinedPlayer'
import MuteUnmute from './MuteUnmute'
import PlayPause from './PlayPause'
import SeekBar from './SeekBar'
import Volume from './Volume'
import {
  AnnotationsContainer,
  Droppable,
  PDFPreviewWrapper,
  StyledPlayerContainer,
  StyledTypographyText,
} from './styled'
import {
  formateSecondsToMMSS,
  getCurrentTime,
  getMarks,
  getNumberStyles,
  getVideoDuration,
  getVisibleAnnotation,
  showMarkerArea,
  useStateRef,
} from './utils'
import appConfig from '../../../../../app-config'

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
  updateVideoQuizQuestionIdsToDisplay,
  questionClickSeekTime,
  handleUpdateSeektime,
}) => {
  const previewContainer = useRef()
  const annotationContainer = useRef()
  const videoRef = useRef()
  const markerArea = useRef()
  const annotationsRef = useRef()

  const [
    visibleAnnotation,
    setVisibleAnnotation,
    visibleAnnotationRef,
  ] = useStateRef([])

  const [playing, setPlaying] = useState(false)
  const [volumne, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  const getQuestionIds = (questionAnnotations = []) =>
    (questionAnnotations || []).map((annotation) => annotation?.questionId)

  const onPlay = () => {
    setPlaying(true)
    if (markerArea?.current && markerArea?.current?.isOpen) {
      markerArea.current.close()
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

    updateVideoQuizQuestionIdsToDisplay(
      getQuestionIds(questionAnnotations || [])
    )

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
      videoRef.current?.seekTo?.(time)
    }
  }

  const handleDropQuestion = ({ data, itemRect }) => {
    if (annotationContainer.current) {
      const { x: clientX, y: clientY } = itemRect

      const containerRect = annotationContainer.current.getBoundingClientRect()
      let x = clientX - containerRect.x - 10
      let y = clientY - containerRect.y - 10
      x = round(x / 1, 2)
      y = round(y / 1, 2)

      onPause()
      onDropAnnotation(
        {
          x,
          y,
          questionId: data.id,
          qIndex: data.index,
          time: Math.floor(videoRef.current?.getCurrentTime?.()),
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
    annotationsRef.current = annotations
    const _currentTime = getCurrentTime(videoRef)

    let newVisibleAnnotations = getVisibleAnnotation(annotations, _currentTime)

    newVisibleAnnotations = newVisibleAnnotations?.length
      ? newVisibleAnnotations
      : []
    const questionAnnotations = newVisibleAnnotations.filter(
      (annotation) => annotation.toolbarMode === 'question'
    )
    updateVideoQuizQuestionIdsToDisplay(
      getQuestionIds(questionAnnotations || [])
    )

    if (newVisibleAnnotations.length > 0) {
      onPause()
      onHighlightQuestion(newVisibleAnnotations[0].questionId, true)
      setVisibleAnnotation(newVisibleAnnotations)
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
      seekTo(questionClickSeekTime)
      handleUpdateSeektime(null)
    }
  }, [questionClickSeekTime])

  const duration = getVideoDuration(videoRef)
  const marks = getMarks(annotations)

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
        <CombinedPlayer
          url={videoUrl}
          playing={playing}
          controls={false}
          ref={videoRef}
          height="100%"
          width="100%"
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
              embedConfig: { contentFilter: 2 },
            },
          }}
          onPause={onPause}
          onPlay={onPlay}
          progressInterval={1000}
          onProgress={onProgress}
          volume={volumne}
          muted={muted}
        />
        <AnnotationsContainer
          className="annotations-container"
          ref={annotationContainer}
          enableDrag={viewMode === 'edit' && isEditable && !testMode}
        >
          {visibleAnnotation
            .filter((item) => item.toolbarMode === 'question' && item.x !== -1)
            .map(({ uuid, qIndex, x, y, questionId }) => (
              <div
                key={uuid}
                className="annotation-item"
                onClick={handleHighlight(questionId)}
                style={getNumberStyles(x, y, 1)}
              >
                <QuestionItem
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
                  draggble
                  disableAutoHightlight
                  isSnapQuizVideo
                  isSnapQuizVideoPlayer
                />
              </div>
            ))}
        </AnnotationsContainer>
      </Droppable>
      <StyledPlayerContainer viewMode={viewMode} type="flex" gutter={16}>
        <Col>
          <PlayPause isPlaying={playing} onPlay={onPlay} onPause={onPause} />
        </Col>
        <Col>
          <StyledTypographyText strong>
            {formateSecondsToMMSS(currentTime)}/{formateSecondsToMMSS(duration)}
          </StyledTypographyText>
        </Col>
        <Col>
          <SeekBar
            marks={marks}
            duration={duration}
            currentTime={currentTime}
            seekTo={seekTo}
            style={{ width: '300px' }}
          />
        </Col>
        <Col>
          <MuteUnmute
            volume={muted ? 0 : volumne}
            muted={muted}
            setMuted={setMuted}
          />
        </Col>
        <Col>
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
}

VideoPreview.defaultProps = {
  annotations: [],
}

export default connect(
  (state) => ({
    pathname: state.router.location.pathname,
    previewMode: getPreviewSelector(state),
  }),
  {
    removeAnswers: removeUserAnswerAction,
  }
)(withRouter(VideoPreview))
