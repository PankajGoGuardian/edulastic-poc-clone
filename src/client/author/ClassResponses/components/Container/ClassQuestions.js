import React, { Component, useContext } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'
import memoizeOne from 'memoize-one'
import { keyBy as _keyBy, isEmpty, get, isEqual, groupBy } from 'lodash'
// components
import { AnswerContext, EduElse, EduIf, EduThen } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import {
  questionType,
  collections as collectionConst,
  roleuser,
} from '@edulastic/constants'
import produce from 'immer'
import { Modal, Row, Col, Spin, Pagination } from 'antd'
import TestItemPreview from '../../../../assessment/components/TestItemPreview'
import {
  loadScratchPadAction,
  clearUserWorkAction,
  saveUserWorkAction,
} from '../../../../assessment/actions/userWork'
import { setUpdatedScratchPadAction } from '../../../ExpressGrader/ducks'

import AssessmentPlayerModal from '../../../Assignments/components/Container/TestPreviewModal'
import { getRows } from '../../../sharedDucks/itemDetail'
// styled wrappers
import {
  StyledFlexContainer,
  PaginationWrapper,
  LoaderContainer,
} from './styled'
import {
  getDynamicVariablesSetIdForViewResponse,
  ttsUserIdSelector,
  getPageNumberSelector,
  LCB_LIMIT_QUESTION_PER_VIEW,
  SCROLL_SHOW_LIMIT,
  getAdditionalDataSelector,
} from '../../../ClassBoard/ducks'
import Worksheet from '../../../AssessmentPage/components/Worksheet/Worksheet'
import VideoQuizWorksheet from '../../../AssessmentPage/VideoQuiz/VideoQuizWorksheet'
import { ThemeButton } from '../../../src/components/common/ThemeButton'
import {
  setPageNumberAction,
  setLcbQuestionLoaderStateAcion,
  setQuestionIdToScrollAction,
} from '../../../src/reducers/testActivity'
import { _scrollTo } from '../../../ClassBoard/components/BarGraph/BarGraph'
import { getManualContentVisibility } from '../../../questionUtils'

const transformTestItemsForAlgoVariables = (testItems, variablesSetIds) =>
  produce(testItems, (draft) => {
    if (!draft) {
      return
    }

    const qidSetIds = _keyBy(variablesSetIds, 'qid')
    for (const [idxItem, item] of draft.entries()) {
      if (!item.algoVariablesEnabled) {
        continue
      }
      const questions = get(item, 'data.questions', [])
      for (const [idxQuestion, question] of questions.entries()) {
        const qid = question.id
        const setIds = qidSetIds[qid]
        if (!setIds) {
          continue
        }
        const setKeyId = setIds.setId
        const examples = get(question, 'variable.examples', [])
        const variables = get(question, 'variable.variables', {})
        const example = examples.find((x) => x.key === +setKeyId)
        if (!example) {
          continue
        }
        for (const variable of Object.keys(variables)) {
          draft[idxItem].data.questions[idxQuestion].variable.variables[
            variable
          ].exampleValue = example[variable]
        }
      }
    }
  })

const getStudentName = (props) => {
  const { isPresentationMode, currentStudent } = props
  if (!currentStudent) return null
  const name = isPresentationMode
    ? currentStudent.fakeName
    : currentStudent.studentName
  return name
}

