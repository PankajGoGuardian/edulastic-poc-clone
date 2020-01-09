import React from "react";
import PropTypes from "prop-types";
import { useDrop } from "react-dnd";

const DropContainer = ({ style, drop, children, index, ...rest }) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: "item",
    drop(item, monitor) {
      if (monitor.didDrop()) {
        return;
      }

      if (typeof drop === "function") {
        drop(item.data, index);
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  });

  const containerStyle = {
    ...style,
    ...(isOver ? { boxShadow: "0 0 6px #75b4dd", border: "2px dashed #75b4dd" } : {})
  };

  return (
    <div ref={dropRef} style={containerStyle} {...rest} data-cy="drop-container">
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
