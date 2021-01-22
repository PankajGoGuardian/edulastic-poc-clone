import React, { useEffect, useRef, useState, useMemo } from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Spin, message, Modal, Button } from 'antd'
import {
  isUndefined,
  get,
  isEmpty,
  isNull,
  isEqual,
  isObject,
  flatMap,
  isArray,
} from 'lodash'
import useInterval from '@use-it/interval'
import {
  test as testConstants,
  assignmentPolicyOptions,
  questionType,
  roleuser,
} from '@edulastic/constants'
import {
  AssessmentPlayerContext,
  useRealtimeV2,
  notification,
  handleChromeOsSEB,
} from '@edulastic/common'
import { themeColor } from '@edulastic/colors'
import { testActivityApi } from '@edulastic/api';

import { gotoItem as gotoItemAction, saveUserResponse } from '../actions/items'
import {
  finishTestAcitivityAction,
  setPasswordValidateStatusAction,
} from '../actions/test'
import { evaluateAnswer } from '../actions/evaluation'
import { changePreview as changePreviewAction } from '../actions/view'
import { getQuestionsByIdSelector } from '../selectors/questions'
import { testLoadingSelector, playerSkinTypeSelector } from '../selectors/test'
import {
  getAnswersArraySelector,
  getAnswersListSelector,
} from '../selectors/answers'
import AssessmentPlayerDefault from './AssessmentPlayerDefault'
import AssessmentPlayerSimple from './AssessmentPlayerSimple'
import AssessmentPlayerDocBased from './AssessmentPlayerDocBased'
import AssessmentPlayerTestlet from './AssessmentPlayerTestlet'
import { CHECK, CLEAR } from '../constants/constantsForQuestions'
import { updateTestPlayerAction } from '../../author/sharedDucks/testPlayer'
import { hideHintsAction } from '../actions/userInteractions'
import UnansweredPopup from './common/UnansweredPopup'
import {
  regradedRealtimeAssignmentAction,
  clearRegradeAssignmentAction,
} from '../../student/sharedDucks/AssignmentModule/ducks'
import { evaluateCurrentAnswersForPreviewAction } from '../sharedDucks/previewTest'
import { userWorkSelector } from '../../student/sharedDucks/TestItem'
import { hasUserWork } from '../utils/answer'
import { fetchAssignmentsAction } from '../../student/Reports/ducks'
import { getSebUrl } from '../../student/Assignments/ducks'
import { setCheckAnswerInProgressStatusAction } from '../actions/checkanswer'
import useFocusHandler from '../utils/useFocusHandler';
const { playerSkinValues } = testConstants

const shouldAutoSave = (itemRows) => {
  if (!itemRows) {
    return false
  }
  const autoSavableTypes = {
    essayRichText: 1,
    essayPlainText: 1,
    formulaessay: 1,
  }
  for (const row of itemRows) {
    for (const widget of row?.widgets || []) {
      if (widget.widgetType === 'question' && autoSavableTypes[widget.type]) {
        return true
      }
    }
  }
  return false
}

const isSEB = () => window.navigator.userAgent.includes('SEB')

function useTabNavigationCounterEffect({testActivityId,enabled,history}){
  const inFocusRef = useRef(true);
  const idleTimeoutRef = useRef(null);
  useFocusHandler({
    onFocus: () => {
      inFocusRef.current = true;
      console.log('on focus ',new Date());
      if(idleTimeoutRef.current){
        clearTimeout(idleTimeoutRef.current);
      }
    },
    onBlur: () => {
      console.log('on blur ',new Date());
      inFocusRef.current = false;
      if(idleTimeoutRef.current){
        clearTimeout(idleTimeoutRef.current);
      }
      idleTimeoutRef.current = setTimeout(()=>{  
        if(!inFocusRef.current && enabled){
          console.info('too much time away from screen!!!!!!!', new Date());
          testActivityApi.incrementTabNavigationCounter(testActivityId)
          .then((response)=>{
            if(response.paused){
              notification({type:"error",msg:"Sorry! Assignment got paused due to inactivity"})
              ;
              history.push('/home/assignments');
            } else {
              notification({type:"warning",msg:"Moving out of assignment has been noted"});
            }
          }).catch((error)=>{
            console.warn('idle error',error);
            notification({type:"error",msg:"something wrong happened with assignment"});
            history.push('/home/assignments');
          })
        }
      },5000);
    }
  });
}

