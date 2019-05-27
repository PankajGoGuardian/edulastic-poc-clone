import React, { Fragment } from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { isEmpty, get } from "lodash";
import { ActionCreators } from "redux-undo";

import { setTestDataAction } from "../../../TestPage/ducks";
import Thumbnails from "../Thumbnails/Thumbnails";
import PDFPreview from "../PDFPreview/PDFPreview";
import Questions from "../Questions/Questions";
import { WorksheetWrapper } from "./styled";
import Tools from "../../../../assessment/themes/AssessmentPlayerDefault/Tools";
import SvgDraw from "../../../../assessment/themes/AssessmentPlayerDefault/SvgDraw";

import { saveScratchPadAction } from "../../../../assessment/actions/userWork";

const swap = (array, i, j) => {
  const copy = array.slice();
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
};

const defaultPage = {
  URL: "blank",
  pageNo: 1,
  rotate: 0
};

const createPage = (pageNumber, url) => ({
  ...defaultPage,
  URL: url ? url : "blank",
  pageNo: pageNumber
});

class Worksheet extends React.Component {
  static propTypes = {
    docUrl: PropTypes.string,
    setTestData: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    questionsById: PropTypes.object.isRequired,
    answersById: PropTypes.object,
    pageStructure: PropTypes.array,
    review: PropTypes.bool,
    noCheck: PropTypes.bool,
    annotations: PropTypes.array
  };

  static defaultProps = {
    review: false,
    annotations: [],
    noCheck: false,
    pageStructure: [],
    answersById: {},
    docUrl: ""
  };

  state = {
    currentPage: 0,
    highlightedQuestion: undefined,
    currentColor: "#ff0000",
    fillColor: "#ff0000",
    activeMode: "",
    history: 0,
    deleteMode: false,
    lineWidth: 6
  };

  handleHighlightQuestion = questionId =>
    this.setState({
      highlightedQuestion: questionId
    });

  handleChangePage = nextPage => {
    this.setState({ currentPage: nextPage });
  };

  handleAddAnnotation = question => {
    const { annotations, setTestData } = this.props;
    const annotation = {
      uuid: uuid(),
      type: "point",
      class: "Annotation",
      toolbarMode: "question",
      ...question
    };

    const newAnnotations = [...annotations];

    const annotationIndex = newAnnotations.findIndex(item => item.questionId === question.questionId);

    if (annotationIndex > -1) {
      newAnnotations.splice(annotationIndex, 1);
    }

    newAnnotations.push(annotation);

    const updatedAssessment = {
      annotations: newAnnotations
    };

    setTestData(updatedAssessment);
  };

  handleAppendBlankPage = () => {
    const { pageStructure } = this.props;

    const lastPageIndex = pageStructure.length - 1;
    this.addBlankPage(lastPageIndex);
  };

  handleInsertBlankPage = index => () => {
    this.addBlankPage(index);
  };

  addBlankPage = index => {
    const { pageStructure, setTestData } = this.props;

    if (index < 0 || index >= pageStructure.length) return;

    const pageNumber = index + 1;
    const blankPage = createPage(pageNumber);

    const updatedPageStructure = [...pageStructure];

    updatedPageStructure.splice(pageNumber, 0, blankPage);

    setTestData({
      pageStructure: updatedPageStructure
    });
    this.handleChangePage(pageNumber);
  };

  handleDeleteSelectedBlankPage = () => {
    const { currentPage } = this.state;
    this.deleteBlankPage(currentPage);
  };

  handleDeletePage = pageNumber => () => {
    this.deleteBlankPage(pageNumber);
  };

  deleteBlankPage = pageNumber => {
    const { pageStructure, setTestData, annotations } = this.props;

    if (pageStructure.length < 2) return;

    const page = pageStructure[pageNumber];

    if (page && page.URL === "blank") {
      const updatedPageStructure = [...pageStructure];

      updatedPageStructure.splice(pageNumber, 1);

      const annotationIndex = annotations.findIndex(annotation => annotation.page === pageNumber + 1);

      const updatedAnnotations = [...annotations];

      updatedAnnotations.splice(annotationIndex, 1);

      const updatedAssessment = {
        pageStructure: updatedPageStructure.map((item, index) => {
          if (item.URL !== "blank") return item;

          return {
            ...item,
            pageNo: index + 1
          };
        }),
        annotations: updatedAnnotations
      };

      this.handleChangePage(pageNumber - 1);
      setTestData(updatedAssessment);
    }
  };

