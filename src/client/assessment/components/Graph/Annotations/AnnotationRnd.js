/* eslint-disable react/destructuring-assignment */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { Rnd } from "react-rnd";
import { FroalaEditor } from "@edulastic/common";
import { FroalaInput } from "./styled/styled_components";
import { setQuestionDataAction } from "../../../../author/QuestionEditor/ducks";
import { getViewSelector } from "../../../../author/src/selectors/view";
import { getQuestionByIdSelector, getCurrentQuestionSelector } from "../../../../author/sharedDucks/questions";
import produce from "immer";

const resizeDisable = {
  bottom: false,
  bottomLeft: false,
  bottomRight: false,
  left: false,
  right: false,
  top: false,
  topLeft: false,
  topRight: false
};

const resizeEnable = {
  bottom: true,
  bottomLeft: true,
  bottomRight: true,
  left: true,
  right: true,
  top: true,
  topLeft: true,
  topRight: true
};

class AnnotationsRnd extends Component {
  handleAnnotationPosition = (d, annotationIndex, disableDragging) => {
    const { setQuestionData, question } = this.props;
    setQuestionData(
      produce(question, draft => {
        const oldAnnotations = draft.annotations || [];
        draft.annotations = oldAnnotations.map(annotation => {
          if (annotationIndex === annotation.id) {
            const modifiedAnnotation = { ...annotation };
            modifiedAnnotation.position = { x: d.x, y: d.y };

            return modifiedAnnotation;
          }
          return annotation;
        });
      })
    );
  };

  handleAnnotationSize = (size, annotationIndex) => {
    const { setQuestionData, question } = this.props;
    setQuestionData(
      produce(question, draft => {
        const oldAnnotations = draft.annotations || [];

        draft.annotations = oldAnnotations.map(annotation => {
          const { width: oldWidth, height: oldHeight } = annotation.size || {
            width: 120,
            height: 80
          };

          if (annotationIndex === annotation.id) {
            const modifiedAnnotation = { ...annotation };

            modifiedAnnotation.size = {
              width: oldWidth + size.width,
              height: oldHeight + size.height
            };

            return modifiedAnnotation;
          }
          return annotation;
        });
      })
    );
  };

  updateAnnotation = (val, annotationIndex) => {
    const { setQuestionData, question } = this.props;
    setQuestionData(
      produce(question, draft => {
        const oldAnnotations = draft.annotations || [];
        draft.annotations = oldAnnotations.map(annotation => {
          if (annotationIndex === annotation.id) {
            const modifiedAnnotation = { ...annotation };
            modifiedAnnotation.value = val;

            return modifiedAnnotation;
          }
          return annotation;
        });
      })
    );
  };

  componentDidUpdate() {
    // Resize annotation box to accomodate content (by changing its height)
    if (this.props.question && this.props.question.annotations) {
      const { question } = this.props;
      if (!question || !question.annotations) return null;

      const annotations = question.annotations || [];

      annotations
        .filter(a => a.value)
        .forEach((annotation, i) => {
          const { width = 120, height = 80 } = annotation.size || { width: 120, height: 80 };
          const { value } = annotation;

          const minCharArea = value.length * 14;
          const currentCharArea = (width * height) / 14;
          let hc = height;
          if (minCharArea > currentCharArea) {
            hc = height * (minCharArea / currentCharArea) - height;
            const delta = { width: 0, height: hc };
            this.handleAnnotationSize(delta, annotation.id);
          }
        });
    }
  }

  render() {
    const { question, view, disableDragging, isAbove } = this.props;
    if (!question || !question.annotations) return null;

    const { updateAnnotation } = this;
    const annotations = question.annotations || [];

    return (
      <Fragment>
        {annotations
          .filter(a => a.value)
          .map((annotation, i) => {
            let { x, y } = annotation.position || { x: i * 50, y: 0 };
            const { width = 120, height = 80 } = annotation.size || { width: 120, height: 80 };
            const { value } = annotation;

            return (
              <Rnd
                key={annotation.id}
                position={{
                  x,
                  y
                }}
                size={{
                  height,
                  width
                }}
                onDragStop={(evt, d) => this.handleAnnotationPosition(d, annotation.id)}
                onResizeStop={(e, dir, ref, delta) => this.handleAnnotationSize(delta, annotation.id)}
                style={{ zIndex: isAbove ? 20 : 10 }}
                enableResizing={disableDragging ? resizeDisable : resizeEnable}
                disableDragging={disableDragging}
                bounds={"parent"}
              >
                <FroalaInput {...this.props} isRnd>
                  <FroalaEditor
                    value={value}
                    onChange={val => updateAnnotation(val, annotation.id)}
                    toolbarInline
                    toolbarVisibleWithoutSelection
                    imageEditButtons={[]}
                    readOnly
                  />
                </FroalaInput>
              </Rnd>
            );
          })}
      </Fragment>
    );
  }
}

AnnotationsRnd.propTypes = {
  question: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  questionId: PropTypes.string,
  disableDragging: PropTypes.bool,
  isAbove: PropTypes.bool
};

AnnotationsRnd.defaultProps = {
  questionId: "",
  disableDragging: true,
  isAbove: true
};

const enhance = compose(
  connect(
    (state, ownProps) => ({
      question: !ownProps.questionId
        ? getCurrentQuestionSelector(state)
        : getQuestionByIdSelector(state, ownProps.questionId),
      view: getViewSelector(state)
    }),
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(AnnotationsRnd);
