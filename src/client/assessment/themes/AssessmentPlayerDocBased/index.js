/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { isEmpty, sortBy, keyBy } from 'lodash'

import { withNamespaces } from '@edulastic/localization'

import { questionType } from '@edulastic/constants'
import { withWindowSizes, EduIf, EduThen, EduElse } from '@edulastic/common'
import { Container, CalculatorContainer } from '../common'
import SubmitConfirmation from '../common/SubmitConfirmation'
import { themes } from '../../../theme'
import assessmentPlayerTheme from '../AssessmentPlayerSimple/themeStyle.json'
import WorksheetComponent from '../../../author/AssessmentPage/components/Worksheet/Worksheet'
import VideoQuizWorksheet from '../../../author/AssessmentPage/VideoQuiz/VideoQuizWorksheet'
import { changeViewAction } from '../../../author/src/actions/view'
import { testLoadingSelector } from '../../selectors/test'
import AssessmentPlayerSkinWrapper from '../AssessmentPlayerSkinWrapper'
import { updateTestPlayerAction } from '../../../author/sharedDucks/testPlayer'

class AssessmentPlayerDocBased extends React.Component {
  static propTypes = {
    videoUrl: PropTypes.string,
    docUrl: PropTypes.string,
    annotations: PropTypes.array,
    theme: PropTypes.object,
    pageStructure: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    changeView: PropTypes.func.isRequired,
    questionsById: PropTypes.object.isRequired,
    answers: PropTypes.array.isRequired,
    saveProgress: PropTypes.func.isRequired,
    answersById: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    gotoSummary: PropTypes.func.isRequired,
  }

  static defaultProps = {
    videoUrl: undefined,
    docUrl: '',
    annotations: [],
    theme: themes,
  }

  state = {
    showExitPopup: false,
    currentToolMode: {
      calculator: false,
    },
    currentPage: 0,
  }

  componentDidMount() {
    const { changeView } = this.props
    changeView('review')
  }

  openExitPopup = () => {
    const {
      closeTestPreviewModal,
      previewPlayer,
      updateTestPlayer,
    } = this.props
    if (previewPlayer && closeTestPreviewModal) {
      return closeTestPreviewModal()
    }
    this.setState({ showExitPopup: true })
    updateTestPlayer({ enableMagnifier: false })
  }

  hideExitPopup = () => {
    this.setState({ showExitPopup: false })
  }

  finishTest = () => {
    const { history, saveCurrentAnswer } = this.props
    saveCurrentAnswer({ pausing: true })
    if (navigator.userAgent.includes('SEB')) {
      history.push('/student/seb-quit-confirm')
    } else {
      history.push('/home/assignments')
    }
  }

  handlePause = () => {
    this.handleSaveProgress()
    this.finishTest()
  }

  handleSaveProgress = () => {
    const { saveProgress } = this.props
    saveProgress()
  }

  assessmentQuestions() {
    const { items } = this.props
    const itemData = items?.[0]?.data
    if (isEmpty(itemData)) return
    const questionsWithSections = itemData.questions.concat(itemData.resources)
    return sortBy(questionsWithSections, (item) => item.qIndex)
  }

  onChangeTool = (toolType) => {
    // set all tools to false if only one tool can be active at a time
    this.setState((prevState) => {
      const { currentToolMode } = prevState
      const _currentToolMode = { ...currentToolMode }
      _currentToolMode[toolType] = !_currentToolMode[toolType]
      return {
        currentToolMode: _currentToolMode,
      }
    })
  }

