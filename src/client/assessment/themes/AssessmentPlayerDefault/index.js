/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { Affix, Tooltip } from "antd";
import { ActionCreators } from "redux-undo";
import get from "lodash/get";
import { withWindowSizes, hexToRGB } from "@edulastic/common";
import { nonAutoGradableTypes } from "@edulastic/constants";
import PaddingDiv from "@edulastic/common/src/components/PaddingDiv";
import Hints from "@edulastic/common/src/components/Hints";
import { playersZoomTheme } from "../assessmentPlayersTheme";
import { themes } from "../../../theme";
import QuestionSelectDropdown from "../common/QuestionSelectDropdown";
import MainWrapper from "./MainWrapper";
import HeaderMainMenu from "../common/HeaderMainMenu";
import HeaderRightMenu from "../common/HeaderRightMenu";
import ToolbarModal from "../common/ToolbarModal";
import SavePauseModalMobile from "../common/SavePauseModalMobile";
import SubmitConfirmation from "../common/SubmitConfirmation";
import { toggleBookmarkAction, bookmarksByIndexSelector } from "../../sharedDucks/bookmark";
import { getSkippedAnswerSelector } from "../../selectors/answers";

import {
  ControlBtn,
  ToolButton,
  Main,
  Header,
  Container,
  FlexContainer,
  TestButton,
  ToolBar,
  SaveAndExit,
  CalculatorContainer
} from "../common";
import TestItemPreview from "../../components/TestItemPreview";
import DragScrollContainer from "../../components/DragScrollContainer";
import {
  SMALL_DESKTOP_WIDTH,
  IPAD_PORTRAIT_WIDTH,
  MAX_MOBILE_WIDTH,
  MEDIUM_DESKTOP_WIDTH
} from "../../constants/others";
import { checkAnswerEvaluation } from "../../actions/checkanswer";
import { changePreviewAction } from "../../../author/src/actions/view";
import SvgDraw from "./SvgDraw";
import Tools from "./Tools";
import { saveUserWorkAction } from "../../actions/userWork";
import { currentItemAnswerChecksSelector } from "../../selectors/test";
import { getCurrentGroupWithAllClasses } from "../../../student/Login/ducks";
import FeaturesSwitch from "../../../features/components/FeaturesSwitch";
import { setUserAnswerAction } from "../../actions/answers";
import { getZoomedTheme } from "../../../student/zoomTheme";
import { isZoomGreator } from "../../../common/utils/helpers";

class AssessmentPlayerDefault extends React.Component {
  constructor(props) {
    super(props);
    const { settings } = props;
    this.state = {
      currentColor: "#ff0000",
      fillColor: "#ff0000",
      activeMode: "",
      lineWidth: 6,
      cloneCurrentItem: props.currentItem,
      deleteMode: false,
      testItemState: "",
      isToolbarModalVisible: false,
      isSubmitConfirmationVisible: false,
      isSavePauseModalVisible: false,
      history: props.scratchPad ? [props.scratchPad] : [{ points: [], pathes: [], figures: [], texts: [] }],
      calculateMode: `${settings.calcType}_DESMOS`,
      currentToolMode: [0],
      showHints: false,
      enableCrossAction: false
    };

    this.scrollElementRef = React.createRef();
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
    if (answerChecksUsedForItem >= settings.maxAnswerChecks) return;
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
    const { history } = this.props;
    history.push("/home/assignments");
  };

