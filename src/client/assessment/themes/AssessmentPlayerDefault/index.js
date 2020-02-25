/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { message } from "antd";
import { ActionCreators } from "redux-undo";
import { get, keyBy } from "lodash";
import { withWindowSizes, hexToRGB, ScrollContext } from "@edulastic/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nonAutoGradableTypes, questionType } from "@edulastic/constants";
import PaddingDiv from "@edulastic/common/src/components/PaddingDiv";
import Hints from "@edulastic/common/src/components/Hints";

import { themes } from "../../../theme";
import QuestionSelectDropdown from "../common/QuestionSelectDropdown";
import MainWrapper from "./MainWrapper";
import HeaderMainMenu from "../common/HeaderMainMenu";
import ToolbarModal from "../common/ToolbarModal";
import SavePauseModalMobile from "../common/SavePauseModalMobile";
import SubmitConfirmation from "../common/SubmitConfirmation";
import { toggleBookmarkAction, bookmarksByIndexSelector } from "../../sharedDucks/bookmark";
import { getSkippedAnswerSelector } from "../../selectors/answers";
import ReportIssuePopover from "../common/ReportIssuePopover";
import { Tooltip, isZoomGreator } from "../../../common/utils/helpers";
import SettingsModal from "../../../student/sharedComponents/SettingsModal";
import {
  ControlBtn,
  ToolButton,
  Main,
  Header,
  HeaderWrapper,
  Container,
  FlexContainer,
  TestButton,
  ToolBar,
  SaveAndExit,
  CalculatorContainer,
  ToolTipContainer,
  MainActionWrapper,
  LogoCompact,
  Nav,
  CustomAffix
} from "../common";
import TestItemPreview from "../../components/TestItemPreview";
import { MAX_MOBILE_WIDTH, IPAD_LANDSCAPE_WIDTH, LARGE_DESKTOP_WIDTH } from "../../constants/others";
import { checkAnswerEvaluation } from "../../actions/checkanswer";
import { changePreviewAction } from "../../../author/src/actions/view";
import Tools from "./Tools";
import { saveUserWorkAction, clearUserWorkAction } from "../../actions/userWork";
import { currentItemAnswerChecksSelector } from "../../selectors/test";
import { getCurrentGroupWithAllClasses } from "../../../student/Login/ducks";
import FeaturesSwitch from "../../../features/components/FeaturesSwitch";
import { setUserAnswerAction } from "../../actions/answers";
import { updateScratchpadAction, resetScratchPadDataAction } from "../../../common/ducks/scratchpad";
import AssessmentPlayerSkinWrapper from "../AssessmentPlayerSkinWrapper";

class AssessmentPlayerDefault extends React.Component {
  constructor(props) {
    super(props);
    const { settings } = props;
    this.state = {
      cloneCurrentItem: props.currentItem,
      testItemState: "",
      isToolbarModalVisible: false,
      isSubmitConfirmationVisible: false,
      isSavePauseModalVisible: false,
      history: 0,
      calculateMode: `${settings.calcType}_${settings.calcProvider}`,
      currentToolMode: [0],
      showHints: false,
      enableCrossAction: false,
      zoomFactor: 1,
      minWidth: 480,
      defaultContentWidth: 900,
      defaultHeaderHeight: 62
    };
  }

  static propTypes = {
    theme: PropTypes.object,
    scratchPad: PropTypes.any.isRequired,
    highlights: PropTypes.any.isRequired,
    isFirst: PropTypes.func.isRequired,
    moveToNext: PropTypes.func.isRequired,
    moveToPrev: PropTypes.func.isRequired,
    currentItem: PropTypes.any.isRequired,
    items: PropTypes.any.isRequired,
    gotoQuestion: PropTypes.any.isRequired,
    itemRows: PropTypes.array.isRequired,
    evaluation: PropTypes.any.isRequired,
    checkAnswer: PropTypes.func.isRequired,
    history: PropTypes.func.isRequired,
    windowWidth: PropTypes.number.isRequired,
    questions: PropTypes.object.isRequired,
    undoScratchPad: PropTypes.func.isRequired,
    redoScratchPad: PropTypes.func.isRequired,
    userWork: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    answerChecksUsedForItem: PropTypes.number.isRequired,
    previewPlayer: PropTypes.bool.isRequired,
    saveUserWork: PropTypes.func.isRequired,
    LCBPreviewModal: PropTypes.any.isRequired,
    setUserAnswer: PropTypes.func.isRequired,
    userAnswers: PropTypes.object.isRequired
  };