const transformTestItems = (props) => {
  const {
    currentStudent,
    questionActivities,
    filter,
    labels = {},
    isQuestionView = false,
    testItemsData,
    testActivityId,
    passages,
    variableSetIds,
    expressGrader,
    testItemsOrder = {},
    isPresentationMode,
  } = props
  if (!currentStudent || !questionActivities) {
    return []
  }

  let { testItems } = props

  if (!expressGrader && testItems && !isQuestionView) {
    testItems = testItemsData.filter((tid) =>
      testItems.find((ti) => ti._id === tid._id)
    )
  }
  const userQActivities =
    currentStudent && currentStudent.questionActivities
      ? currentStudent.questionActivities
      : []
  if (!testItems) {
    return []
  }

  testItems = testItems
    .sort((x, y) => testItemsOrder[x._id] - testItemsOrder[y._id])
    .map((item) => {
      const { data, rows, ...others } = item
      if (!(data && !isEmpty(data.questions))) {
        return
      }
      if (item.itemLevelScoring) {
        const firstQid = data.questions[0].id
        const firstQAct = userQActivities.find(
          (x) => x._id === firstQid && x.testItemId === item._id
        )
        if (firstQAct) {
          if (filter === 'unscoredItems' && !firstQAct.isPractice) {
            return false
          }

          if (filter && filter !== 'unscoredItems' && firstQAct.isPractice) {
            return false
          }

          if (filter === 'correct' && firstQAct.maxScore !== firstQAct.score) {
            return false
          }

          if (
            filter === 'wrong' &&
            (firstQAct.score > 0 ||
              firstQAct.skipped ||
              firstQAct.graded === false)
          ) {
            return false
          }

          if (
            filter === 'partial' &&
            !(firstQAct.score > 0 && firstQAct.score < firstQAct.maxScore)
          ) {
            return false
          }
          if (
            filter === 'skipped' &&
            !(firstQAct.skipped && firstQAct.score === 0)
          ) {
            return false
          }
          if (filter === 'notGraded' && !(firstQAct.graded === false)) {
            return false
          }

          if (filter === 'attempted' && firstQAct.score >= 0) {
            return false
          }
        }
      }

      let questions = data.questions
        .map((question) => {
          const { id } = question
          let qActivities = questionActivities.filter(
            ({ qid, id: altId, testItemId }) =>
              (qid === id || altId === id) && testItemId === item._id
          )
          if (qActivities.length > 1) {
            /**
             * taking latest qActivity for a qid
             */
            const qActivity = qActivities.find(
              (o) => o.testActivityId === testActivityId
            )
            if (qActivity) {
              qActivities = [qActivity]
            } else {
              qActivities = [qActivities[qActivities.length - 1]]
            }
          }
          qActivities = qActivities.map((q) => ({
            ...q,
            studentName: getStudentName({ isPresentationMode, currentStudent }),
            icon: currentStudent.icon,
            color: currentStudent.color,
          }))
          const label = labels[`${item._id}_${id}`] || {}
          if (!item.itemLevelScoring && qActivities[0]) {
            if (filter === 'unscoredItems' && !qActivities[0].isPractice) {
              return false
            }

            if (
              filter &&
              filter !== 'unscoredItems' &&
              qActivities[0].isPractice
            ) {
              return false
            }

            if (
              filter === 'correct' &&
              qActivities[0].score < qActivities[0].maxScore
            ) {
              return false
            }

            if (
              filter === 'wrong' &&
              (qActivities[0].score > 0 ||
                qActivities[0].skipped ||
                qActivities[0].graded === false)
            ) {
              return false
            }

            if (
              filter === 'skipped' &&
              !(qActivities[0].skipped && qActivities[0].score === 0)
            ) {
              return false
            }
            if (filter === 'notGraded' && !(qActivities[0].graded === false)) {
              return false
            }
            if (
              filter === 'partial' &&
              !(
                qActivities[0].score > 0 &&
                qActivities[0].score < qActivities[0].maxScore
              )
            ) {
              return false
            }
          }

          const scoringType = currentStudent.questionActivities?.find((ele) =>
            item.data.questions.some((i) => i.id === ele._id)
          )?.scoringType
          qActivities = qActivities.map((q) => {
            const userQuestion = userQActivities.find(
              ({ _id }) => _id === q.qid
            )
            if (userQuestion) {
              q.timespent = userQuestion.timeSpent
              q.disabled = userQuestion.disabled
            }
            if (isQuestionView) {
              q.scoringType = scoringType
            }
            return { ...q }
          })
          const [activity] = qActivities.length > 0 ? qActivities : [{}]
          return { ...question, activity, ...label }
        })
        .filter((x) => x)
      if (!questions.length) {
        return false
      }
      if (item.passageId && passages) {
        const passage = passages.find((p) => p._id === item.passageId)
        if (passage) {
          questions = [...questions, passage.data?.[0]]
        }
      }
      const resources = data.resources || []
      questions = [...questions, ...resources]
      return { ...others, rows, data: { questions } }
    })
    .filter((x) => x)
  return transformTestItemsForAlgoVariables([...testItems], variableSetIds)
}

