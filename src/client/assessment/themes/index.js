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
import { testActivityApi, classBoardApi, TokenStorage } from '@edulastic/api'

import Styled from 'styled-components'
import {
  gotoItem as gotoItemAction,
  saveUserResponse,
  saveBlurTimeAction,
} from '../actions/items'
import { saveUserWorkAction } from '../actions/userWork'
import {
  finishTestAcitivityAction,
  loadTestAction,
  setIsTestPreviewVisibleAction,
  setPasswordValidateStatusAction,
} from '../actions/test'
import { evaluateAnswer } from '../actions/evaluation'
import { changePreview as changePreviewAction } from '../actions/view'
import { getQuestionsByIdSelector } from '../selectors/questions'
import {
  testLoadingSelector,
  playerSkinTypeSelector,
  originalPlayerSkinName,
  getIsPreviewModalVisibleSelector,
} from '../selectors/test'
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
import { allowReferenceMaterialSelector } from '../../author/src/selectors/user'

const { playerSkinValues } = testConstants

const autoSavableTypes = {
  essayRichText: 1,
  essayPlainText: 1,
  formulaessay: 1,
}

const shouldAutoSave = (itemRows, answersById, itemId) => {
  let autosave = false
  let currentAnswer = ''
  if (!itemRows) {
    return [autosave, currentAnswer]
  }

  for (const row of itemRows) {
    for (const widget of row?.widgets || []) {
      if (widget.widgetType === 'question' && autoSavableTypes[widget.type]) {
        const currentAnswerId = `${itemId}_${widget?.reference}`
        currentAnswer += answersById[currentAnswerId]
        autosave = true
      }
    }
  }
  return [autosave, currentAnswer]
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
        zIndex: 10000,
      })
      if (history.location.pathname === '/home/assignments') {
        history.push('/home/assignmentss') // this hack needed to re-render route
        history.replace('/home/assignments')
      } else {
        history.push('/home/assignments')
      }
    })
    .catch((e) => {
      if (Fscreen?.fullscreenEnabled) {
        Fscreen.exitFullscreen()
      }
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
          zIndex: 10000,
        })
        Fscreen.exitFullscreen()
        history.push('/home/assignments')
      } else {
        notification({
          type: 'warning',
          msg:
            'Test Security: Moving out of the assignment has been recorded and the teacher will be notified',
          duration: 0,
          zIndex: 10000,
        })
      }
    })
    .catch((error) => {
      console.warn('idle error', error)
      history.push('/home/assignments')
    })
}

