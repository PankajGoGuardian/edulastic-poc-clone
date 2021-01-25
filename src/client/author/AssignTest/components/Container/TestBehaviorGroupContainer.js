import React, { useState } from 'react'
import { Row, Col, Select, Tooltip, Modal } from 'antd'
import {
  RadioBtn,
  CheckboxLabel,
  SelectInputStyled,
  NumberInputStyled,
} from '@edulastic/common'
import { themeColor, lightGrey9 } from '@edulastic/colors'
import { test, roleuser } from '@edulastic/constants'
import {
  AlignRight,
  AlignSwitchRight,
  CheckBoxWrapper,
  Label,
  TimeSpentInput,
  StyledInfoIcon,
  StyledRow,
} from '../SimpleOptions/styled'
import TestTypeSelector from '../SimpleOptions/TestTypeSelector'
import DollarPremiumSymbol from './DollarPremiumSymbol'
import DetailsTooltip from './DetailsTooltip'
import { SettingContainer } from './styled'

const {
  calculatorKeys,
  calculators,
  calculatorTypes,
  releaseGradeTypes,
  evalTypes,
  completionTypes,
  releaseGradeLabels,
  testContentVisibilityTypes,
  testContentVisibility: testContentVisibilityOptions,
} = test

const TestBehaviorGroupContainer = ({
  assignmentSettings,
  changeField,
  testSettings,
  _releaseGradeKeys,
  isDocBased,
  freezeSettings,
  completionTypeKeys,
  premium,
  calculatorProvider,
  overRideSettings,
  match,
  totalItems,
  userRole,
  featuresAvailable,
}) => {
  const [timedTestConfirmed, setTimedtestConfirmed] = useState(false)
  const {
    markAsDone = testSettings?.markAsDone,
    releaseScore = testSettings.releaseScore,
    calcType = testSettings.calcType,
    maxAnswerChecks = testSettings.maxAnswerChecks,
    timedAssignment = testSettings.timedAssignment,
    allowedTime = testSettings.allowedTime,
    pauseAllowed = testSettings.pauseAllowed,
    testContentVisibility = testSettings.testContentVisibility ||
      testContentVisibilityOptions.ALWAYS,
    maxAttempts = testSettings.maxAttempts,
    testType = testSettings.testType,
  } = assignmentSettings

  const {
    assessmentSuperPowersMarkAsDone,
    assessmentSuperPowersShowCalculator,
    assessmentSuperPowersCheckAnswerTries,
    assessmentSuperPowersTimedTest,
    maxAttemptAllowed,
  } = featuresAvailable

  const scoringType =
    assignmentSettings?.scoringType ||
    testSettings?.scoringType ||
    evalTypes?.ITEM_LEVEL_EVALUATION

  const checkForCalculator = premium && calculatorProvider !== 'DESMOS'
  const calculatorKeysAvailable =
    (checkForCalculator &&
      calculatorKeys.filter((i) =>
        [calculatorTypes.NONE, calculatorTypes.BASIC].includes(i)
      )) ||
    calculatorKeys

  const updateTimedTestAttrs = (attr, value) => {
    if (
      match?.params?.assignmentId &&
      match?.params?.classId &&
      !timedTestConfirmed
    ) {
      Modal.confirm({
        title: 'Do you want to Proceed ?',
        content:
          'Changes made in Timed Assignment will impact all Students who are In Progress or Not Started.',
        onOk: () => {
          if (attr === 'timedAssignment' && value)
            overRideSettings('allowedTime', totalItems * 60 * 1000)
          overRideSettings(attr, value)
          setTimedtestConfirmed(true)
          Modal.destroyAll()
        },
        onCancel: () => {},
        okText: 'Proceed',
        centered: true,
        width: 500,
        okButtonProps: {
          style: { background: themeColor },
        },
      })
      return
    }
    if (attr === 'timedAssignment' && value)
      overRideSettings('allowedTime', totalItems * 60 * 1000)
    overRideSettings(attr, value)
  }

  return (
    <>
      {/* Mark as done */}
      <SettingContainer>
        <DetailsTooltip
          title="Mark as done"
          content="Control when class will be marked as Done. Automatically when all studens are graded and due date has passed OR Manually when you click the Mark as Done button."
          premium={assessmentSuperPowersMarkAsDone}
        />
        <StyledRow gutter={16} mb="15px">
          <Col span={12}>
            <Label>
              MARK AS DONE
              <DollarPremiumSymbol premium={assessmentSuperPowersMarkAsDone} />
            </Label>
          </Col>
          <Col span={12}>
            <AlignRight
              disabled={freezeSettings || !assessmentSuperPowersMarkAsDone}
              onChange={(e) => overRideSettings('markAsDone', e.target.value)}
              value={markAsDone}
            >
              {completionTypeKeys.map((item) => (
                <RadioBtn value={completionTypes[item]} key={item}>
                  <Label>{completionTypes[item]}</Label>
                </RadioBtn>
              ))}
            </AlignRight>
          </Col>
        </StyledRow>
      </SettingContainer>
      {/* Mark as done */}

      {/* Release score */}
      <StyledRow gutter={16} mb="15px">
        <Col span={12}>
          <Label>
            RELEASE SCORES{' '}
            {releaseScore === releaseGradeLabels.DONT_RELEASE
              ? '[OFF]'
              : '[ON]'}
          </Label>
        </Col>
        <Col span={12}>
          <SelectInputStyled
            data-cy="selectRelaseScore"
            placeholder="Please select"
            cache="false"
            value={releaseScore}
            onChange={changeField('releaseScore')}
            height="30px"
          >
            {_releaseGradeKeys.map((item, index) => (
              <Select.Option data-cy="class" key={index} value={item}>
                {releaseGradeTypes[item]}
              </Select.Option>
            ))}
          </SelectInputStyled>
        </Col>
      </StyledRow>
      {/* Release score */}

      {/* Show Calculator */}
      <SettingContainer>
        <DetailsTooltip
          title="SHOW CALCULATOR"
          content="Choose if student can use a calculator, also select the type of calculator that would be shown to the students."
          premium={assessmentSuperPowersShowCalculator}
        />
        <StyledRow gutter={16} mb="15px">
          <Col span={12}>
            <Label>
              SHOW CALCULATOR
              <DollarPremiumSymbol
                premium={assessmentSuperPowersShowCalculator}
              />
            </Label>
          </Col>
          <Col span={12}>
            <AlignRight
              disabled={freezeSettings || !assessmentSuperPowersShowCalculator}
              value={calcType}
              onChange={(e) => overRideSettings('calcType', e.target.value)}
            >
              {calculatorKeysAvailable.map((item) => (
                <RadioBtn data-cy={item} value={item} key={item}>
                  <Label>{calculators[item]}</Label>
                </RadioBtn>
              ))}
            </AlignRight>
          </Col>
        </StyledRow>
      </SettingContainer>
      {/* Show Calculator */}

      {/* Evaluation Method */}
      <SettingContainer>
        <DetailsTooltip
          title="EVALUATION METHOD"
          content="Choose if students should be awarded partial credit for their answers or not. If partial credit is allowed, then choose whether the student should be penalized for incorrect answers or not (applicable only for multiple selection que widgets)."
          premium
        />
        <StyledRow gutter={16} mb="15px">
          <Col span={12}>
            <Label>EVALUATION METHOD</Label>
          </Col>
          <Col span={12}>
            <SelectInputStyled
              disabled={freezeSettings}
              onChange={(value) => {
                if (!freezeSettings) {
                  overRideSettings('scoringType', value)
                }
              }}
              value={scoringType}
              height="30px"
            >
              {Object.keys(evalTypes).map((evalKey, index) => (
                <Select.Option value={evalKey} data-cy={evalKey} key={evalKey}>
                  {Object.values(evalTypes)[index]}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </Col>
        </StyledRow>
      </SettingContainer>
      {/* Evaluation Method */}

      {
        /* Check Answer Tries Per Question */
        !isDocBased && (
          <SettingContainer>
            <DetailsTooltip
              title="CHECK ANSWER TRIES PER QUESTION"
              content="Control whether student can check in answer during attempt or not. Value mentioned will be equivalent to number of attempts allowed per student."
              premium={assessmentSuperPowersTimedTest}
            />
            <StyledRow gutter={16} mb="15px">
              <Col span={12}>
                <Label>
                  CHECK ANSWER TRIES PER QUESTION
                  <DollarPremiumSymbol
                    premium={assessmentSuperPowersCheckAnswerTries}
                  />
                </Label>
              </Col>
              <Col span={12}>
                <NumberInputStyled
                  disabled={
                    freezeSettings || !assessmentSuperPowersCheckAnswerTries
                  }
                  onChange={(value) =>
                    overRideSettings('maxAnswerChecks', value)
                  }
                  size="large"
                  value={maxAnswerChecks}
                  min={0}
                  placeholder="Number of tries"
                  bg="white"
                />
              </Col>
            </StyledRow>
          </SettingContainer>
        )
        /* Check Answer Tries Per Question */
      }

      {/* Timed TEST */}
      <SettingContainer>
        <DetailsTooltip
          title="TIMED TEST"
          content="The time can be modified in one minute increments. When the time limit is reached, students will be locked out of the assessment. If the student begins an assessment and exits with time remaining, upon returning, the timer will start up again where the student left off. This ensures that the student does not go over the allotted time."
          premium={assessmentSuperPowersTimedTest}
        />
        <StyledRow gutter={16} mb="15px" height="40">
          <Col span={12}>
            <Label>
              <span>
                TIMED TEST
                <DollarPremiumSymbol premium={assessmentSuperPowersTimedTest} />
              </span>
              <Tooltip title="The time can be modified in one minute increments.  When the time limit is reached, students will be locked out of the assessment.  If the student begins an assessment and exits with time remaining, upon returning, the timer will start up again where the student left off.  This ensures that the student does not go over the allotted time.">
                <StyledInfoIcon color={lightGrey9} mL="15px" />
              </Tooltip>
            </Label>
          </Col>
          <Col span={10} style={{ display: 'flex', flexDirection: 'column' }}>
            <Row style={{ display: 'flex', alignItems: 'center' }}>
              <AlignSwitchRight
                data-cy="assignment-time-switch"
                size="small"
                defaultChecked={false}
                disabled={freezeSettings || !assessmentSuperPowersTimedTest}
                checked={timedAssignment}
                onChange={(value) =>
                  updateTimedTestAttrs('timedAssignment', value)
                }
              />
              {timedAssignment && (
                <>
                  {/* eslint-disable no-restricted-globals */}
                  <TimeSpentInput
                    onChange={(e) => {
                      if (e.target.value.length <= 3 && e.target.value <= 300) {
                        updateTimedTestAttrs(
                          'allowedTime',
                          e.target.value * 60 * 1000
                        )
                      }
                    }}
                    size="large"
                    data-cy="assignment-time"
                    value={!isNaN(allowedTime) ? allowedTime / (60 * 1000) : 1}
                    type="number"
                    min={1}
                    max={300}
                    step={1}
                  />
                  <Label>MINUTES</Label>
                  {/* eslint-enable no-restricted-globals */}
                </>
              )}
            </Row>
            <Row>
              {timedAssignment && (
                <CheckBoxWrapper>
                  <CheckboxLabel
                    disabled={freezeSettings || !assessmentSuperPowersTimedTest}
                    data-cy="exit-allowed"
                    checked={pauseAllowed}
                    onChange={(e) =>
                      updateTimedTestAttrs('pauseAllowed', e.target.checked)
                    }
                  >
                    <span>Allow student to save and continue later</span>
                  </CheckboxLabel>
                </CheckBoxWrapper>
              )}
            </Row>
          </Col>
        </StyledRow>
      </SettingContainer>
      {/* Timed TEST */}

      {/* Test Content visibility */}
      {(userRole === roleuser.DISTRICT_ADMIN ||
        userRole === roleuser.SCHOOL_ADMIN) && (
        <StyledRow gutter={16} mb="15px">
          <Col span={12}>
            <Label>ITEM CONTENT VISIBILITY TO TEACHERS</Label>
          </Col>
          <Col span={12}>
            <AlignRight
              disabled={freezeSettings}
              onChange={(e) =>
                overRideSettings('testContentVisibility', e.target.value)
              }
              value={testContentVisibility}
            >
              {testContentVisibilityTypes.map((item) => (
                <RadioBtn value={item.key} key={item.key}>
                  {item.value}
                </RadioBtn>
              ))}
            </AlignRight>
          </Col>
        </StyledRow>
      )}
      {/* Test Content visibility */}

      {/* Maximum attempt */}
      <SettingContainer>
        <DetailsTooltip
          title="MAXIMUM ATTEMPTS ALLOWED"
          content="Control the number of times a student can take the assignment."
          premium={assessmentSuperPowersTimedTest}
        />
        <StyledRow gutter={16} mb="15px">
          <Col span={12}>
            <Label>
              MAXIMUM ATTEMPTS ALLOWED
              <DollarPremiumSymbol premium={maxAttemptAllowed} />
            </Label>
          </Col>
          <Col span={12}>
            <NumberInputStyled
              size="large"
              disabled={freezeSettings || !maxAttemptAllowed}
              value={maxAttempts}
              onChange={(value) => overRideSettings('maxAttempts', value)}
              min={1}
              step={1}
              bg="white"
              width="20%"
            />
          </Col>
        </StyledRow>
      </SettingContainer>
      {/* Maximum attempt */}

      <StyledRow mb="15px" gutter={16}>
        <TestTypeSelector
          userRole={userRole}
          testType={testType}
          onAssignmentTypeChange={changeField('testType')}
          disabled={freezeSettings}
        />
      </StyledRow>
    </>
  )
}

export default TestBehaviorGroupContainer