const getTestItems = memoizeOne(transformTestItems, isEqual)

const Preview = ({
  item,
  qIndex,
  studentId,
  studentName,
  evaluation,
  showStudentWork,
  passages,
  isQuestionView,
  isExpressGrader,
  isLCBView,
  questionActivity,
  userWork,
  scractchPadUsed,
  t,
  isStudentView,
  isStudentWorkCollapseOpen,
  toggleStudentWorkCollapse,
  hideCorrectAnswer,
  testActivityId: utaId,
  currentStudent,
  isExpandedView = false,
  saveScratchPadData,
  aiEvaluationStatus,
}) => {
  const rows = getRows(item, false)
  const questions = get(item, ['data', 'questions'], [])
  const resources = get(item, ['data', 'resources'], [])
  let questionsKeyed = {
    ..._keyBy(questions, (q) => `${item._id}_${q.id}`),
    ..._keyBy(resources, (r) => `${item._id}_${r.id}`),
  }
  let passage = {}
  if (item.passageId && passages.length) {
    passage = passages.find((p) => p._id === item.passageId) || {}
    questionsKeyed = { ...questionsKeyed, ..._keyBy(passage.data, 'id') }
    rows[0] = passage.structure
  }
  const passageId = passage?._id
  const answerContextConfig = useContext(AnswerContext)
  const timeSpent = (get(questionActivity, 'timeSpent', 0) / 1000).toFixed(1)
  const { multipartItem, itemLevelScoring, isPassageWithQuestions } = item
  const isV1Multipart = (rows || []).some((row) => row.isV1Multipart)
  const scoringProps = {
    multipartItem: multipartItem || isV1Multipart,
    itemLevelScoring,
    isPassageWithQuestions,
  }
  const attachments = get(questionActivity, 'scratchPad.attachments', null)
  const scratchpadDimensions = get(
    questionActivity,
    'scratchPad.dimensions',
    null
  )

  const testActivityId = get(questionActivity, 'testActivityId', '')
  const highlights = get(
    userWork,
    `[${passageId}][${testActivityId}].resourceId`,
    {}
  )

  const premiumCollectionWithoutAccess =
    item?.premiumContentRestriction &&
    item?.collections
      ?.filter(({ type = '' }) => type === collectionConst.types.PREMIUM)
      .map(({ name }) => name)

  return (
    <StyledFlexContainer
      key={item._id}
      data-cy="student-question-container"
      className={`student-question-container-id-${studentId}`}
      height={isLCBView && isQuestionView && 'auto'}
    >
      <TestItemPreview
        showCollapseBtn
        showFeedback
        cols={rows}
        isDocBased={item.isDocBased}
        preview="show"
        previewTab="show"
        questions={questionsKeyed}
        disableResponse={!answerContextConfig.isAnswerModifiable}
        verticalDivider={item.verticalDivider}
        scrolling={item.scrolling}
        style={{ width: '100%' }}
        qIndex={qIndex}
        evaluation={evaluation}
        showStudentWork={showStudentWork}
        isQuestionView={isQuestionView}
        isExpressGrader={isExpressGrader}
        isLCBView={isLCBView}
        timeSpent={timeSpent}
        attachments={attachments}
        userWork={scractchPadUsed && userWork} // used to determine show student work button
        highlights={highlights}
        scratchpadDimensions={scratchpadDimensions}
        saveUserWork={(data) => saveScratchPadData(data)}
        isStudentWorkCollapseOpen={isStudentWorkCollapseOpen}
        toggleStudentWorkCollapse={toggleStudentWorkCollapse}
        {...scoringProps}
        studentId={studentId}
        studentName={studentName || t('common.anonymous')}
        inLCB
        itemId={item._id}
        isStudentView={isStudentView}
        testActivityId={utaId}
        hideCorrectAnswer={hideCorrectAnswer}
        currentStudent={currentStudent}
        isPremiumContentWithoutAccess={!!premiumCollectionWithoutAccess}
        premiumCollectionWithoutAccess={premiumCollectionWithoutAccess}
        isExpandedView={isExpandedView}
        aiEvaluationStatus={aiEvaluationStatus}
      />
    </StyledFlexContainer>
  )
}

