import React, { createRef } from 'react'
import PropTypes from 'prop-types'

import { ScrollContext, notification } from '@edulastic/common'
import { get, isEmpty } from 'lodash'
import { connect } from 'react-redux'
import * as Sentry from '@sentry/browser'
import Question from '../Question/Question'
import {
  ModalWrapper,
  QuestionWrapperStyled,
  BottomNavigationWrapper,
} from './styled'
import {
  submitResponseAction,
  setUpdatedScratchPadAction,
  uploadDataAndUpdateAttachmentAction,
  getTeacherEditedScoreSelector,
  getIsScoringCompletedSelector,
  getUpdatedScratchPadSelector,
  removeTeacherEditedScoreAction,
} from '../../ducks'
import { userWorkSelector } from '../../../../student/sharedDucks/TestItem'
import { scratchpadDomRectSelector } from '../../../../common/components/Scratchpad/duck'
import { hasValidAnswers } from '../../../../assessment/utils/answer'
import {
  getAnswerByQidSelector,
  getStudentQuestionSelector,
} from '../../../ClassBoard/ducks'
import BottomNavigation from '../BottomNavigation/BottomNavigation'

const QuestionWrapper = React.forwardRef((props, ref) => (
  <QuestionWrapperStyled {...props} ref={ref} />
))

class QuestionModal extends React.Component {
  constructor() {
    super()
    this.state = {
      loaded: false,
      // visible: false,
      // question: null,
      rowIndex: null,
      colIndex: null,
      maxQuestions: null,
      maxStudents: null,
      editResponse: false,
      studentId: '',
    }
    this.containerRef = createRef()
  }

  componentDidMount() {
    // TODO: attach only the event listener, move rest of code into getDerivedStateFromProps
    const { record, tableData, scoreMode } = this.props
    const loaded = true
    let maxQuestions = null
    let maxStudents = null
    const colIndex = record ? record.colIndex : null
    const rowIndex = record ? record.rowIndex : null

    if (rowIndex !== null) {
      maxQuestions = tableData[rowIndex].questions
      maxStudents = tableData.length
    }
    this.setState({
      rowIndex,
      colIndex,
      loaded,
      maxQuestions,
      maxStudents,
      editResponse: !scoreMode,
      studentId: record?.studentId,
    })
    document.addEventListener('keyup', this.keyListener, false)
  }

  // TODO: refactor to getDerivedStateFromProps
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { record, tableData } = nextProps
    const loaded = true
    const newcolIndex = record ? record.colIndex : null
    const newrowIndex = record ? record.rowIndex : null
    const { rowIndex, colIndex } = this.state

