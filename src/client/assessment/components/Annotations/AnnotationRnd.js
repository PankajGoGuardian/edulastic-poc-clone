import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Rnd } from "react-rnd";
import produce from "immer";

import { FroalaInput } from "./styled/styled_components";
import { ValueWrapper } from "./styled/ValueWrapper";

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
  handleAnnotationPosition = (d, annotationIndex) => {
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
    const { question } = this.props;
    // Resize annotation box to accomodate content (by changing its height)
    if (question && question.annotations) {
      const annotations = question.annotations || [];

      annotations
        .filter(a => a.value)
        .forEach(annotation => {
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
    const { question, disableDragging, isAbove, bounds } = this.props;
    if (!question || !question.annotations) return null;

    const annotations = question.annotations || [];
    return (
      <Fragment>
        {annotations
          .filter(a => a.value)
          .map((annotation, i) => {
            const { x, y } = annotation.position || { x: i * 50, y: 0 };
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
                style={{
                  zIndex: isAbove ? 20 : 10,
                  border: disableDragging ? "none" : "1px solid #efefef",
                  pointerEvents: disableDragging ? "none" : "auto"
                }}
                enableResizing={disableDragging ? resizeDisable : resizeEnable}
                disableDragging={disableDragging}
                bounds={bounds || "parent"}
                className="annotation"
              >
                <FroalaInput {...this.props} isRnd>
                  <ValueWrapper dangerouslySetInnerHTML={{ __html: value }} />
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
  disableDragging: PropTypes.bool,
  isAbove: PropTypes.bool
};

AnnotationsRnd.defaultProps = {
  disableDragging: true,
  isAbove: true
};

export default AnnotationsRnd;
