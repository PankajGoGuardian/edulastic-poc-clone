import React from "react";
import styled from "styled-components";
import { Menu, Dropdown, Button, message, Tooltip } from "antd";
import { IconDownEmptyArrow, IconArrowLeft } from "@edulastic/icons";
import { FlexContainer } from "@edulastic/common";

const SortMenu = ({ options, onSelect, sortBy, sortDir }) => {
  const sortBy2 = options.find(i => i.value === sortBy);
  const handleMenuClick = e => onSelect(e.key, sortDir);
  const onSort = () => onSelect(sortBy2.value, sortDir === "desc" ? "asc" : "desc");

  const menu = (
    <Menu onClick={handleMenuClick}>
      {options.map(option => (
        <Menu.Item key={option.value}>{option.text}</Menu.Item>
      ))}
    </Menu>
  );
  return (
    <FlexContainer>
      <StyledLabel data-cy="sort-button" onClick={onSort}>
        Sort by <StyledSortIcon dir={sortDir} />
      </StyledLabel>
      <StyledDropdown overlay={menu}>
        <Button data-cy="sort-dropdown">
          {sortBy2?.text} <IconDownEmptyArrow />
        </Button>
      </StyledDropdown>
    </FlexContainer>
  );
};

const StyledSortIcon = styled(IconArrowLeft)`
  transform: ${({ dir }) => (dir === "desc" ? "rotate(-90deg)" : "rotate(90deg)")};
`;

const StyledLabel = styled.span`
  min-width: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: gray;

  svg {
    fill: gray;
    height: 10px;
  }
`;

const StyledDropdown = styled(Dropdown)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 125px;
  span {
    margin-right: 10px;
  }
`;

export default SortMenu;
