/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { get, isUndefined } from "lodash";
import { ThemeProvider } from "styled-components";
import { withNamespaces } from "@edulastic/localization";
import { withWindowSizes, notification } from "@edulastic/common";

// actions
import { checkAnswerEvaluation } from "../../actions/checkanswer";
import { currentItemAnswerChecksSelector } from "../../selectors/test";
// components

import { Container, CalculatorContainer } from "../common";
import PlayerMainContentArea from "./PlayerMainContentArea";

import SubmitConfirmation from "../common/SubmitConfirmation";
import { themes } from "../../../theme";
import assessmentPlayerTheme from "./themeStyle.json";
import { unansweredQuestionCountSelector } from "../../../student/TestAttemptReview/ducks";
import { toggleBookmarkAction, bookmarksByIndexSelector } from "../../sharedDucks/bookmark";
import { getSkippedAnswerSelector } from "../../selectors/answers";
import { saveUserWorkAction } from "../../actions/userWork";
import { changePreviewAction } from "../../../author/src/actions/view";

import { setUserAnswerAction } from "../../actions/answers";
import AssessmentPlayerSkinWrapper from "../AssessmentPlayerSkinWrapper";
import { updateTestPlayerAction } from "../../../author/sharedDucks/testPlayer";
import { showHintsAction } from "../../actions/userInteractions";
import { CLEAR } from "../../constants/constantsForQuestions";
import { showScratchpadInfoNotification } from "../../utils/helpers";

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
      if (toolsOpenStatus.includes(5)) {
        const { items, currentItem } = this.props;
        if (!isUndefined(currentItem) && Array.isArray(items)) {
          if (showScratchpadInfoNotification(items[currentItem])) {
            notification({
              type: "info",
              messageKey: "scratchpadInfoMultipart"
            });
          }
        }
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
      return notification({ type: "warn", messageKey: "checkAnswerLimitExceededForItem" });
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

  // will dispatch user work to store on here for scratchpad, passage highlight, or cross answer
  // sourceId will be one of 'scratchpad', 'resourceId', and 'crossAction'
  saveHistory = sourceId => data => {
    const { saveUserWork, items, currentItem, setUserAnswer, userAnswers, userWork, passage } = this.props;
    this.setState(({ history }) => ({ history: history + 1 }));

    // resourceId(passage) will use passage._id
    // @see https://snapwiz.atlassian.net/browse/EV-14181
    let userWorkId = items[currentItem]?._id;
    if (sourceId === "resourceId") {
      userWorkId = passage._id;
    }
    saveUserWork({
      [userWorkId]: { ...userWork, [sourceId]: data }
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
      attachments,
      previousQuestionActivities,
      bookmarksInOrder,
      skippedInOrder,
      zoomLevel,
      windowWidth,
      showHints,
      timedAssignment = false,
      groupId,
      highlights,
      utaId
    } = this.props;
    const { showExitPopup, testItemState, enableCrossAction, toolsOpenStatus } = this.state;

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
            qId={get(items, `[${currentItem}].data.questions[0].id`, null)}
            timedAssignment={timedAssignment}
            utaId={utaId}
            groupId={groupId}
          >
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
              highlights={highlights}
              enableCrossAction={enableCrossAction}
              unansweredQuestionCount={unansweredQuestionCount}
              setHighlights={this.saveHistory("resourceId")}
              setCrossAction={enableCrossAction ? this.saveHistory("crossAction") : false}
              crossAction={crossAction || {}}
              previousQuestionActivities={previousQuestionActivities}
              zoomLevel={zoomLevel}
              windowWidth={windowWidth}
              scratchPadMode={scratchPadMode}
              saveHistory={this.saveHistory("scratchpad")}
              saveAttachments={this.saveHistory("attachments")}
              attachments={attachments}
              history={scratchPad}
              changePreview={this.handleChangePreview}
            />
            {!previewPlayer && (
              <SubmitConfirmation
                settings={settings}
                isVisible={showExitPopup}
                onClose={this.hideExitPopup}
                finishTest={this.finishTest}
              />
            )}
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
      highlights: get(state, `userWork.present[${ownProps?.passage?._id}].resourceId`, null),
      attachments: get(state, `userWork.present[${ownProps.items[ownProps.currentItem]?._id}].attachments`, null),
      crossAction: get(state, `userWork.present[${ownProps.items[ownProps.currentItem]._id}].crossAction`, null),
      userWork: get(state, `userWork.present[${ownProps.items[ownProps.currentItem]._id}]`, {}),
      previousQuestionActivities: get(state, "previousQuestionActivity", {}),
      bookmarksInOrder: bookmarksByIndexSelector(state),
      skippedInOrder: getSkippedAnswerSelector(state),
      timedAssignment: state.test?.settings?.timedAssignment,
      currentAssignmentTime: state.test?.currentAssignmentTime,
      stopTimerFlag: state.test?.stopTimerFlag
    }),
    {
      checkAnswer: checkAnswerEvaluation,
      toggleBookmark: toggleBookmarkAction,
      saveUserWork: saveUserWorkAction,
      changePreview: changePreviewAction,
      setUserAnswer: setUserAnswerAction,
      updateTestPlayer: updateTestPlayerAction,
      showHints: showHintsAction
    }
  )
);
export default enhance(AssessmentPlayerSimple);
