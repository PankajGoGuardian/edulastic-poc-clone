import React, { Fragment } from 'react'
import { findDOMNode } from 'react-dom'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { sortBy, maxBy, uniqBy } from 'lodash'
import { SortableElement, SortableContainer } from 'react-sortable-hoc'
import PerfectScrollbar from 'react-perfect-scrollbar'

import { EduIf } from '@edulastic/common'

import { storeInLocalStorage } from '@edulastic/api/src/utils/Storage'

import {
  createQuestion,
  validationCreators,
  createSection,
} from '../utils/questionsHelpers'

import { getPreviewSelector } from '../../../src/selectors/view'
import { checkAnswerAction } from '../../../src/actions/testItem'
import { changePreviewAction } from '../../../src/actions/view'
import {
  addQuestionAction,
  updateQuestionAction,
  deleteQuestionAction,
} from '../../../sharedDucks/questions'
import AddQuestion from './AddQuestion'
import QuestionItem from './QuestionItem/QuestionItem'
import QuestionEditModal from './QuestionEditModal/QuestionEditModal'
import Section from './Section'
import {
  QuestionsWrapper,
  AnswerActionsWrapper,
  AnswerAction,
  QuestionWidgetWrapper,
} from '../styled-components/Questions'
import { clearAnswersAction } from '../../../src/actions/answers'
import { deleteAnnotationAction } from '../../../TestPage/ducks'
import { getRecentStandardsListSelector } from '../../../src/selectors/dictionaries'
import { updateRecentStandardsAction } from '../../../src/actions/dictionaries'

const SortableQuestionItem = SortableElement(
  ({
    key,
    index,
    handleOnClick,
    data,
    review,
    onCreateOptions,
    onOpenEdit,
    onDelete,
    previewMode,
    viewMode,
    answer,
    feedback,
    previousFeedback,
    onDragStart,
    highlighted,
    testMode,
    onHighlightQuestion,
    questionIndex,
    groupId,
    qId,
    clearHighlighted,
    resetTimeSpentOnQuestion,
    itemId,
    disableAutoHightlight,
    editMode,
    onDropAnnotation,
  }) => (
    <div
      onClick={() => {
        onHighlightQuestion(data.id)
      }}
      onFocus={() => {
        onHighlightQuestion(data.id)
      }}
      style={{
        display: 'flex',
        marginBottom: '6px',
        paddingRight: (testMode || review) && 12,
        paddingLeft: (testMode || review) && 4,
        paddingTop: questionIndex === 1 && 6,
        marginTop: (testMode || review) && 5,
      }}
    >
      <QuestionItem
        key={key}
        index={index}
        handleOnClick={handleOnClick}
        questionIndex={questionIndex}
        data={data}
        review={review}
        onCreateOptions={onCreateOptions}
        onOpenEdit={onOpenEdit}
        onDelete={onDelete}
        previewMode={previewMode}
        viewMode={viewMode}
        answer={answer}
        feedback={feedback}
        previousFeedback={previousFeedback}
        onDragStart={() => onDragStart(data.id)}
        highlighted={highlighted}
        testMode={testMode}
        groupId={groupId}
        qId={qId}
        clearHighlighted={clearHighlighted}
        resetTimeSpentOnQuestion={resetTimeSpentOnQuestion}
        itemId={itemId}
        disableAutoHightlight={disableAutoHightlight}
        editMode={editMode}
        onDropAnnotation={onDropAnnotation}
      />
    </div>
  )
)

const updateQuesionData = (question, data) => ({
  ...question,
  ...data,
})

class Questions extends React.Component {
  constructor(props) {
    super(props)
    this.containerRef = React.createRef()
    this.scrollBarRef = React.createRef()
    this.state = {
      currentEditQuestionIndex: -1,
    }
  }

  componentDidMount() {
    this.resetTimeSpentOnQuestion()
  }