  render() {
    const { showExitPopup, currentToolMode, currentPage } = this.state
    const {
      theme,
      items,
      t,
      videoUrl,
      docUrl,
      annotations,
      questionsById: _questionsById,
      answers,
      answersById,
      loading,
      pageStructure = [],
      freeFormNotes,
      gotoSummary,
      selectedTheme,
      previewPlayer,
      settings,
      playerSkinType,
      groupId,
      hidePause,
      userWork,
      utaId,
    } = this.props

    const questionsById = keyBy(Object.values(_questionsById), 'id')
    const item = items[0]
    const dropdownOptions = item?.data?.questions
      ?.filter((q) => q.type !== questionType.SECTION_LABEL)
      ?.map((_, index) => index)
    const currentItem = answers.filter((answer) => !isEmpty(answer)).length - 1
    const questions = this.assessmentQuestions()

    let themeToPass = theme[selectedTheme] || theme.default

    themeToPass = { ...themeToPass, ...assessmentPlayerTheme }
    const extraPaddingTop =
      playerSkinType === 'parcc' ? 35 : playerSkinType === 'sbac' ? 29 : 0

    const stdWork = (userWork?.[utaId]?.freeNotesStd || []).concat(
      userWork?.[item._id]?.freeNotesStd || []
    )

    return (
      <ThemeProvider theme={themeToPass}>
        <Container style={{ paddingTop: 70 + extraPaddingTop }}>
          <AssessmentPlayerSkinWrapper
            {...this.props}
            theme={themeToPass}
            dropdownOptions={dropdownOptions}
            onOpenExitPopup={this.openExitPopup}
            currentItem={currentItem}
            onPause={this.handlePause}
            onSaveProgress={this.handleSaveProgress}
            onSubmit={gotoSummary}
            showSubmit
            t={t}
            previewPlayer={previewPlayer}
            settings={settings}
            currentToolMode={currentToolMode}
            onChangeTool={this.onChangeTool}
            finishTest={this.openExitPopup}
            hidePause={hidePause}
            themeForHeader={{ ...theme.default, ...assessmentPlayerTheme }}
          >
            {!loading && (
              <EduIf condition={videoUrl?.length}>
                <EduThen>
                  <VideoQuizWorksheet
                    videoUrl={videoUrl}
                    docUrl={docUrl}
                    isAssessmentPlayer
                    item={item}
                    annotations={annotations}
                    stdAnnotations={stdWork}
                    questions={questions}
                    freeFormNotes={freeFormNotes}
                    questionsById={questionsById}
                    pageStructure={pageStructure}
                    answersById={answersById}
                    viewMode="review"
                    noCheck
                    testMode
                    extraPaddingTop={extraPaddingTop}
                    onPageChange={(cpage) =>
                      this.setState({ currentPage: cpage })
                    }
                    currentPage={currentPage}
                    groupId={groupId}
                    previewPlayer={previewPlayer}
                  />
                </EduThen>
                <EduElse>
                  <WorksheetComponent
                    docUrl={docUrl}
                    isAssessmentPlayer
                    item={item}
                    annotations={annotations}
                    stdAnnotations={stdWork}
                    questions={questions}
                    freeFormNotes={freeFormNotes}
                    questionsById={questionsById}
                    pageStructure={pageStructure}
                    answersById={answersById}
                    viewMode="review"
                    noCheck
                    testMode
                    extraPaddingTop={extraPaddingTop}
                    onPageChange={(cpage) =>
                      this.setState({ currentPage: cpage })
                    }
                    currentPage={currentPage}
                    groupId={groupId}
                    previewPlayer={previewPlayer}
                  />
                </EduElse>
              </EduIf>
            )}
            {!previewPlayer && (
              <SubmitConfirmation
                settings={settings}
                isVisible={showExitPopup}
                onClose={this.hideExitPopup}
                finishTest={this.finishTest}
              />
            )}
            {currentToolMode.calculator ? (
              <CalculatorContainer
                changeTool={() => this.onChangeTool('calculator')}
                calcTypes={settings.calcTypes}
                calcProvider={settings.calcProvider}
              />
            ) : null}
          </AssessmentPlayerSkinWrapper>
        </Container>
      </ThemeProvider>
    )
  }
}

const enhance = compose(
  withWindowSizes,
  withNamespaces('common'),
  connect(
    (state) => ({
      loading: testLoadingSelector(state),
      selectedTheme: state.ui.selectedTheme,
      settings: state.test.settings,
      timedAssignment: state.test?.settings?.timedAssignment,
    }),
    {
      changeView: changeViewAction,
      updateTestPlayer: updateTestPlayerAction,
    }
  )
)

export default enhance(AssessmentPlayerDocBased)
