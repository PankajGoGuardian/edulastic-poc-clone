import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { Label, Block } from "./styled";

const { Option } = Select;

const Size = ({ value, onChangeSize }) => (
  <Block>
    <Label>Size</Label>
    <Select
      defaultValue={value}
      onChange={onChangeSize}
      showArrow={false}
      getPopupContainer={triggerNode => triggerNode.parentNode}
    >
      <Option value={4}>2</Option>
      <Option value={6}>3</Option>
      <Option value={8}>4</Option>
      <Option value={10}>5</Option>
      <Option value={12}>6</Option>
    </Select>
  </Block>
);

Size.propTypes = {
  value: PropTypes.number.isRequired,
  onChangeSize: PropTypes.func.isRequired
};

export default Size;
