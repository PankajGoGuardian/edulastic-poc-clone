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

// components
import {
  Container,
  CalculatorContainer,
  getDefaultCalculatorProvider,
} from '../common'
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

  submitAnswer = (uuid, timeSpent, groupId, extData) => {
    const { items, saveUserAnswer } = this.props
    const currentItemIndex = findIndex(items, (item) =>
      get(item, 'data.questions', [])
        .map((q) => q.id)
        .includes(uuid)
    )
    saveUserAnswer(currentItemIndex, timeSpent, false, groupId, extData)
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
    const { calcProvider, calcType } = settings
    const calculateMode =
      calcProvider && calcType !== 'NONE'
        ? `${calcType}_${
            calcProvider || getDefaultCalculatorProvider(calcType)
          }`
        : false

    return (
      <ThemeProvider theme={themeToPass}>
        <Container scratchPadMode={currentTool}>
          <PlayerContent
            {...this.props}
            currentTool={currentTool}
            openExitPopup={this.openExitPopup}
            changeTool={this.changeTool}
            calculateMode={calculateMode}
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
              calculateMode={calculateMode}
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
  }
)(withNamespaces('common')(AssessmentPlayerTestlet))