  static defaultProps = {
    theme: themes
  };

  scrollContainer = React.createRef();

  changeTool = val => {
    let { currentToolMode, enableCrossAction } = this.state;
    if (val === 3 || val === 5) {
      const index = currentToolMode.indexOf(val);
      if (index !== -1) {
        currentToolMode.splice(index, 1);
      } else {
        currentToolMode.push(val);
      }
      currentToolMode = currentToolMode.filter(m => m === 3 || m === 5);
    } else {
      currentToolMode = [val];
    }
    if (val === 3) {
      enableCrossAction = !enableCrossAction;
      this.setState({ currentToolMode, enableCrossAction });
    } else {
      this.setState({ currentToolMode });
    }
  };

  showHideHints = () => {
    this.setState(prevState => ({
      ...prevState,
      showHints: !prevState.showHints
    }));
  };

  changeTabItemState = value => {
    const { checkAnswer, answerChecksUsedForItem, settings, groupId } = this.props;
    if (answerChecksUsedForItem >= settings.maxAnswerChecks)
      return message.warn("Check answer limit exceeded for the item.");
    checkAnswer(groupId);
    this.setState({ testItemState: value });
  };

  closeToolbarModal = () => {
    this.setState({ isToolbarModalVisible: false });
  };

  closeSavePauseModal = () => {
    this.setState({ isSavePauseModalVisible: false });
  };

  openSubmitConfirmation = () => {
    const { previewPlayer } = this.props;
    if (previewPlayer) {
      return;
    }
    this.setState({ isSubmitConfirmationVisible: true });
  };

  closeSubmitConfirmation = () => {
    this.setState({ isSubmitConfirmationVisible: false });
  };

  finishTest = () => {
    const { history, saveCurrentAnswer } = this.props;
    saveCurrentAnswer({ shouldClearUserWork: true });
    history.push("/home/assignments");
  };

