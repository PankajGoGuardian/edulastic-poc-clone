import React, { Component } from "react";
import PropTypes from "prop-types";
import { Rnd } from "react-rnd";
import { Container, Title, MarkContainer } from "./styled";

class ResponseBox extends Component {
  handleDragDropValuePosition(d, value, width, height) {
    const { onAddMark, position, markWidth, markHeight, minWidth, minHeight } = this.props;
    let x = d.x + markWidth / 2;
    let y = d.y + markHeight / 2;

    if (position === "top") {
      y -= height;
    } else if (position === "right") {
      x += minWidth;
    } else if (position === "bottom") {
      y += minHeight;
    } else if (position === "left") {
      x -= width;
    }

    onAddMark(value, x, y);
  }

  render() {
    const {
      values,
      minWidth,
      minHeight,
      titleHeight,
      titleWidth,
      markCount,
      markWidth,
      markHeight,
      separationDistanceX,
      separationDistanceY,
      position
    } = this.props;

    const width = position === "top" || position === "bottom" ? minWidth : titleWidth;

    const markCountInLine = Math.floor((width - separationDistanceX) / (markWidth + separationDistanceX));
    const linesCount = Math.ceil(markCount / markCountInLine);
    let height = titleHeight + linesCount * (markHeight + separationDistanceY);
    height =
      position === "top" || position === "bottom"
        ? Math.max(height, titleHeight + markHeight + separationDistanceY)
        : Math.max(height, minHeight);

    console.log("responsebox render");

    return (
      <Container width={width} height={height}>
        <Title height={titleHeight} width={titleWidth}>
          DRAG DROP VALUES
        </Title>
        {values.map((value, i) => (
          <Rnd
            key={value.id}
            position={{
              x: separationDistanceX + (i % markCountInLine) * (markWidth + separationDistanceX),
              y: titleHeight + Math.floor(i / markCountInLine) * (markHeight + separationDistanceY)
            }}
            size={{ width: markWidth, height: markHeight }}
            onDragStop={(evt, d) => this.handleDragDropValuePosition(d, value, width, height)}
            style={{ zIndex: 10, overflow: "hidden" }}
            disableDragging={false}
            enableResizing={false}
            bounds=".jsxbox-with-response-box"
            className="mark"
          >
            <MarkContainer dangerouslySetInnerHTML={{ __html: value.text }} />
          </Rnd>
        ))}
      </Container>
    );
  }
}

ResponseBox.propTypes = {
  values: PropTypes.array,
  onAddMark: PropTypes.func,
  minWidth: PropTypes.number,
  minHeight: PropTypes.number,
  titleHeight: PropTypes.number,
  titleWidth: PropTypes.number,
  markCount: PropTypes.number,
  markWidth: PropTypes.number,
  markHeight: PropTypes.number,
  separationDistanceX: PropTypes.number,
  separationDistanceY: PropTypes.number,
  position: PropTypes.string
};

ResponseBox.defaultProps = {
  values: [],
  onAddMark: () => {},
  minWidth: 600,
  minHeight: 150,
  titleHeight: 30,
  titleWidth: 150,
  markCount: 0,
  markWidth: 120, // from .mark class
  markHeight: 45, // from .mark class
  separationDistanceX: 10,
  separationDistanceY: 20,
  position: "bottom"
};

export default ResponseBox;
