import { greyThemeLighter, themeColorBlue, lightGrey12 } from "@edulastic/colors";
import { isObject } from "lodash";
import styled, { css, withTheme } from "styled-components";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useDrop } from "react-dnd";

const DropContainer = ({
  style,
  drop,
  hover,
  children,
  index,
  borderColor,
  showHoverBorder,
  noBorder,
  className,
  ...rest
}) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: "item",
    drop(item, monitor) {
      if (monitor.didDrop()) {
        return;
      }
      if (typeof drop === "function") {
        const itemPos = monitor.getClientOffset();
        const itemOffset = monitor.getSourceClientOffset();
        const { data, size } = item;
        let itemRect = {};
        if (isObject(size) && isObject(itemPos)) {
          itemRect = { ...item.size, ...itemPos };
        }
        drop({ data, itemRect, itemOffset }, index);
      }
    },
    // hover(item, monitor) {
    //   const { data, size: itemRect } = item;
    //   const itemOffset = monitor.getSourceClientOffset();
    //   if (hover) {
    //     // hover(data, itemRect, itemOffset);
    //     hover(monitor.isOver({ shallow: true }));
    //   }
    // },
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  });

  useEffect(() => {
    if (hover) {
      hover(isOver);
    }
  }, [hover, isOver]);

  const overrideBorderColor = isOver ? themeColorBlue : borderColor || "transparent";

  const mergedStyle = {
    ...style,
    background: style.background || greyThemeLighter
  };

  return (
    <Container
      {...rest}
      className={`${className} drop-target-box`}
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
  index: PropTypes.number,
  className: PropTypes.string,
  borderColor: PropTypes.string
};

DropContainer.defaultProps = {
  children: undefined,
  isOver: false,
  drop: () => null,
  style: {},
  index: null,
  className: "",
  borderColor: lightGrey12
};

export default withTheme(DropContainer);

const hoverStyle = css`
  &:hover {
    border-color: ${themeColorBlue};
  }
`;

const Container = styled.div`
  font-size: ${({ theme }) => theme.fontSize};
  border: ${({ noBorder }) => !noBorder && "2px dashed"};
  border-radius: 2px;
  border-color: ${({ borderColor }) => borderColor};
  ${({ showHoverBorder }) => showHoverBorder && hoverStyle}
`;
