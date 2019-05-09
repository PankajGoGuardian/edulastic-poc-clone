import React from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { isEmpty, get } from "lodash";

import { setTestDataAction } from "../../../TestPage/ducks";
import Thumbnails from "../Thumbnails/Thumbnails";
import PDFPreview from "../PDFPreview/PDFPreview";
import Questions from "../Questions/Questions";
import { WorksheetWrapper } from "./styled";

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
    totalPages: 1
  };

  handleChangePage = nextPage => {
    this.setState({ currentPage: nextPage });
  };

  handleDocumentLoad = ({ numPages }) => {
    this.setState({ totalPages: numPages });
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

  render() {
    const { currentPage } = this.state;
    const { docUrl, annotations, review, noCheck, questions, questionsById, answersById, pageStructure } = this.props;

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
          <PDFPreview
            page={selectedPage}
            currentPage={currentPage + 1}
            annotations={annotations}
            onDocumentLoad={this.handleDocumentLoad}
            onDropAnnotation={this.handleAddAnnotation}
          />
        )}
        <Questions
          noCheck={noCheck}
          list={questions}
          questionsById={questionsById}
          answersById={answersById}
          centered={!shouldRenderDocument}
        />
      </WorksheetWrapper>
    );
  }
}

const enhance = compose(
  withRouter,
  connect(
    null,
    {
      setTestData: setTestDataAction
    }
  )
);

export default enhance(Worksheet);
