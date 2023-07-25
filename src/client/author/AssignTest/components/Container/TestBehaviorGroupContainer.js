import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { Col, Modal, Row, Select } from 'antd'
import {
  CheckboxLabel,
  EduIf,
  RadioBtn,
  SelectInputStyled,
} from '@edulastic/common'
import { themeColor } from '@edulastic/colors'
import {
  roleuser,
  test,
  testTypes as testTypesConstants,
} from '@edulastic/constants'
import {
  TEST_CONTENT_VISIBILITY,
  evalTypeLabels,
} from '@edulastic/constants/const/test'
import { withNamespaces } from '@edulastic/localization'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
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
import {
  showRubricToStudentsSetting,
  showAutoEssayEvaluationSetting,
} from '../../../TestPage/utils'
import RefMaterialFile from './RefMaterialFile'
import ShowHintsToStudents from './ShowHintsToStudents'
import ShowTtsForPassage from './ShowTtsForPassages'
import CalculatorSettings from '../../../Shared/Components/CalculatorSettings'
import { BetaTag2 } from '../../../AssessmentCreate/components/OptionDynamicTest/styled'
import ContentVisibilityOptions from '../../../TestPage/components/Setting/components/Common/ContentVisibilityOptions'
import { InfoIconWrapper } from '../../../GradingRubric/styled'

const { COMMON } = testTypesConstants.TEST_TYPES

