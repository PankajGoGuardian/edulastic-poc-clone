import React, { Component, createRef } from "react";
import PropTypes from "prop-types";

export const UPWARDS = "upwards";
export const DOWNWARDS = "downwards";
const DRAG_DETECT_TIMEOUT = 600;

class DragScroll extends Component {
  dragEnterRef = createRef();

  state = {
    isDragging: false,
    isMouseClicked: false
  };

  intervalId;

  timerId;

  handleDragEnter = () => {
    const { scrollDelay, direction } = this.props;
    const scrollAmount = direction === UPWARDS ? -window.innerHeight / 2 : window.innerHeight / 2;
    const { context } = this.props;
    const { getScrollElement } = context;
    const scrollContainer = getScrollElement();
    scrollContainer.scrollBy({
      top: scrollAmount,
      behavior: "smooth"
    });

    // eslint-disable-next-line
    this.intervalId = setInterval(function() {
      scrollContainer.scrollBy({
        top: scrollAmount,
        behavior: "smooth"
      });
    }, scrollDelay);
  };

  handleDragLeave = () => {
    clearTimeout(this.timerId);
    clearInterval(this.intervalId);
  };

  handleMouseDown = () => {
    this.timerId = setTimeout(() => {
      this.setState({ isMouseClicked: true, isDragging: true });
    }, DRAG_DETECT_TIMEOUT);
  };

  handleMouseUp = () => {
    clearTimeout(this.timerId);
    clearInterval(this.intervalId);
    this.setState({ isMouseClicked: false, isDragging: false });
  };

  handleMouseEnter = () => {
    const { handleDragEnter } = this;
    const { isMouseClicked } = this.state;
    if (isMouseClicked) {
      handleDragEnter();
    }
  };

  handleMouseLeave = () => {
    const { handleDragLeave } = this;

    handleDragLeave();
  };

  componentDidMount() {
    window.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("dragstart", this.handleIsDragging);
    window.addEventListener("dragend", this.handleDragEnd);
    window.addEventListener("focus", this.handleMouseUp);
    window.addEventListener("blur", this.handleMouseUp);
    window.addEventListener("contextmenu", this.handleMouseUp);
  }

  componentWillUnmount() {
    window.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("mouseup", this.handleMouseUp);
    window.removeEventListener("dragstart", this.handleIsDragging);
    window.removeEventListener("dragend", this.handleDragEnd);
    window.removeEventListener("focus", this.handleMouseUp);
    window.removeEventListener("blur", this.handleMouseUp);
    window.removeEventListener("contextmenu", this.handleMouseUp);

    clearInterval(this.intervalId);
    clearTimeout(this.timerId);
  }

  handleIsDragging = () => {
    const { scrollDelay, direction } = this.props;
    if (direction === DOWNWARDS) {
      this.timerId = setTimeout(() => {
        this.setState({ isDragging: true });
      }, scrollDelay);
    } else if (direction === UPWARDS) {
      this.setState({ isDragging: true });
    }
  };

  handleDragEnd = () => {
    clearInterval(this.intervalId);
    clearInterval(this.timerId);
    this.setState({ isDragging: false, isMouseClicked: false });
  };

  render = () => {
    const { isDragging } = this.state;
    const { style } = this.props;
    const { context } = this.props;
    const { getScrollElement } = context;
    const scrollContainer = getScrollElement();

    const height = style.height || "auto";

    const mergedStyle = {
      ...style,
      height: isDragging ? height : 0
    };

    const key = scrollContainer.classList ? scrollContainer.classList.toString() : "window";

    return (
      <div
        key={key}
        ref={this.dragEnterRef}
        style={mergedStyle}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
      />
    );
  };
}

DragScroll.propTypes = {
  scrollDelay: PropTypes.number,
  direction: PropTypes.string,
  style: PropTypes.object,
  context: PropTypes.object.isRequired
};

DragScroll.defaultProps = {
  direction: UPWARDS,
  scrollDelay: 1500,
  style: {}
};

export default DragScroll;