  componentDidUpdate() {
    const {
      annotations,
      handleAddBulkQuestionAnnotations,
      editMode,
      isSnapQuizVideoPlayer,
      highlightedQuestion,
    } = this.props

    if (
      !isSnapQuizVideoPlayer &&
      editMode &&
      typeof handleAddBulkQuestionAnnotations === 'function'
    ) {
      let questions = this.questionList
      questions = (questions || []).filter((question) => {
        const annotationIndex = (annotations || []).findIndex(
          (annotation) => annotation?.questionId === question.id
        )
        return annotationIndex === -1
      })
      if (questions?.length) {
        const newAnnotations = []
        questions.forEach((question) => {
          if (typeof question?.questionDisplayTimestamp === 'number') {
            const annotation = {
              x: -1,
              y: -1,
              questionId: question.id,
              qIndex: question.qIndex,
              time: question.questionDisplayTimestamp,
            }
            newAnnotations.push(annotation)
          }
        })
        if (newAnnotations.length) {
          handleAddBulkQuestionAnnotations(newAnnotations)
        }
      }
    }

    if (editMode && highlightedQuestion) {
      this.scrollToQuestion(highlightedQuestion)
    }
  }

  scrollToQuestion = (questionId) => {
    const element = document.getElementById(questionId)
    if (this?.scrollBarRef?.current && element) {
      this.scrollBarRef.current.scrollTop = element.offsetTop - 10 // 10px is padding to this element
    }
  }

  isQuestionVisible = (questionId = '') => {
    const { videoQuizQuestionsToDisplay = [], editMode } = this.props
    const visibleQuestionIndex = (videoQuizQuestionsToDisplay || []).findIndex(
      (questionAnnotation) =>
        questionAnnotation?.questionId === questionId &&
        questionAnnotation?.x === -1 &&
        questionAnnotation?.y === -1
    )
    return editMode || visibleQuestionIndex !== -1
  }

  scrollToBottom = () => {
    const reference = this.containerRef
    if (reference.current) {
      const elem = findDOMNode(reference.current)
      if (elem.scrollHeight > elem.clientHeight) {
        elem.scrollTop = elem.scrollHeight - elem.clientHeight
      }
    }
  }

  resetTimeSpentOnQuestion = () => {
    window.localStorage.setItem('docAssessmentLastTimestamp', Date.now())
  }

  handleAddQuestion = (
    type,
    index,
    modalQuestionId,
    docBasedCommonData = {},
    aiQuestion,
    isFromAddBulk
  ) => () => {
    const { addQuestion, list } = this.props
    const questions = list.filter((q) => q.type !== 'sectionLabel')

    const lastQuestion = maxBy(questions, 'qIndex')

    const questionIndex =
      index ||
      (lastQuestion && lastQuestion.qIndex
        ? lastQuestion.qIndex + 1
        : questions.length + 1)

    const question = createQuestion({
      type,
      questionIndex,
      docBasedCommonData,
      aiQuestion,
    })
    addQuestion(question)

    const questionIdToOpen = modalQuestionId - 1 || list.length
    if (!isFromAddBulk) {
      this.handleOpenEditModal(questionIdToOpen)()
    }
  }

  handleDeleteQuestion = (questionId) => () => {
    const { deleteQuestion, deleteAnnotation } = this.props
    deleteAnnotation(questionId)
    deleteQuestion(questionId)
  }

  handleAddSection = () => {
    const { addQuestion, list } = this.props
    const sectionIndex = list.length
    const section = createSection(sectionIndex)

    addQuestion(section)
    this.scrollToBottom()
  }

  handleUpdateSection = (sectionId, title) => {
    const { questionsById, updateQuestion } = this.props
    const section = questionsById[sectionId]

    if (section) {
      const updatedSection = {
        ...section,
        title,
      }
      updateQuestion(updatedSection)
    }
  }

  handleCreateOptions = (questionId, type) => ({ target: { value } }) => {
    const { questionsById, updateQuestion } = this.props
    const question = questionsById[questionId]
    const createValidation = validationCreators[type]

    if (question) {
      const questionWithOptions = updateQuesionData(
        question,
        createValidation(value)
      )

      updateQuestion(questionWithOptions)
    }
  }

  handleUpdateData = (data) => {
    const { updateQuestion, updateRecentStandards } = this.props
    let { recentStandardsList } = this.props
    const question = this.currentQuestion
    const nextQuestion = updateQuesionData(question, data)
    updateQuestion(nextQuestion)
    const { alignment = [] } = nextQuestion

    const standards = alignment[0]?.standards || []
    if (standards.length > 0 && data?.alignment) {
      // to update recent standards used in local storage and store
      recentStandardsList = uniqBy(
        [...standards, ...recentStandardsList],
        (i) => i._id
      ).slice(0, 10)
      updateRecentStandards({ recentStandards: recentStandardsList })
      storeInLocalStorage(
        'recentStandards',
        JSON.stringify(recentStandardsList)
      )
    }
  }