const RealTimeV2HookWrapper = ({
  userId,
  testId,
  regradedAssignment,
  regradedRealtimeAssignment,
  groupId,
}) => {
  let topics = [
    `student_assessment:user:${userId}`,
    `student_assessment:test:${testId}:group:${groupId}`,
  ]
  if (regradedAssignment?.newTestId) {
    topics = [
      ...topics,
      `student_assessment:test:${regradedAssignment?.newTestId}:group:${groupId}`,
    ]
  }
  useRealtimeV2(topics, {
    regradedAssignment: (payload) => regradedRealtimeAssignment(payload),
  })
  return null
}

const AssessmentContainer = ({
  view,
  items,
  title,
  defaultAP,
  finishTest,
  history,
  changePreview,
  saveUserResponse: saveUserAnswer,
  evaluateAnswer: evaluate,
  match,
  url,
  gotoItem,
  docUrl,
  annotations,
  questionsById,
  answers,
  answersById,
  loading,
  pageStructure,
  freeFormNotes,
  passages,
  preview,
  LCBPreviewModal,
  closeTestPreviewModal,
  submitPreviewTest,
  testletType,
  testletState,
  testletConfig,
  testType,
  test,
  groupId,
  showTools,
  isStudentReport,
  savingResponse,
  playerSkinType,
  userPrevAnswer,
  testSettings,
  showMagnifier,
  updateTestPlayer,
  enableMagnifier,
  studentReportModal,
  hideHints,
  demo,
  regradedRealtimeAssignment,
  testId,
  userId,
  regradedAssignment,
  clearRegradeAssignment,
  setPasswordValidateStatus,
  userRole,
  assignmentById,
  currentAssignment,
  fetchAssignments,
  evaluateForPreview,
  ...restProps
}) => {
  const qid = preview || testletType ? 0 : match.params.qid || 0
  const [currentItem, setCurrentItem] = useState(Number(qid))
  const [unansweredPopupSetting, setUnansweredPopupSetting] = useState({
    qLabels: [],
    show: false,
  })
  const [showRegradedModal, setShowRegradedModal] = useState(false)
  const isLast = () => currentItem === items.length - 1
  const isFirst = () => currentItem === 0

  const lastTime = useRef(window.localStorage.assessmentLastTime || Date.now())

  const assignmentObj = currentAssignment && assignmentById[currentAssignment];
  console.log('assignmentObj',assignmentObj);
  useTabNavigationCounterEffect({testActivityId: restProps.utaId,enabled:assignmentObj.restrictNavigationOut,history});
  useEffect(() => {
    if (assignmentObj) {
      if (assignmentObj.safeBrowser && !isSEB() && restProps.utaId) {
        const sebUrl = getSebUrl({
          testId,
          testType,
          assignmentId: assignmentObj._id,
          testActivityId: restProps.utaId,
          groupId,
        })
        history.push('/home/assignments')
        if (!handleChromeOsSEB()) {
          window.location.href = sebUrl
        }
      }
    }
  })

  // start assessment
  useEffect(() => {
    /**
     * src/client/assessment/sagas/items.js:saveUserResponse
     * requires current assignment id in store (studentAssignment.current)
     * TODO: Use studentAssignment.assignment to store current assignment data
     */
    if (!assignmentById[currentAssignment] && !preview) {
      fetchAssignments()
    }

    window.localStorage.assessmentLastTime = Date.now()
    return () => setPasswordValidateStatus(false)
  }, [])

  useEffect(() => {
    if (!loading && items.length === 0) {
      Modal.info({
        title: "It looks like there aren't any Items in this test.",
        okText: 'Close',
      })
    }
  }, [loading])

  useEffect(() => {
    setCurrentItem(Number(qid))
    if (enableMagnifier) {
      updateTestPlayer({ enableMagnifier: false })
    }
  }, [qid])

  useEffect(() => {
    const { setCheckAnswerInProgress } = restProps
    lastTime.current = Date.now()
    window.localStorage.assessmentLastTime = lastTime.current
    gotoItem(currentItem)
    setCheckAnswerInProgress(false)
  }, [currentItem])

  useEffect(() => {
    if (regradedAssignment && regradedAssignment?.newTestId !== testId) {
      setShowRegradedModal(true)
    }
  }, [regradedAssignment?.newTestId])

  const onRegradedModalOk = () => {
    history.push(
      `/student/assessment/${regradedAssignment.newTestId}/class/${groupId}/uta/${restProps.utaId}/qid/0`
    )
    clearRegradeAssignment()
    setShowRegradedModal(false)
  }
  const saveCurrentAnswer = (payload) => {
    const timeSpent = Date.now() - lastTime.current
    saveUserAnswer(currentItem, timeSpent, false, groupId, payload)
  }

  function getPreviewTab(index = currentItem) {
    let previewTab = CLEAR
    const { showPreviousAttempt: redirectPolicy } = testSettings || {}
    const {
      showPreviousAttemptOptions: { STUDENT_RESPONSE_AND_FEEDBACK },
    } = assignmentPolicyOptions

    if (redirectPolicy === STUDENT_RESPONSE_AND_FEEDBACK) {
      const questionIds = (items[index]?.data?.questions || []).map(
        (question) => question.id
      )
      const currentlyAnsweredQIds = Object.keys(answersById)
      const previouslyAnsweredQIds = Object.keys(userPrevAnswer)

      const renderCheckAnswerView =
        questionIds.length > 0 &&
        questionIds.filter(
          (id) =>
            previouslyAnsweredQIds.includes(id) &&
            !currentlyAnsweredQIds.includes(id)
        ).length === questionIds.length

      if (renderCheckAnswerView) {
        previewTab = CHECK
      }
    }

    return previewTab
  }

  useEffect(() => {
    const previewTab = getPreviewTab()
    changePreview(previewTab)
  }, [userPrevAnswer, answersById, items])

  const getUnAnsweredQuestions = () => {
    const questions = items[currentItem]?.data?.questions || []
    /**
     * if user used scratchpad or other tools like cross out
     * consider item as attempted
     * @see https://snapwiz.atlassian.net/browse/EV-17309
     */
    if (hasUserWork(items[currentItem]?._id, restProps.userWork || {})) {
      return []
    }
    return questions.filter((q) => {
      const qAnswers = answersById[q.id] || userPrevAnswer[q.id]
      switch (q.type) {
        case questionType.TOKEN_HIGHLIGHT:
          return (
            (answersById[q.id] || []).filter((token) => token?.selected)
              .length === 0
          )
        case questionType.LINE_CHART:
        case questionType.BAR_CHART:
        case questionType.HISTOGRAM:
        case questionType.DOT_PLOT:
        case questionType.LINE_PLOT: {
          const initialData = q.chart_data.data
          return initialData.every((d, i) => d?.y === qAnswers?.[i]?.y)
        }
        case questionType.MATCH_LIST:
          return Object.values(qAnswers || {}).every((d) => isNull(d))
        case questionType.SORT_LIST:
        case questionType.CLOZE_DRAG_DROP:
        case questionType.HOTSPOT:
          return !qAnswers?.some((ans) => ans?.toString())
        case questionType.ORDER_LIST: {
          const prevOrder = [...Array(q.list.length).keys()]
          return qAnswers ? isEqual(prevOrder, qAnswers) : true
        }
        case questionType.MATH:
          if (q.title === 'Complete the Equation') {
            if (isArray(qAnswers)) {
              return !qAnswers.some((ans) => ans?.toString())
            }
            const ans = (qAnswers || '').replace(/\\ /g, '')
            return isEmpty(ans) || ans === '+='
          }
          return isEmpty(qAnswers)
        case questionType.FORMULA_ESSAY:
          return (qAnswers || []).every((d) => {
            const ans = (d.text || '').replace(/\\ /g, '')
            return isEmpty(ans)
          })
        case questionType.EXPRESSION_MULTIPART: {
          const { inputs = {}, dropDowns = {}, maths = {}, mathUnits = {} } =
            qAnswers || {}
          const isAnswered = Object.values({
            ...inputs,
            ...dropDowns,
            ...maths,
            ...mathUnits,
          }).some((d) => d.value?.trim() || d.unit)
          return !isAnswered
        }
        case questionType.CLOZE_TEXT: {
          return (qAnswers || []).every((d) => {
            if (typeof d === 'string') {
              return isEmpty(d)
            }
            if (Array.isArray(d)) {
              return isEmpty(d || d?.value)
            }
            return isEmpty(d?.value)
          })
        }
        case questionType.CLASSIFICATION: {
          if (!isObject(qAnswers)) {
            return true
          }
          const keys = Object.keys(qAnswers)
          return (
            keys.length === 0 || keys.every((key) => isEmpty(qAnswers[key]))
          )
        }
        case questionType.CLOZE_IMAGE_DROP_DOWN:
        case questionType.CLOZE_IMAGE_TEXT: {
          if (!isObject(qAnswers)) {
            return true
          }
          const keys = Object.keys(qAnswers)
          return keys.some((key) => !qAnswers[key])
        }
        default:
          return isEmpty(qAnswers)
      }
    })
  }

  const onCloseUnansweedPopup = () => {
    setUnansweredPopupSetting({
      ...unansweredPopupSetting,
      show: false,
    })
  }

  const gotoQuestion = (index, needsToProceed = false, context = '') => {
    if (preview) {
      hideHints()
      setCurrentItem(index)
      const timeSpent = Date.now() - lastTime.current
      if (!demo) {
        evaluateForPreview({ currentItem, timeSpent })
      }
    } else {
      const unansweredQs = getUnAnsweredQuestions()
      if (
        (unansweredQs.length && needsToProceed) ||
        !unansweredQs.length ||
        index < currentItem
      ) {
        const previewTab = getPreviewTab(index)
        saveCurrentAnswer({
          urlToGo: `${url}/qid/${index}`,
          locState: history?.location?.state,
          callback: () => changePreview(previewTab),
        })
      } else {
        setUnansweredPopupSetting({
          show: true,
          qLabels: unansweredQs.map(
            ({ barLabel, qSubLabel }) =>
              `${(barLabel || '-').substr(1)}${qSubLabel || '-'}`
          ),
          index,
          context,
        })
      }
    }
  }

  const moveToNext = async (e, needsToProceed = false, value) => {
    if (!isLast() && value !== 'SUBMIT') {
      gotoQuestion(Number(currentItem) + 1, needsToProceed, 'next')
    }

    const timeSpent = Date.now() - lastTime.current

    if (isLast() && preview && !demo) {
      evaluateForPreview({
        currentItem,
        timeSpent,
        callback: submitPreviewTest,
      })
    }

    if ((isLast() || value === 'SUBMIT') && !preview) {
      const unansweredQs = getUnAnsweredQuestions()
      if ((unansweredQs.length && needsToProceed) || !unansweredQs.length) {
        await saveUserAnswer(currentItem, timeSpent, false, groupId, {
          urlToGo: `${url}/${'test-summary'}`,
          locState: { ...history?.location?.state, fromSummary: true },
        })
      } else {
        setUnansweredPopupSetting({
          show: true,
          qLabels: unansweredQs.map(
            ({ barLabel, qSubLabel }) =>
              `${(barLabel || '-').substr(1)}${qSubLabel || '-'}`
          ),
          index: Number(currentItem) + 1,
          context: 'next',
        })
      }
    }
    if (enableMagnifier) {
      updateTestPlayer({ enableMagnifier: false })
    }
  }

  const saveProgress = () => {
    const timeSpent = Date.now() - lastTime.current
    saveUserAnswer(currentItem, timeSpent, false, groupId)
  }

  const gotoSummary = async () => {
    if (!preview) {
      if (!testletType) {
        const timeSpent = Date.now() - lastTime.current
        saveUserAnswer(currentItem, timeSpent, false, groupId, {
          urlToGo: `${url}/${'test-summary'}`,
          locState: { ...history?.location?.state, fromSummary: true },
        })
      }
    } else {
      history.push(`/login`)
    }
  }

  const moveToPrev = (e, needsToProceed = false) => {
    if (!isFirst())
      gotoQuestion(Number(currentItem) - 1, needsToProceed, 'prev')
    if (enableMagnifier) {
      updateTestPlayer({ enableMagnifier: false })
    }
  }

  const onSkipUnansweredPopup = async () => {
    setUnansweredPopupSetting({
      ...unansweredPopupSetting,
      show: false,
    })
    const { index, context } = unansweredPopupSetting
    if (context === 'next') {
      await moveToNext(null, true)
    } else if (context === 'prev') {
      moveToPrev(null, true)
    } else {
      gotoQuestion(index, true)
    }
  }

  const testItem = items[currentItem] || {}
  if (items && items.length > 0 && Object.keys(testItem).length === 0) {
    notification({
      messageKey: 'invalidAction',
    })
    if (userRole === roleuser.STUDENT) {
      history.push('/home/assignments')
    }
  }
  let itemRows = testItem.rows

  let passage = {}
  if (testItem.passageId && passages) {
    passage = passages.find((p) => p._id === testItem.passageId)
    itemRows = [passage?.structure, ...itemRows]
  }

  const hasDrawingResponse = flatMap(itemRows, (r) => r.widgets).some(
    (x) => x.type === questionType.HIGHLIGHT_IMAGE
  )

  const autoSave = useMemo(() => shouldAutoSave(itemRows), [itemRows])

  useInterval(() => {
    if (autoSave) {
      saveUserAnswer(currentItem, Date.now() - lastTime.current, true, groupId)
    }
  }, 1000 * 30)

  useEffect(() => {
    const cb = (event) => {
      event.preventDefault()
      saveProgress()
      // Older browsers supported custom message
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', cb)
    return () => {
      window.removeEventListener('beforeunload', cb)
    }
  }, [qid])

  const handleMagnifier = () =>
    updateTestPlayer({ enableMagnifier: !enableMagnifier })
  const props = {
    saveCurrentAnswer,
    items,
    isFirst,
    isLast,
    moveToNext,
    moveToPrev,
    currentItem,
    title,
    gotoQuestion,
    itemRows,
    evaluate,
    view,
    pageStructure,
    freeFormNotes,
    finishTest: () => finishTest(groupId),
    history,
    demo,
    previewPlayer: preview,
    LCBPreviewModal,
    closeTestPreviewModal,
    showTools,
    groupId,
    isStudentReport,
    passage,
    defaultAP,
    playerSkinType,
    showMagnifier,
    handleMagnifier,
    enableMagnifier,
    studentReportModal,
    hasDrawingResponse,
    ...restProps,
  }

  useEffect(() => {
    if (savingResponse) {
      message.loading('Submitting the response', 0)
    } else {
      message.destroy()
    }
    return () => {
      /**
       * message might appear just during unmount.
       * in that case we need to destroy it after
       */
      setTimeout(() => message?.destroy(), 1500)
    }
  }, [savingResponse])

  if (loading || (!assignmentObj && !preview)) {
    return <Spin />
  }

  let playerComponent = null
  if (!isUndefined(docUrl)) {
    playerComponent = (
      <AssessmentPlayerDocBased
        docUrl={docUrl}
        annotations={annotations}
        questionsById={questionsById}
        answers={answers}
        answersById={answersById}
        saveProgress={saveProgress}
        gotoSummary={gotoSummary}
        {...props}
      />
    )
  } else if (playerSkinType === playerSkinValues.testlet) {
    playerComponent = (
      <AssessmentPlayerTestlet
        {...props}
        testletConfig={testletConfig}
        testletState={testletState}
        saveUserAnswer={saveUserAnswer}
        gotoSummary={gotoSummary}
        {...test}
      />
    )
  } else {
    /**
     * at student side only scratchPad should be enabled,
     * highlight image default pen should be disabled
     */
    playerComponent = defaultAP ? (
      <AssessmentPlayerDefault {...props} />
    ) : (
      <AssessmentPlayerSimple {...props} />
    )
  }

  return (
    <AssessmentPlayerContext.Provider
      value={{ isStudentAttempt: true, currentItem }}
    >
      {showRegradedModal && (
        <Modal
          visible
          centered
          width={500}
          okButtonProps={{
            style: { background: themeColor },
          }}
          closable={false}
          footer={[
            <Button
              style={{ background: themeColor, color: 'white' }}
              loading={loading}
              onClick={onRegradedModalOk}
            >
              Ok
            </Button>,
          ]}
        >
          The assignment has been modified by Instructor. Please restart the
          assignment.
        </Modal>
      )}
      {unansweredPopupSetting.show && (
        <UnansweredPopup
          visible
          title=""
          onSkip={onSkipUnansweredPopup}
          onClose={onCloseUnansweedPopup}
          data={unansweredPopupSetting.qLabels}
        />
      )}
      {!preview && !demo && (
        <RealTimeV2HookWrapper
          userId={userId}
          testId={testId}
          groupId={groupId}
          regradedAssignment={regradedAssignment}
          regradedRealtimeAssignment={regradedRealtimeAssignment}
        />
      )}
      {playerComponent}
    </AssessmentPlayerContext.Provider>
  )
}

AssessmentContainer.propTypes = {
  gotoItem: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  docUrl: PropTypes.string,
  annotations: PropTypes.array,
  answers: PropTypes.array.isRequired,
  answersById: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  LCBPreviewModal: PropTypes.any.isRequired,
  testType: PropTypes.string.isRequired,
  test: PropTypes.object,
  assignmentById: PropTypes.object,
  currentAssignment: PropTypes.string,
  fetchAssignments: PropTypes.func.isRequired,
}

AssessmentContainer.defaultProps = {
  docUrl: undefined,
  annotations: [],
  test: {},
  assignmentById: {},
  currentAssignment: '',
}

const enhance = compose(
  withRouter,
  connect(
    (state, ownProps) => ({
      view: state.view.preview,
      items: state.test.items,
      passages: state.test.passages || ownProps.passages,
      title: state.test.title,
      docUrl: state.test.docUrl,
      testType: state.test.testType,
      playerSkinType: playerSkinTypeSelector(state),
      testletConfig: state.test?.testletConfig,
      freeFormNotes: state?.test?.freeFormNotes,
      testletState: get(
        state,
        `testUserWork[${
          state.test ? state.test.testActivityId : ''
        }].testletState`,
        {}
      ),
      annotations: state.test.annotations,
      pageStructure: state.test.pageStructure,
      questionsById: getQuestionsByIdSelector(state),
      answers: getAnswersArraySelector(state),
      answersById: getAnswersListSelector(state),
      loading: testLoadingSelector(state),
      savingResponse: state?.test?.savingResponse,
      userPrevAnswer: state.previousAnswers,
      testSettings: state.test?.settings,
      showMagnifier: state.test.showMagnifier,
      enableMagnifier: state.testPlayer.enableMagnifier,
      regradedAssignment: get(state, 'studentAssignment.regradedAssignment'),
      userId: get(state, 'user.user._id'),
      userRole: get(state, 'user.user.role'),
      userWork: userWorkSelector(state),
      assignmentById: get(state, 'studentAssignment.byId'),
      currentAssignment: get(state, 'studentAssignment.current'),
    }),
    {
      saveUserResponse,
      evaluateAnswer,
      changePreview: changePreviewAction,
      finishTest: finishTestAcitivityAction,
      gotoItem: gotoItemAction,
      updateTestPlayer: updateTestPlayerAction,
      hideHints: hideHintsAction,
      regradedRealtimeAssignment: regradedRealtimeAssignmentAction,
      clearRegradeAssignment: clearRegradeAssignmentAction,
      setPasswordValidateStatus: setPasswordValidateStatusAction,
      fetchAssignments: fetchAssignmentsAction,
      evaluateForPreview: evaluateCurrentAnswersForPreviewAction,
      setCheckAnswerInProgress: setCheckAnswerInProgressStatusAction,
    }
  )
)

export default enhance(AssessmentContainer)
