import React, { Component } from "react";
import PropTypes from "prop-types";

import { DragDropValuesContainer, DragDropTitle } from "./styled";
import { Responses } from "./Responses";

class DragDropValues extends Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  handleDragDropValuePosition = (d, value) => {
    const { onAddDragDropValue, width, margin, valueHeight } = this.props;
    const containerWidth = this.container?.current?.offsetWidth || width;
    onAddDragDropValue(value, d.x - containerWidth - margin + width / 2, d.y - margin + valueHeight / 2);
    return false;
  };

  handleDragDropValue = (d, value) => {
    const { onDrawDragDropValue, width, margin, valueHeight } = this.props;
    const containerWidth = this.container?.current?.offsetWidth || width;
    onDrawDragDropValue(value, d.x - containerWidth - margin + width / 2, d.y - margin + valueHeight / 2);
  };

  scrollHandler = e => e.preventDefault();

  render() {
    const { values, width, height, valueHeight, dragDropBoundsClassName, scale } = this.props;
    const containerStyle = {
      position: "relative",
      width,
      height: values.length * (valueHeight + 5)
    };
    const bounds = dragDropBoundsClassName ? `.${dragDropBoundsClassName}` : "";

    return (
      <DragDropValuesContainer ref={this.container} width={width} minHeight={height}>
        <DragDropTitle>DRAG DROP VALUES</DragDropTitle>
        <div style={containerStyle}>
          <Responses
            values={values}
            bounds={bounds}
            handleDragDropValuePosition={this.handleDragDropValuePosition}
            handleDragDropValue={this.handleDragDropValue}
            scale={scale}
            width={width}
            scrollHandler={this.scrollHandler}
            valueHeight={valueHeight}
          />
        </div>
      </DragDropValuesContainer>
    );
  }
}

DragDropValues.propTypes = {
  dragDropBoundsClassName: PropTypes.string,
  values: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  valueHeight: PropTypes.number,
  margin: PropTypes.number,
  onAddDragDropValue: PropTypes.func,
  onDrawDragDropValue: PropTypes.func,
  scale: PropTypes.number
};

DragDropValues.defaultProps = {
  values: [],
  width: 150,
  height: 600,
  valueHeight: 50,
  margin: 0,
  onDrawDragDropValue: () => {},
  onAddDragDropValue: () => {},
  dragDropBoundsClassName: "",
  scale: 1
};

export default DragDropValues;