export function ForceFullScreenModal({ visible, takeItLaterCb, fullscreenCb }) {
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
              if (fullscreenCb) {
                fullscreenCb(true)
              }
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
        While taking this test, you cannot open other web pages. This test can
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
        (win, _disableSave) => {
          const { pathname: _path } = win.location
          if (!_path.includes('/uta/')) {
            window.sessionStorage.removeItem('totalTimeInBlur')
          }
          if (
            !_path.includes('/uta/') &&
            _disableSave &&
            !window.sessionStorage.getItem('paused') &&
            window.sessionStorage.getItem('submitted') === 'no'
          ) {
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
        window,
        disableSave
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
          doc.set({
            lastUpdatedTime: Date.now(),
            tokenCreatedTime: TokenStorage.getCurrentTokenCreatedTime() || null,
          })
          return
        }

        const {
          lastUpdatedTime: lastTime,
          tokenCreatedTime: firebaseTokenCreatedTime,
        } = d.data()
        const currentTokenCreatedTime = TokenStorage.getCurrentTokenCreatedTime()

        if (
          blockSaveAndContinue &&
          firebaseTokenCreatedTime &&
          currentTokenCreatedTime &&
          currentTokenCreatedTime > firebaseTokenCreatedTime
        ) {
          pauseAssignment({
            history,
            testActivityId,
            userId,
            assignmentId,
            classId,
            pauseReason:
              'Test is paused due to multiple login sessions. To reset, place check mark in student card, go to More, select Resume',
          })

          window.sessionStorage.setItem('paused', 1)
          setTimeout(() => {
            window.sessionStorage.removeItem('paused')
          }, 10000)
        } else if (Date.now() - lastTime >= 45 * 1000) {
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
          doc.update({ lastUpdatedTime: Date.now() })
        }
      })
    }

    const interval = window.setInterval(() => {
      doc.update({ lastUpdatedTime: Date.now() })
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
  onTimeInBlurChange = () => {},
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
        if (enabled) {
          totalTimeInBlur.current += 1
        }
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
  /**
   * need to memoize the topics since its going to be used as dependency for
   * useEffect and its referrence shouldn't change for each re-render
   */
  const topicsMemoized = useMemo(() => {
    let topics = [
      `student_assessment:user:${userId}`,
      `student_assessment:test:${testId}:group:${groupId}`,
      `student_assessment:test:${testId}`,
    ]
    if (regradedAssignment?.newTestId) {
      topics = [
        ...topics,
        `student_assessment:test:${regradedAssignment?.newTestId}:group:${groupId}`,
      ]
    }
    return topics
  }, [userId, testId, groupId, regradedAssignment?.newTestId])

  useRealtimeV2(
    topicsMemoized,
    {
      regradedAssignment: (payload) => {
        regradedRealtimeAssignment(payload)
      },
      correctItem: (payload) => {
        regradedRealtimeAssignment(payload)
      },
    },
    { dynamicTopics: true }
  )
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
  originalSkinName,
  userPrevAnswer,
  testSettings,
  showMagnifier,
  updateTestPlayer,
  enableMagnifier,
  isShowReferenceModal,
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
  loadTest,
  showUserTTS,
  isTestPreviewModalVisible,
  allowReferenceMaterial,
  ...restProps
}) => {
  const testKeypad = testSettings?.keypad || 'item-level-keypad'
  const _questionsById = useMemo(() => {
    if (preview && questionsById) {
      Object.values(questionsById).forEach((question) => {
        if (
          Array.isArray(question.symbols) &&
          testKeypad !== 'item-level-keypad'
        ) {
          question.symbols[0] = testKeypad
        }
      })
    }
    return questionsById
  }, [questionsById, preview, testKeypad])

  const itemId = preview || testletType ? 'new' : match.params.itemId || 'new'
  const itemIndex =
    itemId === 'new' ? 0 : items.findIndex((ele) => ele._id === itemId)
  const qid = itemIndex > 0 ? itemIndex : 0
  const [currentItem, setCurrentItem] = useState(Number(qid))
  const [unansweredPopupSetting, setUnansweredPopupSetting] = useState({
    qLabels: [],
    show: false,
  })
  const { enableSkipAlert = false } = testSettings || {}
  const [showRegradedModal, setShowRegradedModal] = useState(false)

  const [, uploadFile] = useUploadToS3(userId)

  const isLast = () => currentItem === items.length - 1
  const isFirst = () => currentItem === 0

  const lastTime = useRef(window.localStorage.assessmentLastTime || Date.now())

  const assignmentObj = currentAssignment && assignmentById[currentAssignment]
  const {
    restrictNavigationOut = false,
    restrictNavigationOutAttemptsThreshold,
    blockSaveAndContinue = assignmentObj?.blockSaveAndContinue,
  } = restProps

  const hidePause = blockSaveAndContinue
  const [enteredIntoFullScreen, setEnteredIntoFullScreen] = useState(false)
  const currentlyFullScreen = useFullScreenListener({
    enabled: restrictNavigationOut,
    assignmentId: assignmentObj?._id,
    classId: groupId,
    testActivityId: restProps.utaId,
    history,
    disableSave: blockSaveAndContinue,
    userId,
  })

  useTabNavigationCounterEffect({
    testActivityId: restProps.utaId,
    enabled: restrictNavigationOut && enteredIntoFullScreen,
    threshold: restrictNavigationOutAttemptsThreshold,
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
    if (document && window) {
      document.onkeydown = function (e) {
        // for IE
        e = e || window.event
        const keyCode = window.event ? e.which : e.keyCode

        // check ctrl + f and command + f key
        if (
          (window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) &&
          keyCode == 70
        ) {
          e.preventDefault()
          return false
        }
      }
    }
    return () => {
      document.onkeydown = function (e) {
        // for IE
        e = e || window.event
        const keyCode = window.event ? e.which : e.keyCode

        // check ctrl + f and command + f key
        if (
          (window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) &&
          keyCode == 70
        ) {
          return true
        }
      }
    }
  }, [restrictNavigationOut, document, window])

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
        centered: true,
        width: 500,
        okButtonProps: {
          style: { background: themeColor, outline: 'none' },
        },
        onOk: () => {
          setIsTestPreviewVisible(false)
          if (userRole === roleuser.STUDENT) {
            history.push('/home/assignments')
          }
          Modal.destroyAll()
        },
      })
    }
  }, [loading])

  useEffect(() => {
    setCurrentItem(Number(qid))
    if (enableMagnifier || isShowReferenceModal) {
      updateTestPlayer({ enableMagnifier: false, isShowReferenceModal: false })
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
    if (regradedAssignment && regradedAssignment?.newTestId) {
      setShowRegradedModal(true)
    }
  }, [regradedAssignment?.newTestId])

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
          const initialData = q?.chart_data?.data || []
          return initialData.every((d, i) => d?.y === qAnswers?.[i]?.y)
        }
        case questionType.MATCH_LIST:
          return Object.values(qAnswers || {}).every((d) => isNull(d))
        case questionType.SORT_LIST:
        case questionType.CLOZE_DRAG_DROP:
        case questionType.HOTSPOT:
          return !qAnswers?.some((ans) => ans?.toString())
        case questionType.ORDER_LIST: {
          const prevOrder = [...Array(q?.list?.length || 0).keys()]
          return qAnswers ? isEqual(prevOrder, qAnswers) : true
        }
        case questionType.MATH:
          if (q.title === 'Complete the Equation') {
            if (isArray(qAnswers)) {
              return !qAnswers?.some((ans) => ans?.toString())
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
          const keys = Object.keys(qAnswers || {})
          return (
            keys.length === 0 || keys.every((key) => isEmpty(qAnswers[key]))
          )
        }
        case questionType.CLOZE_IMAGE_DROP_DOWN:
        case questionType.CLOZE_IMAGE_TEXT: {
          if (!isObject(qAnswers)) {
            return true
          }
          const keys = Object.keys(qAnswers || {})
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
        const _item = items[currentItem]
        if (!_item.isDummyItem) {
          evaluateForPreview({
            currentItem,
            timeSpent,
            testId,
          })
        }
      } else {
        if (!enableSkipAlert) {
          // eslint-disable-next-line
          return silentSkip({ index, context })
        }
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
        if (!enableSkipAlert) {
          // eslint-disable-next-line
          return silentSkip({ index, context })
        }
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
        if (!enableSkipAlert) {
          // eslint-disable-next-line
          return silentSkip({
            index: Number(currentItem),
            context: value,
          })
        }
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
      const _item = items[currentItem]
      if (!_item.isDummyItem) {
        evaluateForPreview({
          currentItem,
          timeSpent,
          callback: submitPreviewTest,
          testId,
          isLastQuestion: true,
        })
      }
      if (_item.isDummyItem) {
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
        if (!enableSkipAlert) {
          // eslint-disable-next-line
          return silentSkip({
            index: Number(currentItem) + 1,
            context: 'next',
          })
        }
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
    if (enableMagnifier || isShowReferenceModal) {
      updateTestPlayer({ enableMagnifier: false, isShowReferenceModal: false })
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
    if (enableMagnifier || isShowReferenceModal) {
      updateTestPlayer({ enableMagnifier: false, isShowReferenceModal: false })
    }
  }

  const skipOnPreview = (index) => {
    hideHints()
    setCurrentItem(index)
    const timeSpent = Date.now() - lastTime.current
    const _item = items[currentItem]
    if (_item.isDummyItem) {
      return submitPreviewTest()
    }
    const evalArgs = {
      currentItem,
      timeSpent,
      testId,
    }
    if (isLast()) {
      evalArgs.isLastQuestion = true
      evalArgs.callback = submitPreviewTest
    }
    evaluateForPreview(evalArgs)
  }

  // This function is for a direct submit only available in DRC player.
  // take care of changes related to generic submit here as well.
  const handleReviewOrSubmit = () => {
    const timeSpent = Date.now() - lastTime.current
    if (preview) {
      const _item = items[currentItem]
      if (demo || _item.isDummyItem) {
        return submitPreviewTest()
      }
      const evalArgs = {
        currentItem,
        timeSpent,
        testId,
        callback: submitPreviewTest,
      }
      return evaluateForPreview(evalArgs)
    }
    gotoSummary()
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

  const silentSkip = async ({ index, context }) => {
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
      zIndex: 10000,
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

  const { referenceDocAttributes } = restProps || test || {}

  const prevAnswerValue = useRef('')

  useEffect(() => {
    ;[, prevAnswerValue.current] = shouldAutoSave(itemRows, answersById, itemId)
  }, [JSON.stringify(itemRows)])

  const [autoSave, currentAnswerValue] = useMemo(
    () => shouldAutoSave(itemRows, answersById, itemId),
    [itemRows, currentItem, answersById, itemId]
  )

  useInterval(() => {
    if (autoSave && currentAnswerValue !== prevAnswerValue.current) {
      prevAnswerValue.current = currentAnswerValue
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

    const removeBeforeUnloadCB = () =>
      window.removeEventListener('beforeunload', cb)

    // When stduent session expired, no need to show `unsaved data` alert on closing/switching page
    window.addEventListener('student-session-expired', removeBeforeUnloadCB)

    window.addEventListener('user-token-expired', removeBeforeUnloadCB)

    window.addEventListener('assignment-regraded', removeBeforeUnloadCB)

    const unloadCb = () => {
      if (blockSaveAndContinue) {
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
      window.removeEventListener(
        'student-session-expired',
        removeBeforeUnloadCB
      )
      window.removeEventListener('user-token-expired', removeBeforeUnloadCB)
      window.removeEventListener('assignment-regraded', removeBeforeUnloadCB)
    }
  }, [qid])

  const onRegradedModalOk = () => {
    window.dispatchEvent(new Event('assignment-regraded'))
    window.location.href = `/student/assessment/${regradedAssignment.newTestId}/class/${groupId}/uta/${restProps.utaId}/itemId/${items[currentItem]._id}`
  }

  const handleMagnifier = () =>
    updateTestPlayer({ enableMagnifier: !enableMagnifier })

  const openReferenceModal = () => {
    updateTestPlayer({ isShowReferenceModal: !isShowReferenceModal })
  }

  /**
   * Visible when user is tts user or current view is author view
   * @returns {boolean}
   */
  const ttsVisibility =
    (userRole === roleuser.STUDENT && showUserTTS === 'yes') ||
    isTestPreviewModalVisible

  /**
   * Checks for at least one tts is completed in a test
   * @returns {boolean}
   */
  const testItemHasAtLeastOneTTS = items.some(({ data }) =>
    data.questions.some((que) => que.tts && que.tts.taskStatus === 'COMPLETED')
  )

  const canShowPlaybackOptionTTS = ttsVisibility && testItemHasAtLeastOneTTS

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
    originalSkinName,
    showMagnifier,
    handleMagnifier,
    enableMagnifier,
    openReferenceModal,
    isShowReferenceModal,
    referenceDocAttributes,
    studentReportModal,
    hasDrawingResponse,
    questions: _questionsById,
    uploadToS3: uploadFile,
    userWork,
    gotoSummary,
    handleReviewOrSubmit,
    canShowPlaybackOptionTTS,
    canShowReferenceMaterial:
      !isEmpty(referenceDocAttributes) && allowReferenceMaterial,
    ...restProps,
  }

  useEffect(() => {
    if (!preview) {
      if (savingResponse) {
        message.loading('Submitting the response', 0)
      } else {
        message.destroy()
      }
    }
    return () => {
      /**
       * message might appear just during unmount.
       * in that case we need to destroy it after
       */

      try {
        setTimeout(() => message?.destroy(), 1500)
      } catch (e) {
        console.warn('Error', e)
      }
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
        questionsById={_questionsById}
        answers={answers}
        answersById={answersById}
        saveProgress={saveProgress}
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
        {...test}
      />
    )
  } else {
    /**
     * at student side only scratchPad should be enabled,
     * highlight image default pen should be disabled
     */
    playerComponent = defaultAP ? (
      <AssessmentPlayerDefault {...props} test={test} hidePause={hidePause} />
    ) : (
      <AssessmentPlayerSimple {...props} test={test} hidePause={hidePause} />
    )
  }

  return (
    <AssessmentPlayerContext.Provider
      value={{ isStudentAttempt: true, currentItem, setCurrentItem }}
    >
      {restrictNavigationOut && (
        <>
          <ForceFullScreenModal
            testActivityId={restProps.utaId}
            history={history}
            fullscreenCb={setEnteredIntoFullScreen}
            visible={
              !currentlyFullScreen &&
              history.location.pathname.includes('/uta/')
            }
            takeItLaterCb={
              blockSaveAndContinue
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

      {(blockSaveAndContinue || restrictNavigationOut) && (
        <FirestorePings
          testActivityId={restProps.utaId}
          history={history}
          blockSaveAndContinue={blockSaveAndContinue}
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
          playerSkinType={playerSkinType}
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
      originalSkinName: originalPlayerSkinName(state),
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
      isShowReferenceModal: state.testPlayer.isShowReferenceModal,
      allowReferenceMaterial: allowReferenceMaterialSelector(state),
      referenceDocAttributes: state?.test?.referenceDocAttributes,
      regradedAssignment: get(state, 'studentAssignment.regradedAssignment'),
      userId: get(state, 'user.user._id'),
      userRole: get(state, 'user.user.role'),
      showUserTTS: get(state, 'user.user.tts', 'no'),
      userWork: userWorkSelector(state),
      assignmentById: get(state, 'studentAssignment.byId'),
      currentAssignment: get(state, 'studentAssignment.current'),
      blockNavigationToAnsweredQuestions:
        state.test?.settings?.blockNavigationToAnsweredQuestions,
      blockSaveAndContinue: state.test?.settings?.blockSaveAndContinue,
      restrictNavigationOut: state.test?.settings?.restrictNavigationOut,
      restrictNavigationOutAttemptsThreshold:
        state.test?.settings?.restrictNavigationOutAttemptsThreshold,
      savedBlurTime: state.test?.savedBlurTime,
      isTestPreviewModalVisible: getIsPreviewModalVisibleSelector(state),
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
      loadTest: loadTestAction,
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
