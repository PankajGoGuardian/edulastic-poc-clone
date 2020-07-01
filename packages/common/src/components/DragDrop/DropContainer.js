import React from "react";
import PropTypes from "prop-types";
import { isObject } from "lodash";
import { useDrop } from "react-dnd";
import { themeColorBlue, greyThemeLight, greyThemeLighter } from "@edulastic/colors";

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
    border: isOver ? `2px dashed ${themeColorBlue}` : style.border || `2px dashed ${greyThemeLight}`,
    background: style.background || greyThemeLighter
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
