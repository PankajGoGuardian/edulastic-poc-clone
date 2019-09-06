import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Affix, Tooltip } from "antd";
import { ActionCreators } from "redux-undo";
import { get } from "lodash";
import { withWindowSizes } from "@edulastic/common";
import { nonAutoGradableTypes } from "@edulastic/constants";
import { playersTheme } from "../assessmentPlayersTheme";
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
  LARGE_DESKTOP_WIDTH,
  SMALL_DESKTOP_WIDTH,
  MEDIUM_DESKTOP_WIDTH,
  IPAD_PORTRAIT_WIDTH,
  MAX_MOBILE_WIDTH
} from "../../constants/others";
import { checkAnswerEvaluation } from "../../actions/checkanswer";
import { changePreviewAction } from "../../../author/src/actions/view";
import SvgDraw from "./SvgDraw";
import Tools from "./Tools";
import { saveScratchPadAction } from "../../actions/userWork";
import { currentItemAnswerChecksSelector } from "../../selectors/test";
import { getCurrentGroupWithAllClasses } from "../../../student/Login/ducks";
import FeaturesSwitch from "../../../features/components/FeaturesSwitch";
import { setUserAnswerAction } from "../../actions/answers.js";

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
      changeMode: 0,
      tool: 0
    };

    this.scrollElementRef = React.createRef();
  }

  static propTypes = {
    theme: PropTypes.object,
    scratchPad: PropTypes.any.isRequired,
    isFirst: PropTypes.func.isRequired,
    moveToNext: PropTypes.func.isRequired,
    moveToPrev: PropTypes.func.isRequired,
    currentItem: PropTypes.any.isRequired,
    items: PropTypes.any.isRequired,
    gotoQuestion: PropTypes.any.isRequired,
    itemRows: PropTypes.array.isRequired,
    evaluation: PropTypes.any.isRequired,
    checkAnswer: PropTypes.func.isRequired,
    changePreview: PropTypes.func.isRequired,
    history: PropTypes.func.isRequired,
    windowWidth: PropTypes.number.isRequired,
    questions: PropTypes.object.isRequired,
    undoScratchPad: PropTypes.func.isRequired,
    redoScratchPad: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    answerChecksUsedForItem: PropTypes.number.isRequired,
    previewPlayer: PropTypes.bool.isRequired,
    saveScratchPad: PropTypes.func.isRequired,
    LCBPreviewModal: PropTypes.any.isRequired,
    setUserAnswer: PropTypes.func.isRequired,
    userAnswers: PropTypes.object
  };

  static defaultProps = {
    theme: playersTheme
  };

  changeTool = val => this.setState({ tool: val });

  changeTabItemState = value => {
    const { checkAnswer, answerChecksUsedForItem, settings } = this.props;
    if (answerChecksUsedForItem >= settings.maxAnswerChecks) return;
    checkAnswer();
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

  hexToRGB = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);

    const g = parseInt(hex.slice(3, 5), 16);

    const b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  };

  onFillColorChange = obj => {
    this.setState({
      fillColor: this.hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100)
    });
  };

  handleModeChange = value => {
    this.setState({
      changeMode: value
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
      this.setState({ activeMode: value });
    }
  };

  handleColorChange = obj => {
    this.setState({
      currentColor: this.hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100)
    });
  };

  saveHistory = data => {
    const { saveScratchPad, items, currentItem, setUserAnswer, userAnswers } = this.props;
    this.setState(({ history }) => ({ history: history + 1 }));

    saveScratchPad({
      [items[currentItem]._id]: data
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
      const tool = next.scratchPad ? 5 : 0;
      return { tool, cloneCurrentItem: next.currentItem, history: 0, activeMode: "" };
    }

    if (next.scratchPad && prevState.tool !== 5) {
      return { tool: 5, history: 0, activeMode: "" };
    }
    return null;
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
      toggleBookmark,
      isBookmarked,
      answerChecksUsedForItem,
      bookmarksInOrder,
      skippedInOrder,
      currentGroupId,
      LCBPreviewModal,
      preview
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
      changeMode,
      calculateMode,
      tool
    } = this.state;
    const calcBrands = ["DESMOS", "GEOGEBRASCIENTIFIC"];
    const dropdownOptions = Array.isArray(items) ? items.map((item, index) => index) : [];

    const item = items[currentItem];
    if (!item) {
      return <div />;
    }
    let isNonAutoGradable = false;

    if (item.data && item.data.questions) {
      item.data.questions.forEach(question => {
        if (nonAutoGradableTypes.includes(question.type)) {
          isNonAutoGradable = true;
        }
      });
    }

    const scratchPadMode = tool === 5;
    return (
      <ThemeProvider theme={theme}>
        <Container innerRef={this.scrollElementRef} data-cy="assessment-player-default-wrapper">
          <SvgDraw
            activeMode={activeMode}
            scratchPadMode={tool === 5}
            lineColor={currentColor}
            deleteMode={deleteMode}
            lineWidth={lineWidth}
            fillColor={fillColor}
            saveHistory={this.saveHistory}
            history={scratchPad}
          />
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
                  <QuestionSelectDropdown
                    key={currentItem}
                    currentItem={currentItem}
                    gotoQuestion={gotoQuestion}
                    options={dropdownOptions}
                    bookmarks={bookmarksInOrder}
                    skipped={skippedInOrder}
                  />

                  <FlexContainer
                    style={{
                      flex: 1,
                      justifyContent: windowWidth <= IPAD_PORTRAIT_WIDTH && "flex-end"
                    }}
                  >
                    <Tooltip placement="top" title={"Previous"}>
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
                    <Tooltip placement="top" title={"Next"}>
                      <ControlBtn next skin type="primary" data-cy="next" icon="right" onClick={moveToNext} />
                    </Tooltip>
                    {windowWidth < LARGE_DESKTOP_WIDTH && (
                      <Tooltip placement="top" title={"Tool"}>
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
                      />
                    )}
                    {windowWidth >= SMALL_DESKTOP_WIDTH && (
                      <ToolBar
                        changeMode={this.handleModeChange}
                        changeCaculateMode={this.handleModeCaculate}
                        settings={settings}
                        calcBrands={calcBrands}
                        tool={tool}
                        changeTool={this.changeTool}
                      />
                    )}
                    {windowWidth >= MAX_MOBILE_WIDTH && !previewPlayer && (
                      <SaveAndExit finishTest={() => this.openSubmitConfirmation()} />
                    )}
                  </FlexContainer>
                </FlexContainer>
                <FlexContainer />
              </HeaderMainMenu>
              <HeaderRightMenu skin />
              <DragScrollContainer scrollWrraper={previewPlayer ? this.scrollElementRef.current : null} />
            </Header>
          </Affix>
          <Main skin>
            <MainWrapper>
              {testItemState === "" && (
                <TestItemPreview
                  LCBPreviewModal={LCBPreviewModal}
                  cols={itemRows}
                  questions={questions}
                  showCollapseBtn
                />
              )}
              {testItemState === "check" && (
                <TestItemPreview
                  cols={itemRows}
                  previewTab="check"
                  preview={preview}
                  evaluation={evaluation}
                  verticalDivider={item.verticalDivider}
                  scrolling={item.scrolling}
                  questions={questions}
                  LCBPreviewModal={LCBPreviewModal}
                  showCollapseBtn
                />
              )}
            </MainWrapper>
          </Main>
          {changeMode === 2 && (
            <CalculatorContainer
              changeMode={this.handleModeChange}
              changeTool={this.changeTool}
              calculateMode={calculateMode}
              calcBrands={calcBrands}
            />
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
      scratchPad: ownProps.items[ownProps.currentItem]
        ? state.userWork.present[ownProps.items[ownProps.currentItem]._id] || null
        : null,
      settings: state.test.settings,
      answerChecksUsedForItem: currentItemAnswerChecksSelector(state),
      isBookmarked: !!get(state, ["assessmentBookmarks", ownProps.items[ownProps.currentItem]._id], false),
      bookmarksInOrder: bookmarksByIndexSelector(state),
      skippedInOrder: getSkippedAnswerSelector(state),
      currentGroupId: getCurrentGroupWithAllClasses(state),
      userAnswers: state.answers
    }),
    {
      changePreview: changePreviewAction,
      saveScratchPad: saveScratchPadAction,
      undoScratchPad: ActionCreators.undo,
      redoScratchPad: ActionCreators.redo,
      toggleBookmark: toggleBookmarkAction,
      checkAnswer: checkAnswerEvaluation,
      setUserAnswer: setUserAnswerAction
    }
  )
);

export default enhance(AssessmentPlayerDefault);