  handleOpenEditModal = (index) => (direction) => {
    let openIndex = index
    if (direction === 'next') {
      for (let i = index; i < this.questionList.length; i++) {
        if (!this.questionList[i]) {
          return this.handleCloseEditModal()
        }
        if (
          this.questionList[i].type === 'sectionLabel' &&
          i == this.questionList.length - 1
        ) {
          return this.handleCloseEditModal()
        }
        if (this.questionList[i].type !== 'sectionLabel') {
          openIndex = i
          break
        }
      }
    }
    if (direction === 'back') {
      for (let i = index; i >= 0; i--) {
        if (!this.questionList[i]) {
          return this.handleCloseEditModal()
        }
        if (this.questionList[i].type === 'sectionLabel' && i == 0) {
          return this.handleCloseEditModal()
        }
        if (this.questionList[i].type !== 'sectionLabel') {
          openIndex = i
          break
        }
      }
    }
    this.setState({
      currentEditQuestionIndex: openIndex,
    })
  }

  handleCloseEditModal = () =>
    this.setState(
      {
        currentEditQuestionIndex: -1,
      },
      () => this.scrollToBottom()
    )

  handleCheckAnswer = () => {
    const { checkAnswer, changePreview } = this.props

    changePreview('check')
    checkAnswer('edit')
  }

  handleShowAnswer = () => {
    const { checkAnswer, changePreview } = this.props

    changePreview('show')
    checkAnswer({ mode: 'show' })
  }

  handleClear = () => {
    const { changePreview, removeUserAnswer } = this.props

    changePreview('clear')
    removeUserAnswer()
  }

  handleQuestionItemClick = (question) => {
    const { handleUpdateSeektime, isSnapQuizVideoPlayer, editMode } = this.props
    const { questionDisplayTimestamp = null } = question
    if (
      editMode &&
      !isSnapQuizVideoPlayer &&
      questionDisplayTimestamp &&
      typeof handleUpdateSeektime === 'function'
    ) {
      handleUpdateSeektime(questionDisplayTimestamp)
    }
  }

  get currentQuestion() {
    const { currentEditQuestionIndex } = this.state
    return this.questionList[currentEditQuestionIndex]
  }

  get editModalVisible() {
    const { currentEditQuestionIndex } = this.state
    return currentEditQuestionIndex > -1
  }

  get questionList() {
    const { list } = this.props
    return sortBy(list, (item) => item.qIndex)
  }

  getQIndexForDocBasedItems() {
    let loopVar = 1
    return this.questionList.map((x) =>
      x.type === 'sectionLabel' ? null : loopVar++
    )
  }

