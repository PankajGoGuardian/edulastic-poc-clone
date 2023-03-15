import PropTypes from 'prop-types'
import React from 'react'
import { findIndex, get } from 'lodash'
import { connect } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { withNamespaces } from '@edulastic/localization'

// actions
import { checkAnswerEvaluation } from '../../actions/checkanswer'
import {
  setTestUserWorkAction,
  saveTestletStateAction,
  saveTestletLogAction,
} from '../../actions/testUserWork'
import { setUserAnswerAction } from '../../actions/answers'
import { updateTestPlayerAction } from '../../../author/sharedDucks/testPlayer'
import { finishTestAcitivityAction } from '../../actions/test'
import { saveTestletUserResponse } from '../../actions/items'

// components
import { Container, CalculatorContainer } from '../common'
import PlayerContent from './PlayerContent'
import SubmitConfirmation from '../common/SubmitConfirmation'

// player theme
import { themes } from '../../../theme'

class AssessmentPlayerTestlet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showExitPopup: false,
      currentTool: 0,
    }
  }

  openExitPopup = () => {
    const { closeTestPreviewModal, updateTestPlayer, demo } = this.props
    updateTestPlayer({ enableMagnifier: false })
    this.setState({ showExitPopup: true }, () => {
      if (closeTestPreviewModal && !demo) {
        closeTestPreviewModal()
      }
    })
  }

  hideExitPopup = () => {
    this.setState({ showExitPopup: false })
  }

  finishTest = () => {
    const { history } = this.props
    if (navigator.userAgent.includes('SEB')) {
      history.push('/student/seb-quit-confirm')
    } else {
      history.push('/home/assignments')
    }
  }

  changeTool = (tool) => {
    this.setState({ currentTool: tool })
  }

  getCurrentItemIndex = (uuid) => {
    const { items } = this.props
    const currentItemIndex = findIndex(items, (item) =>
      get(item, 'data.questions', [])
        .map((q) => q.id)
        .includes(uuid)
    )
    return currentItemIndex
  }

  submitAnswer = (uuid, timeSpent, groupId, extData) => {
    const { saveUserAnswer } = this.props
    const itemIndex = this.getCurrentItemIndex(uuid)
    saveUserAnswer(itemIndex, timeSpent, false, groupId, extData)
  }

  setUserAnswerToStore = (uuid, answers) => {
    const { items, setUserAnswer } = this.props
    const itemIndex = this.getCurrentItemIndex(uuid)
    if (items[itemIndex]) {
      setUserAnswer(items[itemIndex]._id, uuid, answers)
    }
  }

  saveTestletLog = (log) => {
    const { saveTestletLog, LCBPreviewModal } = this.props
    if (!LCBPreviewModal) {
      saveTestletLog(log)
    }
  }

  render() {
    const {
      theme,
      items,
      currentItem,
      selectedTheme = 'default',
      settings,
      testletConfig,
      timedAssignment = false,
      previewPlayer,
      demo,
    } = this.props
    const { showExitPopup, currentTool } = this.state
    const item = items[currentItem]
    if (!item) {
      return <div />
    }

    const themeToPass = theme[selectedTheme] || theme.default

    // themeToPass = getZoomedTheme(themeToPass, zoomLevel);
    // themeToPass = playersZoomTheme(themeToPass);

    return (
      <ThemeProvider theme={themeToPass}>
        <Container scratchPadMode={currentTool}>
          <PlayerContent
            {...this.props}
            currentTool={currentTool}
            setUserAnswer={this.setUserAnswerToStore}
            openExitPopup={this.openExitPopup}
            changeTool={this.changeTool}
            onSubmitAnswer={this.submitAnswer}
            saveTestletLog={this.saveTestletLog}
            timedAssignment={timedAssignment}
            testletConfig={testletConfig}
          />
          {(!previewPlayer || demo) && (
            <SubmitConfirmation
              settings={settings}
              isVisible={showExitPopup}
              onClose={this.hideExitPopup}
              finishTest={this.finishTest}
            />
          )}
          {currentTool === 1 && (
            <CalculatorContainer
              changeTool={this.changeTool}
              calcTypes={settings.calcTypes}
              calcProvider={settings.calcProvider}
            />
          )}
        </Container>
      </ThemeProvider>
    )
  }
}

AssessmentPlayerTestlet.propTypes = {
  theme: PropTypes.object,
  isLast: PropTypes.func.isRequired,
  isFirst: PropTypes.func.isRequired,
  moveToNext: PropTypes.func.isRequired,
  moveToPrev: PropTypes.func.isRequired,
  saveTestletLog: PropTypes.func.isRequired,
  gotoQuestion: PropTypes.func.isRequired,
  currentItem: PropTypes.any.isRequired,
  items: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  evaluate: PropTypes.any.isRequired,
  view: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  itemRows: PropTypes.any,
}

AssessmentPlayerTestlet.defaultProps = {
  theme: themes,
  itemRows: [],
}

export default connect(
  (state) => ({
    evaluation: state.evaluation,
    testActivityId: state.test ? state.test.testActivityId : '',
    settings: state.test.settings,
    zoomLevel: state.ui.zoomLevel,
    selectedTheme: state.ui.selectedTheme,
    timedAssignment: state.test?.settings?.timedAssignment,
    currentAssignmentTime: state.test?.currentAssignmentTime,
    savingResponse: state?.test?.savingResponse,
    stopTimerFlag: state.test?.stopTimerFlag,
  }),
  {
    checkAnswer: checkAnswerEvaluation,
    setUserAnswer: setUserAnswerAction,
    setTestUserWork: setTestUserWorkAction, // save to redux
    saveTestletState: saveTestletStateAction, // save to db,
    saveTestletLog: saveTestletLogAction, // save logs to db
    updateTestPlayer: updateTestPlayerAction,
    submitTest: finishTestAcitivityAction,
    saveUserAnswer: saveTestletUserResponse, // store user response to db,
  }
)(withNamespaces('common')(AssessmentPlayerTestlet))
