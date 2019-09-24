/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { ThemeProvider } from "styled-components";
import { withNamespaces } from "@edulastic/localization";
import { WithResources } from "@edulastic/common";

// actions
import { checkAnswerEvaluation } from "../../actions/checkanswer";
import { currentItemAnswerChecksSelector } from "../../selectors/test";
// components
import { Container } from "../common";
import PlayerContent from "./PlayerContent";
import SubmitConfirmation from "../common/SubmitConfirmation";

import { playersTheme } from "../assessmentPlayersTheme";
import assessmentPlayerTheme from "./themeStyle";

const Theme = {
  ...playersTheme,
  ...assessmentPlayerTheme
};

class AssessmentPlayerTestlet extends React.Component {
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
    view: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    itemRows: PropTypes.any
  };

  static defaultProps = {
    theme: Theme,
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
    const { theme, items, currentItem } = this.props;
    const { showExitPopup } = this.state;

    const item = items[currentItem];
    if (!item) {
      return <div />;
    }
    return (
      <WithResources
        resources={[
          "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",
          "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.7.2/js/all.min.js"
        ]}
        fallBack={<span />}
      >
        <ThemeProvider theme={theme}>
          <Container>
            <PlayerContent {...this.props} openExitPopup={this.openExitPopup} />
            <SubmitConfirmation isVisible={showExitPopup} onClose={this.hideExitPopup} finishTest={this.finishTest} />
          </Container>
        </ThemeProvider>
      </WithResources>
    );
  }
}

export default connect(
  state => ({
    evaluation: state.evaluation,
    preview: state.view.preview,
    questions: state.assessmentplayerQuestions.byId,
    settings: state.test.settings,
    answerChecksUsedForItem: currentItemAnswerChecksSelector(state)
  }),
  {
    checkAnswer: checkAnswerEvaluation
  }
)(withNamespaces("common")(AssessmentPlayerTestlet));
