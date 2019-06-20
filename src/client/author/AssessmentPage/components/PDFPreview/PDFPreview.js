import React from "react";
import PropTypes from "prop-types";
import { Document, Page } from "react-pdf";
import { Droppable } from "react-drag-and-drop";

import { QuestionNumber } from "../QuestionItem/styled";
import QuestionItem from "../QuestionItem/QuestionItem";
import { PDFPreviewWrapper, Preview } from "./styled";

const handleDrop = (page, cb) => ({ question }, e) => {
  const {
    nativeEvent: { offsetX, offsetY }
  } = e;
  const data = JSON.parse(question);

  cb({
    x: offsetX,
    y: offsetY,
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
  questions,
  questionsById,
  answersById
}) => {
  const handleHighlight = questionId => () => {
    onHighlightQuestion(questionId);
  };

  const handleRemoveHighlight = () => {
    onHighlightQuestion();
  };

  return (
    <PDFPreviewWrapper>
      <Droppable types={["question"]} onDrop={handleDrop(currentPage, onDropAnnotation)}>
        <Preview onClick={handleRemoveHighlight}>
          {page.URL !== "blank" && (
            <Document file={page.URL} rotate={page.rotate || 0} onLoadSuccess={onDocumentLoad}>
              <Page pageNumber={page.pageNo} renderTextLayer={false} />
            </Document>
          )}
        </Preview>
      </Droppable>
      {annotations
        .filter(item => item.toolbarMode === "question" && item.page === currentPage)
        .map(({ uuid, qIndex, x, y, questionId }) => (
          <div key={uuid} onClick={handleHighlight(questionId)} style={getNumberStyles(x, y)}>
            <QuestionItem
              key={questionId}
              index={qIndex}
              data={questionsById[questionId]}
              answer={answersById[questionId]}
              viewMode="review"
            />
          </div>
        ))}
    </PDFPreviewWrapper>
  );
};

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

export default PDFPreview;