  onFillColorChange = obj => {
    this.setState({
      fillColor: hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100)
    });
  };

  handleModeCaculate = calculateMode => {
    this.setState({
      calculateMode
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
      if (next.scratchPad) {
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
        activeMode: "",
        enableCrossAction: currentToolMode.indexOf(3) !== -1
      };

      return nextState;
    }

    if (next.scratchPad && prevState.currentToolMode.indexOf(5) === -1) {
      return { currentToolMode: [5], history: 0, activeMode: "" };
    }

    return null;
  }

  componentDidUpdate(previousProps) {
    if (this.props.currentItem !== previousProps.currentItem) {
      this.scrollElementRef.current.scrollTop = 0;
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
      zoomLevel,
      selectedTheme = "default",
      closeTestPreviewModal
    } = this.props;
    const {
      testItemState,
      isToolbarModalVisible,
      isSubmitConfirmationVisible,
      isSavePauseModalVisible,
      activeMode,
      currentColor,
      deleteMode,
      lineWidth,
      fillColor,
      calculateMode,
      currentToolMode,
      showHints,
      enableCrossAction
    } = this.state;
    const calcBrands = ["DESMOS", "GEOGEBRASCIENTIFIC"];
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
        }
      });
    }

    const scratchPadMode = currentToolMode.indexOf(5) !== -1;
    const hasCollapseButtons =
      itemRows.length > 1 && itemRows.flatMap(_item => _item.widgets).find(_item => _item.widgetType === "resource");

    let themeToPass = theme[selectedTheme] || theme.default;

    themeToPass = getZoomedTheme(themeToPass, zoomLevel);
    themeToPass = playersZoomTheme(themeToPass);

    const navZoomStyle = { zoom: themeToPass?.header?.navZoom };

    const showSettingIcon = windowWidth < MEDIUM_DESKTOP_WIDTH || isZoomGreator("md", themeToPass?.zoomLevel);

    return (
      <ThemeProvider theme={themeToPass}>
        <Container
          scratchPadMode={scratchPadMode}
          innerRef={this.scrollElementRef}
          data-cy="assessment-player-default-wrapper"
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
          <Affix>
            <Header LCBPreviewModal={LCBPreviewModal}>
              <HeaderMainMenu skin>
                <FlexContainer
                  style={{
                    justifyContent: windowWidth <= IPAD_PORTRAIT_WIDTH && "space-between"
                  }}
                >
                  {!LCBPreviewModal && (
                    <QuestionSelectDropdown
                      key={currentItem}
                      currentItem={currentItem}
                      gotoQuestion={gotoQuestion}
                      options={dropdownOptions}
                      bookmarks={bookmarksInOrder}
                      skipped={skippedInOrder}
                      dropdownStyle={navZoomStyle}
                    />
                  )}

                  <FlexContainer
                    style={{
                      flex: 1,
                      justifyContent: windowWidth <= IPAD_PORTRAIT_WIDTH && "flex-end"
                    }}
                  >
                    {!LCBPreviewModal && (
                      <>
                        <ToolTipContainer>
                          <Tooltip placement="top" title="Previous" overlayStyle={navZoomStyle}>
                            <ControlBtn
                              prev
                              skin
                              data-cy="prev"
                              type="primary"
                              icon="left"
                              disabled={isFirst()}
                              onClick={moveToPrev}
                            />
                          </Tooltip>
                        </ToolTipContainer>
                        <ToolTipContainer>
                          <Tooltip placement="top" title="Next" overlayStyle={navZoomStyle}>
                            <ControlBtn next skin type="primary" data-cy="next" icon="right" onClick={moveToNext} />
                          </Tooltip>
                        </ToolTipContainer>
                        {showSettingIcon && (
                          <ToolTipContainer>
                            <Tooltip placement="top" title="Tool" overlayStyle={navZoomStyle}>
                              <ToolButton
                                next
                                skin
                                size="large"
                                type="primary"
                                icon="tool"
                                data-cy="setting"
                                onClick={() => {
                                  this.setState({ isToolbarModalVisible: true });
                                }}
                              />
                            </Tooltip>
                          </ToolTipContainer>
                        )}
                        {windowWidth >= SMALL_DESKTOP_WIDTH && (
                          <TestButton
                            answerChecksUsedForItem={answerChecksUsedForItem}
                            settings={settings}
                            items={items}
                            currentItem={currentItem}
                            isNonAutoGradable={isNonAutoGradable}
                            checkAnswer={() => this.changeTabItemState("check")}
                            toggleBookmark={() => toggleBookmark(item._id)}
                            isBookmarked={isBookmarked}
                            handleClick={this.showHideHints}
                          />
                        )}
                        {windowWidth >= MEDIUM_DESKTOP_WIDTH && !isZoomGreator("md", themeToPass?.zoomLevel) && (
                          <ToolBar
                            settings={settings}
                            calcBrands={calcBrands}
                            tool={currentToolMode}
                            changeCaculateMode={this.handleModeCaculate}
                            changeTool={this.changeTool}
                            qType={get(items, `[${currentItem}].data.questions[0].type`, null)}
                          />
                        )}
                      </>
                    )}
                    {windowWidth >= MAX_MOBILE_WIDTH && !previewPlayer && (
                      <SaveAndExit finishTest={() => this.openSubmitConfirmation()} />
                    )}

                    {previewPlayer && (
                      <SaveAndExit previewPlayer={previewPlayer} finishTest={() => closeTestPreviewModal()} />
                    )}
                  </FlexContainer>
                </FlexContainer>
                <FlexContainer />
              </HeaderMainMenu>
              <HeaderRightMenu skin />
              <DragScrollContainer scrollWrraper={this.scrollElementRef.current} />
            </Header>
          </Affix>
          <Main skin>
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
            <MainWrapper hasCollapseButtons={hasCollapseButtons}>
              {testItemState === "" && (
                <TestItemPreview
                  LCBPreviewModal={LCBPreviewModal}
                  cols={itemRows}
                  previousQuestionActivity={previousQuestionActivity}
                  questions={questions}
                  showCollapseBtn
                  highlights={highlights}
                  crossAction={crossAction || {}}
                  viewComponent="studentPlayer"
                  setHighlights={this.saveHistory("resourceId")}
                  setCrossAction={enableCrossAction ? this.saveHistory("crossAction") : false} // this needs only for MCQ and MSQ
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
                />
              )}
              {showHints && (
                <StyledPaddingDiv>
                  <Hints questions={get(item, [`data`, `questions`], [])} />
                </StyledPaddingDiv>
              )}
            </MainWrapper>
          </Main>
          {currentToolMode.indexOf(2) !== -1 && (
            <CalculatorContainer changeTool={this.changeTool} calculateMode={calculateMode} calcBrands={calcBrands} />
          )}
        </Container>
      </ThemeProvider>
    );
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
      userAnswers: state.answers
    }),
    {
      changePreview: changePreviewAction,
      saveUserWork: saveUserWorkAction,
      undoScratchPad: ActionCreators.undo,
      redoScratchPad: ActionCreators.redo,
      toggleBookmark: toggleBookmarkAction,
      checkAnswer: checkAnswerEvaluation,
      setUserAnswer: setUserAnswerAction
    }
  )
);

export default enhance(AssessmentPlayerDefault);

const StyledPaddingDiv = styled(PaddingDiv)`
  padding: 0px 35px;
`;

const ToolTipContainer = styled.div`
  zoom: ${({ theme }) => theme?.header?.navZoom};
`;
