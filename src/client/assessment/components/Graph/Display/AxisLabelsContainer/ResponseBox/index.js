import React, { Component } from "react";
import PropTypes from "prop-types";
import { MathFormulaDisplay } from "@edulastic/common";
import { Container, Title, MarkContainer, DraggableOptionsContainer, StyledRnd } from "./styled";

class ResponseBox extends Component {
  state = {
    draggingMark: null
  };

  titleRef = React.createRef();

  preventPageScroll = e => e.preventDefault();

  handleDragDropValuePosition = (d, value, width, height) => {
    window.removeEventListener("touchstart", this.preventPageScroll);
    window.removeEventListener("touchmove", this.preventPageScroll);
    const titleHeight = this.titleRef.current.clientHeight;
    const { onAddMark, position, markHeight, minWidth } = this.props;
    // 15 is padding-top of container
    let x = d.x + this.dragItemWidth / 2 + 25;
    let y = d.y + markHeight / 2 + 15;

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

  handleDragStart = i => () => {
    window.addEventListener("touchstart", this.preventPageScroll, { passive: false });
    window.addEventListener("touchmove", this.preventPageScroll, { passive: false });
    this.setState({ draggingMark: i });
  };

  get dragItemWidth() {
    const { choiceWidth } = this.props;
    // 40 is width of index
    return choiceWidth + 40;
  }

  render() {
    const {
      values,
      responseBoxWidth,
      minWidth,
      minHeight,
      markCount,
      markWidth,
      markHeight,
      separationDistanceX,
      separationDistanceY,
      position,
      bounds,
      scale,
      shouldZoom
    } = this.props;
    const { draggingMark } = this.state;
    const isHorizontal = position === "top" || position === "bottom";
    const optionsContWidth = isHorizontal ? minWidth : this.dragItemWidth;

    const markCountInLine = Math.floor((optionsContWidth - separationDistanceX) / (markWidth + separationDistanceX));
    const linesCount = Math.ceil(markCount / markCountInLine);
    let height = linesCount * (markHeight + separationDistanceY);
    height = Math.max(height, minHeight);

    return (
      <Container width={responseBoxWidth} isHorizontal={isHorizontal}>
        <Title ref={this.titleRef}>DRAG DROP VALUES</Title>
        <DraggableOptionsContainer>
          {values.map((value, i) => (
            <StyledRnd
              key={value.id}
              position={{
                x: separationDistanceX + (i % markCountInLine) * (this.dragItemWidth + separationDistanceX),
                y: Math.floor(i / markCountInLine) * (markHeight + separationDistanceY)
              }}
              size={{ width: this.dragItemWidth, height: markHeight }}
              onDragStart={this.handleDragStart(i)}
              onDragStop={(evt, d) => this.handleDragDropValuePosition(d, value, optionsContWidth, height)}
              bounds={bounds}
              className={`mark${draggingMark === i ? " dragging" : ""}`}
              scale={shouldZoom ? scale : 1}
            >
              <MarkContainer>
                <div className="index-box">{i + 1}</div>
                <MathFormulaDisplay className="drag-item-cotent" dangerouslySetInnerHTML={{ __html: value.text }} />
              </MarkContainer>
            </StyledRnd>
          ))}
        </DraggableOptionsContainer>
      </Container>
    );
  }
}

ResponseBox.propTypes = {
  bounds: PropTypes.string.isRequired,
  responseBoxWidth: PropTypes.string.isRequired,
  values: PropTypes.array,
  onAddMark: PropTypes.func,
  minWidth: PropTypes.number,
  minHeight: PropTypes.number,
  markCount: PropTypes.number,
  markWidth: PropTypes.number,
  markHeight: PropTypes.number,
  separationDistanceX: PropTypes.number,
  separationDistanceY: PropTypes.number,
  position: PropTypes.string,
  scale: PropTypes.number
};

ResponseBox.defaultProps = {
  values: [],
  onAddMark: () => {},
  minWidth: 600,
  minHeight: 150,
  markCount: 0,
  markWidth: 120, // from .mark class
  markHeight: 32, // from .mark class
  separationDistanceX: 10,
  separationDistanceY: 20,
  position: "bottom",
  scale: 1
};

export default ResponseBox;