Preview.propTypes = {
  item: PropTypes.object.isRequired,
  qIndex: PropTypes.number.isRequired,
  studentId: PropTypes.any.isRequired,
  evaluation: PropTypes.object,
}
Preview.defaultProps = {
  evaluation: {},
}

const MemoizedPreview = React.memo(Preview)

class ClassQuestions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showPlayerModal: false,
      selectedTestItem: [],
      showDocBasedPlayer: false,
      isStudentWorkCollapseOpen: false,
    }
  }

  componentDidUpdate(prevProps) {
    const {
      studentViewFilter,
      pageNumber,
      setPageNumber,
      setLcbQuestionLoaderState,
      questionId,
      MainContentWrapperRef,
      isQuestionView,
      setQuestionIdToScroll,
    } = this.props
    if (studentViewFilter != prevProps.studentViewFilter && pageNumber !== 1) {
      // eslint-disable-next-line react/no-did-update-set-state
      setPageNumber(1)
    }
    if (prevProps.pageNumber !== pageNumber && !isQuestionView) {
      setLcbQuestionLoaderState(false)
      setQuestionIdToScroll('')
      _scrollTo(questionId, MainContentWrapperRef?.current)
    }
  }

  toggleStudentWorkCollapse = () => {
    this.setState(({ isStudentWorkCollapseOpen }) => ({
      isStudentWorkCollapseOpen: !isStudentWorkCollapseOpen,
    }))
  }

  // show AssessmentPlayerModal
  showPlayerModal = () => {
    this.setState({
      showPlayerModal: true,
    })
  }

  showStudentWork = (testItem) => {
    const testData = produce(testItem, (draft) => {
      const { rows } = draft
      if (!isEmpty(rows)) {
        draft.rows = rows
          .map((row) => {
            let { widgets = [] } = row
            widgets = widgets
              .map((widget) => {
                if (widget.type !== 'passage') {
                  return widget
                }
                return null
              })
              .filter((x) => x)
            if (!isEmpty(widgets)) {
              return { ...row, widgets }
            }
            return null
          })
          .filter((x) => x)
      }
    })

    this.setState({
      showPlayerModal: true,
      selectedTestItem: testData,
    })
  }

  hideStudentWork = () => {
    const { closeTestletPlayer, showTestletPlayer } = this.props
    this.setState(
      {
        showPlayerModal: false,
        selectedTestItem: [],
      },
      () => {
        if (showTestletPlayer && closeTestletPlayer) {
          closeTestletPlayer()
        }
      }
    )
  }

  /**
   * @see https://snapwiz.atlassian.net/browse/EV-24950
   * save scratchpad data updated from EG
   */
  saveScratchPadData = (data) => {
    const {
      saveUserWork,
      questionActivities,
      setUpdatedScratchPad,
    } = this.props

    if (data?.questionId) {
      const { questionId, userWorkData } = data
      const userQuestionActivity = (questionActivities || []).find(
        (qa) => qa?.qid === questionId
      )
      // While in EG, userWork in store has uqa id as keys
      const userWorkId = userQuestionActivity?._id
      if (userWorkId) {
        const scratchpadData = {
          [questionId]: userWorkData,
        }
        setUpdatedScratchPad(true)
        saveUserWork({
          [userWorkId]: { ...scratchpadData },
        })
      }
    }
  }

  render() {
    const {
      showPlayerModal,
      selectedTestItem,
      showDocBasedPlayer,
      isStudentWorkCollapseOpen,
    } = this.state
    const {
      questionActivities,
      currentStudent,
      passages = [],
      showTestletPlayer,
      classResponse,
      testActivity,
      userWork,
      isQuestionView,
      isLCBView,
      testItemsData,
      testData,
      qIndex,
      testActivityId,
      isPresentationMode,
      t,
      ttsUserIds,
      isStudentView,
      hideCorrectAnswer,
      studentViewFilter: filter,
      labels,
      testItemsOrder,
      pageNumber,
      setPageNumber,
      isQuestionsLoading,
      setLcbQuestionLoaderState,
      variableSetIds,
      isExpandedView = false,
      additionalData,
      userRole,
    } = this.props
    const { expressGrader: isExpressGrader = false } = this.context
    const { videoUrl = '' } = testData
    const isVideoQuiz = videoUrl?.length > 0
    const testItems = getTestItems({
      currentStudent,
      questionActivities,
      filter,
      labels,
      isQuestionView,
      testItemsData,
      testActivityId,
      passages,
      testItems: classResponse?.testItems,
      expressGrader: isExpressGrader,
      testItemsOrder,
      isPresentationMode,
      variableSetIds,
    })

    const evaluationStatus = questionActivities.reduce((acc, curr) => {
      if (curr.pendingEvaluation) {
        acc[`${curr.testItemId}_${curr.qid}`] = 'pending'
      } else {
        acc[`${curr.testItemId}_${curr.qid}`] = curr.evaluation
      }

      return acc
    }, {})

    const aiEvaluationStatus = questionActivities.reduce((acc, curr) => {
      if (curr.aiEvaluationStatus) {
        acc[`${curr.testItemId}_${curr.qid}`] = {
          status: curr.aiEvaluationStatus,
          isGradedExternally: curr.isGradedExternally,
        }
      }
      return acc
    }, {})

    const test = showTestletPlayer
      ? {
          testType: classResponse.testType,
          title: classResponse.title,
          testletConfig: classResponse.testletConfig,
          testletState: get(testActivity, 'userWork.testletState'),
          itemGroups: [{ items: [selectedTestItem] }],
        }
      : { itemGroups: [{ items: [selectedTestItem] }], passages }

    let docBasedProps = {}
    if (testData.isDocBased) {
      const {
        isDocBased,
        docUrl,
        annotations: teacherAnnotations,
        pageStructure,
        freeFormNotes = {},
      } = testData
      const utaId = testActivityId || currentStudent.testActivityId
      const studentAnnotations = get(userWork, [utaId, 'freeNotesStd'], [])
      const questionActivitiesById = _keyBy(questionActivities, 'qid')

      const questions = (testItemsData?.[0]?.data?.questions || []).map(
        (q) => ({
          ...q,
          activity: questionActivitiesById[q.id],
        })
      )
      const questionsById = _keyBy(questions, 'id')
      const studentWorkAnswersById = questionActivities.reduce((acc, cur) => {
        acc[cur.qid] = cur.userResponse
        return acc
      }, {})
      docBasedProps = {
        test: testData,
        review: true,
        viewMode: 'report',
        isDocBased,
        docUrl,
        annotations: (teacherAnnotations || []).concat(studentAnnotations),
        pageStructure,
        freeFormNotes,
        questionsById,
        questions,
        studentWorkAnswersById,
        testItemId: testItemsData?.[0]?._id,
        ...(isVideoQuiz ? { videoUrl } : {}),
      }
    }

    const shouldShowPagination =
      !testData.isDocBased &&
      testItems.length > SCROLL_SHOW_LIMIT &&
      !isQuestionView

    const itemsToRender = shouldShowPagination
      ? testItems.slice(
          LCB_LIMIT_QUESTION_PER_VIEW * (pageNumber - 1),
          LCB_LIMIT_QUESTION_PER_VIEW * pageNumber
        )
      : testItems

    let showPaginationForDocQuestions = false
    let filteredWidgets = []
    if (testData.isDocBased) {
      const widgets = testItems?.[0]?.rows?.[0]?.widgets || []
      filteredWidgets = widgets.filter(
        (widget) => widget.type !== questionType.SECTION_LABEL
      )
      showPaginationForDocQuestions =
        filteredWidgets.length > SCROLL_SHOW_LIMIT && !isQuestionView
    }

    const questionActivitiesGroupedByItemId = groupBy(
      questionActivities,
      'testItemId'
    )

    return (
      <>
        {isQuestionsLoading && !isQuestionView && (
          <LoaderContainer>
            <Spin size="large" />
          </LoaderContainer>
        )}
        <AssessmentPlayerModal
          isModalVisible={showPlayerModal || showTestletPlayer}
          closeTestPreviewModal={this.hideStudentWork}
          test={test}
          isShowStudentWork
          isStudentReport
          LCBPreviewModal
          questionActivities={questionActivities}
          testActivityId={testActivityId || currentStudent.testActivityId}
          isQuestionView={isQuestionView}
          isLCBView={isLCBView}
          isStudentView={isStudentView}
        />
        {testData.isDocBased ? (
          <StyledModal
            visible={showDocBasedPlayer}
            onCancel={() => this.setState({ showDocBasedPlayer: false })}
            footer={null}
            destroyOnClose={isVideoQuiz}
          >
            <Row className="exit-btn-row">
              <Col>
                <ThemeButton
                  onClick={() => this.setState({ showDocBasedPlayer: false })}
                  style={{
                    color: '#fff',
                    width: '110px',
                    marginLeft: 'auto',
                    marginRight: 20,
                  }}
                >
                  Exit
                </ThemeButton>
              </Col>
            </Row>
            <EduIf condition={isVideoQuiz}>
              <EduThen>
                <VideoQuizWorksheet {...docBasedProps} studentWork />
              </EduThen>
              <EduElse>
                <Worksheet {...docBasedProps} studentWork />
              </EduElse>
            </EduIf>
          </StyledModal>
        ) : null}
        {itemsToRender.map((item, index) => {
          let showStudentWork = null
          let scractchPadUsed = userWork[item._id]
          scractchPadUsed = item.data.questions.some(
            (question) => question?.activity?.scratchPad?.scratchpad
          )
          if (scractchPadUsed) {
            showStudentWork = () => this.showStudentWork(item)
          }
          if (testData.isDocBased) {
            showStudentWork = () => this.setState({ showDocBasedPlayer: true })
          }
          const questionActivity =
            questionActivitiesGroupedByItemId[item._id]?.[0]

          const hiddenTestContentVisibilty = getManualContentVisibility(
            additionalData
          )

          let questions = item.data.questions
          if (hiddenTestContentVisibilty && userRole === roleuser.TEACHER) {
            questions = questions.filter(
              (q) =>
                !isEmpty(q.activity) &&
                !q?.activity?.autoGrade &&
                !q?.activity?.notStarted
            )
          }

          const questionsWithItemId = questions.map((q) => ({
            ...q,
            testItemId: item._id,
          }))

          return (
            <MemoizedPreview
              studentId={(currentStudent || {}).studentId}
              ttsUserIds={ttsUserIds}
              studentName={
                (currentStudent || {})[
                  isPresentationMode ? 'fakeName' : 'studentName'
                ]
              }
              key={index}
              item={{
                ...item,
                data: { ...item.data, questions: questionsWithItemId },
              }}
              passages={passages}
              qIndex={qIndex || index}
              evaluation={evaluationStatus}
              showStudentWork={showStudentWork}
              isQuestionView={isQuestionView}
              isExpressGrader={isExpressGrader}
              isLCBView={isLCBView}
              questionActivity={questionActivity}
              scractchPadUsed={scractchPadUsed}
              isStudentWorkCollapseOpen={isStudentWorkCollapseOpen}
              toggleStudentWorkCollapse={this.toggleStudentWorkCollapse}
              userWork={userWork} // used to determine show student work button
              t={t}
              hideCorrectAnswer={hideCorrectAnswer}
              isStudentView={isStudentView}
              testActivityId={testActivityId || currentStudent.testActivityId}
              currentStudent={currentStudent}
              isExpandedView={isExpandedView}
              saveScratchPadData={this.saveScratchPadData}
              aiEvaluationStatus={aiEvaluationStatus}
            />
          )
        })}
        {(shouldShowPagination || showPaginationForDocQuestions) && (
          <PaginationWrapper>
            <Pagination
              defaultCurrent={1}
              current={pageNumber}
              pageSize={LCB_LIMIT_QUESTION_PER_VIEW}
              total={
                showPaginationForDocQuestions
                  ? filteredWidgets.length
                  : testItems.length
              }
              hideOnSinglePage
              onChange={(page) => {
                setLcbQuestionLoaderState(true)
                setTimeout(() => setPageNumber(page), 1)
              }}
            />
          </PaginationWrapper>
        )}
      </>
    )
  }
}

