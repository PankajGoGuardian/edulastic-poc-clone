import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Dropdown, Menu, Icon } from "antd";
import { NormalDropDown } from "./normalDropDown";
import { themeColor } from "@edulastic/colors";
import { ControlDropDown } from "./controlDropDown";
import { IconFilter } from "@edulastic/icons";

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
          <StyledControlDropDownContainer>
            <p className="menu-title">{item.title}</p>
            <ControlDropDown
              key={item.key}
              by={values && values[item.key] ? values[item.key] : item.data[0]}
              selectCB={updateNormalDropDownCB}
              data={item.data}
              comData={item.key}
            />
          </StyledControlDropDownContainer>
        );
      })}
    </StyledMenu>
  );

  return (
    <div className={`${className || ""}`}>
      <Dropdown overlay={menu} visible={visible} onVisibleChange={handleVisibleChange} trigger={["click"]}>
        <StyledButton>
          <IconFilter color={themeColor} width={20} height={20} />
        </StyledButton>
      </Dropdown>
    </div>
  );
};

const StyledButton = styled(Button)`
  margin: 5px;
`;

const StyledMenu = styled(Menu)`
  min-width: 230px;
`;

const StyledIcon = styled(Icon)`
  color: ${themeColor};
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

const StyledControlDropDownContainer = styled.div`
  padding: 10px;

  p.menu-title {
    margin-bottom: 5px;
    font-weight: bold;
  }

  .control-dropdown {
    margin: 0px;

    .ant-btn {
      width: 100%;
    }
  }
`;
