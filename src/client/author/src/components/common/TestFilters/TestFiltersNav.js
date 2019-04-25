import React from "react";
import PropTypes from "prop-types";
import { Menu, Icon } from "antd";
import styled from "styled-components";

import { white, mainTextColor, blue } from "@edulastic/colors";

const TestFiltersNav = ({ items, onSelect, search = {} }) => {
  let selected = items[0].path;
  if (search.filter) {
    const getCurrent = items.find(item => item.filter === search.filter);
    selected = getCurrent.path;
  }
  return (
    <Container onSelect={onSelect} selectedKeys={[selected]}>
      {items.map(item => (
        <Item key={item.path}>
          <Icon type={item.icon} /> {item.text}
        </Item>
      ))}
    </Container>
  );
};

TestFiltersNav.propTypes = {
  items: PropTypes.array.isRequired,
  onSelect: PropTypes.func
};

TestFiltersNav.defaultProps = {
  onSelect: () => {}
};

export default TestFiltersNav;

const Container = styled(Menu)`
  border-right: none;
  background: transparent;
`;

const Item = styled(Menu.Item)`
  color: ${mainTextColor};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;

  .anticon {
    font-size: 18px;
    margin-right: 22px;
  }

  :hover {
    color: ${blue};
  }

  &.ant-menu-item {
    font-size: 13px;
    display: flex;
    align-items: center;
  }

  &.ant-menu-item-selected {
    border-left: 3px solid ${blue} !important;
    background-color: ${white} !important;
    color: ${blue};
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 0px 10px 10px 0px;
  }
`;
