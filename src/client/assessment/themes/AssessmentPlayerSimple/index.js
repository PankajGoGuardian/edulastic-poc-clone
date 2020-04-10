/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "redux-undo";
import { get } from "lodash";
import { message } from "antd";
import { ThemeProvider } from "styled-components";
import { withNamespaces } from "@edulastic/localization";
import { hexToRGB, withWindowSizes } from "@edulastic/common";

// actions
import { checkAnswerEvaluation } from "../../actions/checkanswer";
import { currentItemAnswerChecksSelector } from "../../selectors/test";
// components

import { Container, CalculatorContainer } from "../common";
import PlayerMainContentArea from "./PlayerMainContentArea";

import SubmitConfirmation from "../common/SubmitConfirmation";
import { themes } from "../../../theme";
import assessmentPlayerTheme from "./themeStyle";
import { unansweredQuestionCountSelector } from "../../../student/TestAttemptReview/ducks";
import { toggleBookmarkAction, bookmarksByIndexSelector } from "../../sharedDucks/bookmark";
import { getSkippedAnswerSelector } from "../../selectors/answers";
import Tools from "../AssessmentPlayerDefault/Tools";
import { saveUserWorkAction } from "../../actions/userWork";
import { changePreviewAction } from "../../../author/src/actions/view";

import { setUserAnswerAction } from "../../actions/answers";
import AssessmentPlayerSkinWrapper from "../AssessmentPlayerSkinWrapper";

