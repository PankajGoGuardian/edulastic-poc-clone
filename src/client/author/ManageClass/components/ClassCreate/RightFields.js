import React, { useState } from "react";
import PropTypes from "prop-types";
import { filter, isArray } from "lodash";

import * as moment from "moment";
import { Input, Select, DatePicker } from "antd";
import { FieldLabel } from "./components";
import { StyledFlexContainer } from "./styled";
import selectsData from "../../../TestPage/components/common/selectsData";

const { allGrades, allSubjects } = selectsData;

const startDate = moment();
const endDate = moment(); // .add("days", 7);

const RightFields = ({ curriculums, schoolsData, courseList, ...restProps }) => {
  const [subject, setSubject] = useState("");

  const updateSubject = e => {
    setSubject(e);
  };

  const isDropdown = isArray(schoolsData);

  const standardSets = filter(curriculums, el => el.subject === subject);

  return (
    <>
      <StyledFlexContainer>
        <FieldLabel label="Class Name" {...restProps} fiedlName="name">
          <Input placeholder="Enter the name of your class" />
        </FieldLabel>
      </StyledFlexContainer>

      <StyledFlexContainer>
        <FieldLabel
          label="Class Start Date"
          optional
          fiedlName="startDate"
          initialValue={moment(startDate)}
          {...restProps}
        >
          <DatePicker data-cy="startDate" format="DD MMM, YYYY" placeholder="Open Date" />
        </FieldLabel>
        <FieldLabel label="Class End Date" optional {...restProps} fiedlName="endDate" initialValue={moment(endDate)}>
          <DatePicker data-cy="endDate" format="DD MMM, YYYY" placeholder="End Date" />
        </FieldLabel>
      </StyledFlexContainer>

      <StyledFlexContainer>
        <FieldLabel label="Grade" {...restProps} fiedlName="grade" initialValue="">
          <Select placeholder="Select Grade">
            {allGrades.map(el => (
              <Select.Option key={el.value} value={el.value}>
                {el.text}
              </Select.Option>
            ))}
          </Select>
        </FieldLabel>
        <FieldLabel label="Subject" {...restProps} fiedlName="subject" initialValue={subject}>
          <Select placeholder="Select Subject" onSelect={updateSubject}>
            {allSubjects.map(el => (
              <Select.Option key={el.value} value={el.value}>
                {el.text}
              </Select.Option>
            ))}
          </Select>
        </FieldLabel>
      </StyledFlexContainer>

      <FieldLabel label="Standards Set" {...restProps} fiedlName="standardSets" initialValue={[]}>
        <Select
          showSearch
          mode="multiple"
          optionFilterProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          placeholder="Select Standards"
        >
          {standardSets.map(el => (
            <Select.Option key={el._id} value={el._id}>
              {el.curriculum}
            </Select.Option>
          ))}
        </Select>
      </FieldLabel>

      <FieldLabel label="Course" {...restProps} fiedlName="courseId" initialValue="">
        <Select placeholder="Select Course">
          {courseList.map(el => (
            <Select.Option key={el._id} value={el._id}>
              {el.name}
            </Select.Option>
          ))}
        </Select>
      </FieldLabel>

      {!isDropdown && (
        <FieldLabel {...restProps} fiedlName="institutionId" initialValue={schoolsData}>
          <input type="hidden" />
        </FieldLabel>
      )}

      {isDropdown && (
        <FieldLabel label="School" {...restProps} fiedlName="institutionId">
          <Select placeholder="Select School">
            {schoolsData.map(el => (
              <Select.Option key={el._id} value={el._id}>
                {el.name}
              </Select.Option>
            ))}
          </Select>
        </FieldLabel>
      )}
    </>
  );
};

RightFields.propTypes = {
  curriculums: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      curriculum: PropTypes.string.isRequired,
      grades: PropTypes.array.isRequired,
      subject: PropTypes.string.isRequired
    })
  ).isRequired,
  schoolsData: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  courseList: PropTypes.array.isRequired,
  getFieldDecorator: PropTypes.func.isRequired
};

export default RightFields;
