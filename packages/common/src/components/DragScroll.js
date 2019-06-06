import React, { Component, createRef } from "react";
import PropTypes from "prop-types";

export const UPWARDS = "upwards";
export const DOWNWARDS = "downwards";

class DragScroll extends Component {
  dragEnterRef = createRef();

  state = {
    isDragging: false
  };

  intervalId;

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

  componentDidMount() {
    const dragEnterEl = this.dragEnterRef.current;
    window.addEventListener("dragstart", this.handleIsDragging);
    window.addEventListener("dragend", this.handleDragEnd);
    dragEnterEl.addEventListener("dragenter", this.handleDragEnter);
    dragEnterEl.addEventListener("dragleave", this.handleDragLeave);
  }

  componentWillUnmount() {
    const containerEl = this.dragEnterRef.current;
    window.removeEventListener("dragstart", this.handleIsDragging);
    window.removeEventListener("dragend", this.handleDragEnd);
    containerEl.removeEventListener("dragenter", this.handleDragEnter);
    containerEl.removeEventListener("dragleave", this.handleDragLeave);
    clearInterval(this.intervalId);
  }

  handleIsDragging = () => {
    const { scrollDelay, direction } = this.props;
    if (direction === DOWNWARDS) {
      setTimeout(() => {
        this.setState({ isDragging: true });
      }, scrollDelay);
    } else if (direction === UPWARDS) {
      this.setState({ isDragging: true });
    }
  };

  handleDragEnd = () => {
    clearInterval(this.intervalId);
    this.setState({ isDragging: false });
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
