/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { ActionCreators } from "redux-undo";
import { get } from "lodash";
import { message } from "antd";
import { ThemeProvider } from "styled-components";
import { withNamespaces } from "@edulastic/localization";
import { hexToRGB } from "@edulastic/common";

// actions
import { checkAnswerEvaluation } from "../../actions/checkanswer";
import { currentItemAnswerChecksSelector } from "../../selectors/test";
// components

import { Container, CalculatorContainer } from "../common";
import PlayerHeader from "./PlayerHeader";
import PlayerMainContentArea from "./PlayerMainContentArea";

import SubmitConfirmation from "../common/SubmitConfirmation";

import { themes } from "../../../theme";
import assessmentPlayerTheme from "./themeStyle";
import { unansweredQuestionCountSelector } from "../../../student/TestAttemptReview/ducks";
import { toggleBookmarkAction } from "../../sharedDucks/bookmark";
import Tools from "../AssessmentPlayerDefault/Tools";
import SvgDraw from "../AssessmentPlayerDefault/SvgDraw";
import { saveUserWorkAction } from "../../actions/userWork";
import { changePreviewAction } from "../../../author/src/actions/view";

import { setUserAnswerAction } from "../../actions/answers";

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
    itemRows: PropTypes.any,
    view: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
  };

  static defaultProps = {
    theme: themes,
    itemRows: []
  };

  state = {
    currentColor: "#ff0000",
    fillColor: "#ff0000",
    activeMode: "",
    lineWidth: 6,
    deleteMode: false,
    showExitPopup: false,
    showHints: false,
    testItemState: "",
    toolsOpenStatus: [0],
    history: 0,
    calcBrand: "EDULASTIC"
  };

  toggleToolsOpenStatus = tool => {
    let { toolsOpenStatus, enableCrossAction } = this.state;
    if (tool === 3 || tool === 5) {
      const index = toolsOpenStatus.indexOf(tool);
      if (index !== -1) {
        toolsOpenStatus.splice(index, 1);
      } else {
        toolsOpenStatus.push(tool);
      }
      toolsOpenStatus = toolsOpenStatus.filter(m => m === 3 || m === 5);
    } else {
      toolsOpenStatus = [tool];
    }
    if (tool === 3) {
      enableCrossAction = !enableCrossAction;
      this.setState({ toolsOpenStatus, enableCrossAction });
    } else {
      this.setState({ toolsOpenStatus });
    }
  };

  changeTabItemState = value => {
    const { checkAnswer, answerChecksUsedForItem, settings, groupId } = this.props;
    if (answerChecksUsedForItem >= settings.maxAnswerChecks)
      return message.warn("Check answer limit exceeded for the item.");
    checkAnswer(groupId);
    this.setState({ testItemState: value });
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

  showHideHints = () => {
    this.setState(prevState => ({
      showHints: !prevState.showHints
    }));
  };

  // if scratchpad data is present on mount, then open scratchpad
  componentDidMount() {
    const { scratchPad } = this.props;
    if (scratchPad) {
      this.setState({
        toolsOpenStatus: [5]
      });
    }
  }

  componentDidUpdate(previousProps) {
    const { currentItem, scratchPad } = this.props;
    if (currentItem !== previousProps.currentItem) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ showHints: false, testItemState: "" });
      // if scratchpad data is present while navigating to next question
      // open scratchpad
      if (scratchPad) {
        this.setState({
          toolsOpenStatus: [5]
        });
      }
    }
  }

  onFillColorChange = obj => {
    this.setState({
      fillColor: hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100)
    });
  };

  handleToolChange = value => () => {
    const { activeMode } = this.state;

    if (value === "deleteMode") {
      this.setState(prevState => ({ deleteMode: !prevState.deleteMode }));
    } else if (activeMode === value) {
      this.setState({ activeMode: "" });
    } else {
      this.setState({ activeMode: value, deleteMode: false });
    }
  };

  handleUndo = () => {
    const { undoScratchPad } = this.props;
    const { history } = this.state;
    console.log(history);
    if (history > 0) {
      this.setState(
        state => ({ history: state.history - 1 }),
        () => {
          undoScratchPad();
        }
      );
    }
  };

  handleRedo = () => {
    const { redoScratchPad } = this.props;

    this.setState(
      state => ({ history: state.history + 1 }),
      () => {
        redoScratchPad();
      }
    );
  };

  handleColorChange = obj => {
    this.setState({
      currentColor: hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100)
    });
  };

  // will dispatch user work to store on here for scratchpad, passage highlight, or cross answer
  // sourceId will be one of 'scratchpad', 'resourceId', and 'crossAction'
  saveHistory = sourceId => data => {
    const { saveUserWork, items, currentItem, setUserAnswer, userAnswers, userWork } = this.props;
    this.setState(({ history }) => ({ history: history + 1 }));

    saveUserWork({
      [items[currentItem]._id]: { ...userWork, [sourceId]: data }
    });
    const qId = items[currentItem].data.questions[0].id;
    if (!userAnswers[qId]) {
      setUserAnswer(qId, []);
    }
  };

  render() {
    const {
      theme,
      t,
      items,
      currentItem,
      view: previewTab,
      settings,
      selectedTheme,
      unansweredQuestionCount,
      previewPlayer,
      scratchPad
    } = this.props;
    const {
      showExitPopup,
      showHints,
      testItemState,
      toolsOpenStatus,
      fillColor,
      deleteMode,
      currentColor,
      activeMode,
      lineWidth,
      enableCrossAction
    } = this.state;

    const dropdownOptions = Array.isArray(items) ? items.map((item, index) => index) : [];

    const item = items[currentItem];
    if (!item) {
      return <div />;
    }

    let themeToPass = theme[selectedTheme] || theme.default;

    themeToPass = { ...themeToPass, ...assessmentPlayerTheme };
    // themeToPass = getZoomedTheme(themeToPass, zoomLevel);
    // themeToPass = playersZoomTheme(themeToPass);
    const scratchPadMode = toolsOpenStatus.indexOf(5) !== -1;
    return (
      <ThemeProvider theme={themeToPass}>
        <Container scratchPadMode={scratchPadMode}>
          {scratchPadMode && !previewPlayer && (
            <Tools
              onFillColorChange={this.onFillColorChange}
              fillColor={fillColor}
              deleteMode={deleteMode}
              currentColor={currentColor}
              onToolChange={this.handleToolChange}
              activeMode={activeMode}
              undo={this.handleUndo}
              redo={this.handleRedo}
              onColorChange={this.handleColorChange}
            />
          )}
          <SvgDraw
            activeMode={activeMode}
            scratchPadMode={scratchPadMode}
            lineColor={currentColor}
            deleteMode={deleteMode}
            lineWidth={lineWidth}
            fillColor={fillColor}
            saveHistory={this.saveHistory("scratchpad")}
            history={scratchPad}
          />
          <PlayerHeader
            {...this.props}
            theme={themeToPass}
            dropdownOptions={dropdownOptions}
            onOpenExitPopup={this.openExitPopup}
            onshowHideHints={this.showHideHints}
            checkAnswer={() => this.changeTabItemState("check")}
            toggleToolsOpenStatus={this.toggleToolsOpenStatus}
            toolsOpenStatus={toolsOpenStatus}
            t={t}
          />
          {this.state.toolsOpenStatus.indexOf(2) !== -1 && settings?.calcType ? (
            <CalculatorContainer calculateMode={`${settings.calcType}_${settings.calcProvider}`} />
          ) : null}
          <PlayerMainContentArea
            {...this.props}
            theme={themeToPass}
            previewTab={previewTab}
            dropdownOptions={dropdownOptions}
            items={items}
            showHints={showHints}
            settings={settings}
            testItemState={testItemState}
            t={t}
            enableCrossAction={enableCrossAction}
            unansweredQuestionCount={unansweredQuestionCount}
          />
          <SubmitConfirmation isVisible={showExitPopup} onClose={this.hideExitPopup} finishTest={this.finishTest} />
        </Container>
      </ThemeProvider>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    evaluation: state.evaluation,
    preview: state.view.preview,
    questions: state.assessmentplayerQuestions.byId,
    settings: state.test.settings,
    answerChecksUsedForItem: currentItemAnswerChecksSelector(state),
    zoomLevel: state.ui.zoomLevel,
    selectedTheme: state.ui.selectedTheme,
    unansweredQuestionCount: unansweredQuestionCountSelector(state),
    userAnswers: state.answers,
    isBookmarked: !!get(state, ["assessmentBookmarks", ownProps.items[ownProps.currentItem]._id], false),
    scratchPad: get(state, `userWork.present[${ownProps.items[ownProps.currentItem]._id}].scratchpad`, null),
    highlights: get(state, `userWork.present[${ownProps.items[ownProps.currentItem]._id}].resourceId`, null),
    crossAction: get(state, `userWork.present[${ownProps.items[ownProps.currentItem]._id}].crossAction`, null),
    userWork: get(state, `userWork.present[${ownProps.items[ownProps.currentItem]._id}]`, {})
  }),
  {
    checkAnswer: checkAnswerEvaluation,
    toggleBookmark: toggleBookmarkAction,
    saveUserWork: saveUserWorkAction,
    changePreview: changePreviewAction,
    undoScratchPad: ActionCreators.undo,
    redoScratchPad: ActionCreators.redo,
    setUserAnswer: setUserAnswerAction
  }
)(withNamespaces("common")(AssessmentPlayerSimple));
