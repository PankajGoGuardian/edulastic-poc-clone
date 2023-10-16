import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import produce from 'immer'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { withWindowSizes, helpers, toggleChatDisplay } from '@edulastic/common'

import { setTestDataAction } from '../../TestPage/ducks'

import Questions from './components/Questions'
import {
  WorksheetWrapper,
  VideoViewerContainer,
} from './styled-components/Worksheet'

import {
  loadQuestionsAction,
  updateQuestionAction,
} from '../../sharedDucks/questions'

import { getTestEntitySelector } from '../../AssignTest/duck'

import { createAssessmentRequestAction } from '../../AssessmentCreate/ducks'
import VideoPreview from './components/VideoPreview/VideoPreview'

const VideoQuizWorksheetComponent = ({
  annotations,
  review,
  viewMode,
  noCheck,
  questions,
  questionsById,
  test: { isDocBased, videoUrl: entityLink },
  testMode = false,
  studentWorkAnswersById,
  studentWork = false,
  extraPaddingTop,
  currentAnnotationTool,
  isEditable,
  groupId,
  itemDetail,
  testItemId,
  annotationsStack,
  stdAnnotations,
  videoUrl,
  setTestData,
  answersById,
  updateQuestion,
  setQuestionsById,
  history,
}) => {
  const annotationsRef = useRef()
  const questionsContainerRef = useRef(null)

  useEffect(() => {
    // hiding and showing help chat icon for video quiz worksheet
    toggleChatDisplay('hide')

    return () => {
      toggleChatDisplay('show')
    }
  }, [])

  useEffect(() => {
    annotationsRef.current = annotations
  }, [annotations])

  const videoRef = useRef(null)
  const [highlightedQuestion, setHighlightedQuestion] = useState(null)
  const [
    videoQuizQuestionsToDisplay,
    setVideoQuizQuestionsToDisplay,
  ] = useState([])
  const [questionClickSeekTime, setQuestionClickSeekTime] = useState(null)
  const [sortQuestionsByTimestamp, setSortQuestionsByTimestamp] = useState(
    false
  )

  const onPlay = () => {
    videoRef?.current.playVideo?.()
  }

  const handleUpdateSeektime = (time = null) => {
    if (time) {
      setQuestionClickSeekTime(time)
    }
  }

  // taking video to specific question
  const questionKey = history?.location?.state?.question
  const questionTime = questionsById?.[questionKey]?.questionDisplayTimestamp

  const handleHighlightQuestion = (questionId) => {
    setHighlightedQuestion(questionId)
  }

  const clearHighlighted = () => setHighlightedQuestion(null)

  const updateVideoQuizQuestionsToDisplay = (questionAnnotations = []) => {
    setVideoQuizQuestionsToDisplay(questionAnnotations)
  }

  const handleRemoveAnnotation = (questionId) => {
    const newAnnotations = (annotations || []).filter(
      (annotation) => annotation?.questionId !== questionId
    )
    const updatedAssessment = {
      annotations: newAnnotations,
    }
    setTestData(updatedAssessment)

    const questionIndex = (questions || []).findIndex(
      (_question) => _question?.id === questionId
    )
    if (questionIndex !== -1) {
      const questionData = questions[questionIndex] || {}
      updateQuestion({
        ...questionData,
        questionDisplayTimestamp: null,
      })
    }
  }

  const handleDeleteAnnotationAndUpdateQIndex = ({
    questionId,
    deleteQuestionIndex,
  }) => {
    let updatedAnnotations = (annotations || []).filter(
      (annotation) => annotation?.questionId !== questionId
    )

    updatedAnnotations = (updatedAnnotations || []).map((annotation) => {
      if (
        annotation?.toolbarMode === 'question' &&
        annotation?.qIndex > deleteQuestionIndex
      ) {
        return {
          ...annotation,
          qIndex: annotation.qIndex - 1,
        }
      }
      return annotation
    })

    const updatedAssessment = {
      annotations: updatedAnnotations,
    }
    setTestData(updatedAssessment)
  }

  const handleAddBulkQuestionAnnotations = (annotationsData) => {
    const newAnnotations = [...annotations]

    ;(annotationsData || []).forEach((annotationData) => {
      const annotation = {
        uuid: helpers.uuid(),
        type: 'point',
        class: 'Annotation',
        toolbarMode: 'question',
        ...annotationData,
      }
      newAnnotations.push(annotation)
    })

    const updatedAssessment = {
      annotations: newAnnotations,
    }
    setTestData(updatedAssessment)
  }

  const handleAddAnnotation = (question) => {
    const annotation = {
      uuid: helpers.uuid(),
      type: 'point',
      class: 'Annotation',
      toolbarMode: 'question',
      initialWidth: 400,
      initialHeight: 300,
      ...question,
    }

    const newAnnotations = [...(annotationsRef?.current || [])]
    let annotationIndex = -1
    // UI annotation get clubbed to if you find any UI annotation remove previous one and push new
    annotationIndex = newAnnotations.findIndex((item) => {
      if (item.questionId || question.questionId) {
        return `${item.questionId}` === `${question.questionId}`
      }
      return (
        Math.floor(question.time) === Math.floor(item.time) ||
        !item.x ||
        !item.y
      )
    })

    if (annotationIndex > -1) {
      newAnnotations.splice(annotationIndex, 1)
    }

    newAnnotations.push(annotation)

    if (annotation.toolbarMode === 'question') {
      const questionIndex = (questions || []).findIndex(
        (_question) => _question?.id === question.questionId
      )
      if (questionIndex !== -1) {
        const questionData = questions[questionIndex] || {}
        if (question.time === null) {
          handleRemoveAnnotation(question.questionId)
          return
        }
        updateQuestion({
          ...questionData,
          questionDisplayTimestamp: question.time,
        })
      }
    }

    const updatedAssessment = {
      annotations: newAnnotations,
    }

    setTestData(updatedAssessment)
  }

  const onDragStart = (questionId) => {
    handleHighlightQuestion(questionId)
  }

  const onSortEnd = ({ newIndex, oldIndex }) => {
    // Update the qIndex based on newIndex
    const newQuestionsById = produce(questionsById, (draft) => {
      const qids = questions
        .sort((a, b) => a?.qIndex - b?.qIndex)
        .map((obj) => obj?.id)
      const id = qids[oldIndex]
      qids.splice(qids.indexOf(id), 1)
      qids.splice(newIndex, 0, id)
      qids.forEach((idx, i) => {
        draft[idx].qIndex = i + 1
      })
    })

    setQuestionsById(newQuestionsById)

    const questionIdsMap = {}
    Object.values(newQuestionsById).forEach((q) => {
      questionIdsMap[q?.id] = q?.qIndex
    })

    // Update the corresponding annotations
    setTestData({
      annotations: produce(annotations, (draft) => {
        draft.forEach((a) => {
          a.qIndex = questionIdsMap[a.questionId]
        })
      }),
    })
  }

  const finalvideoUrl = videoUrl || entityLink
  if (studentWorkAnswersById) {
    answersById = studentWorkAnswersById
  }

  const reportMode = viewMode && viewMode === 'report'
  const editMode = viewMode === 'edit'
  const showAnnotationTools = editMode || testMode

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <WorksheetWrapper
        showTools={showAnnotationTools}
        reportMode={reportMode}
        testMode={testMode}
        extraPaddingTop={extraPaddingTop}
      >
        <VideoViewerContainer>
          <VideoPreview
            startAt={questionTime}
            onHighlightQuestion={handleHighlightQuestion}
            currentAnnotationTool={currentAnnotationTool}
            annotations={annotations}
            stdAnnotations={stdAnnotations}
            annotationsCount={annotationsStack?.length} // need to update annotations on redo and undo action
            onDragStart={onDragStart}
            onDropAnnotation={handleAddAnnotation}
            questions={questions}
            questionsById={questionsById}
            answersById={answersById}
            viewMode={viewMode}
            isEditable={isEditable}
            reportMode={reportMode}
            testMode={testMode}
            studentWork={studentWork}
            highlighted={highlightedQuestion}
            forwardedVideoRef={videoRef}
            review={review}
            videoUrl={finalvideoUrl}
            itemId={itemDetail?._id || testItemId}
            handleRemoveAnnotation={handleRemoveAnnotation}
            editMode={editMode}
            updateVideoQuizQuestionsToDisplay={
              updateVideoQuizQuestionsToDisplay
            }
            questionClickSeekTime={questionClickSeekTime}
            handleUpdateSeektime={handleUpdateSeektime}
            clearHighlighted={clearHighlighted}
          />
        </VideoViewerContainer>
        <Questions
          getContainer={() =>
            ReactDOM.findDOMNode(questionsContainerRef.current)
          }
          transitionDuration={0}
          videoRef={videoRef}
          questionsContainerRef={questionsContainerRef}
          onPlay={onPlay}
          noCheck={noCheck}
          list={questions}
          review={review}
          viewMode={viewMode}
          questionsById={questionsById}
          answersById={answersById}
          highlighted={highlightedQuestion}
          onDragStart={onDragStart}
          onHighlightQuestion={handleHighlightQuestion}
          lockToContainerEdges
          lockOffset={['15%', '10%']}
          lockAxis="y"
          useDragHandle
          onSortEnd={onSortEnd}
          testMode={testMode}
          isDocBased={isDocBased}
          reportMode={reportMode}
          groupId={groupId}
          qId={0}
          clearHighlighted={clearHighlighted}
          itemId={itemDetail?._id}
          disableAutoHightlight={!!finalvideoUrl}
          editMode={editMode}
          onDropAnnotation={handleAddAnnotation}
          annotations={annotations}
          isSnapQuizVideoPlayer={false}
          handleAddBulkQuestionAnnotations={handleAddBulkQuestionAnnotations}
          videoQuizQuestionsToDisplay={videoQuizQuestionsToDisplay}
          handleUpdateSeektime={handleUpdateSeektime}
          studentWork={studentWork}
          handleDeleteAnnotationAndUpdateQIndex={
            handleDeleteAnnotationAndUpdateQIndex
          }
          sortQuestionsByTimestamp={sortQuestionsByTimestamp}
          setSortQuestionsByTimestamp={setSortQuestionsByTimestamp}
          setQuestionsById={setQuestionsById}
          setTestData={setTestData}
        />
      </WorksheetWrapper>
    </div>
  )
}

