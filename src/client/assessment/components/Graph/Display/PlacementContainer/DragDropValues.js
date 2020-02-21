import React, { Component } from "react";
import PropTypes from "prop-types";
import { Rnd } from "react-rnd";
import { DragDropTitle, DragDropContainer } from "./styled";
import { SortableContainer, SortableElement, arrayMove } from "react-sortable-hoc";

class DragDropValues extends Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.state = {
      values: this.props.values
    };
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ values }) => ({
      values: arrayMove(values, oldIndex, newIndex)
    }));
  };

  handleDragDropValuePosition = (d, value, index) => {
    const { onAddDragDropValue, width, valueHeight } = this.props;
    onAddDragDropValue(value, d.x - 0.83 * width, d.y + 0.5 * valueHeight + index * valueHeight);
    return false;
  };

  handleDragDropValue = (d, value, index) => {
    const { onDrawDragDropValue, width, valueHeight } = this.props;
    onDrawDragDropValue(value, d.x - 0.83 * width, d.y + 0.5 * valueHeight + index * valueHeight);
  };

  componentDidUpdate(oldProps) {
    const newProps = this.props;
    if (oldProps.values !== newProps.values) {
      this.setState({ values: newProps.values });
    }
  }

  scrollHandler = e => e.preventDefault();

  render() {
    const { values, width, valueHeight, dragDropBoundsClassName, scale } = this.props;
    const containerStyle = {
      position: "relative",
      height: 30 + values.length * valueHeight
    };
    const size = { width: width, height: valueHeight };
    const SortableItem = SortableElement(({ value, ind, position }) => (
      <div style={{ backgroundColor: "rgba(230, 230, 230, 0.23)", width: width + "px" }}>
        <Rnd
          key={`item-${value.id}`}
          position={position}
          size={size}
          index={ind}
          onDragStop={(evt, d) => {
            if (window.isIOS) {
              document.body.removeEventListener("touchmove", this.scrollHandler);
            }
            this.handleDragDropValuePosition(d, value, ind);
          }}
          onDrag={(e, d) => {
            if (window.isIOS) {
              document.body.addEventListener("touchmove", this.scrollHandler, { passive: false });
              document.body.scrollTop = 0;
            }
            this.handleDragDropValue(d, value, ind);
          }}
          style={{ zIndex: 10, position: "static" }}
          disableDragging={false}
          enableResizing={false}
          bounds={dragDropBoundsClassName ? `.${dragDropBoundsClassName}` : ""}
          className="drag-drop-value react-draggable"
          scale={1}
        >
          <DragDropContainer style={{ margin: "14.5px 0" }} dangerouslySetInnerHTML={{ __html: value.text }} />
        </Rnd>
      </div>
    ));

    const SortableList = SortableContainer(({ items }) => {
      const items2 = items.filter(item => item);
      return (
        <div>
          {items2.map((value, index) => (
            <SortableItem key={`item-${value.id}`} index={index} ind={index} value={value} position={{ x: 0, y: 0 }} />
          ))}
        </div>
      );
    });

    return (
      <div style={containerStyle} className="drag-drop-values">
        <DragDropTitle>DRAG DROP VALUES</DragDropTitle>
        <SortableList items={this.state.values} onSortEnd={this.onSortEnd} />
      </div>
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
