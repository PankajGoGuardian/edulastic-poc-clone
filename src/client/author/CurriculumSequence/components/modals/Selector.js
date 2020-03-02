/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { Select, Col, Spin } from "antd";
import { StyledRow, ColLabel, StyledSelect, Label } from "./styled";

const Selector = ({ onChange, onSelect, value, options, onDeselect, placeholder, mode, isLoading, label, dataCy }) => (
  <React.Fragment>
    <StyledRow gutter={32}>
      {label && <ColLabel span={24}>
        <Label>{label}</Label>
      </ColLabel>}
      <Col span={24}>
        <StyledSelect
          showArrow
          data-cy={dataCy}
          placeholder={placeholder}
          mode={mode}
          optionFilterProp="children"
          onChange={onChange}
          onSelect={onSelect}
          onDeselect={onDeselect}
          getPopupContainer={node => node.parentNode}
          filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
          notFoundContent={isLoading ? <Spin /> : "Not data"}
          value={value}
          labelInValue
          maxTagCount={4}
          maxTagTextLength={10}
        >
          {options.map(data => (
            <Select.Option data-cy="class" key={data.id} value={data.id} classId={data?.classId}>
              {data.name}
            </Select.Option>
          ))}
        </StyledSelect>
      </Col>
    </StyledRow>
  </React.Fragment>
);

Selector.propTypes = {
  mode: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  value: PropTypes.array,
  options: PropTypes.arrayOf(PropTypes.object),
  onDeselect: PropTypes.func,
  placeholder: PropTypes.string,
  isLoading: PropTypes.bool,
  dataCy: PropTypes.string
};

Selector.defaultProps = {
  mode: "multiple",
  onDeselect: () => {},
  value: [],
  isLoading: false,
  placeholder: "Search by name"
}
export default Selector;
