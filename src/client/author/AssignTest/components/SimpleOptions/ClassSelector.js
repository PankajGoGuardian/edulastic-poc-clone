/* eslint-disable react/prop-types */
import React from "react";
import { Select, Col } from "antd";
import { StyledRow, ColLabel, StyledSelect, Label } from "./styled";

const ClassSelector = ({ onChange, fetchStudents, selectedGroups, group, onDeselect }) => (
  <React.Fragment>
    <StyledRow gutter={32}>
      <ColLabel span={24}>
        <Label>CLASS/GROUP SECTION</Label>
      </ColLabel>
      <Col span={24}>
        <StyledSelect
          showSearch
          data-cy="selectClass"
          placeholder="Please select"
          mode="multiple"
          optionFilterProp="children"
          cache="false"
          onChange={onChange}
          onSelect={classId => {
            fetchStudents({ classId });
          }}
          onDeselect={onDeselect}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          value={selectedGroups}
        >
          {group.map(data => (
            <Select.Option data-cy="class" key={data._id} value={data._id}>
              {data.name}
            </Select.Option>
          ))}
        </StyledSelect>
      </Col>
    </StyledRow>
  </React.Fragment>
);

export default ClassSelector;