    if (rowIndex === null && colIndex === null) {
      const maxQuestions = tableData[rowIndex].questions
      const maxStudents = tableData.length
      this.setState({
        loaded,
        rowIndex: newrowIndex,
        colIndex: newcolIndex,
        maxQuestions,
        maxStudents,
      })
    }
  }

  // When a new row inserted as part of real time update in the EG table the current row index will change
  // to find the new index and update the popup data
  static getDerivedStateFromProps(props, state) {
    const { tableData } = props
    const { studentId, rowIndex } = state
    const newRowIndex = tableData.findIndex(
      (ele) => ele.students.studentId === studentId
    )
    if (
      state.maxStudents < tableData.length &&
      rowIndex !== newRowIndex &&
      newRowIndex !== -1
    ) {
      return {
        maxStudents: tableData.length,
        rowIndex: newRowIndex,
      }
    }
    return null
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.keyListener, false)
  }

  keyListener = (event) => {
    if (event.keyCode === 37) {
      this.prevQuestion()
    }
    if (event.keyCode === 38) {
      this.prevStudent(event)
    }
    if (event.keyCode === 39) {
      this.nextQuestion()
    }
    if (event.keyCode === 40) {
      this.nextStudent(event)
    }
  }

  hideModal = () => {
    this.submitResponse()
    const { hideQuestionModal } = this.props
    hideQuestionModal()
  }

  nextStudent = (event) => {
    const { maxStudents } = this.state
    const { rowIndex, colIndex } = this.state
    const { tableData, updateRecord } = this.props

    const nextIndex = rowIndex + 1
    if (nextIndex !== maxStudents) {
      this.submitResponse()
      this.setState({ loaded: false }, () => {
        this.setState({ rowIndex: nextIndex, loaded: true }, () => {
          if (typeof updateRecord === 'function') {
            updateRecord(get(tableData, [nextIndex, `Q${colIndex}`]))
          }
        })
      })
    } else {
      event.stopPropagation()
      notification({ type: 'success', messageKey: 'finishedGrading' })
    }
  }

  prevStudent = (event) => {
    const { rowIndex, colIndex } = this.state
    const { tableData, updateRecord } = this.props

    if (rowIndex !== 0) {
      this.submitResponse()
      const prevIndex = rowIndex - 1
      this.setState({ loaded: false }, () => {
        this.setState({ rowIndex: prevIndex, loaded: true }, () => {
          if (typeof updateRecord === 'function') {
            updateRecord(get(tableData, [prevIndex, `Q${colIndex}`]))
          }
        })
      })
    } else {
      event?.stopPropagation()
    }
  }

  getQuestion = () => {
    const { rowIndex, colIndex } = this.state
    const { tableData } = this.props
    return get(tableData, [rowIndex, `Q${colIndex}`])
  }

  submitResponse = () => {
    const question = this.getQuestion()
    /**
     *  testActivityId,
        itemId,
        groupId,
        userResponse
     */
    const {
      groupId,
      userResponse: _userResponse,
      allResponse,
      submitResponse,
      teacherEditedScore,
      studentResponseLoading,
      studentQuestionResponseTestActivityId,
      userWork,
      setUpdatedScratchPad,
      updatedScratchPad,
      uploadDataAndUpdateAttachment,
      scratchPadDimensions,
      removeTeacherEditedScore,
    } = this.props
    if (studentResponseLoading) {
      return
    }
    const { testActivityId, testItemId: itemId, userId } = question
    if (
      studentQuestionResponseTestActivityId &&
      testActivityId != studentQuestionResponseTestActivityId
    ) {
      // TODO: this situation shouldn't happen. but currently happening when switching netween students rapidly. need to fix it
      return
    }
    if (!isEmpty(_userResponse) || (updatedScratchPad && !isEmpty(userWork))) {
      /**
       * allResponse is empty when the questionActivity is empty.
       * In that case only send currenytly attempted _userResponse
       */

      const scores = isEmpty(teacherEditedScore)
        ? undefined
        : { ...teacherEditedScore }

      let payload = { testActivityId, itemId, groupId, scores }
      if (!isEmpty(_userResponse)) {
        const userResponse =
          allResponse.length > 0
            ? allResponse.reduce((acc, cur) => {
                console.log('curr', cur)
                // only if not empty send the responses to server for editing
                if (hasValidAnswers(cur.qType, cur.userResponse)) {
                  acc[cur.qid] = cur.userResponse
                } else {
                  const error = new Error('empty response update event')
                  Sentry.configureScope((scope) => {
                    scope.setExtra('qType', cur?.qType)
                    scope.setExtra('userResponse', cur?.userResponse)
                    Sentry.captureException(error)
                  })
                }
                return acc
              }, {})
            : _userResponse
        payload = {
          ...payload,
          userResponse,
        }
      }
      /**
       * @see https://snapwiz.atlassian.net/browse/EV-24950
       * save scratchpad data when edited from EG
       */
      if (updatedScratchPad && !isEmpty(userWork) && allResponse?.length > 0) {
        setUpdatedScratchPad(false)
        const currentUserWork = {}
        allResponse.forEach((uqa) => {
          const uqaId = uqa?._id
          const qid = uqa?.qid
          if (userWork?.[uqaId]?.[qid]) {
            currentUserWork[qid] = userWork?.[uqaId]?.[qid]
          }
        })
        if (!isEmpty(currentUserWork)) {
          const dimensions = scratchPadDimensions || {}
          const userWorkData = { scratchpad: true, dimensions }
          payload = {
            ...payload,
            scratchPadData: userWorkData,
          }
          uploadDataAndUpdateAttachment({
            userWork: currentUserWork,
            uta: testActivityId,
            itemId,
            userId,
          })
        }
      }
      submitResponse(payload)
    } else {
      removeTeacherEditedScore()
    }
  }

  nextQuestion = () => {
    const { maxQuestions } = this.state
    const { rowIndex, colIndex } = this.state
    const nextIndex = colIndex + 1
    const { tableData, updateRecord } = this.props

    if (nextIndex !== maxQuestions) {
      this.submitResponse()
      this.setState({ loaded: false }, () => {
        this.setState({ colIndex: nextIndex, loaded: true }, () => {
          if (typeof updateRecord === 'function') {
            updateRecord(get(tableData, [rowIndex, `Q${nextIndex}`]))
          }
        })
      })
    } else {
      notification({ type: 'success', messageKey: 'finishedGrading' })
    }
  }

  prevQuestion = () => {
    this.submitResponse()
    const { rowIndex, colIndex } = this.state
    const { tableData, updateRecord } = this.props

    if (colIndex !== 0) {
      const prevIndex = colIndex - 1
      this.setState({ loaded: false }, () => {
        this.setState({ colIndex: prevIndex, loaded: true }, () => {
          if (typeof updateRecord === 'function') {
            updateRecord(get(tableData, [rowIndex, `Q${prevIndex}`]))
          }
        })
      })
    }
  }

  render() {
    let question = null
    const {
      isVisibleModal,
      tableData,
      isPresentationMode,
      windowWidth,
      studentResponseLoading,
      isScoringInProgress,
    } = this.props

    const blurStyles = studentResponseLoading
      ? { filter: 'blur(8px)', '-webkit-filter': 'blur(8px)' }
      : {}
    const { rowIndex, colIndex, loaded, editResponse } = this.state

    if (colIndex !== null && rowIndex !== null) {
      question = tableData[rowIndex][`Q${colIndex}`]
    }

    let student = {}
    if (rowIndex !== null) {
      student = tableData[rowIndex].students
    }

    return (
      <ModalWrapper
        centered
        width="95%"
        height="95%"
        footer={null}
        closable={false}
        destroyOnClose
        onOk={this.hideModal}
        onCancel={this.hideModal}
        visible={isVisibleModal}
        bodyStyle={{ background: '#f0f2f5', height: '100%', overflowY: 'auto' }}
      >
        {isVisibleModal && question && loaded && (
          <>
            <ScrollContext.Provider
              value={{
                getScrollElement: () =>
                  this.containerRef?.current || document.body,
              }}
            >
              <QuestionWrapper
                ref={this.containerRef}
                style={{
                  marginBottom: windowWidth > 1024 ? '66px' : '99px',
                  ...blurStyles,
                }}
              >
                <Question
                  record={question}
                  key={question.id}
                  qIndex={colIndex}
                  student={student}
                  isPresentationMode={isPresentationMode}
                  editResponse={editResponse}
                  studentResponseLoading={
                    studentResponseLoading || isScoringInProgress
                  }
                />
              </QuestionWrapper>
            </ScrollContext.Provider>
            <BottomNavigationWrapper>
              <BottomNavigation
                hideModal={this.hideModal}
                prevStudent={this.prevStudent}
                nextStudent={this.nextStudent}
                prevQuestion={this.prevQuestion}
                nextQuestion={this.nextQuestion}
                style={{ padding: '20px 3%' }}
                editResponse={editResponse}
                toggleEditResponse={() =>
                  this.setState(({ editResponse: _editResponse }) => ({
                    editResponse: !_editResponse,
                  }))
                }
              />
            </BottomNavigationWrapper>
          </>
        )}
      </ModalWrapper>
    )
  }
}

QuestionModal.propTypes = {
  record: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
  isVisibleModal: PropTypes.bool.isRequired,
  hideQuestionModal: PropTypes.func.isRequired,
  isPresentationMode: PropTypes.bool,
}

QuestionModal.defaultProps = {
  isPresentationMode: false,
}

export default connect(
  (state) => ({
    userResponse: getAnswerByQidSelector(state),
    allResponse: getStudentQuestionSelector(state),
    teacherEditedScore: getTeacherEditedScoreSelector(state),
    studentResponseLoading: state.studentQuestionResponse?.loading,
    isScoringInProgress: getIsScoringCompletedSelector(state),
    studentQuestionResponseTestActivityId:
      state.studentQuestionResponse?.data?.testActivityId,
    userWork: userWorkSelector(state),
    updatedScratchPad: getUpdatedScratchPadSelector(state),
    scratchPadDimensions: scratchpadDomRectSelector(state),
  }),
  {
    submitResponse: submitResponseAction,
    setUpdatedScratchPad: setUpdatedScratchPadAction,
    uploadDataAndUpdateAttachment: uploadDataAndUpdateAttachmentAction,
    removeTeacherEditedScore: removeTeacherEditedScoreAction,
  }
)(QuestionModal)