ClassQuestions.contextType = AnswerContext

const withConnect = connect(
  (state, ownProps) => ({
    testItemsData: get(
      state,
      ['author_classboard_testActivity', 'data', 'testItemsData'],
      []
    ),
    testData: get(state, ['author_classboard_testActivity', 'data', 'test']),
    passages: get(
      state,
      ['author_classboard_testActivity', 'data', 'passageData'],
      []
    ),
    variableSetIds: getDynamicVariablesSetIdForViewResponse(state, {
      showMultipleAttempts: ownProps.isLCBView && !ownProps.isQuestionView,
      studentId: ownProps.currentStudent.studentId,
    }),
    userWork: get(state, ['userWork', 'present'], {}),
    ttsUserIds: ttsUserIdSelector(state),
    pageNumber: getPageNumberSelector(state),
    additionalData: getAdditionalDataSelector(state),
    isQuestionsLoading: get(state, [
      'author_classboard_testActivity',
      'isQuestionsLoading',
    ]),
    questionId: get(state, ['author_classboard_testActivity', 'questionId']),
    userRole: get(state.user, 'user.role', null),
  }),
  {
    loadScratchPad: loadScratchPadAction,
    clearUserWork: clearUserWorkAction,
    setPageNumber: setPageNumberAction,
    setLcbQuestionLoaderState: setLcbQuestionLoaderStateAcion,
    setQuestionIdToScroll: setQuestionIdToScrollAction,
    saveUserWork: saveUserWorkAction,
    setUpdatedScratchPad: setUpdatedScratchPadAction,
  }
)