  handleMovePageUp = pageIndex => () => {
    if (pageIndex === 0) return;

    const nextIndex = pageIndex - 1;
    const { pageStructure, setTestData } = this.props;

    const updatedPageStructure = swap(pageStructure, pageIndex, nextIndex);

    setTestData({
      pageStructure: updatedPageStructure
    });
    this.handleChangePage(nextIndex);
  };

  handleMovePageDown = pageIndex => () => {
    const { pageStructure, setTestData } = this.props;

    if (pageIndex === pageStructure.length - 1) return;

    const nextIndex = pageIndex + 1;

    const updatedPageStructure = swap(pageStructure, pageIndex, nextIndex);

    setTestData({
      pageStructure: updatedPageStructure
    });
    this.handleChangePage(nextIndex);
  };

  handleRotate = pageIndex => direction => () => {
    const { pageStructure, setTestData } = this.props;

    if (!pageStructure[pageIndex]) return;

    const page = { ...pageStructure[pageIndex] };

    const angle = direction === "clockwise" ? 90 : -90;
    const rotate = get(page, "rotate", 0) + angle;

    page.rotate = Math.abs(rotate) === 360 ? 0 : rotate;

    const updatedPageStructure = [...pageStructure];

    updatedPageStructure.splice(pageIndex, 1, page);

    setTestData({
      pageStructure: updatedPageStructure
    });
  };

  handleReupload = () => {
    const {
      match: {
        params: { assessmentId }
      },
      history
    } = this.props;
    history.push(`/author/assessments/create?assessmentId=${assessmentId}`);
  };

  // Set up for scratchpad

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

  saveHistory = data => {
    console.log("data after drawing", data);
    const { saveScratchPad, itemDetail } = this.props;
    this.setState(({ history }) => ({ history: history + 1 }));
    const id = itemDetail["item"]["_id"];
    saveScratchPad({
      [id]: data
    });
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
      currentColor: this.hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100)
    });
  };

  // setup for scratchpad ends

  render() {
    const {
      currentPage,
      highlightedQuestion,
      currentColor,
      fillColor,
      activeMode,
      history,
      deleteMode,
      lineWidth
    } = this.state;
    const {
      docUrl,
      annotations,
      review,
      noCheck,
      questions,
      questionsById,
      answersById,
      pageStructure,
      scratchPad
    } = this.props;

    const shouldRenderDocument = review ? !isEmpty(docUrl) : true;

    const selectedPage = pageStructure[currentPage] || defaultPage;

    return (
      <WorksheetWrapper>
        {(review ? pageStructure.length > 1 : true) && (
          <Thumbnails
            list={pageStructure}
            currentPage={currentPage}
            onReupload={this.handleReupload}
            onPageChange={this.handleChangePage}
            onAddBlankPage={this.handleAppendBlankPage}
            onDeletePage={this.handleDeletePage}
            onDeleteSelectedBlankPage={this.handleDeleteSelectedBlankPage}
            onMovePageUp={this.handleMovePageUp}
            onMovePageDown={this.handleMovePageDown}
            onInsertBlankPage={this.handleInsertBlankPage}
            onRotate={this.handleRotate}
            review={review}
          />
        )}
        {shouldRenderDocument && (
          <Fragment>
            <PDFPreview
              page={selectedPage}
              currentPage={currentPage + 1}
              annotations={annotations}
              onDropAnnotation={this.handleAddAnnotation}
              onHighlightQuestion={this.handleHighlightQuestion}
            />
            <SvgDraw
              activeMode={activeMode}
              scratchPadMode={true}
              lineColor={currentColor}
              deleteMode={deleteMode}
              lineWidth={lineWidth}
              fillColor={fillColor}
              saveHistory={this.saveHistory}
              history={scratchPad}
              height={560}
              top={0}
            />
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
          </Fragment>
        )}
        <Questions
          noCheck={noCheck}
          list={questions}
          questionsById={questionsById}
          answersById={answersById}
          centered={!shouldRenderDocument}
          highlighted={highlightedQuestion}
        />
      </WorksheetWrapper>
    );
  }
}

const enhance = compose(
  withRouter,
  connect(
    (state, ownProps) => {
      return {
        scratchPad: state["itemDetail"]["item"]
          ? state.userWork.present[state["itemDetail"]["item"]["_id"]] || null
          : null,
        itemDetail: state["itemDetail"]
      };
    },
    {
      saveScratchPad: saveScratchPadAction,
      undoScratchPad: ActionCreators.undo,
      redoScratchPad: ActionCreators.redo,
      setTestData: setTestDataAction
    }
  )
);

export default enhance(Worksheet);
