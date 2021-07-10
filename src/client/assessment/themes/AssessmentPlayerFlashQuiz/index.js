/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types'
import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, isUndefined, last } from 'lodash'
import { ThemeProvider } from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import { withWindowSizes, notification } from '@edulastic/common'

// actions
import { playerSkinValues } from '@edulastic/constants/const/test'
import { checkAnswerEvaluation } from '../../actions/checkanswer'
import { currentItemAnswerChecksSelector } from '../../selectors/test'
// components

import {
  Container,
  CalculatorContainer,
  getDefaultCalculatorProvider,
} from '../common'
import PlayerMainContentArea from './PlayerMainContentArea'

import PlayerHeader from './PlayerHeader'
import { themes } from '../../../theme'
import assessmentPlayerTheme from './themeStyle.json'
import { unansweredQuestionCountSelector } from '../../../student/TestAttemptReview/ducks'
import {
  toggleBookmarkAction,
  bookmarksByIndexSelector,
} from '../../sharedDucks/bookmark'
import { getSkippedAnswerSelector } from '../../selectors/answers'
import { saveUserWorkAction } from '../../actions/userWork'
import { changePreviewAction } from '../../../author/src/actions/view'

import { setUserAnswerAction } from '../../actions/answers'
import AssessmentPlayerSkinWrapper from '../AssessmentPlayerSkinWrapper'
import { updateTestPlayerAction } from '../../../author/sharedDucks/testPlayer'
import { showHintsAction } from '../../actions/userInteractions'
import { CLEAR } from '../../constants/constantsForQuestions'
import { showScratchpadInfoNotification } from '../../utils/helpers'
import UserWorkUploadModal from '../../components/UserWorkUploadModal'

class AssessmentPlayerFlashQuiz extends React.Component {
  constructor(props) {
    super(props)
    const { attachments = [] } = props
    const lastUploadedFileNameExploded =
      last(attachments)?.name?.split('_') || []
    const cameraImageIndex = last(lastUploadedFileNameExploded)
      ? parseInt(last(lastUploadedFileNameExploded), 10) + 1
      : 1
    this.state = {
      showExitPopup: false,
      testItemState: '',
      toolsOpenStatus: [0],
      history: 0,
      currentItem: 0,
      enableCrossAction: false,
      isUserWorkUploadModalVisible: false,
      phase: 3,
      cameraImageIndex,
    }
  }

  static getCameraImageIndex(attachmentProps) {
    const { attachments = [] } = attachmentProps
    const lastUploadedFileNameExploded =
      last(attachments)?.name?.split('_') || []
    return last(lastUploadedFileNameExploded)
      ? parseInt(last(lastUploadedFileNameExploded), 10) + 1
      : 1
  }

  headerRef = React.createRef()