export default compose(
  withConnect,
  withNamespaces('student')
)(React.memo(ClassQuestions))

ClassQuestions.propTypes = {
  classResponse: PropTypes.object.isRequired,
  questionActivities: PropTypes.array.isRequired,
  currentStudent: PropTypes.object.isRequired,
  testItemsOrder: PropTypes.any.isRequired,
  labels: PropTypes.array.isRequired,
  qIndex: PropTypes.number,
  isPresentationMode: PropTypes.bool,
  studentViewFilter: PropTypes.string,
  showTestletPlayer: PropTypes.bool,
  userRole: PropTypes.string.isRequired,
}
ClassQuestions.defaultProps = {
  qIndex: null,
  isPresentationMode: false,
  showTestletPlayer: false,
  studentViewFilter: null,
}

const StyledModal = styled(Modal)`
  width: 100% !important;
  top: 0 !important;
  left: 0 !important;

  .ant-modal-close-x {
    display: none;
  }
  .ant-modal-header {
    display: none;
  }
  .ant-modal-content {
    height: 100vh;
    padding-top: 20px;
    bottom: auto;
    border-radius: 0;
  }
  .ant-modal-body {
    padding: 0px;
    position: relative;
    & > div:not(.ant-spin) {
      & > svg {
        height: 100%;
      }
    }
  }

  .exit-btn-row {
    margin-top: -10px;
    margin-bottom: 10px;
  }
`
