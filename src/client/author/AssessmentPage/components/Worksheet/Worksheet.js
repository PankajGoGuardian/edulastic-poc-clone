/* eslint-disable react/prop-types */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { get, debounce } from "lodash";
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

class WorksheetComponent extends React.Component {
  constructor(props) {
    super(props);
    this.pdfRef = React.createRef();
  }

  static propTypes = {
    setTestData: PropTypes.func.isRequired,
    userWork: PropTypes.object.isRequired,
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
    answersById: {}
  };

  cancelUpload;

  state = {
    currentPage: 0,
    highlightedQuestion: undefined,
    currentColor: "#ff0000",
    fillColor: "#ff0000",
    currentFont: "",
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
    isToolBarVisible: true,
    fromFreeFormNotes: {},
    pageZoom: 1
  };

  componentDidMount() {
    const { saveUserWork, itemDetail, freeFormNotes } = this.props;

    const fromFreeFormNotes = {};
    if (itemDetail?._id) {
      for (const key in freeFormNotes) {
        if (Object.prototype.hasOwnProperty.call(freeFormNotes, key)) {
          for (const figureType in freeFormNotes[key]) {
            if (Object.prototype.hasOwnProperty.call(freeFormNotes[key], figureType)) {
              fromFreeFormNotes[figureType] = freeFormNotes[key][figureType].length;
            }
          }
        }
      }
      saveUserWork({ [itemDetail._id]: { scratchpad: freeFormNotes || {} } });
      this.setState({ fromFreeFormNotes });
    }
  }

  static getDerivedStateFromProps(props, prevState) {
    if (prevState.uploadModal && prevState.creating && !props.creating) {
      return {
        uploadModal: false,
        creating: false,
        isAddPdf: false
      };
    }
    if (!prevState.creating && props.creating) {
      return {
        creating: true
      };
    }
  }

  handleHighlightQuestion = (questionId, pdfPreview = false) => {
    this.setState({ highlightedQuestion: questionId });
    const { currentPage } = this.state;
    const { annotations } = this.props;
    if (!pdfPreview) {
      const { page, y } = annotations.find(x => x.questionId === questionId) || {};
      if (!page) return;
      if (page - 1 !== currentPage) this.handleChangePage(page - 1);
      if (this?.pdfRef?.current) {
        const scrollableDOMNode = this.pdfRef?.current?._ps?.element;
        const { top } = scrollableDOMNode.getBoundingClientRect() || {};
        if (y > top) {
          scrollableDOMNode.scrollTo({
            top: y - top || 0,
            behavior: "smooth"
          });
        }
      }
    }
  };

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
    // TODO some one plis fix this shit.
    /* Scratchpad component requires an object in this({"1":value,"2":value,"3":value}) 
    format to perform rendering.
    As the freeFormNotes is not an array can not perform the shift or splice operations. 
    So found below way to shift items. */
    Object.keys(freeFormNotes).forEach(item => {
      const parsedItem = parseInt(item, 10);
      // new note should not have the removed key so return here
      if (parsedItem === pageNumber) return;
      // all items greater than the removed should shift backwards.
      if (parsedItem > pageNumber) {
        // eslint-disable-next-line no-return-assign
        return (newFreeFormNotes[parsedItem - 1] = freeFormNotes[item]);
      }
      newFreeFormNotes[parsedItem] = freeFormNotes[item];
    });
    const updatedAnnotations = annotations
      // eslint-disable-next-line array-callback-return
      .map(x => {
        if (x.page === pageNumber) {
          return null;
        }
        if (x.page < pageNumber) {
          return x;
        }
        if (x.page > pageNumber) {
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
    const id = itemDetail?._id;
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

    const id = itemDetail?._id;
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

    const id = itemDetail?._id;
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

  handleChangeFont = font => this.setState({ currentFont: font });

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
    const id = itemDetail?._id;

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

  handleChangeLineWidth = size => this.setState({ lineWidth: size });

  onDragStart = questionId => {
    this.handleHighlightQuestion(questionId, true);
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
      cancelUpload: this.setCancelFn,
      merge: true
    });
  }, 1000);