  containerRef = React.createRef()

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentItem !== prevState.currentItem) {
      const { attachments = [] } = nextProps
      const lastUploadedFileNameExploded =
        last(attachments)?.name?.split('_') || []
      const cameraImageIndex = last(lastUploadedFileNameExploded)
        ? parseInt(last(lastUploadedFileNameExploded), 10) + 1
        : 1

      return {
        cameraImageIndex,
        enableCrossAction: false,
        currentItem: nextProps.currentItem,
        testItemState: '', // coming from a different question, reset to clear view
      }
    }
    return null
  }

  toggleToolsOpenStatus = (tool) => {
    let { toolsOpenStatus, enableCrossAction } = this.state
    const { hasDrawingResponse, playerSkinType } = this.props
    if (tool === 3 || tool === 5) {
      const index = toolsOpenStatus.indexOf(tool)
      if (index !== -1) {
        toolsOpenStatus.splice(index, 1)
      } else {
        toolsOpenStatus.push(tool)
      }
      if (toolsOpenStatus.includes(5)) {
        const { items, currentItem } = this.props
        if (!isUndefined(currentItem) && Array.isArray(items)) {
          if (
            !hasDrawingResponse &&
            showScratchpadInfoNotification(items[currentItem])
          ) {
            const config =
              playerSkinType === playerSkinValues.quester
                ? { bottom: '64px' }
                : {}
            notification({
              type: 'info',
              messageKey: 'scratchpadInfoMultipart',
              ...config,
            })
          }
        }
      }
    } else {
      toolsOpenStatus = [tool]
    }
    if (tool === 3) {
      enableCrossAction = !enableCrossAction
      this.setState({ toolsOpenStatus, enableCrossAction })
    } else {
      this.setState({ toolsOpenStatus })
    }
  }

  changeTabItemState = (value) => {
    const {
      checkAnswer,
      answerChecksUsedForItem,
      settings,
      groupId,
      playerSkinType,
    } = this.props
    const config =
      playerSkinType === playerSkinValues.quester ? { bottom: '64px' } : {}
    if (answerChecksUsedForItem >= settings.maxAnswerChecks)
      return notification({
        type: 'warn',
        messageKey: 'checkAnswerLimitExceededForItem',
        ...config,
      })
    checkAnswer(groupId)
    this.setState({ testItemState: value })
  }

  openExitPopup = () => {
    const {
      updateTestPlayer,
      closeTestPreviewModal,
      previewPlayer,
    } = this.props
    if (previewPlayer && closeTestPreviewModal) {
      return closeTestPreviewModal()
    }
    updateTestPlayer({ enableMagnifier: false })
    this.setState({ showExitPopup: true })
  }

  hideExitPopup = () => {
    this.setState({ showExitPopup: false })
  }

  finishTest = () => {
    const { history, saveCurrentAnswer } = this.props
    saveCurrentAnswer({ shouldClearUserWork: true, pausing: true })
    if (history?.location?.state?.playlistAssignmentFlow) {
      history.push(`/home/playlist/${history?.location?.state?.playlistId}`)
    } else if (history?.location?.state?.playlistRecommendationsFlow) {
      history.push(
        `/home/playlist/${history?.location?.state?.playlistId}/recommendations`
      )
    } else if (navigator.userAgent.includes('SEB')) {
      history.push('/student/seb-quit-confirm')
    } else {
      history.push('/home/assignments')
    }
  }

  // will dispatch user work to store on here for scratchpad, passage highlight, or cross answer
  // sourceId will be one of 'scratchpad', 'resourceId', and 'crossAction'
  saveUserWork = (sourceId) => (data) => {
    const { saveUserWork, items, currentItem, userWork, passage } = this.props
    this.setState(({ history }) => ({ history: history + 1 }))

    // resourceId(passage) will use passage._id
    // @see https://snapwiz.atlassian.net/browse/EV-14181
    let userWorkId = items[currentItem]?._id
    if (sourceId === 'resourceId') {
      userWorkId = passage._id
    }
    const scratchpadData = {}
    if (sourceId === 'scratchpad' && data.questionId) {
      const { questionId, userWorkData } = data
      // keep all other question data in scratchpad
      scratchpadData[sourceId] = {
        ...(userWork[sourceId] || {}),
        [questionId]: userWorkData,
      }
    } else {
      scratchpadData[sourceId] = data
    }

    saveUserWork({
      [userWorkId]: { ...(userWork || {}), ...scratchpadData },
    })
  }

  toggleUserWorkUploadModal = () =>
    this.setState(({ isUserWorkUploadModalVisible }) => ({
      isUserWorkUploadModalVisible: !isUserWorkUploadModalVisible,
    }))

  closeUserWorkUploadModal = () =>
    this.setState({ isUserWorkUploadModalVisible: false })

  saveUserWorkAttachments = (files) => {
    const { attachments } = this.props
    const newAttachments = files.map(({ name, type, size, source }) => ({
      name,
      type,
      size,
      source,
    }))
    this.saveUserWork('attachments')([
      ...(attachments || []),
      ...newAttachments,
    ])
    this.setState(({ cameraImageIndex }) => ({
      cameraImageIndex: cameraImageIndex + 1,
    }))
    this.closeUserWorkUploadModal()
  }

  handleChangePreview = () => {
    const { changePreview = () => {} } = this.props
    // change the player state to clear mode (attemptable mode)
    this.setState({ testItemState: '' }, () => changePreview(CLEAR))
  }

  render() {
    const {
      theme,
      t,
      items,
      LCBPreviewModal,
      currentItem,
      view: previewTab,
      settings,
      selectedTheme,
      previousQuestionActivities,
      zoomLevel,
      windowWidth,
      groupId,
      utaId,
      user,
      playerSkinType,
    } = this.props
    const { phase } = this.state

    const item = items[currentItem]
    if (!item) {
      return <div />
    }

    let themeToPass = theme[selectedTheme] || theme.default

    themeToPass = { ...themeToPass, ...assessmentPlayerTheme, playerSkinType }

    return (
      <ThemeProvider theme={themeToPass}>
        <Container>
          <PlayerHeader phase={phase} />
          <PlayerMainContentArea
            flashQuizPhase={phase}
            setPhase={(x) => this.setState({ phase: x })}
            user={user}
          />
        </Container>
      </ThemeProvider>
    )
  }
}

