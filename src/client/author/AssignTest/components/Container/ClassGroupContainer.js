import React from 'react'
import { SelectInputStyled, FieldLabel } from '@edulastic/common'
import { test as testConst } from '@edulastic/constants'
import { Col, Select, Tooltip } from 'antd'
import ClassSelector from '../SimpleOptions/ClassSelector'
import StudentSelector from '../SimpleOptions/StudentSelector'
import DateSelector from '../SimpleOptions/DateSelector'
import QuestionPerStandardSelector from '../SimpleOptions/QuestionPerStandardSelector'
import { StyledRow } from '../SimpleOptions/styled'
import DetailsTooltip from './DetailsTooltip'
import { SettingContainer } from './styled'

const ClassGroupContainer = ({
  changeField,
  fetchStudents,
  classIds,
  group,
  studentOfSelectedClass,
  updateStudents,
  selectAllStudents,
  unselectAllStudents,
  handleRemoveStudents,
  assignment,
  isAssignRecommendations,
  changeDateSelection,
  selectedDateOption,
  showOpenDueAndCloseDate,
  openPolicy,
  closePolicy,
  testSettings,
  isRecommendingStandards,
  questionPerStandardOptions,
  tootltipWidth,
}) => {
  return (
    <>
      {!isAssignRecommendations && (
        <>
          <SettingContainer>
            <DetailsTooltip
              width={tootltipWidth}
              title="Class/Group Section"
              content="Choose one or more classes or groups to receive the test. In the student field below, you can select individuals from these sections if not all students should receive the assignment."
              premium
            />
            <ClassSelector
              onChange={changeField('class')}
              fetchStudents={fetchStudents}
              selectedGroups={classIds}
              group={group}
            />
          </SettingContainer>

          <SettingContainer>
            <DetailsTooltip
              width={tootltipWidth}
              title="Students"
              content="Select individual students if required. If this field is left blank, all students in the class will receive the assignment."
              premium
            />
            <StudentSelector
              selectedGroups={classIds}
              students={studentOfSelectedClass}
              groups={group}
              updateStudents={updateStudents}
              selectAllStudents={selectAllStudents}
              unselectAllStudents={unselectAllStudents}
              handleRemoveStudents={handleRemoveStudents}
            />
          </SettingContainer>
        </>
      )}
      <DateSelector
        startDate={assignment.startDate}
        endDate={assignment.endDate}
        dueDate={assignment.dueDate}
        hasStartDate={!isAssignRecommendations}
        changeField={changeField}
        passwordPolicy={assignment.passwordPolicy}
        changeRadioGrop={changeDateSelection}
        selectedOption={selectedDateOption}
        showOpenDueAndCloseDate={showOpenDueAndCloseDate}
        tootltipWidth={tootltipWidth}
      />

      <SettingContainer>
        <DetailsTooltip
          width={tootltipWidth}
          title="OPEN POLICY"
          content="Choose Automatically on Open Date to allow students immediate access to the test on the open date/time. This is good for practice or other low stakes assignments. Choose Manually in Class when it is required for the teacher to control the open times, (e.g. a final exam that is assigned to multiple classes throughout the day)."
          premium
          placement="rightTop"
        />
        <StyledRow gutter={16}>
          <Col span={10}>
            <FieldLabel>OPEN POLICY</FieldLabel>
          </Col>
          <Col span={14}>
            <Tooltip
              placement="top"
              title={
                assignment.passwordPolicy ===
                testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
                  ? 'To modify set Dynamic Password as OFF'
                  : null
              }
            >
              <SelectInputStyled
                data-cy="selectOpenPolicy"
                placeholder="Please select"
                cache="false"
                value={assignment.openPolicy}
                onChange={changeField('openPolicy')}
                disabled={
                  assignment.passwordPolicy ===
                  testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
                }
                title="To modify set Dynamic Password as OFF"
              >
                {openPolicy.map(({ value, text }, index) => (
                  <Select.Option key={index} value={value} data-cy="open">
                    {text}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </Tooltip>
          </Col>
        </StyledRow>
      </SettingContainer>

      <SettingContainer>
        <DetailsTooltip
          width={tootltipWidth}
          title="CLOSE POLICY"
          content="Choose the Automatic option to automatically lock down access on the close date. This eliminates the need for teachers to remember to close and also useful for sending data to Insight reports as soon as all students have submitted. Choose Manually in Class when it is required for the teacher to control the close times, (e.g. a final exam that is assigned to multiple classes throughout the day)."
          premium
          placement="rightTop"
        />
        <StyledRow gutter={16}>
          <Col span={10}>
            <FieldLabel>CLOSE POLICY</FieldLabel>
          </Col>
          <Col span={14}>
            <SelectInputStyled
              data-cy="selectClosePolicy"
              placeholder="Please select"
              cache="false"
              value={assignment.closePolicy}
              onChange={changeField('closePolicy')}
            >
              {closePolicy.map(({ value, text }, index) => (
                <Select.Option data-cy="class" key={index} value={value}>
                  {text}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </Col>
        </StyledRow>
      </SettingContainer>

      {isAssignRecommendations && isRecommendingStandards && (
        <StyledRow gutter={16}>
          <QuestionPerStandardSelector
            onChange={changeField('questionPerStandard')}
            questionPerStandard={
              assignment.questionPerStandard || testSettings.questionPerStandard
            }
            options={questionPerStandardOptions}
          />
        </StyledRow>
      )}
    </>
  )
}

export default ClassGroupContainer