const {
  releaseGradeTypes,
  evalTypes,
  completionTypes,
  releaseGradeLabels,
  playerSkinValues,
  REF_MATERIAL_ALLOWED_SKIN_TYPES,
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
  overRideSettings,
  match,
  totalItems,
  userRole,
  featuresAvailable,
  tootltipWidth,
  showAssignModuleContent,
  t: i18translate,
  allowToUseShowHintsToStudents,
  togglePenaltyOnUsingHints,
  isAiEvaulationDistrict,
}) => {
  const [timedTestConfirmed, setTimedtestConfirmed] = useState(false)
  const {
    markAsDone = testSettings?.markAsDone,
    releaseScore = testSettings.releaseScore,
    calcTypes = testSettings.calcTypes,
    timedAssignment = testSettings.timedAssignment,
    allowedTime = testSettings.allowedTime,
    pauseAllowed = testSettings.pauseAllowed,
    testType = testSettings.testType,
    playerSkinType = testSettings.playerSkinType || playerSkinValues.edulastic,
    applyEBSR = false,
    showRubricToStudents = testSettings.showRubricToStudents,
    allowAutoEssayEvaluation = testSettings.allowAutoEssayEvaluation,
    allowTeacherRedirect = testSettings.allowTeacherRedirect,
    referenceDocAttributes = testSettings?.referenceDocAttributes,
    isDocBased = testSettings?.isDocBased,
    showHintsToStudents = testSettings?.showHintsToStudents,
    penaltyOnUsingHints = testSettings?.penaltyOnUsingHints,
    showTtsForPassages = testSettings?.showTtsForPassages,
  } = assignmentSettings

  const showRefMaterial = useMemo(() => {
    return (
      !isDocBased && REF_MATERIAL_ALLOWED_SKIN_TYPES.includes(playerSkinType)
    )
  }, [playerSkinType, isDocBased])

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

  const isShowAutoEssayEvaluationSetting = showAutoEssayEvaluationSetting(
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

  const updateRefMaterials = (value) => {
    overRideSettings('referenceDocAttributes', value)
  }

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

  const isTestlet = playerSkinType?.toLowerCase() === playerSkinValues.testlet

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
          content={i18translate('calculatorTypesSettings.info')}
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
            <CalculatorSettings
              disabled={freezeSettings || !assessmentSuperPowersShowCalculator}
              value={calcTypes}
              onChange={(value) => overRideSettings('calcTypes', value)}
            />
          </Col>
        </StyledRow>
      </SettingContainer>
      {/* Show Calculator */}

      {/* Reference Material */}
      {showRefMaterial && (
        <RefMaterialFile
          premium={premium}
          disabled={freezeSettings}
          tootltipWidth={tootltipWidth}
          setData={updateRefMaterials}
          referenceDocAttributes={referenceDocAttributes}
          hasAttributesInTest={!isEmpty(testSettings?.referenceDocAttributes)}
        />
      )}
      {/* Reference Material */}

      {/* Show TTS for passage */}
      {!(isDocBased || isTestlet) && (
        <SettingContainer id="show-tts-for-passage">
          <DetailsTooltip
            width={tootltipWidth}
            title={i18translate('showTtsForPassage.title')}
            content={i18translate('showTtsForPassage.info')}
            premium={premium}
            placement="rightTop"
          />
          <ShowTtsForPassage
            tootltipWidth={tootltipWidth}
            premium={premium}
            freezeSettings={freezeSettings}
            showTtsForPassages={showTtsForPassages}
            overRideSettings={overRideSettings}
            i18translate={i18translate}
          />
        </SettingContainer>
      )}
      {/* Show TTS for passage */}

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
            content={i18translate('showRubricToStudents.info')}
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
      <EduIf
        condition={[
          isShowAutoEssayEvaluationSetting,
          !testSettings?.isDocBased,
          isAiEvaulationDistrict,
        ].every((o) => !!o)}
      >
        <SettingContainer id="auto-essay-evaluation">
          <DetailsTooltip
            width={tootltipWidth}
            title={i18translate('allowAutoEssayEvaluation.title')}
            content={i18translate('allowAutoEssayEvaluation.info')}
            premium={premium}
            placement="rightTop"
          />
          <StyledRow gutter={16} mb="15px" height="40">
            <Col span={10}>
              <Label>
                <span>
                  {i18translate('allowAutoEssayEvaluation.autoEssayEvaluation')}
                  <br />
                  {i18translate('allowAutoEssayEvaluation.essayQuestion')}
                </span>
                <BetaTag2 mt="-35px" ml="4px">
                  BETA
                </BetaTag2>
                <DollarPremiumSymbol premium={premium} />
              </Label>
            </Col>
            <Col span={10} style={{ display: 'flex', flexDirection: 'column' }}>
              <Row style={{ display: 'flex', alignItems: 'center' }}>
                <AlignSwitchRight
                  data-cy="auto-essay-evaluation"
                  size="small"
                  defaultChecked={false}
                  disabled={freezeSettings || !premium}
                  checked={allowAutoEssayEvaluation}
                  onChange={(value) =>
                    overRideSettings('allowAutoEssayEvaluation', value)
                  }
                />
                <InfoIconWrapper
                  style={{
                    display: 'flex',
                    marginLeft: '80px',
                  }}
                >
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    aria-hidden="true"
                    style={{ color: 'rgb(158, 155, 149)' }}
                  />{' '}
                  <div
                    style={{
                      marginLeft: '5px',
                      marginTop: '-5px',
                      marginRight: '-150px',
                    }}
                  >
                    This feature is AI-assisted for enhanced functionality, but
                    its accuracy may vary
                  </div>
                </InfoIconWrapper>
              </Row>
            </Col>
          </StyledRow>
        </SettingContainer>
      </EduIf>
      {/* Show hints to students */}
      {!(isDocBased && isTestlet) && (
        <SettingContainer id="show-hints-to-students">
          <DetailsTooltip
            width={tootltipWidth}
            title="SHOW HINTS TO STUDENTS"
            content="Students will be able to see the hint associated with an item while attempting the assignment"
            premium={premium}
            placement="rightTop"
          />
          <ShowHintsToStudents
            tootltipWidth={tootltipWidth}
            premium={premium}
            freezeSettings={freezeSettings}
            showHintsToStudents={showHintsToStudents}
            penaltyOnUsingHints={penaltyOnUsingHints}
            overRideSettings={overRideSettings}
            allowToUseShowHintsToStudents={allowToUseShowHintsToStudents}
            togglePenaltyOnUsingHints={togglePenaltyOnUsingHints}
          />
        </SettingContainer>
      )}
      {/* Show hints to students */}

      {/* Test Content visibility */}
      {COMMON.includes(testType) &&
        (userRole === roleuser.DISTRICT_ADMIN ||
          userRole === roleuser.SCHOOL_ADMIN) && (
          <SettingContainer id="content-visibility">
            <DetailsTooltip
              width={tootltipWidth}
              title="TEST CONTENT VISIBILITY"
              content="Should teachers see the test items? Choose Always Hidden if test security is critical use Hide Prior to Grading to hide until all students submit. Use sub-options to allow teachers to grade manually gradable items with the help of rubric while keeping the question hidden."
              premium
              placement="rightTop"
            />
            <StyledRow gutter={16} mb="15px">
              <Col span={10}>
                <Label>
                  Item content visibility and grading permissions on manually
                  gradable items for teachers
                </Label>
              </Col>
              <Col span={14}>
                <ContentVisibilityOptions
                  isDisabled={freezeSettings}
                  testContentVisibility={testSettings.testContentVisibility}
                  updateTestContentVisibility={(value) =>
                    overRideSettings(TEST_CONTENT_VISIBILITY, value)
                  }
                />
              </Col>
            </StyledRow>
          </SettingContainer>
        )}
      {/* Test Content visibility */}
      {COMMON.includes(testType) && (
        <SettingContainer id="allow-teachers-to-redirect">
          <DetailsTooltip
            width={tootltipWidth}
            title="ALLOW TEACHERS TO REDIRECT"
            content={i18translate('allowTeacherToRedirect.info')}
            premium={premium}
            placement="rightTop"
          />
          <StyledRow
            data-cy="allow-teachers-to-redirect"
            gutter={16}
            mb="15px"
            height="40"
          >
            <Col span={10}>
              <Label>
                <span>ALLOW TEACHERS TO REDIRECT</span>
                <DollarPremiumSymbol premium={premium} />
              </Label>
            </Col>
            <Col span={10} style={{ display: 'flex', flexDirection: 'column' }}>
              <Row style={{ display: 'flex', alignItems: 'center' }}>
                <AlignSwitchRight
                  data-testid="allow-teachers-to-redirect-switch"
                  size="small"
                  defaultChecked
                  disabled={freezeSettings || !premium}
                  checked={allowTeacherRedirect}
                  onChange={(value) =>
                    overRideSettings('allowTeacherRedirect', value)
                  }
                />
              </Row>
            </Col>
          </StyledRow>
        </SettingContainer>
      )}
    </>
  )
}

export default withNamespaces('author')(TestBehaviorGroupContainer)

const StyledSpan = styled.span`
  font-weight: ${(props) => props.theme.semiBold};
  font-size: 11px;
`
