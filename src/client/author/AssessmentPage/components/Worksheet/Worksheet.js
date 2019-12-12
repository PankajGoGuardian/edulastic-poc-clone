import React, { Fragment } from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { isEmpty, get, debounce } from "lodash";
import { ActionCreators } from "redux-undo";
import { hexToRGB, withWindowSizes } from "@edulastic/common";
import { white, themeColor } from "@edulastic/colors";
import styled from "styled-components";
import { Modal, message, Button } from "antd";
import { IconGraphRightArrow } from "@edulastic/icons";
import { setTestDataAction } from "../../../TestPage/ducks";
import Thumbnails from "../Thumbnails/Thumbnails";
import PDFPreview from "../PDFPreview/PDFPreview";
import Questions from "../Questions/Questions";
import { WorksheetWrapper, MinimizeButton } from "./styled";
import Tools from "../../../../assessment/themes/AssessmentPlayerDefault/Tools";
import SvgDraw from "../../../../assessment/themes/AssessmentPlayerDefault/SvgDraw";
import { updateQuestionNumberAction } from "../../../sharedDucks/questions";

import { saveUserWorkAction } from "../../../../assessment/actions/userWork";
import { getTestEntitySelector } from "../../../AssignTest/duck";
import DropArea from "../../../AssessmentCreate/components/DropArea/DropArea";
import {
  getAssessmentCreatingSelector,
  percentageUploadedSelector,
  fileInfoSelector,
  createAssessmentRequestAction,
  setPercentUploadedAction
} from "../../../AssessmentCreate/ducks";

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

const StyledSubmitBtn = styled(Button)`
  background: ${themeColor};
  color: ${white};
  &:hover,
  &:active,
  &:focus {
    background: ${themeColor};
    color: ${white};
  }
`;

const StyledCancelBtn = styled(Button)`
  color: ${themeColor};
  border-color: ${themeColor};
`;

class Worksheet extends React.Component {
  static propTypes = {
    docUrl: PropTypes.string,
    setTestData: PropTypes.func.isRequired,
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

  cancelUpload;

  state = {
    currentPage: 0,
    highlightedQuestion: undefined,
    currentColor: "#ff0000",
    fillColor: "#ff0000",
    activeMode: "",
    history: 0,
    selected: 0,
    uploadModal: false,
    isAddPdf: false,
    creating: false,
    deleteConfirmation: false,
    deleteMode: false,
    minimized: false,
    lineWidth: 6,
    isToolBarVisible: true
  };

  componentDidMount() {
    const { saveUserWork, itemDetail, freeFormNotes } = this.props;
    if (itemDetail?.item?._id) {
      saveUserWork({ [itemDetail.item._id]: { scratchpad: freeFormNotes || {} } });
    }
  }

  static getDerivedStateFromProps(props, prevState) {
    if (prevState.uploadModal && prevState.creating && !props.creating) {
      return {
        uploadModal: false,
        creating: false,
        isAddPdf: false
      };
    } else if (!prevState.creating && props.creating) {
      return {
        creating: true
      };
    }
  }

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

    if (index < 0 || index > pageStructure.length) return;

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
    const { pageStructure, annotations = [] } = this.props;
    if (
      (pageStructure[currentPage] && pageStructure[currentPage].URL !== "blank") ||
      annotations.some(annotation => annotation.page === currentPage + 1)
    ) {
      this.setDeleteConfirmation(true, currentPage);
    } else {
      this.deleteBlankPage(currentPage);
    }
  };

  handleDeletePage = pageNumber => {
    this.deleteBlankPage(pageNumber);
  };

