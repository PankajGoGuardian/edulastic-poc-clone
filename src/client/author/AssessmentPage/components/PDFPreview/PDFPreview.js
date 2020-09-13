import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import { withRouter } from "react-router";
import { round } from "lodash";
import { DragDrop } from "@edulastic/common";
import { IconGraphRightArrow, IconChevronLeft } from "@edulastic/icons";
import { getPreviewSelector } from "../../../src/selectors/view";
import QuestionItem from "../QuestionItem/QuestionItem";
import {
  PDFPreviewWrapper,
  Preview,
  Droppable,
  ZoomControlCotainer,
  PDFZoomControl,
  AnnotationsContainer
} from "./styled";
import { removeUserAnswerAction } from "../../../../assessment/actions/answers";
import PDFViewer from "../PDFViewer";

const getNumberStyles = (x, y, scale) => ({
  position: "absolute",
  top: `${y * scale}px`,
  left: `${x * scale}px`
});

const { DragPreview } = DragDrop;

const PDFPreview = ({
  page,
  currentPage,
  annotations,
  onDropAnnotation,
  onHighlightQuestion,
  questionsById,
  answersById,
  viewMode,
  previewMode,
  isToolBarVisible,
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
  review,
  toggleMinimized,
  currentAnnotationTool,
  setCurrentAnnotationTool,
  annotationToolsProperties,
  annotationsStack,
  isEditable
}) => {
  const previewContainer = useRef();
  const annotationContainer = useRef();
  const [pdfScale, scalePDF] = useState(1);
  const [docLoading, setDocLoading] = useState(true);

  const PDFScaleUp = (scale = 0.1) => {
    const zoom = pdfScale < 3 ? pdfScale + scale : pdfScale;
    scalePDF(round(zoom, 1));
  };

  const PDFScaleDown = (scale = 0.1) => {
    const zoom = pdfScale > 0.5 ? pdfScale - scale : pdfScale;
    scalePDF(round(zoom, 1));
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

  const calculateInitScale = viewport => {
    const containerWidth = previewContainer?.current?.clientWidth || viewport.width;
    scalePDF(round((containerWidth - 40) / viewport.width, 1));
    if (forwardedRef.current) {
      setTimeout(() => {
        forwardedRef.current.updateScroll();
      }, 10);
    }
  };

  const handleDropQuestion = ({ data, itemOffset }) => {
    if (annotationContainer.current) {
      const containerRect = annotationContainer.current.getBoundingClientRect();
      let x = itemOffset.x - containerRect.x;
      let y = itemOffset.y - containerRect.y;
      x = round(x / pdfScale, 2);
      y = round(y / pdfScale, 2);

      onDropAnnotation({ x, y, page: currentPage, questionId: data.id, qIndex: data.index });
    }
  };

  return (
    <PDFPreviewWrapper
      review={review}
      testMode={testMode}
      reportMode={reportMode}
      viewMode={viewMode === "report"}
      isToolBarVisible={isToolBarVisible}
      minimized={minimized}
      ref={previewContainer}
    >
      <PerfectScrollbar ref={forwardedRef} option={{ wheelSpeed: 0.6 }}>
        <Droppable drop={handleDropQuestion}>
          {page.URL === "blank" && <Preview onClick={handleRemoveHighlight} />}

          {page.URL !== "blank" && (
            <PDFViewer
              page={page}
              pdfScale={pdfScale}
              setDocLoading={setDocLoading}
              docLoading={docLoading}
              setOriginalDimensions={calculateInitScale}
              currentAnnotationTool={currentAnnotationTool}
              annotationToolsProperties={annotationToolsProperties}
              annotationsStack={annotationsStack}
              currentPage={currentPage}
              authoringMode={viewMode === "edit"}
            />
          )}

          {!docLoading && (
            <AnnotationsContainer
              className="annotations-container"
              ref={annotationContainer}
              enableDrag={viewMode === "edit" && isEditable && !testMode}
            >
              {annotations
                .filter(item => item.toolbarMode === "question" && item.page === currentPage)
                .map(({ uuid, qIndex, x, y, questionId }) => (
                  <div
                    key={uuid}
                    className="annotation-item"
                    onClick={handleHighlight(questionId)}
                    style={getNumberStyles(x, y, pdfScale)}
                  >
                    <QuestionItem
                      key={questionId}
                      index={qIndex}
                      questionIndex={qIndex}
                      review={review}
                      data={questionsById[questionId]}
                      answer={answersById[questionId]}
                      previewMode={viewMode === "edit" ? "clear" : previewMode}
                      onDragStart={() => {
                        setCurrentAnnotationTool("cursor");
                        onDragStart(questionId);
                      }}
                      testMode={testMode}
                      highlighted={highlighted === questionId}
                      viewMode={viewMode}
                      annotations
                      pdfPreview
                      zoom={pdfScale >= 2 ? 2 : pdfScale}
                    />
                  </div>
                ))}
            </AnnotationsContainer>
          )}
        </Droppable>

        {!studentWork ? (
          <ZoomControlCotainer>
            {viewMode !== "edit" && (
              <PDFZoomControl onClick={toggleMinimized}>
                {minimized ? <IconGraphRightArrow /> : <IconChevronLeft />}
              </PDFZoomControl>
            )}
            <PDFZoomControl onClick={() => PDFScaleUp(0.1)}> &#43; </PDFZoomControl>
            <PDFZoomControl onClick={() => PDFScaleDown(0.1)}> &minus; </PDFZoomControl>
          </ZoomControlCotainer>
        ) : null}
      </PerfectScrollbar>
      <DragPreview />
    </PDFPreviewWrapper>
  );
};

PDFPreview.propTypes = {
  page: PropTypes.object.isRequired,
  currentPage: PropTypes.number.isRequired,
  annotations: PropTypes.array,
  onDropAnnotation: PropTypes.func.isRequired,
  onHighlightQuestion: PropTypes.func.isRequired
};

PDFPreview.defaultProps = {
  annotations: []
};

export default connect(
  state => ({
    previewMode: getPreviewSelector(state),
    annotationsStack: state.tests.annotationsStack
  }),
  {
    removeAnswers: removeUserAnswerAction
  }
)(withRouter(PDFPreview));
