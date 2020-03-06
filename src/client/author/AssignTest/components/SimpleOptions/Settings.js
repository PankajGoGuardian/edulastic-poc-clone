import React, { useState } from "react";
import { connect } from "react-redux";
import { Col, Radio, Select, Icon, Checkbox, Input, message } from "antd";
import { green, red, blueBorder } from "@edulastic/colors";
import { test, roleuser } from "@edulastic/constants";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import {
  AlignRight,
  AlignSwitchRight,
  StyledRowSettings,
  StyledRowSelect,
  SettingsWrapper,
  Password,
  StyledSelect,
  StyledDiv,
  CheckBoxWrapper,
  MessageSpan,
  MaxAttemptIInput,
  DivBlock,
  Label
} from "./styled";
import StandardProficiencyTable from "../../../TestPage/components/Setting/components/MainSetting/StandardProficiencyTable";
import SubscriptionsBlock from "../../../TestPage/components/Setting/components/MainSetting/SubscriptionsBlock";

import PeformanceBand from "../../../TestPage/components/Setting/components/MainSetting/PeformanceBand";

import { getUserRole } from "../../../src/selectors/user";
import TestTypeSelector from "./TestTypeSelector";
import PlayerSkinSelector from "./PlayerSkinSelector";
import { getDisableAnswerOnPaperSelector } from "../../../TestPage/ducks";
import { EduCheckBox } from "@edulastic/common";

const evalTypeKeys = ["ALL_OR_NOTHING", "PARTIAL_CREDIT"];
const completionTypeKeys = ["AUTOMATICALLY", "MANUALLY"];
const {
  calculatorKeys,
  calculators,
  releaseGradeTypes,
  evalTypes,
  evalTypeLabels,
  completionTypes,
  testContentVisibilityTypes,
  testContentVisibility: testContentVisibilityOptions,
  releaseGradeLabels,
  passwordPolicyOptions,
  passwordPolicy: passwordPolicyValues
} = test;

