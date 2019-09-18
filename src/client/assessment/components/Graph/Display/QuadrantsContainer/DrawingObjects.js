import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import striptags from "striptags";

import { secondaryTextColor, whiteSmoke, fadedBlack } from "@edulastic/colors";

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

  render() {
    const { drawingObjects } = this.props;
    return (
      <Container>
        <Title>CLICK TO SELECT</Title>
        {drawingObjects.map((drawingObject, index) => (
          <Button
            style={{ boxShadow: `inset 0 0 1em ${drawingObject.baseColor}` }}
            key={`drawing-object-${index}`}
            onClick={() => this.onClick(drawingObject)}
            className={drawingObject.disabled ? "disabled" : drawingObject.selected ? "selected" : ""}
          >
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
    color: ${whiteSmoke};
    border-color: transparent;
  }
`;

export const Title = styled.div`
  padding: 5px;
  width: 100%;
  font-size: ${props => props.theme.widgets.quadrants.dragDropTitleFontSize};
  font-weight: ${props => props.theme.widgets.quadrants.dragDropTitleFontWeight};
`;
