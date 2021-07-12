/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types'
import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { ThemeProvider } from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import { withWindowSizes } from '@edulastic/common'

// actions
import { checkAnswerEvaluation } from '../../actions/checkanswer'
import { currentItemAnswerChecksSelector } from '../../selectors/test'
// components

import { Container } from '../common'
import PlayerMainContentArea from './PlayerMainContentArea'

import PlayerHeader from './PlayerHeader'
import { themes } from '../../../theme'
import assessmentPlayerTheme from './themeStyle.json'
import { saveUserWorkAction } from '../../actions/userWork'

import { setUserAnswerAction } from '../../actions/answers'
import moment from 'moment'

const getTime = (millis) => {
  if (!millis) return 0
  var tempTime = moment.duration(millis)
  return tempTime.minutes()
}

class AssessmentPlayerFlashQuiz extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showExitPopup: false,
      testItemState: '',
      toolsOpenStatus: [0],
      history: 0,
      currentItem: 0,
      enableCrossAction: false,
      isUserWorkUploadModalVisible: false,
      phase: -1,
      learningTime: 0,
      assessementTime: 0,
    }
  }

  componentDidMount() {
    localStorage.setItem('lastTimeStampFlipQuiz', Date.now())
  }

  componentDidUpdate() {
    if (
      Object.keys(this.props.questions || {}).length &&
      this.state.phase === -1
    ) {
      if (this?.props?.testPhase === 'assignment') {
        this.setState({ phase: 2 })
      } else if (this?.props?.testPhase === 'report') {
        this.setState({ phase: 3 })
      } else {
        this.setState({ phase: 1 })
      }
    }
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

  render() {
    const {
      theme,
      items,
      finishTest,
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
      saveUserAnswer,
      setUserAnswer,
      title,
      answers,
      learningTime,
      assessementTime,
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
            questions={item?.data?.questions}
            testActivityId={utaId}
            groupId={groupId}
            zoomLevel={zoomLevel}
            windowWidth={windowWidth}
            previousQuestionActivities={previousQuestionActivities}
            settings={settings}
            setUserAnswer={setUserAnswer}
            itemId={item?._id}
            saveUserResponse={saveUserAnswer}
            title={title}
            finishTest={finishTest}
            answers={answers}
            learningTime={getTime(learningTime || this.state.learningTime)}
            setLearningTime={(x) => this.setState({ learningTime: x })}
            assessementTime={getTime(
              assessementTime || this.state.assessementTime
            )}
            setAssessementTime={(x) => this.setState({ assessementTime: x })}
          />
        </Container>
      </ThemeProvider>
    )
  }
}

AssessmentPlayerFlashQuiz.propTypes = {
  theme: PropTypes.object,
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
    (state) => ({
      user: get(state, 'user.user', {}),
      evaluation: state.evaluation,
      preview: state.view.preview,
      settings: state.test.settings,
      answerChecksUsedForItem: currentItemAnswerChecksSelector(state),
      zoomLevel: state.ui.zoomLevel,
      selectedTheme: state.ui.selectedTheme,
      previousQuestionActivities: get(state, 'previousQuestionActivity', {}),
    }),
    {
      checkAnswer: checkAnswerEvaluation,
      saveUserWork: saveUserWorkAction,
      setUserAnswer: setUserAnswerAction,
    }
  )
)
export default enhance(AssessmentPlayerFlashQuiz)
