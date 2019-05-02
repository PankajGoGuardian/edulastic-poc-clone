import React from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { isEmpty } from "lodash";

import { setTestDataAction } from "../../../TestPage/ducks";
import Thumbnails from "../Thumbnails/Thumbnails";
import PDFPreview from "../PDFPreview/PDFPreview";
import Questions from "../Questions/Questions";
import { WorksheetWrapper } from "./styled";

const defaultPreview = 1;

const createPage = (pageNumber, url) => ({
  [pageNumber]: {
    URL: url ? "main" : "blank",
    pageNo: pageNumber,
    rotate: 0,
    annotationIds: []
  }
});

class Worksheet extends React.Component {
  static propTypes = {
    docUrl: PropTypes.string.isRequired,
    setTestData: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    questionsById: PropTypes.object.isRequired,
    answersById: PropTypes.object.isRequired,
    pageStructure: PropTypes.object,
    review: PropTypes.bool,
    noCheck: PropTypes.bool,
    annotations: PropTypes.array
  };

  static defaultProps = {
    review: false,
    annotations: [],
    noCheck: false,
    pageStructure: {}
  };

  state = {
    currentPage: 1,
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

  handleAddBlankPage = () => {
    const { pageStructure, setTestData } = this.props;

    const blankPageNumber = Object.keys(pageStructure).length + 2;

    const newBlankPage = createPage(blankPageNumber);

    const updatedAssessment = {
      pageStructure: {
        ...pageStructure,
        ...newBlankPage
      }
    };

    setTestData(updatedAssessment);
  };

  handleDeleteBlankPage = () => {
    const { currentPage } = this.state;
    const { pageStructure, setTestData } = this.props;

    if (currentPage in pageStructure) {
      const updatedPageStructure = { ...pageStructure };

      delete updatedPageStructure[currentPage];

      this.handleChangePage(currentPage - 1);

      setTestData({
        pageStructure: updatedPageStructure
      });
    }
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
    const { currentPage, totalPages } = this.state;
    const { docUrl, annotations, review, noCheck, questions, questionsById, answersById, pageStructure } = this.props;

    const blankPagesAmount = Object.keys(pageStructure).length + 1;
    const thumbnails = new Array(docUrl ? totalPages : blankPagesAmount).fill(defaultPreview);
    const shouldRenderDocument = review ? !isEmpty(docUrl) : true;

    return (
      <WorksheetWrapper>
        {(review ? totalPages > 1 : true) && (
          <Thumbnails
            list={thumbnails}
            currentPage={currentPage}
            url={docUrl}
            onReupload={this.handleReupload}
            onPageChange={this.handleChangePage}
            onAddBlankPage={this.handleAddBlankPage}
            onDeleteBlankPage={this.handleDeleteBlankPage}
            review={review}
          />
        )}
        {shouldRenderDocument && (
          <PDFPreview
            url={docUrl}
            page={currentPage}
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
