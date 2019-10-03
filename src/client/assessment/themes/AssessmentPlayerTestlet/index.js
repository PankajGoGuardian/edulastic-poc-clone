/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { ThemeProvider } from "styled-components";
import { withNamespaces } from "@edulastic/localization";

// actions
import { checkAnswerEvaluation } from "../../actions/checkanswer";
import { setTestUserWorkAction, saveTestletStateAction } from "../../actions/testUserWork";
import { setUserAnswerAction } from "../../actions/answers";

// components
import { Container } from "../common";
import PlayerContent from "./PlayerContent";
import SubmitConfirmation from "../common/SubmitConfirmation";

import assessmentPlayerTheme from "./themeStyle";

const Theme = {
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

  openExitPopup = () => {
    const { closeTestPreviewModal } = this.props;
    this.setState({ showExitPopup: true }, () => {
      if (closeTestPreviewModal) {
        closeTestPreviewModal();
      }
    });
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
      <ThemeProvider theme={theme}>
        <Container>
          <PlayerContent {...this.props} openExitPopup={this.openExitPopup} />
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
    testActivityId: state.test ? state.test.testActivityId : "",
    questions: state.assessmentplayerQuestions.byId,
    settings: state.test.settings
  }),
  {
    checkAnswer: checkAnswerEvaluation,
    setUserAnswer: setUserAnswerAction,
    setTestUserWork: setTestUserWorkAction, // save to redux
    saveTestletState: saveTestletStateAction // save to db
  }
)(withNamespaces("common")(AssessmentPlayerTestlet));
