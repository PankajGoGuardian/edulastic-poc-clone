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
    const dragEnterEl = this.dragEnterRef.current;
    const { context } = this.props;
    const { getScrollElement } = context;
    const scrollContainer = getScrollElement();
    console.log(scrollContainer);
    scrollContainer.addEventListener("mousedown", this.handleMouseDown);
    scrollContainer.addEventListener("mouseup", this.handleMouseUp);
    scrollContainer.addEventListener("dragstart", this.handleIsDragging);
    scrollContainer.addEventListener("dragend", this.handleDragEnd);
    scrollContainer.addEventListener("focus", this.handleMouseUp);
    scrollContainer.addEventListener("blur", this.handleMouseUp);
    scrollContainer.addEventListener("contextmenu", this.handleMouseUp);

    dragEnterEl.addEventListener("dragenter", this.handleDragEnter);
    dragEnterEl.addEventListener("dragleave", this.handleDragLeave);
    dragEnterEl.addEventListener("mouseenter", this.handleMouseEnter);
    dragEnterEl.addEventListener("mouseleave", this.handleMouseLeave);
  }

  componentWillUnmount() {
    const dragEnterEl = this.dragEnterRef.current;
    const { context } = this.props;
    const { getScrollElement } = context;
    const scrollContainer = getScrollElement();

    scrollContainer.removeEventListener("mousedown", this.handleMouseDown);
    scrollContainer.removeEventListener("mouseup", this.handleMouseUp);
    scrollContainer.removeEventListener("dragstart", this.handleIsDragging);
    scrollContainer.removeEventListener("dragend", this.handleDragEnd);
    scrollContainer.removeEventListener("focus", this.handleMouseUp);
    scrollContainer.removeEventListener("blur", this.handleMouseUp);
    scrollContainer.removeEventListener("contextmenu", this.handleMouseUp);

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
    const { style, ...restProps } = this.props;
    const { context } = this.props;
    const { getScrollElement } = context;
    const scrollContainer = getScrollElement();

    const height = style.height || "auto";

    const mergedStyle = {
      ...style,
      height: isDragging ? height : 0
    };

    const key = scrollContainer.classList ? scrollContainer.classList.toString() : "window";

    return <div key={key} ref={this.dragEnterRef} {...restProps} style={mergedStyle} />;
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