AssessmentPlayerFlashQuiz.propTypes = {
  theme: PropTypes.object,
  isLast: PropTypes.func.isRequired,
  isFirst: PropTypes.func.isRequired,
  moveToNext: PropTypes.func.isRequired,
  moveToPrev: PropTypes.func.isRequired,
  gotoQuestion: PropTypes.func.isRequired,
  currentItem: PropTypes.any.isRequired,
  items: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  evaluate: PropTypes.any.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  itemRows: PropTypes.any,
  view: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
}

AssessmentPlayerFlashQuiz.defaultProps = {
  theme: themes,
  itemRows: [],
}

const enhance = compose(
  withWindowSizes,
  withNamespaces('common'),
  connect(
    (state, ownProps) => ({
      user: get(state, 'user.user', {}),
      evaluation: state.evaluation,
      preview: state.view.preview,
      settings: state.test.settings,
      answerChecksUsedForItem: currentItemAnswerChecksSelector(state),
      zoomLevel: state.ui.zoomLevel,
      selectedTheme: state.ui.selectedTheme,
      unansweredQuestionCount: unansweredQuestionCountSelector(state),
      userAnswers: state.answers,
      isBookmarked: !!get(
        state,
        ['assessmentBookmarks', ownProps?.items[ownProps?.currentItem]?._id],
        false
      ),
      scratchPad: get(
        state,
        `userWork.present[${
          ownProps?.items[ownProps?.currentItem]?._id
        }].scratchpad`,
        null
      ),
      highlights: get(
        state,
        `userWork.present[${ownProps?.passage?._id}].resourceId`,
        null
      ),
      attachments: get(
        state,
        `userWork.present[${
          ownProps?.items[ownProps?.currentItem]?._id
        }].attachments`,
        null
      ),
      crossAction: get(
        state,
        `userWork.present[${
          ownProps?.items[ownProps?.currentItem]?._id
        }].crossAction`,
        null
      ),
      userWork: get(
        state,
        `userWork.present[${ownProps?.items[ownProps?.currentItem]?._id}]`,
        {}
      ),
      previousQuestionActivities: get(state, 'previousQuestionActivity', {}),
      bookmarksInOrder: bookmarksByIndexSelector(state),
      skippedInOrder: getSkippedAnswerSelector(state),
      timedAssignment: state.test?.settings?.timedAssignment,
      currentAssignmentTime: state.test?.currentAssignmentTime,
      stopTimerFlag: state.test?.stopTimerFlag,
    }),
    {
      checkAnswer: checkAnswerEvaluation,
      toggleBookmark: toggleBookmarkAction,
      saveUserWork: saveUserWorkAction,
      changePreview: changePreviewAction,
      setUserAnswer: setUserAnswerAction,
      updateTestPlayer: updateTestPlayerAction,
      showHints: showHintsAction,
    }
  )
)
export default enhance(AssessmentPlayerFlashQuiz)
