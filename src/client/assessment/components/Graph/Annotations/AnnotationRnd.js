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

const resizeDisable = {
  bottom: false,
  bottomLeft: false,
  bottomRight: false,
  left: false,
  right: false,
  top: false,
  topLeft: false,
  topRight: true
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
  handleAnnotationPosition = (d, annotationIndex) => {
    const { setQuestionData, question } = this.props;
    const oldAnnotations = question.annotations || [];

    question.annotations = oldAnnotations.map(annotation => {
      if (annotationIndex === annotation.id) {
        const modifiedAnnotation = { ...annotation };
        modifiedAnnotation.position = { x: d.x, y: d.y };

        return modifiedAnnotation;
      }
      return annotation;
    });

    setQuestionData(question);
  };

  handleAnnotationSize = (size, annotationIndex) => {
    const { setQuestionData, question } = this.props;
    const oldAnnotations = question.annotations || [];

    question.annotations = oldAnnotations.map(annotation => {
      const { width: oldWidth, height: oldHeight } = annotation.size || {
        width: 50,
        height: 50
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

    setQuestionData(question);
  };

  updateAnnotation = (val, annotationIndex) => {
    const { setQuestionData, question } = this.props;

    const oldAnnotations = question.annotations || [];
    question.annotations = oldAnnotations.map(annotation => {
      if (annotationIndex === annotation.id) {
        const modifiedAnnotation = { ...annotation };
        modifiedAnnotation.value = val;

        return modifiedAnnotation;
      }
      return annotation;
    });

    setQuestionData(question);
  };

  render() {
    const { question, view } = this.props;
    if (!question || !question.annotations) return null;

    const { updateAnnotation } = this;
    const annotations = question.annotations || [];

    return (
      <Fragment>
        {annotations
          .filter(a => a.value)
          .map((annotation, i) => {
            const { x, y } = annotation.position || { x: i * 50, y: 0 };
            const { width = 50, height = 50 } = annotation.size || { width: 50, height: 50 };
            const { value } = annotation;

            return (
              <Rnd
                key={annotation.id}
                default={{
                  x,
                  y,
                  width,
                  height
                }}
                onDragStop={(evt, d) => this.handleAnnotationPosition(d, annotation.id)}
                onResizeStop={(e, dir, ref, delta) => this.handleAnnotationSize(delta, annotation.id)}
                style={{ zIndex: 10 }}
                enableResizing={view === "preview" ? resizeDisable : resizeEnable}
                disableDragging={view === "preview"}
              >
                <FroalaInput {...this.props} isRnd>
                  <FroalaEditor
                    value={value}
                    onChange={val => updateAnnotation(val, annotation.id)}
                    toolbarInline
                    toolbarVisibleWithoutSelection
                    config={{
                      placeholderText: "Edit your content"
                    }}
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
  questionId: PropTypes.string
};

AnnotationsRnd.defaultProps = {
  questionId: ""
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
