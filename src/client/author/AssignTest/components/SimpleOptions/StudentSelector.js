/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { Col, Select, Radio } from "antd";
import { StyledRowLabel, StyledRow, StyledSelect, StyledRadioGropRow } from "./styled";

const RadioGroup = Radio.Group;

const StudentsSelector = ({ specificStudents, students, updateStudents, onChange, studentNames }) => {
  const changeRadioGrop = e => {
    const { value, checked } = e.target;
    if (value === 3) {
      onChange("specificStudents", checked);
    } else {
      onChange("specificStudents", false);
    }
  };
  return (
    <React.Fragment>
      <StyledRadioGropRow gutter={16}>
        <Col span={24}>
          {/* value={specificStudents ? 3 : 1} */}
          <RadioGroup onChange={changeRadioGrop}>
            <Radio value={1}>Entire Class</Radio>
            <Radio value={2}>Absent Students</Radio>
            <Radio value={3}>Specific Student</Radio>
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
                placeholder="Please select"
                style={{ width: "100%" }}
                mode="multiple"
                onChange={updateStudents}
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