  handleCreateBlankAssessment = event => {
    event.stopPropagation();
    this.handleAppendBlankPage();
    this.setState({ uploadModal: false });
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

  setZoom = zoom => this.setState({ pageZoom: zoom });

  // setup for scratchpad ends
  render() {
    const {
      annotations,
      review,
      creating,
      viewMode,
      noCheck,
      questions,
      questionsById,
      percentageUploaded,
      fileInfo,
      pageStructure,
      scratchPad = {},
      freeFormNotes = {},
      windowWidth,
      test: { isDocBased },
      testMode = false,
      studentWorkAnswersById,
      studentWork,
      isAssessmentPlayer,
      extraPaddingTop
    } = this.props;

    const {
      currentPage,
      uploadModal,
      highlightedQuestion,
      currentColor,
      currentFont,
      fillColor,
      activeMode,
      deleteConfirmation,
      deleteMode,
      isAddPdf,
      selected,
      minimized,
      lineWidth,
      isToolBarVisible,
      fromFreeFormNotes
    } = this.state;
    let { answersById } = this.props;
    if (studentWorkAnswersById) {
      answersById = studentWorkAnswersById;
    }

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
        zoom={this.state.pageZoom}
        position="absolute"
        fontFamily={currentFont}
        fromFreeFormNotes={isAssessmentPlayer ? fromFreeFormNotes : {}}
      />
    );

    // LEFT THUMBNAILS AREA 200+(15 extra space) IS THE THUMBNAILS AREA
    // WIDTH WHEN MINIMIZED REDUCE width AND USE that space for PDF AREA
    const leftColumnWidth = minimized ? 0 : windowWidth > 1024 ? 215 : 195;
    // 350+(15 extra space) IS THE TOTAL WIDTH OF RIGHT QUESTION AREA
    const rightColumnWidth = windowWidth > 1024 ? 365 : 295;
    const pdfWidth = windowWidth - rightColumnWidth - leftColumnWidth;
    const reportMode = viewMode && viewMode === "report";

    return (
      <WorksheetWrapper reportMode={reportMode} testMode={testMode} extraPaddingTop={extraPaddingTop}>
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
          Are you sure that you want to delete this page?
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
            testMode={testMode}
            reportMode={reportMode}
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
          <div
            style={{
              position: "relative",
              display: "flex",
              width: `${pdfWidth}px`,
              overflowX: "auto",
              paddingLeft: `${!minimized && (testMode || viewMode === "edit") ? "60px" : "20px"}`
            }}
          >
            <PDFPreview
              page={selectedPage}
              currentPage={currentPage + 1}
              annotations={annotations}
              onDragStart={this.onDragStart}
              onDropAnnotation={this.handleAddAnnotation}
              onHighlightQuestion={this.handleHighlightQuestion}
              questions={questions}
              questionsById={questionsById}
              answersById={answersById}
              renderExtra={svgContainer}
              setZoom={this.setZoom}
              viewMode={viewMode}
              reportMode={reportMode}
              isToolBarVisible={isToolBarVisible}
              pdfWidth={pdfWidth - 100}
              minimized={minimized}
              pageChange={this.handleChangePage}
              testMode={testMode}
              studentWork={studentWork}
              highlighted={highlightedQuestion}
              forwardedRef={this.pdfRef}
              review={review}
            />
            {viewMode !== "report" && isToolBarVisible && (
              <Tools
                isWorksheet
                onFillColorChange={this.onFillColorChange}
                fillColor={fillColor}
                deleteMode={deleteMode}
                currentColor={currentColor}
                onToolChange={this.handleToolChange}
                onChangeFont={this.handleChangeFont}
                currentFont={currentFont}
                activeMode={activeMode}
                undo={this.handleUndo}
                redo={this.handleRedo}
                onColorChange={this.handleColorChange}
                testMode={testMode}
                review={review}
                lineWidth={lineWidth}
                onChangeSize={this.handleChangeLineWidth}
                isToolBarVisible={isToolBarVisible}
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
          lockAxis="y"
          useDragHandle
          onSortEnd={this.onSortEnd}
          testMode={testMode}
          isDocBased={isDocBased}
          reportMode={reportMode}
        />
      </WorksheetWrapper>
    );
  }
}

const withForwardedRef = Component => {
  const handle = (props, ref) => <Component {...props} forwardedRef={ref} />;

  const name = Component.displayName || Component.name;
  handle.displayName = `withForwardedRef(${name})`;

  return React.forwardRef(handle);
};

const Worksheet = withForwardedRef(WorksheetComponent);

export { Worksheet };

const enhance = compose(
  withWindowSizes,
  withRouter,
  connect(
    (state, ownProps) => ({
      scratchPad: get(
        state,
        `userWork.present[${
          ownProps.isAssessmentPlayer ? ownProps.item?._id : state.itemDetail?.item?._id
        }].scratchpad`,
        null
      ),
      test: getTestEntitySelector(state),
      userWork: get(
        state,
        `userWork.present[${ownProps.isAssessmentPlayer ? ownProps.item?._id : state.itemDetail?.item?._id}]`,
        {}
      ),
      itemDetail: ownProps.isAssessmentPlayer ? ownProps.item : state.itemDetail.item,
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
