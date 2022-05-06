import React, { useState } from 'react'
import styled from 'styled-components'
// import { isEmpty } from 'lodash'
import { Col, Modal, Row, Select } from 'antd'
import { CheckboxLabel, RadioBtn, SelectInputStyled } from '@edulastic/common'
import { themeColor } from '@edulastic/colors'
import { roleuser, test } from '@edulastic/constants'
import { evalTypeLabels } from '@edulastic/constants/const/test'
import { withNamespaces } from '@edulastic/localization'
import {
  AlignRight,
  AlignSwitchRight,
  AssignModuleContentSpan,
  CheckBoxWrapper,
  Label,
  StyledRow,
  TimeSpentInput,
} from '../SimpleOptions/styled'
import TestTypeSelector from '../SimpleOptions/TestTypeSelector'
import DollarPremiumSymbol from './DollarPremiumSymbol'
import DetailsTooltip from './DetailsTooltip'
import SettingContainer from './SettingsContainer'
import { showRubricToStudentsSetting } from '../../../TestPage/utils'
import CalculatorSelector from '../SimpleOptions/CalculatorSelector'
// import RefMaterialFile from './RefMaterialFile'

const {
  releaseGradeTypes,
  evalTypes,
  completionTypes,
  releaseGradeLabels,
  testContentVisibilityTypes,
  testContentVisibility: testContentVisibilityOptions,
  // playerSkinValues,
} = test

const TEST_TYPE_TOOLTIP_CONTENT =
  'Designate what type of assignment you are delivering. You’ll be able to use these categories later to filter reports so make sure practice is set as practice. '

const ASSIGN_MODULE_TOOLTIP_CONTENT =
  'If freeze settings is enabled in any of the test(s) in this module, then the assignment settings will default to the test settings for the respective tests.'

