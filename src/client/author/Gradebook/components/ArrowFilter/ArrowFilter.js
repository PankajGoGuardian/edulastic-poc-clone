import React from "react";
import PropTypes from "prop-types";

import { cardTitleColor } from "@edulastic/colors";
import { FlexContainer } from "@edulastic/common";
import { ItemsContainer, StyledButton, StyledSpan, ItemContainer, Mid, After } from "./styled";

const ArrowItem = ({ children, color, handleClick, bgColor = "" }) => (
  <ItemContainer onClick={handleClick} style={{ cursor: "pointer" }}>
    <Mid bgColor={bgColor} color={color}>
      {children}
    </Mid>
    <After bgColor={bgColor} color={color} />
  </ItemContainer>
);

ArrowItem.propTypes = {
  children: PropTypes.any.isRequired,
  color: PropTypes.string
};

ArrowItem.defaultProps = {
  color: cardTitleColor
};

const ArrowFilter = ({ data, onClick, selected }) => {
  const itemAll = data.find(d => d.id === "");
  const items = data.filter(d => d.id !== "");
  const allItemsCount = items.reduce((res, ele) => res + (ele.count || 0), 0);
  return (
    <FlexContainer alignItems="center">
      <div>
        <StyledSpan>Filter By</StyledSpan>
        {itemAll && (
          <StyledButton type="primary" onClick={() => onClick(itemAll.id)}>
            <span style={{ fontSize: "19px", marginRight: "10px" }}>{allItemsCount}</span>
            {itemAll.name}
          </StyledButton>
        )}
      </div>
      <ItemsContainer>
        {items.map(item => (
          <ArrowItem
            key={item.id}
            handleClick={() => onClick(item.id)}
            color={selected === item.id ? "white" : item.fgColor}
            bgColor={selected === item.id && item.fgColor}
          >
            <span>{item.count || 0}</span>
            {item.name}
          </ArrowItem>
        ))}
      </ItemsContainer>
    </FlexContainer>
  );
};

ArrowFilter.propTypes = {
  data: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.string
};

ArrowFilter.defaultProps = {
  selected: ""
};

export default ArrowFilter;
