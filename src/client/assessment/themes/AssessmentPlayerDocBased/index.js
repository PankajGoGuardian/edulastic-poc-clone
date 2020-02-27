/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { ThemeProvider } from "styled-components";
import { isEmpty, sortBy } from "lodash";

import { withNamespaces } from "@edulastic/localization";

import { questionType } from "@edulastic/constants";
import { withWindowSizes } from "@edulastic/common";
import { Container, CalculatorContainer } from "../common";
import SubmitConfirmation from "../common/SubmitConfirmation";
import PlayerHeader from "./PlayerHeader";
import { themes } from "../../../theme";
import assessmentPlayerTheme from "../AssessmentPlayerSimple/themeStyle";
import WorksheetComponent from "../../../author/AssessmentPage/components/Worksheet/Worksheet";
import { changeViewAction } from "../../../author/src/actions/view";
import { testLoadingSelector } from "../../selectors/test";
import AssessmentPlayerSkinWrapper from "../AssessmentPlayerSkinWrapper";

const calcBrands = ["DESMOS", "GEOGEBRASCIENTIFIC", "EDULASTIC"];

class AssessmentPlayerDocBased extends React.Component {
  static propTypes = {
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
    gotoSummary: PropTypes.func.isRequired
  };

  static defaultProps = {
    docUrl: "",
    annotations: [],
    theme: themes
  };

  state = {
    showExitPopup: false,
    currentToolMode: {
      calculator: false
    }
  };

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      calculateMode: `${props?.settings?.calcType}_${props?.settings?.calcProvider}`
    };
  }

  componentDidMount() {
    const { changeView } = this.props;
    changeView("review");
  }

  openExitPopup = () => {
    const { closeTestPreviewModal, previewPlayer } = this.props;
    if (previewPlayer && closeTestPreviewModal) {
      return closeTestPreviewModal();
    }
    this.setState({ showExitPopup: true });
  };

  hideExitPopup = () => {
    this.setState({ showExitPopup: false });
  };

  finishTest = () => {
    const { history, saveCurrentAnswer } = this.props;
    saveCurrentAnswer();
    history.push("/home/assignments");
  };

  handlePause = () => {
    this.handleSaveProgress();
    this.finishTest();
  };

  handleSaveProgress = () => {
    const { saveProgress } = this.props;
    saveProgress();
  };

  assessmentQuestions() {
    const { items } = this.props;
    const itemData = items[0].data;
    if (isEmpty(itemData)) return;
    const questionsWithSections = itemData.questions.concat(itemData.resources);
    return sortBy(questionsWithSections, item => item.qIndex);
  }

  onChangeTool = toolType => {
    // set all tools to false if only one tool can be active at a time
    this.setState(prevState => {
      const { currentToolMode } = prevState;
      const _currentToolMode = { ...currentToolMode };
      _currentToolMode[toolType] = !_currentToolMode[toolType];
      return {
        currentToolMode: _currentToolMode
      };
    });
  };

  render() {
    const { showExitPopup, calculateMode, currentToolMode } = this.state;
    const {
      theme,
      items,
      t,
      docUrl,
      annotations,
      questionsById,
      answers,
      answersById,
      loading,
      pageStructure = [],
      freeFormNotes,
      gotoSummary,
      selectedTheme,
      previewPlayer,
      settings,
      playerSkinType
    } = this.props;

    const item = items[0];
    const dropdownOptions = item.data.questions
      .filter(q => q.type !== questionType.SECTION_LABEL)
      .map((_, index) => index);
    const currentItem = answers.filter(answer => !isEmpty(answer)).length - 1;
    const questions = this.assessmentQuestions();

    let themeToPass = theme[selectedTheme] || theme.default;

    themeToPass = { ...themeToPass, ...assessmentPlayerTheme };
    const extraPaddingTop = playerSkinType === "parcc" ? 35 : 0;

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
          >
            {!loading && (
            <WorksheetComponent
              docUrl={docUrl}
              isAssessmentPlayer
              item={item}
              annotations={annotations}
              questions={questions}
              freeFormNotes={freeFormNotes}
              questionsById={questionsById}
              pageStructure={pageStructure}
              answersById={answersById}
              viewMode="review"
              noCheck
              testMode
              extraPaddingTop={extraPaddingTop}
            />
          )}
            <SubmitConfirmation isVisible={showExitPopup} onClose={this.hideExitPopup} finishTest={this.finishTest} />
            {currentToolMode.calculator ? (
              <CalculatorContainer
                changeTool={() => this.onChangeTool("calculator")}
                calculateMode={calculateMode}
                calcBrands={calcBrands}
              />
          ) : null}
          </AssessmentPlayerSkinWrapper>
        </Container>
      </ThemeProvider>
    );
  }
}

const enhance = compose(
  withWindowSizes,
  withNamespaces("common"),
  connect(
    state => ({
      loading: testLoadingSelector(state),
      selectedTheme: state.ui.selectedTheme,
      settings: state.test.settings
    }),
    {
      changeView: changeViewAction
    }
  )
);

export default enhance(AssessmentPlayerDocBased);
