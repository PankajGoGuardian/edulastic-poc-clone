import PropTypes from "prop-types";
import React from "react";
import { findIndex, get } from "lodash";
import { connect } from "react-redux";
import { ThemeProvider } from "styled-components";
import { withNamespaces } from "@edulastic/localization";

// actions
import { checkAnswerEvaluation } from "../../actions/checkanswer";
import { setTestUserWorkAction, saveTestletStateAction, saveTestletLogAction } from "../../actions/testUserWork";
import { setUserAnswerAction } from "../../actions/answers";

// components
import { Container, CalculatorContainer } from "../common";
import PlayerContent from "./PlayerContent";
import SubmitConfirmation from "../common/SubmitConfirmation";

// player theme
import { themes } from "../../../theme";

class AssessmentPlayerTestlet extends React.Component {
  static propTypes = {
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
    itemRows: PropTypes.any
  };

  static defaultProps = {
    theme: themes,
    itemRows: []
  };

  state = {
    showExitPopup: false,
    currentTool: 0
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

  changeTool = tool => {
    this.setState({ currentTool: tool });
  };

  submitAnswer = (uuid, timeSpent, groupId) => {
    const { items, saveUserAnswer } = this.props;
    const currentItemIndex = findIndex(items, item =>
      get(item, "data.questions", [])
        .map(q => q.id)
        .includes(uuid)
    );
    saveUserAnswer(currentItemIndex, timeSpent, false, groupId);
  };

  saveTestletLog = log => {
    const { saveTestletLog, LCBPreviewModal } = this.props;
    if (!LCBPreviewModal) {
      saveTestletLog(log);
    }
  };

  render() {
    const { theme, items, currentItem, selectedTheme = "default", settings } = this.props;
    const { showExitPopup, currentTool } = this.state;
    const item = items[currentItem];
    if (!item) {
      return <div />;
    }

    const themeToPass = theme[selectedTheme] || theme.default;

    // themeToPass = getZoomedTheme(themeToPass, zoomLevel);
    // themeToPass = playersZoomTheme(themeToPass);
    const { calcProvider, calcType } = settings;
    const calculateMode = calcProvider && calcType !== "NONE" ? `${calcType}_${calcProvider}` : false;
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
          />
          <SubmitConfirmation
            settings={settings}
            isVisible={showExitPopup}
            onClose={this.hideExitPopup}
            finishTest={this.finishTest}
          />
          {currentTool === 1 && (
            <CalculatorContainer
              changeTool={this.changeTool}
              calculateMode={calculateMode}
              style={{ zIndex: 10, height: "100%", width: "100%", left: 0 }}
            />
          )}
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
    settings: state.test.settings,
    zoomLevel: state.ui.zoomLevel,
    selectedTheme: state.ui.selectedTheme
  }),
  {
    checkAnswer: checkAnswerEvaluation,
    setUserAnswer: setUserAnswerAction,
    setTestUserWork: setTestUserWorkAction, // save to redux
    saveTestletState: saveTestletStateAction, // save to db,
    saveTestletLog: saveTestletLogAction // save logs to db
  }
)(withNamespaces("common")(AssessmentPlayerTestlet));
