import React, { Component } from "react";
import PropTypes from "prop-types";
import { Rnd } from "react-rnd";
import { Tooltip } from "antd";

import { WithResources } from "@edulastic/common";
import { replaceLatexesWithMathHtml } from "@edulastic/common/src/utils/mathUtils";
import AppConfig from "../../../../../../../../app-config";
import { Container, Title, MarkContainer, DraggableOptionsContainer } from "./styled";

class ResponseBox extends Component {
  state = {
    draggingMark: null,
    resourcesLoaded: false
  };

  titleRef = React.createRef();

  preventPageScroll = e => e.preventDefault();

  handleDragDropValuePosition = (d, value, width, height) => {
    window.removeEventListener("touchstart", this.preventPageScroll);
    window.removeEventListener("touchmove", this.preventPageScroll);
    const titleHeight = this.titleRef.current.clientHeight;
    const { onAddMark, position, choiceWidth, markHeight, minWidth } = this.props;
    let x = d.x + choiceWidth / 2;
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

  handleDragStart = i => () => {
    window.addEventListener("touchstart", this.preventPageScroll, { passive: false });
    window.addEventListener("touchmove", this.preventPageScroll, { passive: false });
    this.setState({ draggingMark: i });
  };

  resourcesOnLoaded = () => {
    const { resourcesLoaded } = this.state;
    if (resourcesLoaded) {
      return;
    }
    this.setState({ resourcesLoaded: true });
  };

  render() {
    const {
      values,
      responseBoxWidth,
      choiceWidth,
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

    const { draggingMark, resourcesLoaded } = this.state;
    const isHorizontal = position === "top" || position === "bottom";
    const width = isHorizontal ? minWidth : choiceWidth;

    const markCountInLine = Math.floor((width - separationDistanceX) / (markWidth + separationDistanceX));
    const linesCount = Math.ceil(markCount / markCountInLine);
    let height = linesCount * (markHeight + separationDistanceY);
    height = Math.max(height, minHeight);

    return (
      <WithResources
        resources={[`${AppConfig.jqueryPath}/jquery.min.js`, `${AppConfig.katexPath}/katex.min.js`]}
        fallBack={<span />}
        onLoaded={this.resourcesOnLoaded}
      >
        {!resourcesLoaded ? null : (
          <Container width={responseBoxWidth} isHorizontal={isHorizontal}>
            <Title ref={this.titleRef}>DRAG DROP VALUES</Title>
            <DraggableOptionsContainer className="draggable-options-container" height={height} width={width}>
              {values.map((value, i) => {
                const content = replaceLatexesWithMathHtml(value.text);
                return (
                  <Rnd
                    key={value.id}
                    position={{
                      x: separationDistanceX + (i % markCountInLine) * (choiceWidth + separationDistanceX),
                      y: Math.floor(i / markCountInLine) * (markHeight + separationDistanceY)
                    }}
                    size={{ width: choiceWidth, height: markHeight }}
                    onDragStart={this.handleDragStart(i)}
                    onDragStop={(evt, d) => this.handleDragDropValuePosition(d, value, width, height)}
                    style={{ zIndex: 10 }}
                    disableDragging={false}
                    enableResizing={false}
                    bounds={bounds}
                    className={`mark${draggingMark === i ? " dragging" : ""}`}
                    scale={shouldZoom ? scale : 1}
                  >
                    <Tooltip
                      placement="bottomRight"
                      title={<span dangerouslySetInnerHTML={{ __html: content }} />}
                      arrowPointAtCenter
                    >
                      <MarkContainer
                        fontSize={12}
                        dangerouslySetInnerHTML={{
                          __html: `<div class='mark-content'>${content}</div>`
                        }}
                      />
                    </Tooltip>
                  </Rnd>
                );
              })}
            </DraggableOptionsContainer>
          </Container>
        )}
      </WithResources>
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
  markHeight: 45, // from .mark class
  separationDistanceX: 10,
  separationDistanceY: 20,
  position: "bottom",
  scale: 1
};

export default ResponseBox;