  deleteBlankPage = pageNumber => {
    const {
      pageStructure,
      setTestData,
      annotations,
      saveUserWork,
      itemDetail,
      userWork,
      freeFormNotes = {}
    } = this.props;
    if (pageStructure.length < 2) return;

    const updatedPageStructure = [...pageStructure];

    updatedPageStructure.splice(pageNumber, 1);

    const newFreeFormNotes = {};
    //TODO some one plis fix this shit.
    /*Scratchpad component requires an object in this({"1":value,"2":value,"3":value}) format to perform rendering. As the freeFormNotes is not an array can not perform the shift or splice operations. So found below way to shift items.*/
    Object.keys(freeFormNotes).forEach(item => {
      const parsedItem = parseInt(item);
      //new note should not have the removed key so return here
      if (parsedItem === pageNumber) return;
      //all items greater than the removed should shift backwards.
      if (parsedItem > pageNumber) {
        return (newFreeFormNotes[parsedItem - 1] = freeFormNotes[item]);
      }
      newFreeFormNotes[parsedItem] = freeFormNotes[item];
    });
    const updatedAnnotations = annotations
      .map(x => {
        if (x.page === pageNumber) {
          return null;
        } else if (x.page < pageNumber) {
          return x;
        } else if (x.page > pageNumber) {
          return { ...x, page: x.page - 1 };
        }
      })
      .filter(x => x);

    const updatedAssessment = {
      pageStructure: updatedPageStructure.map((item, index) => {
        if (item.URL !== "blank") return item;

        return {
          ...item,
          pageNo: index + 1
        };
      }),
      freeFormNotes: newFreeFormNotes,
      annotations: updatedAnnotations
    };
    const id = itemDetail?.item?._id;
    if (id) {
      this.setState(({ history }) => ({ history: history + 1 }));
      saveUserWork({
        [id]: { ...userWork, scratchpad: newFreeFormNotes }
      });
    }

    this.handleChangePage(pageNumber > 0 ? pageNumber - 1 : pageNumber);
    setTestData(updatedAssessment);
  };

  handleMovePageUp = pageIndex => () => {
    if (pageIndex === 0) return;

    const nextIndex = pageIndex - 1;
    const {
      pageStructure,
      setTestData,
      annotations = [],
      freeFormNotes = {},
      itemDetail,
      userWork,
      saveUserWork
    } = this.props;

    const newFreeFormNotes = {
      ...freeFormNotes,
      [nextIndex]: freeFormNotes[pageIndex],
      [pageIndex]: freeFormNotes[nextIndex]
    };

    const newAnnotations = annotations.map(annotation => ({
      ...annotation,
      page:
        annotation.page === pageIndex + 1
          ? nextIndex + 1
          : annotation.page === nextIndex + 1
          ? pageIndex + 1
          : annotation.page
    }));
    const updatedPageStructure = swap(pageStructure, pageIndex, nextIndex);

    const id = itemDetail?.item?._id;
    if (id) {
      saveUserWork({
        [id]: { ...userWork, scratchpad: { ...newFreeFormNotes } }
      });
    }
    setTestData({
      freeFormNotes: newFreeFormNotes,
      annotations: newAnnotations,
      pageStructure: updatedPageStructure
    });
    this.handleChangePage(nextIndex);
  };

