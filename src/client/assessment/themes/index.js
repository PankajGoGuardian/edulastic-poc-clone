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
  FireBaseService,
  EduButton,
} from '@edulastic/common'

import { themeColor } from '@edulastic/colors'
import { testActivityApi, classBoardApi } from '@edulastic/api'

import Styled from 'styled-components'
import {
  gotoItem as gotoItemAction,
  saveUserResponse,
  saveBlurTimeAction,
} from '../actions/items'
import { saveUserWorkAction } from '../actions/userWork'
import {
  finishTestAcitivityAction,
  setIsTestPreviewVisibleAction,
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
import useFocusHandler from '../utils/useFocusHandler'
import useUploadToS3 from '../hooks/useUploadToS3'
import { Fscreen } from '../utils/helpers'

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

function pauseAssignment({
  history,
  assignmentId,
  classId,
  userId,
  pauseReason,
  msg,
}) {
  classBoardApi
    .togglePauseStudents({
      assignmentId,
      classId,
      students: [userId],
      isPause: true,
      pauseReason,
    })
    .then(() => {
      Fscreen.safeExitfullScreen()
      const errorMsg = msg || 'Pausing Assignment due to Anti Cheating measures'
      notification({
        type: 'warning',
        msg: errorMsg,
        duration: 0,
        key: errorMsg,
      })
      if (history.location.pathname === '/home/assignments') {
        history.push('/home/assignmentss') // this hack needed to re-render route
        history.replace('/home/assignments')
      } else {
        history.push('/home/assignments')
      }
    })
    .catch((e) => {
      Fscreen.exitFullscreen()
      const errorMsg =
        e?.response?.data?.result?.message ||
        'Pausing Assignment due to Anti Cheating measures'
      console.warn('error pausing', errorMsg)
      if (!history.location.pathname === '/home/assignments') {
        history.push('/home/assignments')
      }
    })
}

function incrementNavigationCounter({ history, testActivityId }) {
  const msg =
    'Your test has been locked for security reasons. Please contact your teacher to reopen your test'
  return testActivityApi
    .incrementTabNavigationCounter(testActivityId)
    .then((response) => {
      if (response.paused) {
        notification({
          type: 'warning',
          msg,
          duration: 0,
          key: msg,
        })
        Fscreen.exitFullscreen()
        history.push('/home/assignments')
      } else {
        notification({
          type: 'warning',
          msg:
            'Test Security: Moving out of the assignment has been recorded and the teacher will be notified',
          duration: 0,
        })
      }
    })
    .catch((error) => {
      console.warn('idle error', error)
      history.push('/home/assignments')
    })
}

export function ForceFullScreenModal({ visible, takeItLaterCb }) {
  return (
    <StyledModal
      destroyOnClose
      keyboard={false}
      closable={!!takeItLaterCb}
      onCancel={takeItLaterCb}
      maskClosable={false}
      footer={
        <>
          {takeItLaterCb && (
            <Button type="link" onClick={() => takeItLaterCb()}>
              Take it Later
            </Button>
          )}
          <EduButton
            className="inline-button"
            type="primary"
            onClick={() => {
              Fscreen.requestFullscreen(document.body)
            }}
          >
            Enter Full Screen
          </EduButton>
        </>
      }
      maskStyle={{ background: '#000', opacity: 1 }}
      visible={visible}
    >
      <div className="content">
        While taking this test, you can not open other web pages. This test can
        only be taken in fullscreen mode
      </div>
    </StyledModal>
  )
}

export function useFullScreenListener({
  enabled,
  assignmentId,
  testActivityId,
  classId,
  userId,
  history,
  disableSave,
}) {
  const [inFullScreen, setInFullScreen] = useState(
    enabled ? Fscreen.fullscreenElement : true
  )
  const fullScreenCb = () => {
    if (Fscreen.fullscreenElement) {
      setInFullScreen(true)
    } else {
      setTimeout(() => setInFullScreen(false), 700)
    }
  }

  useEffect(() => {
    Fscreen.addEventListener('fullscreenchange', fullScreenCb)
    if (enabled && !Fscreen.fullscreenElement) {
      setInFullScreen(false)
    }

    return () => {
      Fscreen.removeEventListener('fullscreenchange', fullScreenCb)
      Modal.destroyAll()
      setTimeout(
        (win) => {
          const { pathname: _path } = win.location
          if (!_path.includes('/uta/')) {
            window.sessionStorage.removeItem('totalTimeInBlur')
          }
          if (!_path.includes('/uta/') && disableSave) {
            pauseAssignment({
              history,
              assignmentId,
              testActivityId,
              classId,
              userId,
              pauseReason:
                'Paused due to navigating away from assignment without submission',
            })
          }
        },
        5000,
        window
      )
    }
  }, [enabled])
  return inFullScreen
}

function useFirestorePingsForNavigationCheck({
  testActivityId,
  history,
  blockSaveAndContinue,
  userId,
  classId,
  assignmentId,
}) {
  const collectionName = `timetracking`
  const coll = FireBaseService.db.collection(collectionName)
  const doc = coll.doc(testActivityId)
  useEffect(() => {
    if (testActivityId) {
      doc.get().then((d) => {
        if (!d.data()) {
          doc.set({ lastUpdatedTime: Date.now() })
          return
        }
        const lastTime = d.data().lastUpdatedTime

        if (Date.now() - lastTime >= 45 * 1000) {
          if (blockSaveAndContinue) {
            pauseAssignment({
              history,
              testActivityId,
              userId,
              assignmentId,
              classId,
              pauseReason: 'blocked-save-and-continue',
            })
          } else {
            incrementNavigationCounter({ history, testActivityId })
          }
        } else {
          doc.set({ lastUpdatedTime: Date.now() })
        }
      })
    }

    const interval = window.setInterval(() => {
      doc.set({ lastUpdatedTime: Date.now() })
    }, 30 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, [testActivityId])
}

export function FirestorePings({
  testActivityId,
  history,
  blockSaveAndContinue,
  userId,
  classId,
  assignmentId,
}) {
  useFirestorePingsForNavigationCheck({
    testActivityId,
    history,
    blockSaveAndContinue,
    assignmentId,
    classId,
    userId,
  })
  return null
}

export function useTabNavigationCounterEffect({
  testActivityId,
  enabled,
  history,
  threshold,
  assignmentId,
  classId,
  userId,
  onTimeInBlurChange,
  blurTimeAlreadySaved,
}) {
  const inFocusRef = useRef(true)
  const idleTimeoutRef = useRef(null)
  const totalBlurTimeCounterIntervalRef = useRef(null)
  const totalTimeInBlur = useRef(blurTimeAlreadySaved || 0)

  useEffect(() => {
    if (window.sessionStorage.totalTimeInBlur) {
      totalTimeInBlur.current =
        parseInt(window.sessionStorage.totalTimeInBlur, 10) || 0
      window.sessionStorage.removeItem('totalTimeInBlur')
      onTimeInBlurChange(totalTimeInBlur.current)
    } else if (blurTimeAlreadySaved) {
      totalTimeInBlur.current = blurTimeAlreadySaved
      onTimeInBlurChange(blurTimeAlreadySaved)
    }
    return () => {
      if (totalBlurTimeCounterIntervalRef.current) {
        clearInterval(totalBlurTimeCounterIntervalRef.current)
      }
    }
  }, [])

  useFocusHandler({
    enabled,
    onFocus: () => {
      onTimeInBlurChange(totalTimeInBlur.current)
      inFocusRef.current = true
      window.sessionStorage.removeItem('totalTimeInBlur')
      console.log('on focus ', new Date())
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current)
      }
      if (totalBlurTimeCounterIntervalRef.current) {
        clearInterval(totalBlurTimeCounterIntervalRef.current)
      }
    },
    onBlur: () => {
      console.log('on blur ', new Date())
      inFocusRef.current = false
      if (totalBlurTimeCounterIntervalRef.current) {
        clearInterval(totalBlurTimeCounterIntervalRef.current)
      }
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current)
      }
      totalBlurTimeCounterIntervalRef.current = setInterval(() => {
        totalTimeInBlur.current += 1
        window.sessionStorage.totalTimeInBlur = totalTimeInBlur.current
        if (enabled && threshold > 1) {
          const maximumTimeLimit = threshold * 5
          if (totalTimeInBlur.current >= maximumTimeLimit) {
            if (totalBlurTimeCounterIntervalRef.current) {
              clearInterval(totalBlurTimeCounterIntervalRef.current)
            }
            window.sessionStorage.removeItem('totalTimeInBlur')
            pauseAssignment({
              history,
              assignmentId,
              classId,
              userId,
              pauseReason: 'out-of-navigation',
              msg:
                'Your test has been locked for security reasons. Please contact your teacher to reopen your test',
            })
          }
        }
      }, 1000)
      idleTimeoutRef.current = setTimeout(() => {
        if (!inFocusRef.current && enabled) {
          console.info('too much time away from screen!!!!!!!', new Date())
          incrementNavigationCounter({ history, testActivityId })
        }
      }, 2500)
    },
  })
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
  saveUserWork,
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
  userWork,
  regradedAssignment,
  clearRegradeAssignment,
  setPasswordValidateStatus,
  userRole,
  assignmentById,
  currentAssignment,
  fetchAssignments,
  evaluateForPreview,
  setIsTestPreviewVisible,
  saveBlurTime,
  savedBlurTime: blurTimeAlreadySaved,
  ...restProps
}) => {
  const itemId = preview || testletType ? 'new' : match.params.itemId || 'new'
  const itemIndex =
    itemId === 'new' ? 0 : items.findIndex((ele) => ele._id === itemId)
  const qid = itemIndex > 0 ? itemIndex : 0
  const [currentItem, setCurrentItem] = useState(Number(qid))
  const [unansweredPopupSetting, setUnansweredPopupSetting] = useState({
    qLabels: [],
    show: false,
  })
  const [showRegradedModal, setShowRegradedModal] = useState(false)

  const [, uploadFile] = useUploadToS3(userId)

  const isLast = () => currentItem === items.length - 1
  const isFirst = () => currentItem === 0

  const lastTime = useRef(window.localStorage.assessmentLastTime || Date.now())

  const assignmentObj = currentAssignment && assignmentById[currentAssignment]
  const hidePause = assignmentObj?.blockSaveAndContinue
  const currentlyFullScreen = useFullScreenListener({
    enabled: assignmentObj?.restrictNavigationOut,
    assignmentId: assignmentObj?._id,
    classId: groupId,
    testActivityId: restProps.utaId,
    history,
    disableSave: assignmentObj?.blockSaveAndContinue,
    userId,
  })

  useTabNavigationCounterEffect({
    testActivityId: restProps.utaId,
    enabled: assignmentObj?.restrictNavigationOut,
    threshold: assignmentObj?.restrictNavigationOutAttemptsThreshold,
    history,
    assignmentId: assignmentObj?._id,
    classId: groupId,
    userId,
    onTimeInBlurChange: (v) => {
      saveBlurTime(v)
    },
    blurTimeAlreadySaved,
  })
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
        onOk: () => setIsTestPreviewVisible(false),
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
      `/student/assessment/${regradedAssignment.newTestId}/class/${groupId}/uta/${restProps.utaId}/itemId/${items[currentItem]._id}`
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
        (question) => `${items[index]?._id}_${question.id}`
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
    const _itemId = items[currentItem]?._id
    if (hasUserWork(_itemId, userWork || {})) {
      return []
    }
    return questions.filter((q) => {
      const qAnswers =
        answersById[`${_itemId}_${q.id}`] ||
        userPrevAnswer[`${_itemId}_${q.id}`]
      switch (q.type) {
        case questionType.TOKEN_HIGHLIGHT:
          return (
            (answersById[`${_itemId}_${q.id}`] || []).filter(
              (token) => token?.selected
            ).length === 0
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
      const unansweredQs = getUnAnsweredQuestions()
      if (
        (unansweredQs.length && needsToProceed) ||
        !unansweredQs.length ||
        index < currentItem
      ) {
        hideHints()
        setCurrentItem(index)
        const timeSpent = Date.now() - lastTime.current
        if (!demo) {
          evaluateForPreview({ currentItem, timeSpent })
        }
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
    } else {
      const unansweredQs = getUnAnsweredQuestions()
      if (
        (unansweredQs.length && needsToProceed) ||
        !unansweredQs.length ||
        index < currentItem
      ) {
        const previewTab = getPreviewTab(index)
        saveCurrentAnswer({
          urlToGo: `${url}/itemId/${items[index]._id}`,
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

    if (isLast() && preview) {
      const unansweredQs = getUnAnsweredQuestions()
      if (unansweredQs.length && !needsToProceed) {
        return setUnansweredPopupSetting({
          show: true,
          qLabels: unansweredQs.map(
            ({ barLabel, qSubLabel }) =>
              `${(barLabel || '-').substr(1)}${qSubLabel || '-'}`
          ),
          index: Number(currentItem),
          context: value,
        })
      }
      if (!demo) {
        evaluateForPreview({
          currentItem,
          timeSpent,
          callback: submitPreviewTest,
        })
      }
      if (demo) {
        submitPreviewTest()
      }
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

  const skipOnPreview = (index) => {
    hideHints()
    setCurrentItem(index)
    const timeSpent = Date.now() - lastTime.current
    if (demo && isLast()) {
      return submitPreviewTest()
    }
    if (!demo) {
      const evalArgs = { currentItem, timeSpent }
      if (isLast()) {
        evalArgs.callback = submitPreviewTest
      }
      evaluateForPreview(evalArgs)
    }
  }

  const onSkipUnansweredPopup = async () => {
    setUnansweredPopupSetting({
      ...unansweredPopupSetting,
      show: false,
    })
    const { index, context } = unansweredPopupSetting
    if (preview) {
      return skipOnPreview(index)
    }
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
      event.returnValue = 'Are'
    }

    if (!demo) window.addEventListener('beforeunload', cb)

    const unloadCb = () => {
      if (assignmentObj?.blockSaveAndContinue) {
        pauseAssignment({
          history,
          testActivityId: restProps.utaId,
          assignmentId: assignmentObj?._id,
          classId: groupId,
          userId,
          pauseReason: 'exiting',
        })
      }
    }

    window.addEventListener('unload', unloadCb)

    return () => {
      window.removeEventListener('beforeunload', cb)
      window.removeEventListener('unload', unloadCb)
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
    questions: questionsById,
    uploadToS3: uploadFile,
    userWork,
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
        hidePause={hidePause}
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
        hidePause={hidePause}
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
      <AssessmentPlayerDefault {...props} hidePause={hidePause} />
    ) : (
      <AssessmentPlayerSimple {...props} hidePause={hidePause} />
    )
  }

  return (
    <AssessmentPlayerContext.Provider
      value={{ isStudentAttempt: true, currentItem, setCurrentItem }}
    >
      {assignmentObj?.restrictNavigationOut && (
        <>
          <ForceFullScreenModal
            testActivityId={restProps.utaId}
            history={history}
            visible={
              !currentlyFullScreen &&
              history.location.pathname.includes('/uta/')
            }
            takeItLaterCb={
              assignmentObj?.blockSaveAndContinue
                ? null
                : () =>
                    saveCurrentAnswer({
                      pausing: true,
                      callback: () => history.push('/home/assignments'),
                    })
            }
          />
        </>
      )}

      {(assignmentObj.blockSaveAndContinue ||
        assignmentObj?.restrictNavigationOut) && (
        <FirestorePings
          testActivityId={restProps.utaId}
          history={history}
          blockSaveAndContinue={assignmentObj?.blockSaveAndContinue}
          userId={userId}
          classId={groupId}
          assignmentId={assignmentObj?._id}
        />
      )}
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
      blockNavigationToAnsweredQuestions:
        state.test?.settings?.blockNavigationToAnsweredQuestions,
      savedBlurTime: state.test?.savedBlurTime,
    }),
    {
      saveUserResponse,
      saveBlurTime: saveBlurTimeAction,
      evaluateAnswer,
      saveUserWork: saveUserWorkAction,
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
      setIsTestPreviewVisible: setIsTestPreviewVisibleAction,
    }
  )
)

const StyledModal = Styled(Modal)`
  .content{
    padding-top:20px;
  }
  .ant-modal-footer{
    border-top:0px;
    text-align:center;
    .ant-btn-link{
      color: ${themeColor}
    }
  }

  .inline-button{
    display: inline-block;
  }
`

export default enhance(AssessmentContainer)
