import {
  TextInputStyled,
  DatePickerStyled,
  SelectInputStyled,
  EduButton,
} from '@edulastic/common'
import { Row, Col, Icon, Select } from 'antd'
import { debounce, filter, isArray, isEmpty } from 'lodash'
import * as moment from 'moment'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

import { roleuser } from '@edulastic/constants'
import styled from 'styled-components'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'
import selectsData from '../../../TestPage/components/common/selectsData'
import { FieldLabel } from './components'
import Tags from './components/Tags'
import { StandardsValidationMSG, StyledFlexContainer } from './styled'
import { ContainerForButtonAtEnd } from '../../../../student/Signup/styled'

const { allGrades, allSubjects } = selectsData

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
  clearStandards,
  type,
  userRole,
  defaultGrades,
  defaultSubjects,
  interestedCurriculums,
  isCourseVisible,
  ...restProps
}) => {
  const isClass = type === 'class'
  const [startDate, setStartDate] = useState(moment())
  const [toggleDetails, setToggleDetails] = useState(true)
  const defaultSubject = defaultSubjects.length === 1 ? defaultSubjects[0] : []
  const defaultGrade = defaultGrades.length === 1 ? defaultGrades : []
  const defaultStandardSetIds = interestedCurriculums
    .filter(
      ({ subject, orgType }) =>
        subject === defaultSubject && orgType === userRole
    )
    .map(({ _id }) => _id)

  useEffect(() => {
    setSubject(defaultSubject)
  }, [])

  // @todo default term id is not coming in terms list.
  // For now below logic is implemented to set default term end date
  const term =
    userOrgData.terms.length &&
    userOrgData.terms.find(
      (t) => t.endDate > Date.now() && t.startDate < Date.now()
    )
  const endDate = term ? term.endDate : moment().add(1, 'year')
  const updateSubject = (e) => {
    setSubject(e)
    clearStandards()
  }

  const onStartDateChangeHnadler = (date) => {
    setStartDate(date)
  }

  const handleSearch = debounce((keyword) => searchCourse(keyword), 500)
  const handleFocus = debounce((keyword = '') => searchCourse(keyword), 500)

  let isDropdown = false
  if (isArray(schoolList) && !isEmpty(schoolList)) {
    defaultSchool = defaultSchool || schoolList[0]._id
    isDropdown = schoolList.length > 1
  }

  const disabledStartDate = (current) =>
    current && current < moment().subtract(1, 'day')
  const disabledEndDate = (current) => current && current < moment(startDate)

  const grades = filter(allGrades, (el) => el.isContentGrade !== true)
  const subjects = filter(allSubjects, (el) => el.value !== '')

  const handleAdditionalDetailsToggle = () => {
    setToggleDetails((val) => !val)
  }

  return (
    <>
      <div style={{ marginTop: '30px', marginBottom: '20px' }}>
        <StyledFlexContainer gutter={96}>
          <Col xs={12}>
            <FieldLabel label={`${type} name`} {...restProps} fiedlName="name">
              <TextInputStyled
                placeholder={`Enter the name of your ${type}`}
                maxLength="256"
              />
            </FieldLabel>
          </Col>
          {isClass && (
            <Col xs={12}>
              <FieldLabel
                label="Grade"
                {...restProps}
                fiedlName="grades"
                initialValue={defaultGrade}
              >
                <SelectInputStyled
                  showArrow
                  showSearch
                  placeholder="Select Grades"
                  optionFilterProp="children"
                  mode="multiple"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {grades.map((el) => (
                    <Select.Option key={el.value} value={el.value}>
                      {el.text}
                    </Select.Option>
                  ))}
                </SelectInputStyled>
              </FieldLabel>
            </Col>
          )}
          {!isClass && (
            <Col xs={12}>
              <FieldLabel
                label="Description"
                {...restProps}
                fiedlName="description"
              >
                <TextInputStyled
                  placeholder={`Enter ${type} description`}
                  maxLength="512"
                />
              </FieldLabel>
            </Col>
          )}
        </StyledFlexContainer>

        {isClass && (
          <StyledFlexContainer gutter={96}>
            <Col xs={12}>
              <FieldLabel
                label="Subject"
                {...restProps}
                fiedlName="subject"
                initialValue={defaultSubject}
              >
                <SelectInputStyled
                  placeholder="Select Subject"
                  onSelect={updateSubject}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {subjects.map((el) => (
                    <Select.Option key={el.value} value={el.value}>
                      {el.text}
                    </Select.Option>
                  ))}
                </SelectInputStyled>
              </FieldLabel>
            </Col>
            <Col xs={12}>
              <FieldLabel
                label="Standard Sets"
                {...restProps}
                fiedlName="standardSets"
                initialValue={defaultStandardSetIds || []}
              >
                <SelectInputStyled
                  showArrow
                  showSearch
                  mode="multiple"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      ?.toString()
                      ?.toLowerCase()
                      ?.indexOf(input.toLowerCase()) >= 0
                  }
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  placeholder="Select Standards"
                >
                  {!selectedSubject ? (
                    <Select.Option
                      key="subject_first"
                      value="subject_first"
                      disabled
                    >
                      <StandardsValidationMSG>
                        Please select subject first.
                      </StandardsValidationMSG>
                    </Select.Option>
                  ) : (
                    filteredCurriculums.map((el) => (
                      <Select.Option
                        key={el.value}
                        value={el.value}
                        disabled={el.disabled}
                      >
                        {el.text}
                      </Select.Option>
                    ))
                  )}
                </SelectInputStyled>
              </FieldLabel>
            </Col>
          </StyledFlexContainer>
        )}

        {!isClass && (
          <StyledFlexContainer gutter={96}>
            <Col xs={12}>
              <FieldLabel
                label="Grade"
                {...restProps}
                fiedlName="grades"
                initialValue={defaultGrade}
              >
                <SelectInputStyled
                  showArrow
                  showSearch
                  placeholder="Select Grades"
                  optionFilterProp="children"
                  mode="multiple"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {grades.map((el) => (
                    <Select.Option key={el.value} value={el.value}>
                      {el.text}
                    </Select.Option>
                  ))}
                </SelectInputStyled>
              </FieldLabel>
            </Col>

            <Col xs={12}>
              <FieldLabel
                label="Subject"
                {...restProps}
                fiedlName="subject"
                initialValue={defaultSubject}
              >
                <SelectInputStyled
                  placeholder="Select Subject"
                  onSelect={updateSubject}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {subjects.map((el) => (
                    <Select.Option key={el.value} value={el.value}>
                      {el.text}
                    </Select.Option>
                  ))}
                </SelectInputStyled>
              </FieldLabel>
            </Col>
          </StyledFlexContainer>
        )}

        {isClass && isDropdown && (
          <Row gutter={96}>
            <Col span={12}>
              <FieldLabel
                label="School"
                {...restProps}
                fiedlName="institutionId"
                initialValue={[]}
              >
                <SelectInputStyled
                  showArrow
                  placeholder="Select School"
                  defaultActiveFirstOption={false}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {schoolList.map((el) => (
                    <Select.Option key={el._id} value={el._id}>
                      {el.name}
                    </Select.Option>
                  ))}
                </SelectInputStyled>
              </FieldLabel>
            </Col>
          </Row>
        )}

        {/* TODO: feature switch should be removed and simple show hide should be here
        show course flag will be available in district policy
      */}
        <Row>
          <Col span={12}>
            <AdditionalSettingsContainer
              onClick={handleAdditionalDetailsToggle}
              data-cy="classAdvancedSettings"
            >
              ADVANCED SETTINGS (OPTIONAL){'  '}
              <Icon type={!toggleDetails ? 'caret-up' : 'caret-down'} />
            </AdditionalSettingsContainer>
          </Col>
          <Col span={12}>
            {toggleDetails && (
              <ContainerForButtonAtEnd mB="20px" mT="20px">
                <EduButton
                  width="125px"
                  height="42px"
                  htmlType="submit"
                  data-cy="saveClass"
                >
                  Create {type}
                </EduButton>
              </ContainerForButtonAtEnd>
            )}
          </Col>
        </Row>
        {isClass && (
          <StyledFlexContainer gutter={96} hidden={toggleDetails}>
            <Col xs={12}>
              <FieldLabel
                label={`${type} start date`}
                fiedlName="startDate"
                initialValue={startDate}
                {...restProps}
              >
                <DatePickerStyled
                  data-cy="startDate"
                  format="DD MMM, YYYY"
                  placeholder="Open Date"
                  disabledDate={disabledStartDate}
                  onChange={onStartDateChangeHnadler}
                />
              </FieldLabel>
            </Col>
            <Col xs={12}>
              <FieldLabel
                label={`${type} end date`}
                {...restProps}
                fiedlName="endDate"
                initialValue={moment(endDate)}
              >
                <DatePickerStyled
                  data-cy="endDate"
                  format="DD MMM, YYYY"
                  placeholder="End Date"
                  disabledDate={disabledEndDate}
                />
              </FieldLabel>
            </Col>
          </StyledFlexContainer>
        )}
        <StyledFlexContainer gutter={96} hidden={toggleDetails}>
          {isCourseVisible && (
            <Col xs={12}>
              <Row>
                <Col>
                  <FeaturesSwitch
                    inputFeatures="selectCourse"
                    actionOnInaccessible="hidden"
                    key="selectCourse"
                  >
                    <FieldLabel
                      label="Course"
                      {...restProps}
                      fiedlName="courseId"
                      initialValue={[]}
                    >
                      <SelectInputStyled
                        showArrow
                        placeholder="Select Course"
                        showSearch
                        defaultActiveFirstOption={false}
                        filterOption={false}
                        onSearch={handleSearch}
                        onFocus={handleFocus}
                        notFoundContent={null}
                        loading={isSearching}
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      >
                        {courseList.map((el) => (
                          <Select.Option key={el._id} value={el._id}>
                            {`${el.name} - ${el.number}`}
                          </Select.Option>
                        ))}
                      </SelectInputStyled>
                    </FieldLabel>
                  </FeaturesSwitch>
                </Col>
              </Row>
            </Col>
          )}
          <Col xs={!isCourseVisible ? 24 : 12}>
            <Row
              gutter={96}
              style={!isCourseVisible ? { display: 'flex' } : {}}
            >
              <Col xs={!isCourseVisible ? 12 : 24}>
                <Tags {...restProps} />
              </Col>
              <Col
                xs={!isCourseVisible ? 12 : 24}
                style={{ alignSelf: 'center' }}
              >
                {!toggleDetails && (
                  <ContainerForButtonAtEnd
                    mB="0px"
                    mT={!isCourseVisible ? '0px' : '25px'}
                  >
                    <EduButton
                      width="125px"
                      height="42px"
                      htmlType="submit"
                      data-cy="saveClass"
                    >
                      Create {type}
                    </EduButton>
                  </ContainerForButtonAtEnd>
                )}
              </Col>
            </Row>
          </Col>
        </StyledFlexContainer>
        {(!isDropdown || !isClass) && userRole !== roleuser.DISTRICT_ADMIN && (
          <FieldLabel
            {...restProps}
            fiedlName="institutionId"
            initialValue={defaultSchool}
            style={{ height: '0px' }}
          >
            <input type="hidden" />
          </FieldLabel>
        )}
      </div>
    </>
  )
}

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
  userOrgData: PropTypes.object.isRequired,
}

RightFields.defaultProps = {
  schoolList: [],
  defaultSchool: null,
}

export default RightFields

const AdditionalSettingsContainer = styled.div`
  cursor: pointer;
  margin: 25px 0px 35px;
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  letter-spacing: 0.05em;
  color: #000000;
`
