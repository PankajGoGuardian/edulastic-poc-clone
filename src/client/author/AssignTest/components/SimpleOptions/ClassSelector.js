/* eslint-disable react/prop-types */
import { FieldLabel, SelectInputStyled } from "@edulastic/common";
import { Col, Select } from "antd";
import React from "react";
import { StyledRow } from "./styled";

const ClassSelector = ({ onChange, fetchStudents, selectedGroups, group, onDeselect, specificStudents }) => (
  <React.Fragment>
    <StyledRow gutter={32}>
      <Col span={24}>
        <FieldLabel>CLASS/GROUP SECTION</FieldLabel>
        <SelectInputStyled
          showSearch
          data-cy="selectClass"
          placeholder={
            specificStudents
              ? "Select a class here first and then students in the field below"
              : "Select a class to assign"
          }
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
          getPopupContainer={trigger => trigger.parentNode}
          margin="0px 0px 10px"
        >
          {group.map(data => (
            <Select.Option data-cy="class" key={data._id} value={data._id}>
              {data.name}
            </Select.Option>
          ))}
        </SelectInputStyled>
      </Col>
    </StyledRow>
  </React.Fragment>
);

export default ClassSelector;
