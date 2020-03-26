/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { Col, Select, Radio } from "antd";
import { ColLabel, StyledRow, StyledSelect, StyledRadioGropRow, Label } from "./styled";
import { RadioBtn, RadioGrp, SelectInputStyled, FieldLabel } from "@edulastic/common";

const StudentsSelector = ({
  specificStudents,
  students = [],
  updateStudents,
  onChange,
  studentNames,
  handleRemoveStudents
}) => {
  const changeRadioGrop = e => {
    const { value } = e.target;
    onChange("specificStudents", value);
  };
  return (
    <React.Fragment>
      <StyledRadioGropRow gutter={32}>
        <Col span={24}>
          <RadioGrp onChange={changeRadioGrop} value={specificStudents}>
            <RadioBtn data-cy="radioEntireClass" value={false}>
              <Label>ENTIRE CLASS</Label>
            </RadioBtn>
            <RadioBtn data-cy="radioSpecificStudent" value={true}>
              <Label>SPECIFIC STUDENT</Label>
            </RadioBtn>
          </RadioGrp>
        </Col>
      </StyledRadioGropRow>
      {specificStudents && (
        <React.Fragment>
          <StyledRow gutter={32}>
            <Col span={24}>
              <FieldLabel>STUDENT</FieldLabel>
              <SelectInputStyled
                data-cy="selectStudent"
                placeholder="Select a student to assign"
                mode="multiple"
                onSelect={updateStudents}
                onDeselect={handleRemoveStudents}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                value={studentNames}
                getPopupContainer={trigger => trigger.parentNode}
                margin="0px 0px 15px"
              >
                {students
                  .filter(({ enrollmentStatus }) => enrollmentStatus > 0)
                  .map(({ _id, firstName, lastName, groupId }) => {
                    const fullName = `${lastName ? `${lastName}, ` : ""}${firstName ? `${firstName}` : ""}`;
                    return (
                      //group Id is being used to track student belongs to which class.
                      <Select.Option key={_id} value={_id} groupId={groupId}>
                        {fullName}
                      </Select.Option>
                    );
                  })}
              </SelectInputStyled>
            </Col>
          </StyledRow>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

StudentsSelector.propTypes = {
  students: PropTypes.array.isRequired,
  updateStudents: PropTypes.func.isRequired,
  studentNames: PropTypes.array
};

StudentsSelector.defaultProps = {
  studentNames: []
};

export default StudentsSelector;
