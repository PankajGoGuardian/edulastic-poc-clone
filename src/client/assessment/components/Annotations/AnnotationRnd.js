import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Rnd } from "react-rnd";
import produce from "immer";
import { Popover } from "antd";
import { Ellipsis, MathSpan, measureText } from "@edulastic/common";
import { getAdjustedV1AnnotationCoordinatesForDB } from "../Graph/common/utils";

import { Container } from "./styled/Container";
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
    const { setQuestionData, question, adjustedHeightWidth, layout, v1Dimenstions } = this.props;
    const { isV1Migrated } = question;

    setQuestionData(
      produce(question, draft => {
        const oldAnnotations = draft.annotations || [];
        draft.annotations = oldAnnotations.map(annotation => {
          if (annotationIndex === annotation.id) {
            const _size = annotation.size;
            if (isV1Migrated && v1Dimenstions) {
              const co = getAdjustedV1AnnotationCoordinatesForDB(
                adjustedHeightWidth,
                layout,
                {
                  ...annotation,
                  position: { ...d }
                },
                v1Dimenstions
              );
              d.x = co.x;
              d.y = co.y;
              _size.width = co.width;
              _size.height = co.height;
            }

            const modifiedAnnotation = { ...annotation };
            modifiedAnnotation.position = { x: d.x, y: d.y };
            modifiedAnnotation.size = _size;

            return modifiedAnnotation;
          }
          if (isV1Migrated && v1Dimenstions) {
            const co = getAdjustedV1AnnotationCoordinatesForDB(adjustedHeightWidth, layout, annotation, v1Dimenstions);
            annotation.position.x = co.x;
            annotation.position.y = co.y;
            annotation.size.width = co.width;
            annotation.size.height = co.height;
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

            const { scrollWidth: contentWidth, scrollHeight: contentHeight } = measureText(value, {
              maxWidth: width,
              height,
              fontSize: "1rem"
            });

            // we are adding 10px for some reason in measure method.
            // so we should reduce 10px here.
            const isOverHight = contentHeight - 5 > height;
            const isOverWidth = contentWidth - 10 > width;
            const showPopover = isOverHight || isOverWidth;

            const content = <MathSpan dangerouslySetInnerHTML={{ __html: value }} noPadding />;

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
                  zIndex: isAbove ? 20 : 10
                }}
                enableResizing={disableDragging ? resizeDisable : resizeEnable}
                disableDragging={disableDragging}
                bounds={bounds || "parent"}
                className="annotation"
              >
                <Container noBorder {...this.props} isRnd>
                  <ValueWrapper isOverHight={isOverHight}>
                    {showPopover && <Popover content={content}>{content}</Popover>}
                    {showPopover && <Ellipsis noPadding top="unset" bottom="2px" />}
                    {!showPopover && content}
                  </ValueWrapper>
                </Container>
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
  isAbove: PropTypes.bool,
  noBorder: PropTypes.bool
};

AnnotationsRnd.defaultProps = {
  disableDragging: true,
  isAbove: true,
  noBorder: false
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
