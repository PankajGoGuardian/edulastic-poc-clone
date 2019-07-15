import React, { useState } from "react";
import PropTypes from "prop-types";
import { filter, isArray, isEmpty, debounce } from "lodash";
import * as moment from "moment";
import { Input, Select, DatePicker } from "antd";
import { FieldLabel } from "./components";
import { StyledFlexContainer, StandardsValidationMSG } from "./styled";
import selectsData from "../../../TestPage/components/common/selectsData";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";

const { allGrades, allSubjects } = selectsData;

// eslint-disable-next-line max-len
const RightFields = ({
  defaultSchool,
  courseList,
  schoolList,
  searchCourse,
  isSearching,
  filteredCurriculums,
  setSubject,
  selectedSubject,
  userOrgData,
  ...restProps
}) => {
  const [startDate, setStartDate] = useState(moment());

  //@todo default term id is not coming in terms list.
  // For now below logic is implemented to set default term end date
  const term = userOrgData.terms.length && userOrgData.terms.find(term => term.endDate > Date.now());
  const endDate = term ? term.endDate : moment().add(1, "year");
  const updateSubject = e => {
    setSubject(e);
  };

  const onStartDateChangeHnadler = date => {
    setStartDate(date);
  };

  const handleSearch = debounce(keyword => searchCourse(keyword), 500);
  const handleFocus = debounce((keyword = "") => searchCourse(keyword), 500);
  let isDropdown = isArray(schoolList) && !isEmpty(schoolList);
  if (isArray(schoolList) && !isEmpty(schoolList) && schoolList.length === 1) {
    defaultSchool = schoolList[0]._id;
  }

  if (isDropdown) {
    if (schoolList.length === 1) {
      isDropdown = schoolList[0]._id !== defaultSchool;
    }
  }
  const disabledStartDate = current => current && current < moment().subtract(1, "day");
  const disabledEndDate = current => current && current < moment(startDate);

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
        <FieldLabel label="Class Start Date" optional fiedlName="startDate" initialValue={startDate} {...restProps}>
          <DatePicker
            data-cy="startDate"
            format="DD MMM, YYYY"
            placeholder="Open Date"
            disabledDate={disabledStartDate}
            onChange={onStartDateChangeHnadler}
          />
        </FieldLabel>
        <FieldLabel label="Class End Date" optional {...restProps} fiedlName="endDate" initialValue={moment(endDate)}>
          <DatePicker data-cy="endDate" format="DD MMM, YYYY" placeholder="End Date" disabledDate={disabledEndDate} />
        </FieldLabel>
      </StyledFlexContainer>

      <StyledFlexContainer>
        <FieldLabel label="Grade" {...restProps} fiedlName="grade" initialValue={[]}>
          <Select
            showSearch
            placeholder="Select Grade"
            optionFilterProp="children"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
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
          {!selectedSubject ? (
            <Select.Option key="subject_first" value="subject_first" disabled>
              <StandardsValidationMSG>Please select subject first.</StandardsValidationMSG>
            </Select.Option>
          ) : isEmpty(filteredCurriculums) ? (
            <Select.Option key="loading" value="loading" disabled>
              <StandardsValidationMSG>Loading data...</StandardsValidationMSG>
            </Select.Option>
          ) : (
            filteredCurriculums.map(el => (
              <Select.Option key={el.value} value={el.value} disabled={el.disabled}>
                {el.text}
              </Select.Option>
            ))
          )}
        </Select>
      </FieldLabel>
      {/* TODO: feature switch should be removed and simple show hide should be here
        show course flag will be available in district policy
      */}
      <FeaturesSwitch inputFeatures="selectCourse" actionOnInaccessible="hidden" key="selectCourse">
        <FieldLabel label="Course" {...restProps} fiedlName="courseId" initialValue={[]}>
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
            {courseList.map(el => (
              <Select.Option key={el._id} value={el._id}>{`${el.name} - ${el.number}`}</Select.Option>
            ))}
          </Select>
        </FieldLabel>
      </FeaturesSwitch>
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
  defaultSchool: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  courseList: PropTypes.array.isRequired,
  schoolList: PropTypes.array,
  searchCourse: PropTypes.func.isRequired,
  isSearching: PropTypes.bool.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  filteredCurriculums: PropTypes.array.isRequired,
  setSubject: PropTypes.func.isRequired,
  selectedSubject: PropTypes.string.isRequired,
  userOrgData: PropTypes.object.isRequired
};

RightFields.defaultProps = {
  schoolList: [],
  defaultSchool: null
};

export default RightFields;
