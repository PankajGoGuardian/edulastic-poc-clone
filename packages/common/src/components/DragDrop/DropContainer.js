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

  const containerStyle = {
    ...style,
    ...(isOver ? { boxShadow: "0 0 6px #75b4dd", background: "#f8f8f8", border: "2px dashed #b9b9b9" } : {})
  };

  return (
    <div ref={dropRef} style={containerStyle} {...rest} id={`drop-container-${index}`}>
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
