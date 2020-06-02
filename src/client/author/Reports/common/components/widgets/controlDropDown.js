import React, { useState, useCallback, useEffect } from "react";
import { Button, Dropdown, Menu, Icon } from "antd";
import styled from "styled-components";
import { partial } from "lodash";
import { fadedGrey, lightGreySecondary, black, whiteSmoke, themeColor } from "@edulastic/colors";

import { useInternalEffect } from "../../hooks/useInternalEffect";

const CustomMenu = (className, data, handleMenuClick, prefix, selected) => (
  <Menu selectedKeys={[selected.key]} className={`${className}`} onClick={handleMenuClick}>
    <Menu.Item key="0" disabled>
      {prefix}
    </Menu.Item>
    {data.map((item, index) => (
      <Menu.Item key={item.key} title={item.title}>
        {item.title}
      </Menu.Item>
        ))}
  </Menu>
  );

const ControlDropDown = ({
  className,
  containerClassName = "",
  prefix = "",
  showPrefixOnSelected = true,
  by,
  selectCB,
  data,
  comData,
  trigger = ["click"],
  buttonWidth
}) => {
  const [selected, setSelected] = useState(by);
  const [isActive, setActive] = useState(false);

  useInternalEffect(() => {
    let item = null;
    if (data.length) {
      item = data.find((item, index) => {
        if (item.key === selected.key) {
          return true;
        }
      });
      if (!item) {
        item = data[0];
      }
    } else {
      item = { key: "", title: "" };
    }

    setSelected(item);
  }, [data]);

  useInternalEffect(() => {
    let item = data.find((item, index) => {
      if (typeof by === "string" && item.key === by) {
        return true;
      }
      if (typeof by === "object" && item.key === by.key) {
        return true;
      }
    });

    if (!item && data.length) {
      item = data[0];
    } else if (!item && !data.length) {
      item = { key: "", title: "" };
    }

    setSelected(item);
  }, [by]);

  const handleMenuClick = useCallback(
    event => {
      const _selected = { key: event.key, title: event.item.props.title };
      setActive(false);
      setSelected(_selected);
      if (selectCB) {
        selectCB(event, _selected, comData);
      }
    },
    [selectCB]
  );

  const title = (selected && selected.title) || prefix;

  return (
    <StyledDiv className={`${containerClassName} control-dropdown`} buttonWidth={buttonWidth}>
      <Dropdown
        onVisibleChange={setActive}
        overlay={partial(CustomMenu, className, data, handleMenuClick, prefix, selected)}
        trigger={trigger}
      >
        <Button title={title}>
          {(showPrefixOnSelected ? `${prefix  } ` : "") + selected ?.title}
          <Icon type={isActive ? "up" : "down"} />
        </Button>
      </Dropdown>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  padding: 5px;
  button {
    display: flex;
    justify-content: start;
    align-items: center;
    width: ${({ buttonWidth }) => (buttonWidth || "auto")};
    &.ant-btn.ant-dropdown-trigger {
      background-color: ${lightGreySecondary};
      border-color: ${fadedGrey};

      &.ant-dropdown-open {
        background-color: transparent;
      }

      &:hover,
      &:focus {
        border-color: ${themeColor};
        color: ${themeColor};
      }
      i {
        color: ${themeColor};
      }
      .anticon {
        height: 13px;
        font-size: 13px;
        transform: none;
      }
    }

    span {
      flex: 1;
      text-align: left;
      overflow: hidden;
    }
  }
`;

const StyledControlDropDown = styled(ControlDropDown)`
  max-height: 250px;
  overflow: auto;
  .ant-dropdown-menu-item {
    padding: 4px 12px;
  }

  .ant-dropdown-menu-item-selected,
  .ant-dropdown-menu-item-active {
    background-color: ${themeColor};
    color: #ffffff;
  }

  .ant-dropdown-menu-item-disabled {
    font-weight: 900;
    color: ${black};
    cursor: default;
  }
`;

export { StyledControlDropDown as ControlDropDown };
