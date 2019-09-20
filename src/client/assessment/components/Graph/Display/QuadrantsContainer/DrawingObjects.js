import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import striptags from "striptags";

import { secondaryTextColor, fadedBlack, greyDarken } from "@edulastic/colors";

import {
  IconGraphRay as IconRay,
  IconGraphLine as IconLine,
  IconGraphPoint as IconPoint,
  IconGraphSine as IconSine,
  IconGraphParabola as IconParabola,
  IconGraphCircle as IconCircle,
  IconGraphVector as IconVector,
  IconGraphSegment as IconSegment,
  IconGraphPolygon as IconPolygon
} from "@edulastic/icons";

import utils from "../../common/utils";

class DrawingObjects extends Component {
  onClick = drawingObject => {
    const { selectDrawingObject } = this.props;
    if (drawingObject.disabled || drawingObject.selected) {
      return;
    }
    selectDrawingObject(drawingObject);
  };

  getLabel = drawingObject => {
    const type = utils.capitalizeFirstLetter(drawingObject.type);
    const objLabel = striptags(drawingObject.label);
    if (objLabel) {
      return `${type} ${objLabel}`;
    }

    if (drawingObject.pointLabels) {
      const pointLabels = drawingObject.pointLabels.map(item => striptags(item.label)).join("");
      if (pointLabels) {
        return `${type} ${pointLabels}`;
      }
    }

    return type;
  };

  getIconByToolName = (toolName, options) => {
    if (!toolName) {
      return "";
    }

    const iconsByToolName = {
      point: () => <IconPoint {...options} />,
      line: () => <IconLine {...options} />,
      ray: () => <IconRay {...options} />,
      segment: () => <IconSegment {...options} />,
      vector: () => <IconVector {...options} />,
      circle: () => <IconCircle {...options} />,
      ellipse: () => <IconLine {...options} />,
      hyperbola: () => <IconLine {...options} />,
      tangent: () => <IconLine {...options} />,
      secant: () => <IconLine {...options} />,
      exponent: () => <IconLine {...options} />,
      logarithm: () => <IconLine {...options} />,
      polynom: () => <IconLine {...options} />,
      parabola: () => <IconParabola {...options} />,
      sine: () => <IconSine {...options} />,
      polygon: () => <IconPolygon {...options} />,
      area: () => <IconLine {...options} />,
      dashed: () => <IconLine {...options} />
    };

    return iconsByToolName[toolName]();
  };

  render() {
    const { drawingObjects } = this.props;
    return (
      <Container>
        <Title>CLICK TO SELECT</Title>
        {drawingObjects.map((drawingObject, index) => (
          <Button
            style={{
              boxShadow: `inset 0 0 1em ${drawingObject.baseColor}`
            }}
            key={`drawing-object-${index}`}
            onClick={() => this.onClick(drawingObject)}
            className={drawingObject.disabled ? "disabled" : drawingObject.selected ? "selected" : ""}
          >
            <span style={{ padding: "0 5px" }}>
              {this.getIconByToolName(drawingObject.type, {
                width: 10,
                height: 10,
                color: "#00b2ff",
                stroke: "#00b2ff"
              })}
            </span>
            {this.getLabel(drawingObject)}
          </Button>
        ))}
      </Container>
    );
  }
}

DrawingObjects.propTypes = {
  selectDrawingObject: PropTypes.func.isRequired,
  drawingObjects: PropTypes.array.isRequired
};

export default DrawingObjects;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 150px;
  padding: 5px;
`;

const Button = styled.div`
  width: 100%;
  padding: 5px;
  margin-bottom: 5px;
  color: ${secondaryTextColor};
  cursor: pointer;
  transition: background-color 0.1s ease-in, border-color 0.1s ease-in;
  border-radius: 4px;
  border: 1px solid transparent;

  &.selected,
  &:hover {
    border-color: ${fadedBlack};
  }

  &.disabled,
  &.disabled:hover {
    color: ${greyDarken};
    border-color: transparent;
    cursor: default;
  }
`;

export const Title = styled.div`
  padding: 5px;
  width: 100%;
  font-size: ${props => props.theme.widgets.quadrants.dragDropTitleFontSize};
  font-weight: ${props => props.theme.widgets.quadrants.dragDropTitleFontWeight};
`;
