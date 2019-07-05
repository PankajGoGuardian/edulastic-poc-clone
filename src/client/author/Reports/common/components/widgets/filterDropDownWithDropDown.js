import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Dropdown, Menu, Icon } from "antd";
import { NormalDropDown } from "./normalDropDown";

export const FilterDropDownWithDropDown = ({ className, updateCB, data, values }) => {
  const [visible, setVisible] = useState(false);

  const handleMenuClick = event => {};

  const handleVisibleChange = flag => {
    setVisible(flag);
  };

  const updateNormalDropDownCB = (event, selected, comData) => {
    updateCB(event, selected, comData);
  };

  const menu = (
    <StyledMenu className={`${className}`} onClick={handleMenuClick}>
      {data.map((item, index) => {
        return (
          <Menu.Item key={item.key}>
            <p>{item.title}</p>
            <StyledDropDown
              by={values && values[item.key] ? values[item.key] : item.data[0]}
              updateCB={updateNormalDropDownCB}
              data={item.data}
              comData={item.key}
            />
          </Menu.Item>
        );
      })}
    </StyledMenu>
  );

  return (
    <div className={`${className}`}>
      <Dropdown overlay={menu} visible={visible} onVisibleChange={handleVisibleChange}>
        <Button>
          <Icon type="filter" />
        </Button>
      </Dropdown>
    </div>
  );
};
const StyledMenu = styled(Menu)`
  min-width: 250px;
`;

const StyledDropDown = styled(NormalDropDown)`
  max-width: 200px;

  .ant-btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &.ant-dropdown-trigger {
      white-space: nowrap;
      overflow: hidden;
      max-width: 100%;
      text-overflow: ellipsis;
      width: 100%;
    }
  }

  .ant-dropdown-menu-item {
    white-space: normal;
  }
`;
