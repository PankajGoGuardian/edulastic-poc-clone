import React, { Component } from "react";
import PropTypes from "prop-types";
import { Rnd } from "react-rnd";
import { FroalaEditor } from "@edulastic/common";
import { DragDropValuesContainer, DragDropTitle } from "./styled";

class DragDropValues extends Component {
  handleDragDropValuePosition = (d, value) => {
    const { onAddDragDropValue, width, margin, valueHeight } = this.props;
    onAddDragDropValue(value, d.x - width - margin + width / 2, d.y - margin + valueHeight / 2);
  };

  render() {
    const { values, width, height, valueHeight, titleOffset } = this.props;

    return (
      <DragDropValuesContainer
        width={width}
        minHeight={height}
        height={values.length * (valueHeight + 5) - titleOffset}
      >
        <DragDropTitle height={titleOffset}>DRAG DROP VALUES</DragDropTitle>
        {values.map((value, i) => {
          const position = { x: 5, y: i * (valueHeight + 5) + titleOffset };
          const size = { width: width - 10, height: valueHeight };

          return (
            <Rnd
              key={value.id}
              position={position}
              size={size}
              onDragStop={(evt, d) => this.handleDragDropValuePosition(d, value)}
              style={{ zIndex: 10 }}
              disableDragging={false}
              enableResizing={false}
              bounds=".jsxbox-with-drag-drop"
              className="drag-drop-value"
            >
              <FroalaEditor
                value={value.text}
                onChange={() => {}}
                toolbarInline
                toolbarVisibleWithoutSelection
                imageEditButtons={[]}
                readOnly
              />
            </Rnd>
          );
        })}
      </DragDropValuesContainer>
    );
  }
}

DragDropValues.propTypes = {
  values: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  valueHeight: PropTypes.number,
  titleOffset: PropTypes.number,
  margin: PropTypes.number,
  onAddDragDropValue: PropTypes.func
};

DragDropValues.defaultProps = {
  values: [],
  width: 150,
  height: 600,
  valueHeight: 50,
  titleOffset: 40,
  margin: 0,
  onAddDragDropValue: () => {}
};

export default DragDropValues;
