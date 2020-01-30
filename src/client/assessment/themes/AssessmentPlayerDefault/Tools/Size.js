import React from "react";
import { Select } from "antd";
import { Label, Block } from "./styled";

const { Option } = Select;

const Size = () => (
  <Block>
    <Label>Size</Label>
    <Select
      defaultValue="2"
      onChange={() => {}}
      showArrow={false}
      getPopupContainer={triggerNode => triggerNode.parentNode}
    >
      <Option value="2">2</Option>
      <Option value="3">3</Option>
      <Option value="4">4</Option>
      <Option value="5">5</Option>
      <Option value="6">6</Option>
    </Select>
  </Block>
);

export default Size;
