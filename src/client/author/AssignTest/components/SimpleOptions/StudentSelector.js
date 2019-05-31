/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { Col, Select, Radio } from "antd";
import { StyledRowLabel, StyledRow, StyledSelect, StyledRadioGropRow } from "./styled";

const RadioGroup = Radio.Group;

const StudentsSelector = ({ specificStudents, students, updateStudents, onChange, studentNames }) => {
  const changeRadioGrop = e => {
    const { value } = e.target;
    onChange("specificStudents", value);
  };
  return (
    <React.Fragment>
      <StyledRadioGropRow gutter={16}>
        <Col span={24}>
          <RadioGroup onChange={changeRadioGrop} value={specificStudents}>
            <Radio data-cy="radioEntireClass" value={false}>
              Entire Class
            </Radio>
            <Radio data-cy="radioSpecificStudent" value={true}>
              Specific Student
            </Radio>
          </RadioGroup>
        </Col>
      </StyledRadioGropRow>
      {specificStudents && (
        <React.Fragment>
          <StyledRowLabel gutter={16}>
            <Col span={12}>Student</Col>
          </StyledRowLabel>
          <StyledRow>
            <Col span={24}>
              <StyledSelect
                data-cy="selectStudent"
                placeholder="Please select"
                style={{ width: "100%" }}
                mode="multiple"
                onChange={updateStudents}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                value={studentNames}
              >
                {students.map(({ _id, firstName, lastName }) => (
                  <Select.Option key={_id} value={_id}>
                    {`${firstName || "Anonymous"} ${lastName || ""}`}
                  </Select.Option>
                ))}
              </StyledSelect>
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
