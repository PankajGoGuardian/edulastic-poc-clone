import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { secondaryTextColor, white } from "@edulastic/colors";

class DrawingObjects extends Component {
  onClick = drawingObject => {
    const { selectDrawingObject } = this.props;
    if (drawingObject.disabled || drawingObject.selected) {
      return;
    }
    selectDrawingObject(drawingObject);
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
            {`drawing-object-${index}`}
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
  width: 100px;
  padding: 5px;
`;

const Button = styled.div`
  width: 100%;
  padding: 5px;
  margin-bottom: 5px;
  color: ${secondaryTextColor};
  cursor: pointer;
  transition: background-color 0.1s ease-in;

  &:hover {
    background-color: ${white};
  }

  &.selected {
    background-color: ${white};
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.06);
  }
`;
