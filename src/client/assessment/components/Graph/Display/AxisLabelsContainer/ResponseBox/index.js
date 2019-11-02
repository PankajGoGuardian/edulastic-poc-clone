import React, { Component } from "react";
import PropTypes from "prop-types";
import { Rnd } from "react-rnd";
import { Container, Title, MarkContainer, DraggableOptionsContainer } from "./styled";

export const titleWidth = 150;

class ResponseBox extends Component {
  state = {
    draggingMark: null
  };

  titleRef = React.createRef();

  handleDragDropValuePosition = (d, value, width, height) => {
    const titleHeight = this.titleRef.current.clientHeight;
    const { onAddMark, position, markWidth, markHeight, minWidth } = this.props;
    let x = d.x + markWidth / 2;
    let y = d.y + markHeight / 2;

    const _height = height + titleHeight;
    if (position === "top") {
      y -= _height;
    } else if (position === "right") {
      x += minWidth;
      y += titleHeight;
    } else if (position === "bottom") {
      y += _height;
    } else if (position === "left") {
      x -= width;
      y += titleHeight;
    }

    onAddMark(value, x, y);
    this.setState({ draggingMark: null });
  };

  handleDragStart = i => (event, node) => {
    this.setState({ draggingMark: i });
  };

  render() {
    const {
      values,
      minWidth,
      minHeight,
      titleWidth,
      markCount,
      markWidth,
      markHeight,
      separationDistanceX,
      separationDistanceY,
      position
    } = this.props;

    const { draggingMark } = this.state;
    const width = position === "top" || position === "bottom" ? minWidth : titleWidth;

    const markCountInLine = Math.floor((width - separationDistanceX) / (markWidth + separationDistanceX));
    const linesCount = Math.ceil(markCount / markCountInLine);
    let height = linesCount * (markHeight + separationDistanceY);
    height = Math.max(height, minHeight);

    return (
      <Container width={width} position={position}>
        <Title ref={this.titleRef}>DRAG DROP VALUES</Title>
        <DraggableOptionsContainer className="draggable-options-container" height={height} width={width}>
          {values.map((value, i) => (
            <Rnd
              key={value.id}
              position={{
                x: separationDistanceX + (i % markCountInLine) * (markWidth + separationDistanceX),
                y: Math.floor(i / markCountInLine) * (markHeight + separationDistanceY)
              }}
              size={{ width: markWidth, height: markHeight }}
              onDragStart={this.handleDragStart(i)}
              onDragStop={(evt, d) => this.handleDragDropValuePosition(d, value, width, height)}
              style={{ zIndex: 10 }}
              disableDragging={false}
              enableResizing={false}
              bounds=".jsxbox-with-response-box-response-options"
              className={`mark${draggingMark === i ? " dragging" : ""}`}
            >
              <MarkContainer
                fontSize={12}
                dangerouslySetInnerHTML={{
                  __html: `<div class='mark-content'>${
                    value.text.indexOf("<p>") === 0
                      ? `<p title="${value.text.substring(3, value.text.length - 4)}">${value.text.substring(
                          3,
                          value.text.length - 4
                        )}</p>`
                      : value.text
                  }</div>`
                }}
              />
            </Rnd>
          ))}
        </DraggableOptionsContainer>
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
  titleWidth: titleWidth,
  markCount: 0,
  markWidth: 120, // from .mark class
  markHeight: 45, // from .mark class
  separationDistanceX: 10,
  separationDistanceY: 20,
  position: "bottom"
};

export default ResponseBox;
