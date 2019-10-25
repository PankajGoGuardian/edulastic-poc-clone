import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { ActionCreators } from "redux-undo";
import { get } from "lodash";
import { ThemeProvider } from "styled-components";
import { withNamespaces } from "@edulastic/localization";
import { hexToRGB } from "@edulastic/common";

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
    currentColor: "#ff0000",
    fillColor: "#ff0000",
    activeMode: "",
    lineWidth: 6,
    deleteMode: false,
    showExitPopup: false,
    showHints: false,
    testItemState: "",
    toolsOpenStatus: {
      Pointer: false,
      Ruler: false,
      Calculator: false,
      CrossButton: false,
      Protactor: false,
      ScratchPad: false
    },
    history: [{ points: [], pathes: [], figures: [], texts: [] }]
  };

  toggleToolsOpenStatus = (tool, state = "no state") => {
    this.setState(prevState => {
      return {
        toolsOpenStatus: {
          ...prevState.toolsOpenStatus,
          [tool]: state === "no state" ? !prevState.toolsOpenStatus[tool] : state
        }
      };
    });
  };
  changeTabItemState = value => {
    const { checkAnswer, answerChecksUsedForItem, settings, groupId } = this.props;
    if (answerChecksUsedForItem >= settings.maxAnswerChecks) return;
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

  componentDidUpdate(previousProps) {
    if (this.props.currentItem !== previousProps.currentItem) {
      this.setState({ showHints: false, testItemState: "" });
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
      zoomLevel,
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
      lineWidth
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
    const scratchPadMode = toolsOpenStatus.ScratchPad;
    return (
      <ThemeProvider theme={themeToPass}>
        <Container>
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
