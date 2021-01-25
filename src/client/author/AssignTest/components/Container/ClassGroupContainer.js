import React from 'react'
import { SelectInputStyled, FieldLabel } from '@edulastic/common'
import { test as testConst } from '@edulastic/constants'
import { Col, Select, Tooltip } from 'antd'
import ClassSelector from '../SimpleOptions/ClassSelector'
import StudentSelector from '../SimpleOptions/StudentSelector'
import DateSelector from '../SimpleOptions/DateSelector'
import QuestionPerStandardSelector from '../SimpleOptions/QuestionPerStandardSelector'
import { StyledRow } from '../SimpleOptions/styled'

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
}) => {
  return (
    <>
      {!isAssignRecommendations && (
        <>
          <ClassSelector
            onChange={changeField('class')}
            fetchStudents={fetchStudents}
            selectedGroups={classIds}
            group={group}
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
      />
      <StyledRow gutter={16}>
        <Col span={12}>
          <FieldLabel>OPEN POLICY</FieldLabel>
        </Col>

        <Col span={12}>
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
      <StyledRow gutter={16}>
        <Col span={12}>
          <FieldLabel>CLOSE POLICY</FieldLabel>
        </Col>
        <Col span={12}>
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
