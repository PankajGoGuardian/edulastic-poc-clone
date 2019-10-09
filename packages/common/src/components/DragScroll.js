import React, { Component, createRef } from "react";
import PropTypes from "prop-types";

export const UPWARDS = "upwards";
export const DOWNWARDS = "downwards";
const DRAG_DETECT_TIMEOUT = 600;

class DragScroll extends Component {
  dragEnterRef = createRef();

  state = {
    isDragging: false
  };

  intervalId;

  timerId;

  handleDragEnter = () => {
    const { scrollDelay, direction } = this.props;
    const scrollAmount = direction === UPWARDS ? -window.innerHeight / 2 : window.innerHeight / 2;
    const { context, scrollElement } = this.props;
    const { getScrollElement } = context;
    const scrollContainer = scrollElement || getScrollElement();

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
      this.setState({ isDragging: true });
    }, DRAG_DETECT_TIMEOUT);
  };

  handleMouseUp = () => {
    clearTimeout(this.timerId);
    clearInterval(this.intervalId);
    this.setState({ isDragging: false });
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
    this.setState({ isDragging: false });
  };

  render = () => {
    const { isDragging } = this.state;
    const { style } = this.props;
    const { context } = this.props;
    const { getScrollElement, scrollElement } = context;
    const scrollContainer = scrollElement || getScrollElement();

    const height = style.height || "auto";

    const mergedStyle = {
      ...style,
      height: isDragging ? height : 0
    };

    const key = scrollContainer && scrollContainer.classList ? scrollContainer.classList.toString() : "window";

    return (
      <div
        key={key}
        ref={this.dragEnterRef}
        style={mergedStyle}
        onMouseEnter={this.handleDragEnter}
        onMouseLeave={this.handleDragLeave}
      />
    );
  };
}

DragScroll.propTypes = {
  scrollDelay: PropTypes.number,
  direction: PropTypes.string,
  style: PropTypes.object,
  context: PropTypes.object.isRequired,
  scrollElement: PropTypes.object
};

DragScroll.defaultProps = {
  direction: UPWARDS,
  scrollDelay: 100,
  style: {},
  scrollElement: null
};

export default DragScroll;
