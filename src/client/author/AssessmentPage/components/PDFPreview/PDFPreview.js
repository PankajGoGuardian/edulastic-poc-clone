/* eslint-disable react/prop-types */
import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Document, Page } from "react-pdf";
import { connect } from "react-redux";
import { Droppable } from "react-drag-and-drop";
import PerfectScrollbar from "react-perfect-scrollbar";
import { withRouter } from "react-router";

import Styled from "styled-components";
import { getPreviewSelector } from "../../../src/selectors/view";
import QuestionItem from "../QuestionItem/QuestionItem";
import { PDFPreviewWrapper, Preview, ZoomControlCotainer, PDFZoomControl } from "./styled";
import { removeUserAnswerAction } from "../../../../assessment/actions/answers";

const handleDrop = (page, cb) => ({ question }, e) => {
  const {
    nativeEvent: { offsetX, offsetY }
  } = e;
  const data = JSON.parse(question);

  cb({
    x: offsetX - 16,
    y: offsetY - 16,
    page,
    questionId: data.id,
    qIndex: data.index
  });
};

const getNumberStyles = (x, y) => ({
  position: "absolute",
  top: `${y}px`,
  left: `${x}px`
});

const PDFPreview = ({
  page,
  currentPage,
  annotations,
  onDocumentLoad,
  onDropAnnotation,
  onHighlightQuestion,
  questionsById,
  answersById,
  viewMode,
  renderExtra = "",
  previewMode,
  isToolBarVisible,
  pdfWidth,
  pdfHeight,
  minimized,
  history,
  pageChange,
  removeAnswers,
  testMode,
  reportMode,
  studentWork = false,
  highlighted,
  forwardedRef,
  onDragStart,
  review
}) => {
  const [pdfScale, scalePDF] = useState(1);

  const previewContainer = useRef();

  const PDFScaleUp = (scale = 0.25) => {
    const zoom = pdfScale < 3 ? pdfScale + scale : pdfScale;
    scalePDF(zoom);
  };

  const PDFScaleDown = (scale = 0.25) => {
    const zoom = pdfScale > 0.5 ? pdfScale - scale : pdfScale;
    scalePDF(zoom);
  };

  useLayoutEffect(() => {
    const { question: qid } = history?.location?.state || {};
    /**
     * need to scroll to a particular question in assessment player
     * and to the particular page if the question dropped
     */
    if (qid) {
      const questionAnnotation = annotations.find(x => x.questionId === qid);
      if (questionAnnotation?.page) {
        pageChange(questionAnnotation.page - 1);
      }
      /**
       * it takes some time to render the annotations and to be available in dom
       */
      setTimeout(() => {
        const elements = document.querySelectorAll(`.doc-based-question-item-for-scroll-${qid}`);
        for (const el of elements) {
          el.scrollIntoView();
        }
      }, 2000);
    }
  }, [annotations]);

  useEffect(() => {
    // don't remove answers if student attempts -> saves and/or revisits the answers
    if (!testMode) removeAnswers();
  }, [viewMode, testMode]);

  const handleHighlight = questionId => () => {
    onHighlightQuestion(questionId, true);
  };

  const handleRemoveHighlight = () => {
    onHighlightQuestion();
  };

  return (
    <PDFPreviewWrapper
      review={review}
      testMode={testMode}
      reportMode={reportMode}
      viewMode={viewMode === "report"}
      isToolBarVisible={isToolBarVisible}
      minimized={minimized}
    >
      <PerfectScrollbar ref={forwardedRef}>
        <Droppable
          types={["question"]}
          onDrop={handleDrop(currentPage, onDropAnnotation)}
          style={{ top: 0, display: "block" }}
        >
          <Preview onClick={handleRemoveHighlight} ref={previewContainer}>
            {page.URL !== "blank" && (
              <Document file={page.URL} rotate={page.rotate || 0} onLoadSuccess={onDocumentLoad}>
                <Page
                  pageNumber={page.pageNo}
                  scale={pdfScale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  width={pdfWidth}
                  height={pdfHeight}
                />
              </Document>
            )}
            {renderExtra}
          </Preview>
          <AnnotationsContainer className="annotations-container" zoom={pdfScale}>
            {annotations
              .filter(item => item.toolbarMode === "question" && item.page === currentPage)
              .map(({ uuid, qIndex, x, y, questionId }) => (
                <div
                  className="annotation-item"
                  key={uuid}
                  onClick={handleHighlight(questionId)}
                  style={getNumberStyles(x, y)}
                >
                  <QuestionItem
                    key={questionId}
                    index={qIndex}
                    questionIndex={qIndex}
                    review={review}
                    data={questionsById[questionId]}
                    answer={answersById[questionId]}
                    previewMode={viewMode === "edit" ? "clear" : previewMode}
                    onDragStart={() => onDragStart(questionId)}
                    testMode={testMode}
                    highlighted={highlighted === questionId}
                    viewMode={viewMode}
                    annotations
                    pdfPreview
                  />
                </div>
              ))}
          </AnnotationsContainer>
        </Droppable>

        {!studentWork ? (
          <ZoomControlCotainer>
            <PDFZoomControl onClick={() => PDFScaleUp(0.25)}> &#43; </PDFZoomControl>
            <PDFZoomControl onClick={() => PDFScaleDown(0.25)}> &minus; </PDFZoomControl>
          </ZoomControlCotainer>
        ) : null}
      </PerfectScrollbar>
    </PDFPreviewWrapper>
  );
};

const AnnotationsContainer = Styled.div`
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: absolute;
  transform-origin: left top;
  transform: scale(${props => props.zoom || 1});
`;

PDFPreview.propTypes = {
  page: PropTypes.object.isRequired,
  currentPage: PropTypes.number.isRequired,
  annotations: PropTypes.array,
  onDocumentLoad: PropTypes.func.isRequired,
  onDropAnnotation: PropTypes.func.isRequired,
  onHighlightQuestion: PropTypes.func.isRequired
};

PDFPreview.defaultProps = {
  annotations: []
};

export default connect(
  state => ({ previewMode: getPreviewSelector(state) }),
  { removeAnswers: removeUserAnswerAction }
)(withRouter(PDFPreview));
