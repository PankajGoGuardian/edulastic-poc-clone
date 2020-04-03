/* eslint-disable react/prop-types */
import React from "react";
import { IoIosPeople, IoIosPerson } from "react-icons/io";
import { Col, Select } from "antd";
import styled from "styled-components";
import { FieldLabel, SelectInputStyled } from "@edulastic/common";
import { StyledRow } from "./styled";

const dropdownStyle = {
  boxShadow: "0 3px 10px 0 rgba(0, 0, 0, 0.1)"
};

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
          dropdownStyle={dropdownStyle}
        >
          {group.map(data => (
            <Select.Option data-cy="class" key={data._id} value={data._id}>
              <OptionWrapper>
                {data.type === "custom" ? (
                  <IoIosPeople size={18} style={{ marginRight: "10px" }} />
                ) : (
                  <IoIosPerson size={16} style={{ marginRight: "10px" }} />
                )}
                <span>{data.name}</span>
              </OptionWrapper>
            </Select.Option>
          ))}
        </SelectInputStyled>
      </Col>
    </StyledRow>
  </React.Fragment>
);

export default ClassSelector;

const OptionWrapper = styled.div`
  display: inline-flex;
  align-items: center;
`;
