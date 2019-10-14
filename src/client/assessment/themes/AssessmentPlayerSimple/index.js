import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { ThemeProvider } from "styled-components";
import { withNamespaces } from "@edulastic/localization";

// actions
import { checkAnswerEvaluation } from "../../actions/checkanswer";
import { currentItemAnswerChecksSelector } from "../../selectors/test";
// components

import { Container } from "../common";
import PlayerHeader from "./PlayerHeader";
import PlayerMainContentArea from "./PlayerMainContentArea";

import SubmitConfirmation from "../common/SubmitConfirmation";

import { themes } from "../../../theme";
import assessmentPlayerTheme from "./themeStyle";
import { getZoomedTheme } from "../../../student/zoomTheme";
import { playersZoomTheme } from "../assessmentPlayersTheme";
import { QuestionsLeftToAttemptSelector } from "../../../student/TestAttemptReview/ducks";

class AssessmentPlayerSimple extends React.Component {
  static propTypes = {
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
    itemRows: PropTypes.any.isRequired,
    view: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
  };

  static defaultProps = {
    theme: themes,
    itemRows: []
  };

  state = {
    showExitPopup: false
  };

  onCheckAnswer = () => {
    const { checkAnswer, settings, answerChecksUsedForItem } = this.props;
    if (settings.maxAnswerChecks > answerChecksUsedForItem) checkAnswer();
  };

  openExitPopup = () => {
    this.setState({ showExitPopup: true });
  };

  hideExitPopup = () => {
    this.setState({ showExitPopup: false });
  };

  finishTest = () => {
    const { history } = this.props;
    history.push("/home/assignments");
  };

  render() {
    const {
      theme,
      t,
      items,
      currentItem,
      view: previewTab,
      questions,
      answerChecksUsedForItem,
      settings,
      selectedTheme,
      zoomLevel,
      questionsLeftToAttemptCount
    } = this.props;
    const { showExitPopup } = this.state;
    const dropdownOptions = Array.isArray(items) ? items.map((item, index) => index) : [];

    const item = items[currentItem];
    if (!item) {
      return <div />;
    }

    let themeToPass = theme[selectedTheme] || theme.default;

    themeToPass = { ...themeToPass, ...assessmentPlayerTheme };
    themeToPass = getZoomedTheme(themeToPass, zoomLevel);
    themeToPass = playersZoomTheme(themeToPass);

    const newProps = { ...this.props, theme: themeToPass };

    return (
      <ThemeProvider theme={themeToPass}>
        <Container>
          <PlayerHeader {...newProps} dropdownOptions={dropdownOptions} onOpenExitPopup={this.openExitPopup} t={t} />
          <PlayerMainContentArea
            {...newProps}
            previewTab={previewTab}
            dropdownOptions={dropdownOptions}
            onCheckAnswer={this.onCheckAnswer}
            answerChecksUsedForItem={answerChecksUsedForItem}
            items={items}
            settings={settings}
            t={t}
            questionsLeftToAttemptCount={questionsLeftToAttemptCount}
          />
          <SubmitConfirmation isVisible={showExitPopup} onClose={this.hideExitPopup} finishTest={this.finishTest} />
        </Container>
      </ThemeProvider>
    );
  }
}

export default connect(
  state => ({
    evaluation: state.evaluation,
    preview: state.view.preview,
    questions: state.assessmentplayerQuestions.byId,
    settings: state.test.settings,
    answerChecksUsedForItem: currentItemAnswerChecksSelector(state),
    zoomLevel: state.ui.zoomLevel,
    selectedTheme: state.ui.selectedTheme,
    questionsLeftToAttemptCount: QuestionsLeftToAttemptSelector(state)
  }),
  {
    checkAnswer: checkAnswerEvaluation
  }
)(withNamespaces("common")(AssessmentPlayerSimple));