  render() {
    const { currentEditQuestionIndex } = this.state
    const {
      previewMode,
      viewMode,
      noCheck,
      answersById,
      highlighted,
      list,
      onDragStart,
      review,
      testMode,
      reportMode,
      onHighlightQuestion,
      groupId,
      qId,
      clearHighlighted,
      itemId,
      disableAutoHightlight,
      editMode,
      onDropAnnotation,
      annotations,
    } = this.props
    const minAvailableQuestionIndex =
      (maxBy(list, 'qIndex') || { qIndex: 0 }).qIndex + 1
    let shouldModalBeVisibile = true
    if (list.length > 0 && list[currentEditQuestionIndex]) {
      shouldModalBeVisibile =
        list[currentEditQuestionIndex].type !== 'sectionLabel'
    }

    const questionIndex = this.getQIndexForDocBasedItems()

    return (
      <>
        <QuestionsWrapper
          reportMode={reportMode}
          review={review}
          viewMode={viewMode === 'edit'}
          testMode={testMode}
          ref={this.containerRef}
        >
          <QuestionWidgetWrapper
            reportMode={reportMode}
            testMode={testMode}
            review={review}
          >
            <PerfectScrollbar
              containerRef={(el) => {
                this.scrollBarRef.current = el
              }}
            >
              {this.questionList.map((question, i) =>
                question.type === 'sectionLabel' ? (
                  <Section
                    key={question.id}
                    section={question}
                    viewMode={viewMode}
                    questionIndex={questionIndex[i]}
                    onUpdate={this.handleUpdateSection}
                    onDelete={this.handleDeleteQuestion(question.id)}
                  />
                ) : (
                  <EduIf condition={this.isQuestionVisible(question.id)}>
                    <SortableQuestionItem
                      key={question.id}
                      index={i}
                      handleOnClick={() =>
                        this.handleQuestionItemClick(question)
                      }
                      questionIndex={questionIndex[i]}
                      data={question}
                      review={review}
                      onCreateOptions={this.handleCreateOptions}
                      onOpenEdit={this.handleOpenEditModal(i)}
                      onDelete={this.handleDeleteQuestion(question.id)}
                      previewMode={previewMode}
                      viewMode={viewMode}
                      answer={answersById[`${itemId}_${question.id}`]}
                      onDragStart={onDragStart}
                      highlighted={highlighted === question.id}
                      testMode={testMode}
                      onHighlightQuestion={onHighlightQuestion}
                      clearHighlighted={clearHighlighted}
                      groupId={groupId}
                      qId={qId}
                      resetTimeSpentOnQuestion={this.resetTimeSpentOnQuestion}
                      itemId={itemId}
                      disableAutoHightlight={disableAutoHightlight}
                      editMode={editMode}
                      onDropAnnotation={onDropAnnotation}
                    />
                  </EduIf>
                )
              )}
            </PerfectScrollbar>
          </QuestionWidgetWrapper>
          {!review && !testMode && (
            <AddQuestion
              onAddQuestion={this.handleAddQuestion}
              onAddSection={this.handleAddSection}
              minAvailableQuestionIndex={minAvailableQuestionIndex}
              scrollToBottom={this.scrollToBottom}
            />
          )}
          {review && !noCheck && !reportMode && (
            <AnswerActionsWrapper>
              <AnswerAction
                active={previewMode === 'check'}
                onClick={this.handleCheckAnswer}
                data-cy="checkAnswer"
              >
                Check Answer
              </AnswerAction>
              <AnswerAction
                active={previewMode === 'show'}
                onClick={this.handleShowAnswer}
                data-cy="showAnswer"
              >
                Show Answer
              </AnswerAction>
              <AnswerAction onClick={this.handleClear} data-cy="clearAnswer">
                Clear
              </AnswerAction>
            </AnswerActionsWrapper>
          )}
        </QuestionsWrapper>
        {shouldModalBeVisibile && (
          <QuestionEditModal
            totalQuestions={list.length}
            visible={shouldModalBeVisibile}
            question={this.currentQuestion}
            qNumber={questionIndex[currentEditQuestionIndex]}
            onClose={this.handleCloseEditModal}
            onUpdate={this.handleUpdateData}
            onCurrentChange={this.handleOpenEditModal}
            onDropAnnotation={onDropAnnotation}
            annotations={annotations}
          />
        )}
      </>
    )
  }
}

Questions.propTypes = {
  list: PropTypes.array,
  questionsById: PropTypes.object,
  addQuestion: PropTypes.func.isRequired,
  updateQuestion: PropTypes.func.isRequired,
  deleteQuestion: PropTypes.func.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  changePreview: PropTypes.func.isRequired,
  previewMode: PropTypes.string.isRequired,
  viewMode: PropTypes.string.isRequired,
  noCheck: PropTypes.bool,
  answersById: PropTypes.object,
  highlighted: PropTypes.string,
}

Questions.defaultProps = {
  list: [],
  questionsById: {},
  noCheck: false,
  answersById: {},
  highlighted: undefined,
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      recentStandardsList: getRecentStandardsListSelector(state),
      previewMode: getPreviewSelector(state),
    }),
    {
      addQuestion: addQuestionAction,
      updateQuestion: updateQuestionAction,
      deleteQuestion: deleteQuestionAction,
      deleteAnnotation: deleteAnnotationAction,
      updateRecentStandards: updateRecentStandardsAction,
      checkAnswer: checkAnswerAction,
      changePreview: changePreviewAction,
      removeUserAnswer: clearAnswersAction,
    }
  ),
  SortableContainer
)

export default enhance(Questions)