const Settings = ({
  testSettings,
  assignmentSettings,
  updateAssignmentSettings,
  isAdvanced,
  changeField,
  gradeSubject,
  _releaseGradeKeys,
  userRole,
  isDocBased,
  forClassLevel = false,
  disableAnswerOnPaper,
  premium
}) => {
  const [showPassword, setShowSebPassword] = useState(false);
  const [tempTestSettings, updateTempTestSettings] = useState({ ...testSettings });
  const [passwordStatus, setPasswordStatus] = useState({
    color: blueBorder,
    message: ""
  });

  const passwordValidationStatus = assignmentPassword => {
    if (assignmentPassword.split(" ").length > 1) {
      setPasswordStatus({
        color: red,
        message: "Password must not contain space"
      });
      return;
    }
    if (assignmentPassword.length >= 6 && assignmentPassword.length <= 25) {
      setPasswordStatus({
        color: green,
        message: ""
      });
      return;
    }
    let validationMessage = "Password is too short - must be at least 6 characters";
    if (assignmentPassword.length > 25) validationMessage = "Password is too long";
    setPasswordStatus({
      color: red,
      message: validationMessage
    });
  };
  const overRideSettings = (key, value) => {
    if ((key === "maxAnswerChecks" || key === "maxAttempts") && value < 0) value = 0;
    if (key === "answerOnPaper" && value && disableAnswerOnPaper) {
      return message.error("Answer on paper not suppported for this test");
    }
    const newSettingsState = {
      ...assignmentSettings,
      [key]: value
    };
    const newTempTestSettingsState = {
      ...tempTestSettings,
      [key]: value
    };
    if (key === "safeBrowser" && value === false) {
      delete newSettingsState.sebPassword;
      delete newTempTestSettingsState.sebPassword;
    }
    if (key === "assignmentPassword") {
      passwordValidationStatus(value);
    }
    updateTempTestSettings(newTempTestSettingsState);
    updateAssignmentSettings(newSettingsState);
    changeField(key)(value);
  };

  const handleUpdatePasswordExpireIn = e => {
    let { value = 1 } = e.target;
    value *= 60;
    if (value < 60 || Number.isNaN(value)) {
      value = 60;
    } else if (value > 999 * 60) {
      value = 999 * 60;
    }
    overRideSettings("passwordExpireIn", value);
  };

  const {
    markAsDone = tempTestSettings.markAsDone,
    releaseScore = tempTestSettings.releaseScore,
    safeBrowser = tempTestSettings.safeBrowser,
    sebPassword = tempTestSettings.sebPassword,
    shuffleQuestions = tempTestSettings.shuffleQuestions,
    shuffleAnswers = tempTestSettings.shuffleAnswers,
    calcType = tempTestSettings.calcType,
    answerOnPaper = tempTestSettings.answerOnPaper,
    maxAnswerChecks = tempTestSettings.maxAnswerChecks,
    scoringType = tempTestSettings.scoringType,
    penalty = tempTestSettings.penalty,
    passwordPolicy = tempTestSettings.passwordPolicy,
    assignmentPassword = tempTestSettings.assignmentPassword,
    maxAttempts = tempTestSettings.maxAttempts,
    performanceBand = tempTestSettings.performanceBand,
    standardGradingScale = tempTestSettings.standardGradingScale,
    testContentVisibility = tempTestSettings.testContentVisibility || testContentVisibilityOptions.ALWAYS,
    passwordExpireIn = tempTestSettings.passwordExpireIn || 15 * 60
  } = assignmentSettings;

  return (
    <SettingsWrapper isAdvanced={isAdvanced}>
      <StyledDiv>
        {forClassLevel ? (
          <>
            <TestTypeSelector
              userRole={userRole}
              testType={assignmentSettings?.testType}
              disabled
              onAssignmentTypeChange={changeField("testType")}
              fullwidth
              showTestTypeOption
            />
            <PlayerSkinSelector
              testType={assignmentSettings?.testType}
              userRole={userRole}
              playerSkinType={assignmentSettings?.playerSkinType}
              disabled
              onAssignmentTypeChange={changeField("playerSkinType")}
              fullwidth
            />
          </>
        ) : null}

        {/* Mark as done */}
        <FeaturesSwitch
          inputFeatures="assessmentSuperPowersMarkAsDone"
          actionOnInaccessible="hidden"
          key="assessmentSuperPowersMarkAsDone"
          gradeSubject={gradeSubject}
        >
          <StyledRowSettings gutter={16}>
            <Col span={12}>
              <Label>MARK AS DONE</Label>
            </Col>
            <Col span={12}>
              <AlignRight
                disabled={forClassLevel}
                onChange={e => overRideSettings("markAsDone", e.target.value)}
                value={markAsDone}
              >
                {completionTypeKeys.map(item => (
                  <Radio value={completionTypes[item]} key={item}>
                    <Label>{completionTypes[item]}</Label>
                  </Radio>
                ))}
              </AlignRight>
            </Col>
          </StyledRowSettings>
        </FeaturesSwitch>
        {/* Mark as done */}

        {/* Release score */}
        {!forClassLevel ? (
          <StyledRowSelect gutter={16}>
            <Col span={12}>
              <Label>RELEASE SCORES {releaseScore === releaseGradeLabels.DONT_RELEASE ? "[OFF]" : "[ON]"}</Label>
            </Col>
            <Col span={12}>
              <StyledSelect
                data-cy="selectRelaseScore"
                placeholder="Please select"
                cache="false"
                value={releaseScore}
                onChange={changeField("releaseScore")}
              >
                {_releaseGradeKeys.map((item, index) => (
                  <Select.Option data-cy="class" key={index} value={item}>
                    {releaseGradeTypes[item]}
                  </Select.Option>
                ))}
              </StyledSelect>
            </Col>
          </StyledRowSelect>
        ) : null}
        {/* Release score */}

        {/* Maximum attempt */}
        <FeaturesSwitch
          inputFeatures="maxAttemptAllowed"
          actionOnInaccessible="hidden"
          key="maxAttemptAllowed"
          gradeSubject={gradeSubject}
        >
          <StyledRowSettings gutter={16}>
            <Col span={12}>
              <Label>MAXIMUM ATTEMPTS ALLOWED</Label>
            </Col>
            <Col span={12}>
              <MaxAttemptIInput
                type="number"
                size="large"
                disabled={forClassLevel}
                value={maxAttempts}
                onChange={e => overRideSettings("maxAttempts", e.target.value)}
                min={1}
                step={1}
              />
            </Col>
          </StyledRowSettings>
        </FeaturesSwitch>
        {/* Maximum attempt */}

        {/* Require Safe Exam Browser */}
        <FeaturesSwitch
          inputFeatures="assessmentSuperPowersRequireSafeExamBrowser"
          actionOnInaccessible="hidden"
          key="assessmentSuperPowersRequireSafeExamBrowser"
          gradeSubject={gradeSubject}
        >
          <StyledRowSettings gutter={16}>
            <Col span={12}>
              <Label>REQUIRE SAFE EXAM BROWSER</Label>
            </Col>
            <Col span={12}>
              <AlignSwitchRight
                disabled={forClassLevel}
                defaultChecked={safeBrowser}
                size="small"
                onChange={value => overRideSettings("safeBrowser", value)}
              />
              {safeBrowser && (
                <Password
                  disabled={forClassLevel}
                  suffix={
                    <Icon
                      type={showPassword ? "eye-invisible" : "eye"}
                      theme="filled"
                      onClick={() => setShowSebPassword(prevState => !prevState)}
                    />
                  }
                  onChange={e => overRideSettings("sebPassword", e.target.value)}
                  size="large"
                  value={sebPassword}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                />
              )}
            </Col>
          </StyledRowSettings>
        </FeaturesSwitch>
        {/* Require Safe Exam Browser */}

        {/* Shuffle Question */
        !isDocBased && (
          <FeaturesSwitch
            inputFeatures="assessmentSuperPowersShuffleQuestions"
            actionOnInaccessible="hidden"
            key="assessmentSuperPowersShuffleQuestions"
            gradeSubject={gradeSubject}
          >
            <StyledRowSettings gutter={16}>
              <Col span={12}>
                <Label>SHUFFLE QUESTIONS</Label>
              </Col>
              <Col span={12}>
                <AlignSwitchRight
                  disabled={forClassLevel}
                  size="small"
                  defaultChecked={shuffleQuestions}
                  onChange={value => overRideSettings("shuffleQuestions", value)}
                />
              </Col>
            </StyledRowSettings>
          </FeaturesSwitch>
        )
        /* Shuffle Question */
        }

        {/* Shuffle Answer Choice */
        !isDocBased && (
          <FeaturesSwitch
            inputFeatures="assessmentSuperPowersShuffleAnswerChoice"
            actionOnInaccessible="hidden"
            key="assessmentSuperPowersShuffleAnswerChoice"
            gradeSubject={gradeSubject}
          >
            <StyledRowSettings gutter={16}>
              <Col span={12}>
                <Label>SHUFFLE ANSWER CHOICE</Label>
              </Col>
              <Col span={12}>
                <AlignSwitchRight
                  disabled={forClassLevel}
                  size="small"
                  defaultChecked={shuffleAnswers}
                  onChange={value => overRideSettings("shuffleAnswers", value)}
                />
              </Col>
            </StyledRowSettings>
          </FeaturesSwitch>
        )
        /* Shuffle Answer Choice */
        }

        {/* Show Calculator */}
        <FeaturesSwitch
          inputFeatures="assessmentSuperPowersShowCalculator"
          actionOnInaccessible="hidden"
          key="assessmentSuperPowersShowCalculator"
          gradeSubject={gradeSubject}
        >
          <StyledRowSettings gutter={16}>
            <Col span={12}>
              <Label>SHOW CALCULATOR</Label>
            </Col>
            <Col span={12}>
              <AlignRight value={calcType} onChange={e => overRideSettings("calcType", e.target.value)}>
                {calculatorKeys.map(item => (
                  <Radio data-cy={item} value={item} key={item}>
                    <Label>{calculators[item]}</Label>
                  </Radio>
                ))}
              </AlignRight>
            </Col>
          </StyledRowSettings>
        </FeaturesSwitch>
        {/* Show Calculator */}

        {/* Answer on Paper */}
        <FeaturesSwitch
          inputFeatures="assessmentSuperPowersAnswerOnPaper"
          actionOnInaccessible="hidden"
          key="assessmentSuperPowersAnswerOnPaper"
          gradeSubject={gradeSubject}
        >
          <StyledRowSettings gutter={16}>
            <Col span={12}>
              <Label>ANSWER ON PAPER</Label>
            </Col>
            <Col span={12}>
              <AlignSwitchRight
                disabled={forClassLevel || disableAnswerOnPaper}
                size="small"
                defaultChecked={answerOnPaper}
                onChange={value => overRideSettings("answerOnPaper", value)}
              />
            </Col>
          </StyledRowSettings>
        </FeaturesSwitch>
        {/* Answer on Paper */}

        {/* Require Password */}
        <FeaturesSwitch
          inputFeatures="assessmentSuperPowersRequirePassword"
          actionOnInaccessible="hidden"
          key="assessmentSuperPowersRequirePassword"
          gradeSubject={gradeSubject}
        >
          <StyledRowSelect gutter={16}>
            <Col span={12}>
              <Label>REQUIRE PASSWORD</Label>
            </Col>
            <Col span={12}>
              <StyledSelect
                disabled={forClassLevel}
                placeholder="Please select"
                cache="false"
                value={passwordPolicy}
                onChange={changeField("passwordPolicy")}
              >
                {Object.keys(passwordPolicyValues).map((item, index) => (
                  <Select.Option data-cy="class" key={index} value={passwordPolicyValues[item]}>
                    {passwordPolicyOptions[item]}
                  </Select.Option>
                ))}
              </StyledSelect>
              {passwordPolicy === test.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC && (
                <>
                  <Password
                    disabled={forClassLevel}
                    onChange={e => overRideSettings("assignmentPassword", e.target.value)}
                    size="large"
                    value={assignmentPassword}
                    type="text"
                    placeholder="Enter Password"
                    color={passwordStatus.color}
                  />
                  <MessageSpan>{passwordStatus.message}</MessageSpan>
                </>
              )}
              {passwordPolicy === test.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC && (
                <>
                  <Input
                    disabled={forClassLevel}
                    required
                    type="number"
                    onChange={handleUpdatePasswordExpireIn}
                    value={passwordExpireIn / 60}
                    style={{ width: "100px", marginLeft: "15px" }}
                    max={999}
                    min={1}
                    step={1}
                  />{" "}
                  MINUTES
                </>
              )}
            </Col>
            {passwordPolicy === test.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC && (
              <Col span={24} style={{ marginTop: "10px" }}>
                The password is entered by you and does not change. Students must enter this password before they can
                take the assessment.
              </Col>
            )}
            {passwordPolicy === test.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC && (
              <Col span={24} style={{ marginTop: "10px" }}>
                Students must enter a password to take the assessment. The password is auto-generated and revealed only
                when the assessment is opened. If you select this method, you also need to specify the time in minutes
                after which the password would automatically expire. Use this method for highly sensitive and secure
                assessments. If you select this method, the teacher or the proctor must open the assessment manually and
                announce the password in class when the students are ready to take the assessment.
              </Col>
            )}
          </StyledRowSelect>
        </FeaturesSwitch>
        {/* Require Password */}

        {/* Check Answer Tries Per Question */
        !isDocBased && (
          <FeaturesSwitch
            inputFeatures="assessmentSuperPowersCheckAnswerTries"
            actionOnInaccessible="hidden"
            key="assessmentSuperPowersCheckAnswerTries"
            gradeSubject={gradeSubject}
          >
            <StyledRowSettings gutter={16}>
              <Col span={12}>
                <Label>CHECK ANSWER TRIES PER QUESTION</Label>
              </Col>
              <Col span={12}>
                <Input
                  disabled={forClassLevel}
                  onChange={e => overRideSettings("maxAnswerChecks", e.target.value)}
                  size="large"
                  value={maxAnswerChecks}
                  type="number"
                  min={0}
                  placeholder="Number of tries"
                />
              </Col>
            </StyledRowSettings>
          </FeaturesSwitch>
        )
        /* Check Answer Tries Per Question */
        }

        {/* Evaluation Method */}
        <FeaturesSwitch
          inputFeatures="assessmentSuperPowersEvaluationMethod"
          actionOnInaccessible="hidden"
          key="assessmentSuperPowersEvaluationMethod"
          gradeSubject={gradeSubject}
        >
          <StyledRowSettings gutter={16}>
            <Col span={12}>
              <Label>EVALUATION METHOD</Label>
            </Col>
            <Col span={12}>
              <AlignRight
                disabled={forClassLevel}
                onChange={e => overRideSettings("scoringType", e.target.value)}
                value={scoringType}
              >
                {evalTypeKeys.map(item => (
                  <Radio value={item} data-cy={item} key={item}>
                    <Label>{evalTypes[item]}</Label>
                  </Radio>
                ))}
              </AlignRight>
              {scoringType === evalTypeLabels.PARTIAL_CREDIT && (
                <CheckBoxWrapper>
                  <EduCheckBox
                    disabled={forClassLevel}
                    checked={penalty === false}
                    onChange={e => overRideSettings("penalty", !e.target.checked)}
                  >
                    <Label>DON’T PENALIZE FOR INCORRECT SELECTION</Label>
                  </EduCheckBox>
                </CheckBoxWrapper>
              )}
            </Col>
          </StyledRowSettings>
        </FeaturesSwitch>
        {/* Evaluation Method */}
        {/* Test Content visibility */}
        {(userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN) && (
          <StyledRowSettings gutter={16}>
            <Col span={12}>
              <Label>ITEM CONTENT VISIBILITY TO TEACHERS</Label>
            </Col>
            <Col span={12}>
              <AlignRight
                disabled={forClassLevel}
                onChange={e => overRideSettings("testContentVisibility", e.target.value)}
                value={testContentVisibility}
              >
                {testContentVisibilityTypes.map(item => (
                  <Radio value={item.key} key={item.key}>
                    {item.value}
                  </Radio>
                ))}
              </AlignRight>
            </Col>
          </StyledRowSettings>
        )}
        {/* Test Content visibility */}
        <FeaturesSwitch
          inputFeatures="performanceBands"
          actionOnInaccessible="hidden"
          key="performanceBands"
          gradeSubject={gradeSubject}
        >
          <DivBlock>
            <PeformanceBand
              disabled={forClassLevel}
              setSettingsData={val => overRideSettings("performanceBand", val)}
              performanceBand={performanceBand}
            />
          </DivBlock>
        </FeaturesSwitch>
        {!premium && <SubscriptionsBlock />}
        <DivBlock>
          <StandardProficiencyTable
            disabled={forClassLevel}
            standardGradingScale={standardGradingScale}
            setSettingsData={val => overRideSettings("standardGradingScale", val)}
          />
        </DivBlock>
      </StyledDiv>
    </SettingsWrapper>
  );
};

export default connect(
  state => ({
    userRole: getUserRole(state),
    disableAnswerOnPaper: getDisableAnswerOnPaperSelector(state),
    premium: state?.user?.user?.features?.premium
  }),
  null
)(Settings);
