import React, { Component, createRef } from "react";
import PropTypes from "prop-types";

export const UPWARDS = "upwards";
export const DOWNWARDS = "downwards";
const DRAG_DETECT_TIMEOUT = 300;

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

    window.scrollBy({
      top: scrollAmount,
      behavior: "smooth"
    });

    // eslint-disable-next-line
    this.intervalId = setInterval(function() {
      window.scrollBy({
        top: scrollAmount,
        behavior: "smooth"
      });
    }, scrollDelay);
  };

  handleDragLeave = () => {
    clearInterval(this.intervalId);
  };

  handleMouseDown = () => {
    this.timerId = setTimeout(() => {
      this.setState({ isMouseClicked: true, isDragging: true });
    }, DRAG_DETECT_TIMEOUT);
  };

  handleMouseUp = () => {
    clearTimeout(this.timerId);
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
    const dragEnterEl = this.dragEnterRef.current;
    window.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("dragstart", this.handleIsDragging);
    window.addEventListener("dragend", this.handleDragEnd);

    dragEnterEl.addEventListener("dragenter", this.handleDragEnter);
    dragEnterEl.addEventListener("dragleave", this.handleDragLeave);
    dragEnterEl.addEventListener("mouseenter", this.handleMouseEnter);
    dragEnterEl.addEventListener("mouseleave", this.handleMouseLeave);
  }

  componentWillUnmount() {
    const dragEnterEl = this.dragEnterRef.current;
    window.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("mouseup", this.handleMouseUp);
    window.removeEventListener("dragstart", this.handleIsDragging);
    window.removeEventListener("dragend", this.handleDragEnd);

    dragEnterEl.removeEventListener("dragenter", this.handleDragEnter);
    dragEnterEl.removeEventListener("dragleave", this.handleDragLeave);
    dragEnterEl.removeEventListener("mouseenter", this.handleMouseEnter);
    dragEnterEl.removeEventListener("mouseleave", this.handleMouseLeave);

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
    const height = style.height || "auto";

    const mergedStyle = {
      ...style,
      height: isDragging ? height : 0
    };

    return <div ref={this.dragEnterRef} {...this.props} style={mergedStyle} />;
  };
}

DragScroll.propTypes = {
  scrollDelay: PropTypes.number,
  direction: PropTypes.string,
  style: PropTypes.object
};

DragScroll.defaultProps = {
  direction: UPWARDS,
  scrollDelay: 1500,
  style: {}
};

export default DragScroll;
