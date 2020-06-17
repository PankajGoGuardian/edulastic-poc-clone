import React, { Component } from "react";
import PropTypes from "prop-types";
import { Rnd } from "react-rnd";
import { DragDropValuesContainer, DragDropTitle, DragDropContainer } from "./styled";

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

    return (
      <DragDropValuesContainer ref={this.container} width={width} minHeight={height}>
        <DragDropTitle>DRAG DROP VALUES</DragDropTitle>
        <div style={containerStyle}>
          {values.map((value, i) => {
            const position = { x: 5, y: i * (valueHeight + 5) };
            const size = { width: width - 10, height: valueHeight };

            return (
              <Rnd
                key={value.id}
                position={position}
                size={size}
                onDragStop={(evt, d) => {
                  if (window.isIOS) {
                    document.body.removeEventListener("touchmove", this.scrollHandler);
                  }
                  this.handleDragDropValuePosition(d, value);
                }}
                onDrag={(e, d) => {
                  if (window.isIOS) {
                    document.body.addEventListener("touchmove", this.scrollHandler, { passive: false });
                    document.body.scrollTop = 0;
                  }
                  this.handleDragDropValue(d, value);
                }}
                style={{ zIndex: 10 }}
                disableDragging={false}
                enableResizing={false}
                bounds={dragDropBoundsClassName ? `.${dragDropBoundsClassName}` : ""}
                className="drag-drop-value"
                scale={scale}
              >
                <DragDropContainer dangerouslySetInnerHTML={{ __html: value.text }} />
              </Rnd>
            );
          })}
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
  titleOffset: PropTypes.number,
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
  titleOffset: 40,
  margin: 0,
  onDrawDragDropValue: () => {},
  onAddDragDropValue: () => {},
  dragDropBoundsClassName: "",
  scale: 1
};

export default DragDropValues;
