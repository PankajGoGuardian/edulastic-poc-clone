import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Rnd } from "react-rnd";
import produce from "immer";

import { getAdjustedV1AnnotationCoordinatesForDB } from "../Graph/common/utils";

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
    const { setQuestionData, question, adjustedHeightWidth, layout } = this.props;
    const { isV1Migrated } = question;

    setQuestionData(
      produce(question, draft => {
        const oldAnnotations = draft.annotations || [];
        draft.annotations = oldAnnotations.map(annotation => {
          if (annotationIndex === annotation.id) {
            if (isV1Migrated) {
              const co = getAdjustedV1AnnotationCoordinatesForDB(adjustedHeightWidth, layout, d);
              d.x = co.x;
              d.y = co.y;
            }

            const modifiedAnnotation = { ...annotation };
            modifiedAnnotation.position = { x: d.x, y: d.y };

            return modifiedAnnotation;
          } else {
            if (isV1Migrated) {
              const co = getAdjustedV1AnnotationCoordinatesForDB(adjustedHeightWidth, layout, annotation.position);
              annotation.position.x = co.x;
              annotation.position.y = co.y;
            }

            return annotation;
          }
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

  componentDidUpdate(prevProps) {
    const { question } = this.props;
    // Resize annotation box to accomodate content (by changing its height)
    if (question && question.annotations) {
      const annotations = question.annotations || [];

      annotations.forEach((annotation, i) => {
        if (
          prevProps.question &&
          prevProps.question.annotations &&
          prevProps.question.annotations[i] &&
          prevProps.question.annotations[i].size.width !== annotation.size.width &&
          prevProps.question.annotations[i].size.height !== annotation.size.height
        ) {
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
              <StyledRnd
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
              </StyledRnd>
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

const StyledRnd = styled(Rnd)`
  ${({ theme, position }) => {
    const { zoomLevel, shouldZoom } = theme;
    if (shouldZoom && zoomLevel > 1) {
      const { x, y } = position;
      /**
       * This case will be applied in student side, otherwise not.
       * react-rnd is using transform property for positioning,
       * and that's causing EV-9459 issue which is container alignment changes with Zoom.
       */
      return `
        transform: translate(${x}px, ${y}px) !important;
        transform-origin: left top;
      `;
    }
    return null;
  }}
`;
