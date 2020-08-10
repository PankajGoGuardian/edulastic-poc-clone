/* eslint-disable react/prop-types */
import React from "react";
import { Col, Select, Tooltip } from "antd";
import styled from "styled-components";
import { FieldLabel, SelectInputStyled } from "@edulastic/common";
import { IconGroup, IconClass } from "@edulastic/icons";
import { lightGrey10 } from "@edulastic/colors";

const dropdownStyle = {
  boxShadow: "0 3px 10px 0 rgba(0, 0, 0, 0.1)"
};

const ClassSelector = ({ onChange, fetchStudents, selectedGroups, group }) => (
  <React.Fragment>
    <Col span={12}>
      <FieldLabel>CLASS/GROUP SECTION</FieldLabel>
      <SelectInputStyled
        showSearch
        data-cy="selectClass"
        placeholder="Select a class to assign"
        mode="multiple"
        optionFilterProp="children"
        cache="false"
        onChange={onChange}
        onSelect={classId => {
          fetchStudents({ classId });
        }}
        filterOption={(input, option) => option?.props?.name?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}
        value={selectedGroups}
        getPopupContainer={trigger => trigger.parentNode}
        margin="0px 0px 10px"
        dropdownStyle={dropdownStyle}
      >
        {group.map(data => (
          <Select.Option data-cy="class" key={data._id} value={data._id} name={data.name}>
            <Tooltip placement="left" title={data.type === "class" ? "Class" : "Group"}>
              <OptionWrapper>
                {data.type === "custom" ? (
                  <IconGroup width={20} height={19} color={lightGrey10} margin="0 10px 0 0" />
                ) : (
                  <IconClass width={13} height={14} color={lightGrey10} margin="0 13px 0 3px" />
                )}
                <span>{data.name}</span>
              </OptionWrapper>
            </Tooltip>
          </Select.Option>
        ))}
      </SelectInputStyled>
    </Col>
  </React.Fragment>
);

export default ClassSelector;

const OptionWrapper = styled.div`
  display: inline-flex;
  width: 100%;
  align-items: center;
`;
