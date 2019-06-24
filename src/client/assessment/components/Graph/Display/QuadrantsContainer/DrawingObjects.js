import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import striptags from "striptags";

import { secondaryTextColor, white, whiteSmoke } from "@edulastic/colors";

import utils from "./utils";

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
      const pointLabels = drawingObject.pointLabels.map(item => striptags(item)).join("");
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
        {drawingObjects.map((drawingObject, index) => (
          <Button
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
  transition: background-color 0.1s ease-in;

  &.selected,
  &:hover {
    background-color: ${white};
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.06);
  }

  &.disabled,
  &.disabled:hover {
    color: ${whiteSmoke};
    box-shadow: none;
  }
`;
