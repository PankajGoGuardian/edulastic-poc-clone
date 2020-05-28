import React from "react";
import PropTypes from "prop-types";
import { isObject } from "lodash";
import { useDrop } from "react-dnd";

const DropContainer = ({ style, drop, children, index, ...rest }) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: "item",
    drop(item, monitor) {
      if (monitor.didDrop()) {
        return;
      }
      if (typeof drop === "function") {
        const itemPos = monitor.getClientOffset();
        const { data, size } = item;
        let itemRect = {};
        if (isObject(size) && isObject(itemPos)) {
          itemRect = { ...item.size, ...itemPos };
        }
        drop({ data, itemRect }, index);
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  });

  const overrideStyle = {
    border: isOver ? "1px dashed #75b4dd" : style.border || "1px dashed #b9b9b9",
    background: style.background || "#f8f8f8f"
  };

  const mergedStyle = {
    ...style,
    ...overrideStyle
  };

  return (
    <div ref={dropRef} style={mergedStyle} {...rest} id={`drop-container-${index}`}>
      {children}
    </div>
  );
};

DropContainer.propTypes = {
  children: PropTypes.node,
  drop: PropTypes.func,
  style: PropTypes.object,
  isOver: PropTypes.bool,
  index: PropTypes.number
};

DropContainer.defaultProps = {
  children: undefined,
  isOver: false,
  drop: () => null,
  style: {},
  index: null
};

export default DropContainer;