  handleMovePageDown = pageIndex => () => {
    const {
      pageStructure,
      setTestData,
      annotations = [],
      freeFormNotes = {},
      itemDetail,
      saveUserWork,
      userWork
    } = this.props;
    if (pageIndex === pageStructure.length - 1) return;

    const nextIndex = pageIndex + 1;

    const newFreeFormNotes = {
      ...freeFormNotes,
      [nextIndex]: freeFormNotes[pageIndex],
      [pageIndex]: freeFormNotes[nextIndex]
    };
    const newAnnotations = annotations.map(annotation => ({
      ...annotation,
      page:
        annotation.page === pageIndex + 1
          ? nextIndex + 1
          : annotation.page === nextIndex + 1
          ? pageIndex + 1
          : annotation.page
    }));
    const updatedPageStructure = swap(pageStructure, pageIndex, nextIndex);

    const id = itemDetail?.item?._id;
    if (id) {
      saveUserWork({
        [id]: { ...userWork, scratchpad: { ...newFreeFormNotes } }
      });
    }
    setTestData({
      annotations: newAnnotations,
      freeFormNotes: newFreeFormNotes,
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
    this.setState({ uploadModal: true });
  };

  handleAddPdf = () => {
    this.setState({ uploadModal: true, isAddPdf: true });
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

  // will dispatch user work to store on here for scratchpad, passage highlight, or cross answer
  // sourceId will be one of 'scratchpad', 'resourceId', and 'crossAction'
  saveHistory = data => {
    const { currentPage } = this.state;
    const { saveUserWork, itemDetail, scratchPad = {}, userWork, setTestData } = this.props;
    const id = itemDetail?.item?._id;
    if (id) {
      this.setState(({ history }) => ({ history: history + 1 }));

      saveUserWork({
        [id]: { ...userWork, scratchpad: { ...(scratchPad || {}), [currentPage]: data } }
      });

      setTestData({ freeFormNotes: { ...(scratchPad || {}), [currentPage]: data } });
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

  onDragStart = () => {
    this.setState({ activeMode: "" });
  };

  setDeleteConfirmation = (deleteConfirmation, selected = 0) => {
    this.setState({ deleteConfirmation, selected });
  };

  handleUploadPDF = debounce(({ file }) => {
    const { isAddPdf = false } = this.state;
    const {
      createAssessment,
      test: { _id: assessmentId }
    } = this.props;
    if (file.type !== "application/pdf") {
      return message.error("File format not supported, please select a valid PDF file.");
    }
    if (file.size / 1024000 > 15) {
      return message.error("File size exceeds 15 MB MB limit.");
    }
    createAssessment({
      file,
      assessmentId,
      progressCallback: this.handleUploadProgress,
      isAddPdf,
      cancelUpload: this.setCancelFn
    });
  }, 1000);

  handleCreateBlankAssessment = event => {
    event.stopPropagation();
    const { isAddPdf } = this.state;
    const {
      createAssessment,
      test: { _id: assessmentId }
    } = this.props;

    createAssessment({ assessmentId, isAddPdf });
  };

  setCancelFn = _cancelFn => {
    this.cancelUpload = _cancelFn;
  };

  handleUploadProgress = progressEvent => {
    const { setPercentUploaded } = this.props;
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    setPercentUploaded(percentCompleted);
  };

  toggleMinimized = () => {
    this.setState(prevProps => ({ minimized: !prevProps.minimized, isToolBarVisible: true }));
  };

  toggleToolBarVisiblity = () => {
    this.setState(prev => ({ isToolBarVisible: !prev.isToolBarVisible }));
  };

  onSortEnd = data => {
    const { updateQuestionNumber } = this.props;
    updateQuestionNumber(data);
  };

  // setup for scratchpad ends
  render() {
    const {
      currentPage,
      uploadModal,
      highlightedQuestion,
      currentColor,
      fillColor,
      activeMode,
      deleteConfirmation,
      deleteMode,
      isAddPdf,
      selected,
      minimized,
      lineWidth,
      isToolBarVisible
    } = this.state;
    const {
      docUrl,
      annotations,
      review,
      creating,
      viewMode,
      noCheck,
      questions,
      questionsById,
      answersById,
      percentageUploaded,
      fileInfo,
      pageStructure,
      scratchPad = {},
      freeFormNotes = {},
      windowWidth,
      test: { isDocBased },
      testMode = false
    } = this.props;
    const selectedPage = pageStructure[currentPage] || defaultPage;
    const userHistory = review ? freeFormNotes[currentPage] : scratchPad && scratchPad[currentPage];

    const svgContainer = (
      <SvgDraw
        activeMode={activeMode}
        scratchPadMode
        lineColor={currentColor}
        deleteMode={deleteMode}
        lineWidth={lineWidth}
        fillColor={fillColor}
        saveHistory={this.saveHistory}
        history={userHistory}
        height="100%"
        top={0}
        position="absolute"
      />
    );

    //450 IS THE TOTAL WIDTH OF RIGHT QUESTION AREA AND LEFT THUMBNAILS AREA 220 IS THE THUMBNAILS AREA WIDTH WHEN MINIMIZED REDUCE 220 AND USE that space for PDF AREA
    const pdfWidth = minimized ? windowWidth - 450 : windowWidth - 450 - 220;

    return (
      <WorksheetWrapper>
        <Modal
          visible={deleteConfirmation}
          title="Confirm Page Deletion"
          onCancel={() => this.setDeleteConfirmation(false)}
          footer={[
            <StyledCancelBtn onClick={() => this.setDeleteConfirmation(false)}>No</StyledCancelBtn>,
            <StyledSubmitBtn
              key="back"
              onClick={() => {
                this.handleDeletePage(selected);
                this.setDeleteConfirmation(false);
              }}
            >
              Yes
            </StyledSubmitBtn>
          ]}
        >
          {"Are you sure that you want to delete this page?"}
        </Modal>
        <Modal
          width={700}
          visible={uploadModal}
          onCancel={() => this.setState({ uploadModal: false, isAddPdf: false })}
          footer={null}
        >
          <DropArea
            loading={creating}
            onUpload={this.handleUploadPDF}
            onCreateBlank={this.handleCreateBlankAssessment}
            percent={percentageUploaded}
            fileInfo={fileInfo}
            isAddPdf={isAddPdf}
            cancelUpload={this.cancelUpload}
          />
        </Modal>

        {!minimized && (
          <Thumbnails
            annotations={annotations}
            list={pageStructure}
            currentPage={currentPage}
            onReupload={this.handleReupload}
            onAddPdf={this.handleAddPdf}
            onPageChange={this.handleChangePage}
            onAddBlankPage={this.handleAppendBlankPage}
            onDeletePage={this.handleDeletePage}
            setDeleteConfirmation={this.setDeleteConfirmation}
            onDeleteSelectedBlankPage={this.handleDeleteSelectedBlankPage}
            onMovePageUp={this.handleMovePageUp}
            onMovePageDown={this.handleMovePageDown}
            onInsertBlankPage={this.handleInsertBlankPage}
            onRotate={this.handleRotate}
            viewMode={viewMode}
            review={review}
            isToolBarVisible={isToolBarVisible}
            toggleToolBarVisiblity={this.toggleToolBarVisiblity}
            noCheck={noCheck}
            minimized={minimized}
            toggleMinimized={this.toggleMinimized}
          />
        )}

        {minimized && (
          <MinimizeButton onClick={this.toggleMinimized} minimized={minimized}>
            <IconGraphRightArrow />
          </MinimizeButton>
        )}

        <Fragment>
          <div style={{ position: "relative", display: "flex", width: `${pdfWidth}px`, overflowX: "auto" }}>
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
              isToolBarVisible={isToolBarVisible}
              pdfWidth={pdfWidth - 100}
              minimized={minimized}
              pageChange={this.handleChangePage}
              testMode={testMode}
            />
            {viewMode !== "report" && !minimized && isToolBarVisible && (
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
                testMode={testMode}
                isDocBased={isDocBased}
              />
            )}
          </div>
        </Fragment>
        <Questions
          noCheck={noCheck}
          list={questions}
          review={review}
          viewMode={viewMode}
          questionsById={questionsById}
          answersById={answersById}
          highlighted={highlightedQuestion}
          onDragStart={this.onDragStart}
          onHighlightQuestion={this.handleHighlightQuestion}
          lockToContainerEdges
          lockOffset={["10%", "0%"]}
          lockAxis={"y"}
          useDragHandle
          onSortEnd={this.onSortEnd}
          testMode={testMode}
          isDocBased={isDocBased}
        />
      </WorksheetWrapper>
    );
  }
}

const enhance = compose(
  withWindowSizes,
  withRouter,
  connect(
    state => ({
      scratchPad: get(
        state,
        `userWork.present[${state.itemDetail.item && state.itemDetail.item._id}].scratchpad`,
        null
      ),
      test: getTestEntitySelector(state),
      userWork: get(state, `userWork.present[${state.itemDetail.item && state.itemDetail.item._id}]`, {}),
      itemDetail: state.itemDetail,
      creating: getAssessmentCreatingSelector(state),
      percentageUploaded: percentageUploadedSelector(state),
      fileInfo: fileInfoSelector(state),
      answersById: state.answers
    }),
    {
      saveUserWork: saveUserWorkAction,
      createAssessment: createAssessmentRequestAction,
      setPercentUploaded: setPercentUploadedAction,
      undoScratchPad: ActionCreators.undo,
      redoScratchPad: ActionCreators.redo,
      setTestData: setTestDataAction,
      updateQuestionNumber: updateQuestionNumberAction
    }
  )
);

export default enhance(Worksheet);
