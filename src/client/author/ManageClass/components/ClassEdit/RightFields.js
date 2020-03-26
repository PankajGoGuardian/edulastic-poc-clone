import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { debounce, concat, find, isEmpty, filter } from "lodash";

import * as moment from "moment";
import { Col, Input, Select, DatePicker } from "antd";
import { FieldLabel } from "./components";
import { StyledFlexContainer } from "./styled";
import selectsData from "../../../TestPage/components/common/selectsData";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import { StandardsValidationMSG } from "../ClassCreate/styled";
import Tags from "./Tags";
import { TextInputStyled, DatePickerStyled, SelectInputStyled } from "@edulastic/common";

const { allGrades, allSubjects } = selectsData;
const subjects = filter(allSubjects, el => el.value !== "");

const classStartDate = moment();
const classEndDate = moment(); // .add("days", 7);

const RightFields = ({
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
  schoolList = [],
  subject,
  setSubject,
  filteredCurriculums,
  clearStandards,
  cleverId,
  ...restProps
}) => {
  const [startDate, setStartDate] = useState(moment(defaultStartDate || classStartDate));
  useEffect(() => {
    setSubject(defaultSubject || "");
  }, []);
  const updateSubject = e => {
    setSubject(e);
    clearStandards();
  };

  const onStartDateChangeHandler = date => {
    setStartDate(date);
  };

  const handleSearch = debounce(keyword => searchCourse(keyword), 500);
  const handleFocus = debounce((keyword = "") => searchCourse(keyword), 500);
  const defaultStandardSetIds = defaultStandardSets.map(({ _id }) => _id);
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
      <StyledFlexContainer gutter={24}>
        <Col xs={24}>
          <FieldLabel label="Class Name" {...restProps} fiedlName="name" initialValue={defaultName}>
            <TextInputStyled placeholder="Enter the name of your class" />
          </FieldLabel>
        </Col>
      </StyledFlexContainer>

      <StyledFlexContainer gutter={24}>
        <Col xs={12}>
          <FieldLabel label="Class Start Date" optional fiedlName="startDate" initialValue={startDate} {...restProps}>
            <DatePickerStyled
              data-cy="startDate"
              format="DD MMM, YYYY"
              placeholder="Open Date"
              disabledDate={disabledStartDateHandler}
              onChange={onStartDateChangeHandler}
              disabled={moment(startDate) < moment() || !!cleverId ? true : false}
            />
          </FieldLabel>
        </Col>
        <Col xs={12}>
          <FieldLabel
            label="Class End Date"
            optional
            {...restProps}
            fiedlName="endDate"
            initialValue={moment(defaultEndDate || classEndDate)}
          >
            <DatePickerStyled
              data-cy="endDate"
              format="DD MMM, YYYY"
              placeholder="End Date"
              disabledDate={moment(startDate) < moment() ? disabledEndDateHandler2 : disabledEndDateHandler1}
              disabled={!!cleverId}
            />
          </FieldLabel>
        </Col>
      </StyledFlexContainer>

      <StyledFlexContainer gutter={24}>
        <Col xs={12}>
          <FieldLabel
            label="Grades"
            {...restProps}
            fiedlName="grades"
            initialValue={defaultGrade}
            disabled={!!cleverId}
          >
            <SelectInputStyled placeholder="Select Grades" mode="multiple" disabled={!!cleverId}>
              {allGrades.map(el => (
                <Select.Option key={el.value} value={el.value}>
                  {el.text}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </FieldLabel>
        </Col>
        <Col xs={12}>
          <FieldLabel label="Subject" {...restProps} fiedlName="subject" initialValue={subject} disabled={!!cleverId}>
            <SelectInputStyled placeholder="Select Subject" onSelect={updateSubject} disabled={!!cleverId}>
              {subjects.map(el => (
                <Select.Option key={el.value} value={el.value}>
                  {el.text}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </FieldLabel>
        </Col>
      </StyledFlexContainer>

      <StyledFlexContainer gutter={24}>
        <Col xs={24}>
          <FieldLabel
            label="Standards Set"
            fiedlName="standardSets"
            initialValue={defaultStandardSetIds || []}
            {...restProps}
          >
            <SelectInputStyled
              showSearch
              mode="multiple"
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              placeholder="Select Standards"
              disabled={!!cleverId}
            >
              {!subject ? (
                <Select.Option key="subject_first" value="subject_first" disabled>
                  <StandardsValidationMSG>Please select subject first.</StandardsValidationMSG>
                </Select.Option>
              ) : (
                filteredCurriculums.map(el => (
                  <Select.Option key={el.value} value={el.value} disabled={el.disabled}>
                    {el.text}
                  </Select.Option>
                ))
              )}
            </SelectInputStyled>
          </FieldLabel>
        </Col>
      </StyledFlexContainer>
      {/* TODO: feature switch should be removed and simple show hide should be here
        show course flag will be available in district policy
      */}

      <StyledFlexContainer gutter={24}>
        <Col xs={24}>
          <FeaturesSwitch inputFeatures="selectCourse" actionOnInaccessible="hidden" key="selectCourse">
            <FieldLabel label="Course" {...restProps} fiedlName="courseId" initialValue={defaultCourse.id || ""}>
              <SelectInputStyled
                placeholder="Select Course"
                showSearch
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={handleSearch}
                onFocus={handleFocus}
                notFoundContent={null}
                loading={isSearching}
                disabled={!!cleverId}
              >
                {courseOptions.map(el => (
                  <Select.Option key={el._id} value={el._id}>{`${el.name} - ${el.number || ""}`}</Select.Option>
                ))}
              </SelectInputStyled>
            </FieldLabel>
          </FeaturesSwitch>
        </Col>
        <Col xs={12}>
          <FieldLabel label="School" {...restProps} fiedlName="institutionId" initialValue={defaultSchool || ""}>
            <SelectInputStyled placeholder="Select School">
              {schoolList.map(el => (
                <Select.Option key={el._id} value={el._id}>
                  {el.name}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </FieldLabel>
        </Col>
        <Col xs={12}>
          <Tags {...restProps} />
        </Col>
      </StyledFlexContainer>
    </>
  );
};

RightFields.propTypes = {
  filteredCurriculums: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      disabled: PropTypes.bool
    })
  ).isRequired,
  courseList: PropTypes.array.isRequired,
  searchCourse: PropTypes.func.isRequired,
  isSearching: PropTypes.bool.isRequired,
  defaultName: PropTypes.string.isRequired,
  defaultStartDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number]),
  defaultEndDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number]),
  defaultGrade: PropTypes.array,
  defaultSubject: PropTypes.string,
  defaultStandardSets: PropTypes.array,
  defaultCourse: PropTypes.object,
  defaultSchool: PropTypes.string,
  subject: PropTypes.string,
  setSubject: PropTypes.func.isRequired,
  schoolList: PropTypes.array,
  getFieldValue: PropTypes.func.isRequired,
  tags: PropTypes.array,
  setFieldsValue: PropTypes.func.isRequired,
  allTagsData: PropTypes.array,
  addNewTag: PropTypes.func.isRequired
};

RightFields.defaultProps = {
  defaultStartDate: classStartDate,
  defaultEndDate: classEndDate,
  defaultCourse: {},
  defaultGrade: [],
  defaultSubject: "",
  defaultSchool: "",
  defaultStandardSets: [],
  schoolList: [],
  tags: [],
  allTagsData: []
};

export default RightFields;