import { updateScratchpadAction } from "../../../common/ducks/scratchpad";
import { updateTestPlayerAction } from "../../../author/sharedDucks/testPlayer";
import { showHintsAction } from "../../actions/userInteractions";
import { CLEAR } from "../../constants/constantsForQuestions";

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
    showExitPopup: false,
    testItemState: "",
    toolsOpenStatus: [0],
    history: 0,
    currentItem: 0,
    enableCrossAction: false
  };

  headerRef = React.createRef();

  containerRef = React.createRef();

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentItem !== prevState.currentItem) {
      return {
        enableCrossAction: false,
        currentItem: nextProps.currentItem,
        testItemState: "" // coming from a different question, reset to clear view
      };
    }
    return null;
  }

  toggleToolsOpenStatus = tool => {
    let { toolsOpenStatus, enableCrossAction } = this.state;
    if (tool === 3 || tool === 5) {
      const index = toolsOpenStatus.indexOf(tool);
      if (index !== -1) {
        toolsOpenStatus.splice(index, 1);
      } else {
        toolsOpenStatus.push(tool);
      }
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
    const { updateTestPlayer } = this.props;
    updateTestPlayer({ enableMagnifier: false });
    this.setState({ showExitPopup: true });
  };

  hideExitPopup = () => {
    this.setState({ showExitPopup: false });
  };

  finishTest = () => {
    const { history, saveCurrentAnswer } = this.props;
    saveCurrentAnswer({ shouldClearUserWork: true, pausing: true });
    if (history?.location?.state?.playlistAssignmentFlow) {
      history.push(`/home/playlist/${history?.location?.state?.playlistId}`);
    } else if (history?.location?.state?.playlistRecommendationsFlow) {
      history.push(`/home/playlist/${history?.location?.state?.playlistId}/recommendations`);
    } else if (navigator.userAgent.includes("SEB")) {
      history.push("/student/seb-quit-confirm");
    } else {
      history.push("/home/assignments");
    }
  };

  // if scratchpad data is present on mount, then open scratchpad
  componentDidMount() {
    const { scratchPad, updateScratchpad } = this.props;
    if (scratchPad) {
      updateScratchpad({
        toolsOpenStatus: [5],
        activeMode: ""
      });
    }
  }

  componentDidUpdate(previousProps) {
    const { currentItem, scratchPad, updateScratchpad } = this.props;
    if (currentItem !== previousProps.currentItem) {
      const toolsOpenStatus = scratchPad ? [5] : [];
      updateScratchpad({ toolsOpenStatus, activeMode: "" });
    }
  }

  onFillColorChange = obj => {
    const { updateScratchpad } = this.props;
    updateScratchpad({
      fillColor: hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100)
    });
  };

  handleToolChange = value => () => {
    const { activeMode, deleteMode, updateScratchpad } = this.props;
    if (value === "deleteMode") {
      updateScratchpad({ deleteMode: !deleteMode });
    } else if (activeMode === value) {
      updateScratchpad({ activeMode: "" });
    } else {
      updateScratchpad({ activeMode: value, deleteMode: false });
      if (value === "drawBreakingLine") {
        message.info("Please double click to stop drawing");
      }
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
    const { updateScratchpad } = this.props;
    updateScratchpad({
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

  handleChangePreview = () => {
    const { changePreview = () => {} } = this.props;
    // change the player state to clear mode (attemptable mode)
    this.setState({ testItemState: "" }, () => changePreview(CLEAR));
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
      scratchPad,
      crossAction,
      previousQuestionActivities,
      bookmarksInOrder,
      skippedInOrder,
      zoomLevel,
      windowWidth,
      scratchPadData,
      showHints,
      timedAssignment = false,
      currentAssignmentTime = null,
      stopTimerFlag = false,
      groupId,
      utaId
    } = this.props;
    const { showExitPopup, testItemState, enableCrossAction, toolsOpenStatus } = this.state;

    const { activeMode, deleteMode, currentColor, fillColor, lineWidth } = scratchPadData;

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
        <Container scratchPadMode={scratchPadMode} ref={this.containerRef}>
          <AssessmentPlayerSkinWrapper
            {...this.props}
            headerRef={this.headerRef}
            theme={themeToPass}
            dropdownOptions={dropdownOptions}
            onOpenExitPopup={this.openExitPopup}
            onshowHideHints={showHints}
            checkAnswer={() => this.changeTabItemState("check")}
            toggleToolsOpenStatus={this.toggleToolsOpenStatus}
            toolsOpenStatus={toolsOpenStatus}
            t={t}
            previewPlayer={previewPlayer}
            finishTest={this.openExitPopup}
            setCrossAction={enableCrossAction ? this.saveHistory("crossAction") : false}
            crossAction={crossAction || {}}
            bookmarks={bookmarksInOrder}
            skipped={skippedInOrder}
            qType={get(items, `[${currentItem}].data.questions[0].type`, null)}
            timedAssignment={timedAssignment}
            utaId={utaId}
            groupId={groupId}
          >
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
                className="scratchpad-tools"
              />
            )}

            {toolsOpenStatus.indexOf(2) !== -1 && settings?.calcType ? (
              <CalculatorContainer
                calculateMode={`${settings.calcType}_${settings.calcProvider}`}
                changeTool={this.toggleToolsOpenStatus}
              />
            ) : null}
            <PlayerMainContentArea
              {...this.props}
              theme={themeToPass}
              previewTab={previewTab}
              dropdownOptions={dropdownOptions}
              items={items}
              settings={settings}
              testItemState={testItemState}
              t={t}
              enableCrossAction={enableCrossAction}
              unansweredQuestionCount={unansweredQuestionCount}
              setHighlights={this.saveHistory("resourceId")}
              setCrossAction={enableCrossAction ? this.saveHistory("crossAction") : false}
              crossAction={crossAction || {}}
              previousQuestionActivities={previousQuestionActivities}
              zoomLevel={zoomLevel}
              windowWidth={windowWidth}
              activeMode={activeMode}
              scratchPadMode={scratchPadMode}
              lineColor={currentColor}
              deleteMode={deleteMode}
              lineWidth={lineWidth}
              fillColor={fillColor}
              saveHistory={this.saveHistory("scratchpad")}
              history={scratchPad}
              changePreview={this.handleChangePreview}
            />
            <SubmitConfirmation
              settings={settings}
              isVisible={showExitPopup}
              onClose={this.hideExitPopup}
              finishTest={this.finishTest}
            />
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
      userWork: get(state, `userWork.present[${ownProps.items[ownProps.currentItem]._id}]`, {}),
      previousQuestionActivities: get(state, "previousQuestionActivity", {}),
      bookmarksInOrder: bookmarksByIndexSelector(state),
      skippedInOrder: getSkippedAnswerSelector(state),
      scratchPadData: state.scratchpad,
      timedAssignment: state.test?.settings?.timedAssignment,
      currentAssignmentTime: state.test?.currentAssignmentTime,
      stopTimerFlag: state.test?.stopTimerFlag
    }),
    {
      checkAnswer: checkAnswerEvaluation,
      toggleBookmark: toggleBookmarkAction,
      saveUserWork: saveUserWorkAction,
      changePreview: changePreviewAction,
      undoScratchPad: ActionCreators.undo,
      redoScratchPad: ActionCreators.redo,
      setUserAnswer: setUserAnswerAction,
      updateScratchpad: updateScratchpadAction,
      updateTestPlayer: updateTestPlayerAction,
      showHints: showHintsAction
    }
  )
);
export default enhance(AssessmentPlayerSimple);
