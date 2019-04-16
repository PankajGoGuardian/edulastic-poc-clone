import React, { useState, useCallback, useEffect } from "react";
import { Button, Dropdown, Menu, Icon } from "antd";
import { partial } from "lodash";

const CustomMenu = (className, data, handleMenuClick, prefix) => {
  return (
    <Menu className={`${className}`} onClick={handleMenuClick}>
      <Menu.Item key="0" disabled={true}>
        {prefix}
      </Menu.Item>
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

export const ControlDropDown = ({
  className,
  prefix,
  showPrefixOnSelected = true,
  by,
  updateCB,
  data,
  comData,
  trigger = "hover"
}) => {
  const [selected, setSelected] = useState(by);

  useEffect(() => {
    setSelected(by);
  }, [by]);

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
    <div className={`${className}`} style={{ overflow: "hidden" }}>
      <Dropdown overlay={partial(CustomMenu, className, data, handleMenuClick, prefix)} trigger={trigger}>
        <Button>
          {(showPrefixOnSelected ? prefix + " " : "") + selected.title}
          <Icon type="caret-down" />
        </Button>
      </Dropdown>
    </div>
  );
};
