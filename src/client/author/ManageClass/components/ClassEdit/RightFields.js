import React, { useState } from "react";
import PropTypes from "prop-types";
import { filter, debounce, concat, find, isEmpty } from "lodash";

import * as moment from "moment";
import { Input, Select, DatePicker } from "antd";
import { FieldLabel } from "./components";
import { StyledFlexContainer } from "./styled";
import selectsData from "../../../TestPage/components/common/selectsData";

const { allGrades, allSubjects } = selectsData;

const classStartDate = moment();
const classEndDate = moment(); // .add("days", 7);

// eslint-disable-next-line max-len
const RightFields = ({
  curriculums,
  courseList,
  searchCourse,
  isSearching,
  defaultName,
  defaultStartDate,
  defaultEndDate,
  defaultGrade,
  defaultSubject,
  defaultStandardSets = [],
  defaultCourse = {},
  defaultSchool,
  ...restProps
}) => {
  const [subject, setSubject] = useState(defaultSubject || "");
  const [startDate, setStartDate] = useState(moment(defaultStartDate || classStartDate));
  const updateSubject = e => {
    setSubject(e);
  };

  const onStartDateChangeHandler = date => {
    setStartDate(date);
  };

  const handleSearch = debounce(keyword => searchCourse(keyword), 500);
  const handleFocus = debounce((keyword = "") => searchCourse(keyword), 500);
  const defaultStandardSetIds = defaultStandardSets.map(({ _id }) => _id);
  const standardSets = filter(curriculums, el => el.subject === subject);
  const isExist = find(courseList, ({ _id }) => _id === defaultCourse.id);
  let courseOptions = [];
  if (!isExist && !isEmpty(defaultCourse)) {
    courseOptions = concat(
      [
        {
          _id: defaultCourse.id,
          name: defaultCourse.name
        }
      ],
      courseList
    );
  } else {
    courseOptions = courseList;
  }

  const disabledStartDateHandler = current => current && current < moment().subtract(1, "d");
  const disabledEndDateHandler1 = current => current && current < moment(startDate).subtract(1, "d");
  const disabledEndDateHandler2 = current => current && current < moment();

  return (
    <>
      <StyledFlexContainer>
        <FieldLabel label="Class Name" {...restProps} fiedlName="name" initialValue={defaultName}>
          <Input placeholder="Enter the name of your class" />
        </FieldLabel>
      </StyledFlexContainer>

      <StyledFlexContainer>
        <FieldLabel label="Class Start Date" optional fiedlName="startDate" initialValue={startDate} {...restProps}>
          <DatePicker
            data-cy="startDate"
            format="DD MMM, YYYY"
            placeholder="Open Date"
            disabledDate={disabledStartDateHandler}
            onChange={onStartDateChangeHandler}
            disabled={moment(startDate) < moment() ? true : false}
          />
        </FieldLabel>
        <FieldLabel
          label="Class End Date"
          optional
          {...restProps}
          fiedlName="endDate"
          initialValue={moment(defaultEndDate || classEndDate)}
        >
          <DatePicker
            data-cy="endDate"
            format="DD MMM, YYYY"
            placeholder="End Date"
            disabledDate={moment(startDate) < moment() ? disabledEndDateHandler2 : disabledEndDateHandler1}
          />
        </FieldLabel>
      </StyledFlexContainer>

      <StyledFlexContainer>
        <FieldLabel label="Grade" {...restProps} fiedlName="grade" initialValue={defaultGrade}>
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

      <FieldLabel
        label="Standards Set"
        {...restProps}
        fiedlName="standardSets"
        initialValue={defaultStandardSetIds || []}
      >
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

      <FieldLabel label="Course" {...restProps} fiedlName="courseId" initialValue={defaultCourse.id || ""}>
        <Select
          placeholder="Select Course"
          showSearch
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onSearch={handleSearch}
          onFocus={handleFocus}
          notFoundContent={null}
          loading={isSearching}
        >
          {courseOptions.map(el => (
            <Select.Option key={el._id} value={el._id}>{`${el.name} - ${el.number || ""}`}</Select.Option>
          ))}
        </Select>
      </FieldLabel>

      <FieldLabel {...restProps} fiedlName="institutionId" initialValue={defaultSchool}>
        <input type="hidden" />
      </FieldLabel>
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
  courseList: PropTypes.array.isRequired,
  searchCourse: PropTypes.func.isRequired,
  isSearching: PropTypes.bool.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  defaultName: PropTypes.string.isRequired,
  defaultStartDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number]),
  defaultEndDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number]),
  defaultGrade: PropTypes.string,
  defaultSubject: PropTypes.string,
  defaultStandardSets: PropTypes.array,
  defaultCourse: PropTypes.object,
  defaultSchool: PropTypes.string
};

RightFields.defaultProps = {
  defaultStartDate: classStartDate,
  defaultEndDate: classEndDate,
  defaultCourse: {},
  defaultGrade: "",
  defaultSubject: "",
  defaultSchool: "",
  defaultStandardSets: []
};

export default RightFields;