const TestBehaviorGroupContainer = ({
  assignmentSettings,
  changeField,
  testSettings,
  _releaseGradeKeys,
  freezeSettings,
  completionTypeKeys,
  premium,
  calculatorProvider,
  overRideSettings,
  match,
  totalItems,
  userRole,
  featuresAvailable,
  tootltipWidth,
  showAssignModuleContent,
  t,
}) => {
  const [timedTestConfirmed, setTimedtestConfirmed] = useState(false)
  const {
    markAsDone = testSettings?.markAsDone,
    releaseScore = testSettings.releaseScore,
    calcType = testSettings.calcType,
    timedAssignment = testSettings.timedAssignment,
    allowedTime = testSettings.allowedTime,
    pauseAllowed = testSettings.pauseAllowed,
    testContentVisibility = testSettings.testContentVisibility ||
      testContentVisibilityOptions.ALWAYS,
    testType = testSettings.testType,
    // playerSkinType = testSettings.playerSkinType || playerSkinValues.edulastic,
    applyEBSR = false,
    showRubricToStudents = testSettings.showRubricToStudents,
    // referenceDocAttributes = testSettings?.referenceDocAttributes,
    // isDocBased = testSettings?.isDocBased,
  } = assignmentSettings

  // const showRefMaterial = useMemo(() => {
  //   const { quester, edulastic } = playerSkinValues

  //   return (
  //     !isDocBased &&
  //     (playerSkinType === edulastic || playerSkinType === quester)
  //   )
  // }, [playerSkinType, isDocBased])

  const multipartItems = testSettings.itemGroups
    .map((o) => o.items)
    .flat()
    .filter((o) => o.multipartItem).length
  const {
    assessmentSuperPowersMarkAsDone,
    assessmentSuperPowersShowCalculator,
    assessmentSuperPowersTimedTest,
  } = featuresAvailable

  const isShowRubricToStudentsSettingVisible = showRubricToStudentsSetting(
    testSettings.itemGroups
  )

  const scoringType =
    assignmentSettings?.scoringType ||
    testSettings?.scoringType ||
    evalTypes?.ITEM_LEVEL_EVALUATION

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
          if (attr === 'timedAssignment' && value) {
            overRideSettings('pauseAllowed', true)
            overRideSettings('allowedTime', totalItems * 60 * 1000)
          }
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
    if (attr === 'timedAssignment' && value) {
      overRideSettings('pauseAllowed', true)
      overRideSettings('allowedTime', totalItems * 60 * 1000)
    }

    overRideSettings(attr, value)
  }

  // const updateRefMaterials = (value) => {
  //   overRideSettings('referenceDocAttributes', value)
  // }

  const testTypeContent = (
    <>
      <span>{TEST_TYPE_TOOLTIP_CONTENT} </span>
      {showAssignModuleContent && (
        <AssignModuleContentSpan>
          {ASSIGN_MODULE_TOOLTIP_CONTENT}
        </AssignModuleContentSpan>
      )}
    </>
  )

  return (
    <>
      {/* Test type */}
      <SettingContainer id="test-type-setting">
        <DetailsTooltip
          width={tootltipWidth}
          title="Test Type"
          content={testTypeContent}
          premium
          placement="rightBottom"
        />
        <StyledRow mb="15px" gutter={16}>
          <TestTypeSelector
            userRole={userRole}
            testType={testType}
            onAssignmentTypeChange={changeField('testType')}
            disabled={freezeSettings}
          />
        </StyledRow>
      </SettingContainer>
      {/* Test type */}
      {/* Release score */}
      <SettingContainer id="release-score-setting">
        <DetailsTooltip
          width={tootltipWidth}
          title="RELEASE SCORES"
          content="Decide what students immediately get to see upon submitting an assessment."
          premium
        />
        <StyledRow gutter={16} mb="15px">
          <Col span={10}>
            <Label>
              RELEASE SCORES{' '}
              {releaseScore === releaseGradeLabels.DONT_RELEASE
                ? '[OFF]'
                : '[ON]'}
            </Label>
          </Col>
          <Col span={14}>
            <SelectInputStyled
              data-cy="selectRelaseScore"
              placeholder="Please select"
              cache="false"
              value={releaseScore}
              onChange={changeField('releaseScore')}
              height="30px"
            >
              {_releaseGradeKeys.map((item, index) => (
                <Select.Option key={index} value={item}>
                  {releaseGradeTypes[item]}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </Col>
        </StyledRow>
      </SettingContainer>
      {/* Release score */}
      {/* Evaluation Method */}
      <SettingContainer id="evaluation-method-setting">
        <DetailsTooltip
          width={tootltipWidth}
          title="EVALUATION METHOD"
          content="Choose if students should be awarded partial credit for their answers or not. If partial credit is allowed, then choose whether the student should be penalized for incorrect answers or not (applicable only for multiple selection question widgets)."
          premium
        />
        <StyledRow gutter={16} mb="15px">
          <Col span={10}>
            <Label>EVALUATION METHOD</Label>
          </Col>
          <Col span={14}>
            <SelectInputStyled
              data-cy="eval-methods"
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
            {(scoringType === evalTypeLabels.PARTIAL_CREDIT ||
              scoringType === evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT) &&
            multipartItems &&
            premium ? (
              <CheckBoxWrapper>
                <CheckboxLabel
                  disabled={freezeSettings}
                  data-cy="applyEBSR"
                  checked={applyEBSR}
                  onChange={(e) =>
                    overRideSettings('applyEBSR', e.target.checked)
                  }
                >
                  <StyledSpan>APPLY EBSR GRADING</StyledSpan>
                </CheckboxLabel>
              </CheckBoxWrapper>
            ) : null}
          </Col>
        </StyledRow>
      </SettingContainer>
      {/* Evaluation Method */}

      {/* Mark as done */}
      <SettingContainer id="mark-as-done-setting">
        <DetailsTooltip
          width={tootltipWidth}
          title="Mark as done"
          content="When an assignment is marked “Done”, data flows to the reports. Automatically will mark it as done when all students are graded and the due date has passed, OR choose Manually and select the Mark as Done button when ready."
          premium={assessmentSuperPowersMarkAsDone}
        />
        <StyledRow gutter={16} mb="15px">
          <Col span={10}>
            <Label>
              MARK AS DONE
              <DollarPremiumSymbol premium={assessmentSuperPowersMarkAsDone} />
            </Label>
          </Col>
          <Col span={14}>
            <AlignRight
              disabled={freezeSettings || !assessmentSuperPowersMarkAsDone}
              onChange={(e) => overRideSettings('markAsDone', e.target.value)}
              value={markAsDone}
            >
              {completionTypeKeys.map((item) => (
                <RadioBtn
                  value={completionTypes[item]}
                  data-cy={`mark-as-done-${completionTypes[item]}`}
                  key={item}
                >
                  <Label>{completionTypes[item]}</Label>
                </RadioBtn>
              ))}
            </AlignRight>
          </Col>
        </StyledRow>
      </SettingContainer>
      {/* Mark as done */}

      {/* Show Calculator */}
      <SettingContainer id="calculator-setting">
        <DetailsTooltip
          width={tootltipWidth}
          title="SHOW CALCULATOR"
          content="If students can use an on-screen calculator, select the type to make available on the test."
          premium={assessmentSuperPowersShowCalculator}
        />
        <StyledRow gutter={16} mb="15px">
          <Col span={10}>
            <Label>
              SHOW CALCULATOR
              <DollarPremiumSymbol
                premium={assessmentSuperPowersShowCalculator}
              />
            </Label>
          </Col>
          <Col span={14}>
            <CalculatorSelector
              disabled={freezeSettings || !assessmentSuperPowersShowCalculator}
              calcType={calcType}
              onChangeHanlde={(value) => overRideSettings('calcType', value)}
              premium={premium}
              calculatorProvider={calculatorProvider}
            />
          </Col>
        </StyledRow>
      </SettingContainer>
      {/* Show Calculator */}

      {/* Reference Material */}
      {/* {showRefMaterial && (
        <RefMaterialFile
          premium={premium}
          disabled={freezeSettings}
          tootltipWidth={tootltipWidth}
          setData={updateRefMaterials}
          referenceDocAttributes={referenceDocAttributes}
          hasAttributesInTest={!isEmpty(testSettings?.referenceDocAttributes)}
        />
      )} */}
      {/* Reference Material */}

      {/* Timed TEST */}
      <SettingContainer id="timed-test-setting">
        <DetailsTooltip
          width={tootltipWidth}
          title="TIMED TEST"
          content="Timed test allows you to control how long students have to take the test. When the time limit is reached, students will be locked out of the assessment. Choose the time and whether students can pause and continue later or if the test should be taken in a single sitting."
          premium={assessmentSuperPowersTimedTest}
          placement="rightTop"
        />
        <StyledRow
          data-cy="timed-test-container"
          gutter={16}
          mb="15px"
          height="40"
        >
          <Col span={10}>
            <Label>
              <span>
                TIMED TEST
                <DollarPremiumSymbol premium={assessmentSuperPowersTimedTest} />
              </span>
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
                    value={
                      !isNaN(allowedTime) ? allowedTime / (60 * 1000) || '' : 1
                    }
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

      {!testSettings?.isDocBased && (
        <SettingContainer id="show-rubric-to-students">
          <DetailsTooltip
            width={tootltipWidth}
            title="SHOW RUBRIC TO STUDENTS"
            content={t('showRubricToStudents.info')}
            premium={premium}
            placement="rightTop"
          />
          <StyledRow
            data-cy="show-rubric-to-students-container"
            gutter={16}
            mb="15px"
            height="40"
          >
            <Col span={10}>
              <Label>
                <span>SHOW RUBRIC TO STUDENTS</span>
                <DollarPremiumSymbol premium={premium} />
              </Label>
            </Col>
            <Col span={10} style={{ display: 'flex', flexDirection: 'column' }}>
              <Row style={{ display: 'flex', alignItems: 'center' }}>
                <AlignSwitchRight
                  data-cy="show-rubric-to-students-switch"
                  size="small"
                  defaultChecked={false}
                  disabled={
                    !isShowRubricToStudentsSettingVisible ||
                    freezeSettings ||
                    !premium
                  }
                  checked={showRubricToStudents}
                  onChange={(value) =>
                    overRideSettings('showRubricToStudents', value)
                  }
                />
              </Row>
            </Col>
          </StyledRow>
        </SettingContainer>
      )}

      {/* Test Content visibility */}
      {(userRole === roleuser.DISTRICT_ADMIN ||
        userRole === roleuser.SCHOOL_ADMIN) && (
        <SettingContainer id="content-visibility">
          <DetailsTooltip
            width={tootltipWidth}
            title="TEST CONTENT VISIBILITY"
            content="Should teachers see the test items? Choose Always Hidden if test security is critical and answers are auto-graded. Hide Prior to Grading allows teachers to manually grade after test is open. Always Visible gives access before and after test window."
            premium
            placement="rightTop"
          />
          <StyledRow gutter={16} mb="15px">
            <Col span={10}>
              <Label>ITEM CONTENT VISIBILITY TO TEACHERS</Label>
            </Col>
            <Col span={14}>
              <AlignRight
                disabled={freezeSettings}
                onChange={(e) =>
                  overRideSettings('testContentVisibility', e.target.value)
                }
                value={testContentVisibility}
              >
                {testContentVisibilityTypes.map((item) => (
                  <RadioBtn
                    data-cy={`item-visibility-${item.key}`}
                    value={item.key}
                    key={item.key}
                  >
                    {item.value}
                  </RadioBtn>
                ))}
              </AlignRight>
            </Col>
          </StyledRow>
        </SettingContainer>
      )}
      {/* Test Content visibility */}
    </>
  )
}

export default withNamespaces('author')(TestBehaviorGroupContainer)

const StyledSpan = styled.span`
  font-weight: ${(props) => props.theme.semiBold};
  font-size: 11px;
`