VideoQuizWorksheetComponent.propTypes = {
  setTestData: PropTypes.func.isRequired,
  questions: PropTypes.array.isRequired,
  questionsById: PropTypes.object.isRequired,
  answersById: PropTypes.object,
  review: PropTypes.bool,
  noCheck: PropTypes.bool,
  annotations: PropTypes.array,
}

VideoQuizWorksheetComponent.defaultProps = {
  review: false,
  annotations: [],
  noCheck: false,
  answersById: {},
}

const withForwardedRef = (Component) => {
  const handle = (props, ref) => <Component {...props} forwardedRef={ref} />

  const name = Component.displayName || Component.name
  handle.displayName = `withForwardedRef(${name})`

  return React.forwardRef(handle)
}

const VideoQuizWorksheet = withForwardedRef(VideoQuizWorksheetComponent)

export { VideoQuizWorksheet }

const annotationsStackSelector = (state, ownProps) => {
  const { testMode } = ownProps

  if (!testMode) {
    const pdfAnnotations = state.tests.entity?.annotations || []
    return pdfAnnotations.filter((a) => !a?.questionId)
  }

  return state?.userWork?.past || []
}

const enhance = compose(
  withWindowSizes,
  withRouter,
  connect(
    (state, ownProps) => ({
      test: getTestEntitySelector(state),
      itemDetail: ownProps.isAssessmentPlayer
        ? ownProps.item
        : state.itemDetail.item,
      answersById: state.answers,
      currentAnnotationTool: state.tests.currentAnnotationTool,
      annotationsStack: annotationsStackSelector(state, ownProps),
    }),
    {
      createAssessment: createAssessmentRequestAction,
      setTestData: setTestDataAction,
      setQuestionsById: loadQuestionsAction,
      updateQuestion: updateQuestionAction,
    }
  )
)

export default enhance(VideoQuizWorksheet)
