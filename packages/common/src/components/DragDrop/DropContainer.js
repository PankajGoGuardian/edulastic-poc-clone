import { greyThemeLighter, themeColorBlue } from "@edulastic/colors";
import { isObject } from "lodash";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import React from "react";
import { useDrop } from "react-dnd";

const DropContainer = ({ style, drop, children, index, borderColor, showHoverBorder, noBorder, ...rest }) => {
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

  const overrideBorderColor = isOver ? themeColorBlue : borderColor || "transparent";

  const mergedStyle = {
    ...style,
    background: style.background || greyThemeLighter
  };

  return (
    <Container
      {...rest}
      className="drop-target-box"
      ref={dropRef}
      style={mergedStyle}
      id={`drop-container-${index}`}
      borderColor={overrideBorderColor}
      showHoverBorder={showHoverBorder}
      noBorder={noBorder}
    >
      {children}
    </Container>
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

const hoverStyle = css`
  &:hover {
    border-color: ${themeColorBlue};
  }
`;

const Container = styled.div`
  border: ${({ noBorder }) => !noBorder && "2px dashed"};
  border-radius: 2px;
  border-color: ${({ borderColor }) => borderColor};
  ${({ showHoverBorder }) => showHoverBorder && hoverStyle}
`;
