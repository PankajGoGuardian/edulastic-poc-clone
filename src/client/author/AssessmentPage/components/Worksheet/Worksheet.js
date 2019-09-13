/* eslint-disable react/prop-types */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { isEmpty, get } from "lodash";
import { ActionCreators } from "redux-undo";
import { hexToRGB } from "@edulastic/common";
import { Modal } from "antd";

import { setTestDataAction } from "../../../TestPage/ducks";
import Thumbnails from "../Thumbnails/Thumbnails";
import PDFPreview from "../PDFPreview/PDFPreview";
import Questions from "../Questions/Questions";
import { WorksheetWrapper } from "./styled";
import Tools from "../../../../assessment/themes/AssessmentPlayerDefault/Tools";
import SvgDraw from "../../../../assessment/themes/AssessmentPlayerDefault/SvgDraw";

import { saveUserWorkAction } from "../../../../assessment/actions/userWork";

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
  URL: url || "blank",
  pageNo: pageNumber
});

class Worksheet extends React.Component {
  static propTypes = {
    docUrl: PropTypes.string,
    setTestData: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    userWork: PropTypes.object.isRequired,
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
    selected: 0,
    deleteConfirmation: false,
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
    const { pageStructure } = this.props;
    if (pageStructure[currentPage] && pageStructure[currentPage].URL) {
      this.setDeleteConfirmation(true, currentPage);
    } else {
      this.deleteBlankPage(currentPage);
    }
  };

  handleDeletePage = pageNumber => {
    this.deleteBlankPage(pageNumber);
  };

  deleteBlankPage = pageNumber => {
    const { pageStructure, setTestData, annotations } = this.props;
    if (pageStructure.length < 2) return;

    const updatedPageStructure = [...pageStructure];

    updatedPageStructure.splice(pageNumber, 1);

    const updatedAnnotations = annotations.filter(annotation => annotation.page !== pageNumber + 1);

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

  // will dispatch user work to store on here for scratchpad, passage highlight, or cross answer
  // sourceId will be one of 'scratchpad', 'resourceId', and 'crossAction'
  saveHistory = data => {
    const { currentPage } = this.state;
    const { saveUserWork, itemDetail, scratchPad = {}, userWork, setTestData } = this.props;
    this.setState(({ history }) => ({ history: history + 1 }));
    const id = itemDetail.item._id;
    saveUserWork({
      [id]: { ...userWork, scratchpad: { ...(scratchPad || {}), [currentPage]: data } }
    });

    setTestData({ freeFormNotes: { ...(scratchPad || {}), [currentPage]: data } });
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

  onDragStart = () => {
    this.setState({ activeMode: "" });
  };

  setDeleteConfirmation = (deleteConfirmation, selected = 0) => {
    this.setState({ deleteConfirmation, selected });
  };
  // setup for scratchpad ends

  // setup for scratchpad ends
  render() {
    const {
      currentPage,
      highlightedQuestion,
      currentColor,
      fillColor,
      activeMode,
      deleteConfirmation,
      deleteMode,
      selected,
      lineWidth
    } = this.state;
    const {
      docUrl,
      annotations,
      review,
      viewMode,
      noCheck,
      questions,
      questionsById,
      answersById,
      pageStructure,
      scratchPad
    } = this.props;

    const shouldRenderDocument = review ? !isEmpty(docUrl) : true;

    const selectedPage = pageStructure[currentPage] || defaultPage;

    const svgContainer = (
      <SvgDraw
        activeMode={activeMode}
        scratchPadMode
        lineColor={currentColor}
        deleteMode={deleteMode}
        lineWidth={lineWidth}
        fillColor={fillColor}
        saveHistory={this.saveHistory}
        history={scratchPad && scratchPad[currentPage]}
        height="100%"
        top={0}
      />
    );

    return (
      <WorksheetWrapper>
        <Modal
          visible={deleteConfirmation}
          onOk={() => {
            this.handleDeletePage(selected);
            this.setDeleteConfirmation(false);
          }}
          onCancel={() => this.setDeleteConfirmation(false)}
          title="Confirm Page Deletion"
          okText="Yes"
          cancelText="No"
        >
          {"Are you sure that you want to delete this page?"}
        </Modal>
        <Thumbnails
          annotations={annotations}
          list={pageStructure}
          currentPage={currentPage}
          onReupload={this.handleReupload}
          onPageChange={this.handleChangePage}
          onAddBlankPage={this.handleAppendBlankPage}
          onDeletePage={this.handleDeletePage}
          setDeleteConfirmation={this.setDeleteConfirmation}
          onDeleteSelectedBlankPage={this.handleDeleteSelectedBlankPage}
          onMovePageUp={this.handleMovePageUp}
          onMovePageDown={this.handleMovePageDown}
          onInsertBlankPage={this.handleInsertBlankPage}
          onRotate={this.handleRotate}
          review={review}
        />
        <Fragment>
          <div style={{ position: "relative", display: "flex", width: "calc(100% - 513px)" }}>
            <PDFPreview
              page={selectedPage}
              currentPage={currentPage + 1}
              annotations={annotations}
              onDropAnnotation={this.handleAddAnnotation}
              onHighlightQuestion={this.handleHighlightQuestion}
              questions={questions}
              questionsById={questionsById}
              answersById={answersById}
              renderExtra={svgContainer}
              viewMode={viewMode}
            />
            <Tools
              isWorksheet
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
          </div>
        </Fragment>
        <Questions
          noCheck={noCheck}
          list={questions}
          viewMode={viewMode}
          questionsById={questionsById}
          answersById={answersById}
          centered={!shouldRenderDocument}
          highlighted={highlightedQuestion}
          onDragStart={this.onDragStart}
        />
      </WorksheetWrapper>
    );
  }
}

const enhance = compose(
  withRouter,
  connect(
    state => ({
      scratchPad: get(
        state,
        `userWork.present[${state.itemDetail.item && state.itemDetail.item._id}].scratchpad`,
        null
      ),
      userWork: get(state, `userWork.present[${state.itemDetail.item && state.itemDetail.item._id}]`, {}),
      itemDetail: state.itemDetail,
      answersById: state.answers
    }),
    {
      saveUserWork: saveUserWorkAction,
      undoScratchPad: ActionCreators.undo,
      redoScratchPad: ActionCreators.redo,
      setTestData: setTestDataAction
    }
  )
);

export default enhance(Worksheet);
