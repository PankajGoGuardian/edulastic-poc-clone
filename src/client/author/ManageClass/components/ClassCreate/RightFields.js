import React, { useState } from "react";
import PropTypes from "prop-types";
import { filter, isArray, isEmpty, debounce } from "lodash";

import * as moment from "moment";
import { Input, Select, DatePicker } from "antd";
import { FieldLabel } from "./components";
import { StyledFlexContainer } from "./styled";
import selectsData from "../../../TestPage/components/common/selectsData";

const { allGrades, allSubjects } = selectsData;

const startDate = moment();
const endDate = moment().add(1, "years");

// eslint-disable-next-line max-len
const RightFields = ({
  curriculums,
  defaultSchool,
  courseList,
  schoolList,
  searchCourse,
  isSearching,
  ...restProps
}) => {
  const [subject, setSubject] = useState("");

  const updateSubject = e => {
    setSubject(e);
  };

  const handleSearch = debounce(keyword => searchCourse(keyword), 500);

  let isDropdown = isArray(schoolList) && !isEmpty(schoolList);

  if (isDropdown) {
    if (schoolList.length === 1) {
      isDropdown = schoolList[0]._id !== defaultSchool;
    }
  }

  const standardSets = filter(curriculums, el => el.subject === subject);
  const grades = filter(allGrades, el => el.isContentGrade !== true);
  const subjects = filter(allSubjects, el => el.value !== "");
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
        <FieldLabel label="Grade" {...restProps} fiedlName="grade" initialValue={[]}>
          <Select placeholder="Select Grade">
            {grades.map(el => (
              <Select.Option key={el.value} value={el.value}>
                {el.text}
              </Select.Option>
            ))}
          </Select>
        </FieldLabel>
        <FieldLabel label="Subject" {...restProps} fiedlName="subject" initialValue={[]}>
          <Select placeholder="Select Subject" onSelect={updateSubject}>
            {subjects.map(el => (
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

      <FieldLabel label="Course" {...restProps} fiedlName="courseId" initialValue={[]}>
        <Select
          placeholder="Select Course"
          showSearch
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onSearch={handleSearch}
          notFoundContent={null}
          loading={isSearching}
        >
          {courseList.map(el => (
            <Select.Option key={el._id} value={el._id}>{`${el.name} - ${el.number}`}</Select.Option>
          ))}
        </Select>
      </FieldLabel>

      {!isDropdown && (
        <FieldLabel {...restProps} fiedlName="institutionId" initialValue={defaultSchool}>
          <input type="hidden" />
        </FieldLabel>
      )}

      {isDropdown && (
        <FieldLabel label="School" {...restProps} fiedlName="institutionId">
          <Select placeholder="Select School">
            {schoolList.map(el => (
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
  defaultSchool: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  courseList: PropTypes.array.isRequired,
  schoolList: PropTypes.array,
  searchCourse: PropTypes.func.isRequired,
  isSearching: PropTypes.bool.isRequired,
  getFieldDecorator: PropTypes.func.isRequired
};

RightFields.defaultProps = {
  schoolList: [],
  defaultSchool: null
};

export default RightFields;