  onFillColorChange = obj =>
    this.props.updateScratchPad({ fillColor: hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100) });

  handleModeCaculate = calculateMode => {
    this.setState({
      calculateMode
    });
  };

  handleScratchToolChange = value => () => {
    const { scratchpadData, updateScratchPad } = this.props;
    const { activeMode, deleteMode } = scratchpadData;
    const data = {};

    if (value === "deleteMode") {
      data.deleteMode = !deleteMode;
    } else if (activeMode === value) {
      data.activeMode = "";
    } else {
      data.activeMode = value;
      data.deleteMode = false;
    }
    updateScratchPad(data);
  };

  handleColorChange = obj =>
    this.props.updateScratchPad({
      currentColor: hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100)
    });

  handleChangeFont = font => this.props.updateScratchPad({ currentFont: font });

  handleLineWidthChange = size => this.props.updateScratchPad({ lineWidth: size });

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

  static getDerivedStateFromProps(next, prevState) {
    if (next.currentItem !== prevState.cloneCurrentItem) {
      const qId = get(next.items, `[${next.currentItem}].data.questions[0].id`, null);
      const currentToolMode = [];
      if (next.scratchPad && !prevState.currentToolMode) {
        currentToolMode.push(5);
      }
      if (next.crossAction && next.crossAction[qId]) {
        currentToolMode.push(3);
      }
      if (!next.crossAction && !next.scratchPad) {
        currentToolMode.push(0);
      }

      const nextState = {
        currentToolMode,
        cloneCurrentItem: next.currentItem,
        history: 0,
        enableCrossAction: currentToolMode.indexOf(3) !== -1
      };
      return nextState;
    }

    return null;
  }

  componentDidUpdate(previousProps) {
    const { currentItem } = this.props;
    if (currentItem !== previousProps.currentItem) {
      this.scrollContainer.current.scrollTop = 0;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ showHints: false });
    }
  }

  render() {
    const {
      theme,
      items,
      isFirst,
      currentItem,
      itemRows,
      evaluation,
      windowWidth,
      questions,
      moveToNext,
      moveToPrev,
      gotoQuestion,
      settings,
      previewPlayer,
      scratchPad,
      highlights,
      crossAction,
      toggleBookmark,
      isBookmarked,
      answerChecksUsedForItem,
      bookmarksInOrder,
      skippedInOrder,
      currentGroupId,
      previousQuestionActivities,
      LCBPreviewModal,
      preview,
      zoomLevel: _zoomLevel,
      selectedTheme = "default",
      closeTestPreviewModal,
      showTools = true,
      showScratchPad,
      scratchpadData: { currentColor, currentFont, deleteMode, lineWidth, fillColor, activeMode },
      passage,
      defaultAP,
      playerSkinType
    } = this.props;
    const {
      testItemState,
      isToolbarModalVisible,
      isSubmitConfirmationVisible,
      isSavePauseModalVisible,
      calculateMode,
      showHints,
      enableCrossAction,
      minWidth,
      defaultContentWidth,
      defaultHeaderHeight,
      currentToolMode
    } = this.state;
    const calcBrands = ["DESMOS", "GEOGEBRASCIENTIFIC", "EDULASTIC"];
    const dropdownOptions = Array.isArray(items) ? items.map((item, index) => index) : [];

    const item = items[currentItem];
    if (!item) {
      return <div />;
    }
    const previousQuestionActivity = previousQuestionActivities[item._id];
    let isNonAutoGradable = false;

    if (item.data && item.data.questions) {
      item.data.questions.forEach(question => {
        if (nonAutoGradableTypes.includes(question.type)) {
          isNonAutoGradable = true;
          if (question.type === questionType.HIGHLIGHT_IMAGE) {
            currentToolMode.push(5);
          }
        }
      });
    }

    const scratchPadMode = currentToolMode.indexOf(5) !== -1 || showScratchPad;

    // calculate width of question area
    const availableWidth = windowWidth - 70;
    let responsiveWidth = availableWidth;
    let zoomLevel = _zoomLevel;

    if (defaultContentWidth * zoomLevel > availableWidth) {
      if (availableWidth / zoomLevel < minWidth) {
        zoomLevel = availableWidth / minWidth;
        responsiveWidth = minWidth;
      } else {
        responsiveWidth = availableWidth / zoomLevel;
      }
    } else if (availableWidth / zoomLevel > defaultContentWidth && zoomLevel > "1") {
      responsiveWidth = availableWidth / zoomLevel;
    }
    // 20, 18 and 12 are right margin for right nave on zooming
    if (zoomLevel >= 1.5 && zoomLevel < 1.75) {
      responsiveWidth -= 20;
    }
    if (zoomLevel >= 1.75 && zoomLevel < 2.5) {
      responsiveWidth -= 18;
    }
    if (zoomLevel >= 2.5) {
      responsiveWidth -= 12;
    }

    const hasCollapseButtons =
      itemRows.length > 1 && itemRows.flatMap(_item => _item.widgets).find(_item => _item.widgetType === "resource");

    const themeToPass = theme[selectedTheme] || theme.default;
    // themeToPass = getZoomedTheme(themeToPass, zoomLevel);
    // themeToPass = playersZoomTheme(themeToPass);

    const navZoomStyle = { zoom: themeToPass?.header?.navZoom };
    const isZoomApplied = zoomLevel > "1";
    const showSettingIcon = windowWidth < IPAD_LANDSCAPE_WIDTH || isZoomGreator("md", themeToPass?.zoomLevel);
    let headerZoom = 1;
    if (isZoomApplied) {
      headerZoom = zoomLevel >= "1.75" ? "1.35" : "1.25";
    }

    // calculate height of questiin area
    const headerHeight = defaultHeaderHeight * headerZoom;

    const headerStyleWidthZoom = {
      transform: `scale(${headerZoom})`, // maxScale of 1.5 to header
      transformOrigin: "0px 0px",
      width: isZoomApplied && `${zoomLevel >= "1.75" ? "76" : "80"}%`,
      padding: `${
        isZoomApplied
          ? zoomLevel >= "1.75"
            ? "11px"
            : "11px 5px"
          : windowWidth >= LARGE_DESKTOP_WIDTH
          ? "9px 0px"
          : "11px 0px"
      }`,
      justifyContent: "space-between"
    };

    const isMobile = windowWidth <= MAX_MOBILE_WIDTH;

    if (isMobile) {
      headerStyleWidthZoom.padding = 0;
    }

    const rightButtons = (
      <SaveAndExit
        previewPlayer={previewPlayer}
        showZoomBtn
        finishTest={previewPlayer ? () => closeTestPreviewModal() : () => this.openSubmitConfirmation()}
      />
    );

    return (
      /**
       * zoom only in student side, otherwise not
       * we need to pass zoomLevel as a theme variable because we should use it in questions
       */
      <ThemeProvider theme={{ ...themeToPass, shouldZoom: true, zoomLevel, twoColLayout: {} }}>
        <Container scratchPadMode={scratchPadMode} data-cy="assessment-player-default-wrapper">
          <AssessmentPlayerSkinWrapper
            title={this.props.title}
            LCBPreviewModal={LCBPreviewModal}
            headerHeight={headerHeight}
            isMobile={isMobile}
            key={currentItem}
            currentItem={currentItem}
            gotoQuestion={gotoQuestion}
            options={dropdownOptions}
            bookmarks={bookmarksInOrder}
            skipped={skippedInOrder}
            dropdownStyle={navZoomStyle}
            zoomLevel={headerZoom}
            overlayStyle={navZoomStyle}
            disabled={isFirst()}
            moveToPrev={moveToPrev}
            moveToNext={moveToNext}
            showSettingIcon={showSettingIcon}
            answerChecksUsedForItem={answerChecksUsedForItem}
            settings={settings}
            items={items}
            isNonAutoGradable={isNonAutoGradable}
            checkAnswer={() => this.changeTabItemState("check")}
            toggleBookmark={() => toggleBookmark(item._id)}
            isBookmarked={isBookmarked}
            handletoggleHints={this.showHideHints}
            onClickSetting={() => {
              this.setState({ isToolbarModalVisible: true });
            }}
            calcBrands={calcBrands}
            tool={currentToolMode}
            changeCaculateMode={this.handleModeCaculate}
            changeTool={this.changeTool}
            qType={get(items, `[${currentItem}].data.questions[0].type`, null)}
            previewPlayer={previewPlayer}
            headerStyleWidthZoom={headerStyleWidthZoom}
            playerSkinType={playerSkinType}
            defaultAP={defaultAP}
            previewPlayer={previewPlayer}
            finishTest={previewPlayer ? () => closeTestPreviewModal() : () => this.openSubmitConfirmation()}
          >
            {scratchPadMode && (!previewPlayer || showTools) && (
            <Tools
              onFillColorChange={this.onFillColorChange}
              fillColor={fillColor}
              deleteMode={deleteMode}
              currentColor={currentColor}
              onToolChange={this.handleScratchToolChange}
              activeMode={activeMode}
              undo={this.handleUndo}
              redo={this.handleRedo}
              lineWidth={lineWidth}
              onChangeSize={this.handleLineWidthChange}
              onColorChange={this.handleColorChange}
              onChangeFont={this.handleChangeFont}
              currentFont={currentFont}
            />
          )}
            <FeaturesSwitch
              inputFeatures="studentSettings"
              actionOnInaccessible="hidden"
              key="studentSettings"
              groupId={currentGroupId}
            >
              <ToolbarModal
                isVisible={isToolbarModalVisible}
                onClose={() => this.closeToolbarModal()}
                checkAnswer={() => this.changeTabItemState("check")}
                windowWidth={windowWidth}
                answerChecksUsedForItem={answerChecksUsedForItem}
                settings={settings}
                items={items}
                currentItem={currentItem}
                isNonAutoGradable={isNonAutoGradable}
                toggleBookmark={() => toggleBookmark(item._id)}
                isBookmarked={isBookmarked}
                handletoggleHints={this.showHideHints}
                changeTool={this.changeTool}
              />
            </FeaturesSwitch>
            {!previewPlayer && (
            <SavePauseModalMobile
              isVisible={isSavePauseModalVisible}
              onClose={this.closeSavePauseModal}
              onExitClick={this.openSubmitConfirmation}
            />
          )}
            {!previewPlayer && (
            <SubmitConfirmation
              isVisible={isSubmitConfirmationVisible}
              onClose={() => this.closeSubmitConfirmation()}
              finishTest={this.finishTest}
            />
          )}
            <Main
              skin
              zoomed={isZoomApplied}
              zoomLevel={zoomLevel}
              headerHeight={headerHeight}
              ref={this.scrollContainer}
            >
              {/* react-sortable-hoc is required getContainer for auto-scroll, so need to use ScrollContext here
                Also, will use ScrollContext for auto-scroll on mobile */}
              <ScrollContext.Provider value={{ getScrollElement: () => this.scrollContainer.current }}>
                <SettingsModal />
                <MainWrapper
                  responsiveWidth={responsiveWidth}
                  zoomLevel={zoomLevel}
                  hasCollapseButtons={hasCollapseButtons}
                >
                  {testItemState === "" && (
                  <TestItemPreview
                    LCBPreviewModal={LCBPreviewModal}
                    cols={itemRows}
                    previousQuestionActivity={previousQuestionActivity}
                    questions={passage ? { ...questions, ...keyBy(passage.data, "id") } : questions}
                    showCollapseBtn
                    highlights={highlights}
                    crossAction={crossAction || {}}
                    viewComponent="studentPlayer"
                    setHighlights={this.saveHistory("resourceId")}
                    setCrossAction={enableCrossAction ? this.saveHistory("crossAction") : false} // this needs only for MCQ and MSQ
                    activeMode={activeMode}
                    scratchPadMode={scratchPadMode}
                    lineColor={currentColor}
                    deleteMode={deleteMode}
                    lineWidth={lineWidth}
                    fillColor={fillColor}
                    fontFamily={currentFont}
                    saveHistory={this.saveHistory("scratchpad")}
                    history={scratchPad}
                  />
                )}
                  {testItemState === "check" && (
                  <TestItemPreview
                    cols={itemRows}
                    previewTab="check"
                    preview={preview}
                    previousQuestionActivity={previousQuestionActivity}
                    evaluation={evaluation}
                    verticalDivider={item.verticalDivider}
                    scrolling={item.scrolling}
                    questions={questions}
                    LCBPreviewModal={LCBPreviewModal}
                    highlights={highlights}
                    crossAction={crossAction || {}}
                    showCollapseBtn
                    viewComponent="studentPlayer"
                    setHighlights={this.saveHistory("resourceId")} // this needs only for passage type
                    setCrossAction={enableCrossAction ? this.saveHistory("crossAction") : false} // this needs only for MCQ and MSQ
                    activeMode={activeMode}
                    scratchPadMode={scratchPadMode}
                    lineColor={currentColor}
                    deleteMode={deleteMode}
                    lineWidth={lineWidth}
                    fillColor={fillColor}
                    fontFamily={currentFont}
                    saveHistory={this.saveHistory("scratchpad")}
                    history={scratchPad}
                  />
                )}
                  {showHints && (
                  <StyledPaddingDiv>
                    <Hints questions={get(item, [`data`, `questions`], [])} />
                  </StyledPaddingDiv>
                )}
                </MainWrapper>
              </ScrollContext.Provider>
            </Main>

            <ReportIssuePopover item={item} />

            {currentToolMode.indexOf(2) !== -1 && (
            <CalculatorContainer changeTool={this.changeTool} calculateMode={calculateMode} calcBrands={calcBrands} />
          )}
          </AssessmentPlayerSkinWrapper>
        </Container>
      </ThemeProvider>
    );
  }

  componentWillUnmount() {
    const { previewPlayer, clearUserWork, showScratchPad, resetScratchPadData } = this.props;
    if (previewPlayer && !showScratchPad) {
      clearUserWork();
    }
    resetScratchPadData();
  }
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  connect(
    (state, ownProps) => ({
      evaluation: state.evaluation,
      preview: state.view.preview,
      questions: state.assessmentplayerQuestions.byId,
      scratchPad: get(state, `userWork.present[${ownProps.items[ownProps.currentItem]._id}].scratchpad`, null),
      highlights: get(state, `userWork.present[${ownProps.items[ownProps.currentItem]._id}].resourceId`, null),
      crossAction: get(state, `userWork.present[${ownProps.items[ownProps.currentItem]._id}].crossAction`, null),
      userWork: get(state, `userWork.present[${ownProps.items[ownProps.currentItem]._id}]`, {}),
      settings: state.test.settings,
      answerChecksUsedForItem: currentItemAnswerChecksSelector(state),
      isBookmarked: !!get(state, ["assessmentBookmarks", ownProps.items[ownProps.currentItem]._id], false),
      bookmarksInOrder: bookmarksByIndexSelector(state),
      skippedInOrder: getSkippedAnswerSelector(state),
      currentGroupId: getCurrentGroupWithAllClasses(state),
      userAnswers: state.answers,
      zoomLevel: state.ui.zoomLevel,
      selectedTheme: state.ui.selectedTheme,
      previousQuestionActivities: get(state, "previousQuestionActivity", {}),
      scratchpadData: state.scratchpad
    }),
    {
      changePreview: changePreviewAction,
      saveUserWork: saveUserWorkAction,
      undoScratchPad: ActionCreators.undo,
      redoScratchPad: ActionCreators.redo,
      toggleBookmark: toggleBookmarkAction,
      checkAnswer: checkAnswerEvaluation,
      setUserAnswer: setUserAnswerAction,
      clearUserWork: clearUserWorkAction,
      updateScratchPad: updateScratchpadAction,
      resetScratchPadData: resetScratchPadDataAction
    }
  )
);

export default enhance(AssessmentPlayerDefault);

const StyledPaddingDiv = styled(PaddingDiv)`
  padding: 10px;
  height: max-content;
`;
