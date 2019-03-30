import React, { useState, useMemo, useCallback } from "react";
import { Button, Dropdown, Menu, Icon } from "antd";
import { partial } from "lodash";

const CustomMenu = (className, data, handleMenuClick) => {
  return (
    <Menu className={`${className}`} onClick={handleMenuClick}>
      {data.map((item, index) => {
        return (
          <Menu.Item key={item.key} title={item.title}>
            {item.title}
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export const NormalDropDown = ({ className, by, updateCB, data, comData }) => {
  const [selected, setSelected] = useState(by);

  const handleMenuClick = useCallback(
    event => {
      const _selected = { key: event.key, title: event.item.props.title };
      setSelected(_selected);
      if (updateCB) {
        updateCB(event, _selected, comData);
      }
    },
    [updateCB]
  );

  return (
    <div className={`${className}`}>
      <Dropdown overlay={partial(CustomMenu, className, data, handleMenuClick)}>
        <Button>
          {selected.title}
          <Icon type="caret-down" />
        </Button>
      </Dropdown>
    </div>
  );
};
