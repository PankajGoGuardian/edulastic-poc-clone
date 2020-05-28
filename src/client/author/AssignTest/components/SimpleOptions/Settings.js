import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Row, Col, Radio, Select, Icon, Input, message, Tooltip, Modal } from "antd";
import { green, red, blueBorder, themeColor, lightGrey9 } from "@edulastic/colors";
import { test, roleuser } from "@edulastic/constants";
import { RadioBtn, CheckboxLabel } from "@edulastic/common";
import { IconCaretDown, IconInfo } from "@edulastic/icons";
import { isUndefined } from "lodash";
import { withRouter } from "react-router-dom";
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
  Label,
  AdvancedButton,
  Block,
  StyledRadioGroup,
  RadioWrapper,
  Title,
  TimeSpentInput
} from "./styled";
import StandardProficiencyTable from "../../../TestPage/components/Setting/components/MainSetting/StandardProficiencyTable";
import SubscriptionsBlock from "../../../TestPage/components/Setting/components/MainSetting/SubscriptionsBlock";

import PeformanceBand from "../../../TestPage/components/Setting/components/MainSetting/PeformanceBand";

import { getUserRole } from "../../../src/selectors/user";
import TestTypeSelector from "./TestTypeSelector";
import PlayerSkinSelector from "./PlayerSkinSelector";
import { getDisableAnswerOnPaperSelector, getIsOverrideFreezeSelector } from "../../../TestPage/ducks";

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
  passwordPolicy: passwordPolicyValues,
  accessibilities
} = test;

const { ALL_OR_NOTHING, PARTIAL_CREDIT, ITEM_LEVEL_EVALUATION, PARTIAL_CREDIT_IGNORE_INCORRECT } = evalTypeLabels;

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
  premium,
  totalItems,
  match,
  freezeSettings = false
}) => {
  const [showPassword, setShowSebPassword] = useState(false);
  const [tempTestSettings, updateTempTestSettings] = useState({ ...testSettings });
  const [passwordStatus, setPasswordStatus] = useState({
    color: blueBorder,
    message: ""
  });
  const [showAdvancedOption, toggleAdvancedOption] = useState(false);
  const [timedTestConfirmed, setTimedtestConfirmed] = useState(false);

  const advancedHandler = () => toggleAdvancedOption(!showAdvancedOption);

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

    const penalty = value === evalTypeLabels.PARTIAL_CREDIT;
    const newSettingsState = {
      ...assignmentSettings,
      [key]: value,
      penalty
    };
    const newTempTestSettingsState = {
      ...tempTestSettings,
      [key]: value,
      penalty
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

  useEffect(() => {
    const { scoringType, penalty } = assignmentSettings;
    if (scoringType === PARTIAL_CREDIT && !penalty) overRideSettings("scoringType", PARTIAL_CREDIT_IGNORE_INCORRECT);
  }, []);

  const handleUpdatePasswordExpireIn = e => {
    let { value = 1 } = e.target;
    value *= 60;
    // eslint-disable-next-line no-restricted-globals
    if (value < 60 || Number.isNaN(value)) {
      value = 60;
    } else if (value > 999 * 60) {
      value = 999 * 60;
    }
    overRideSettings("passwordExpireIn", value);
  };

  const updateTimedTestAttrs = (attr, value) => {
    console.log("match", match?.params, timedTestConfirmed);
    if (match?.params?.assignmentId && match?.params?.classId && !timedTestConfirmed) {
      Modal.confirm({
        title: "Do you want to Proceed ?",
        content: "Changes made in Timed Assignment will impact all Students who are In Progress or Not Started.",
        onOk: () => {
          if (attr === "timedAssignment" && value) overRideSettings("allowedTime", totalItems * 60 * 1000);
          overRideSettings(attr, value);
          setTimedtestConfirmed(true);
          Modal.destroyAll();
        },
        onCancel: () => {},
        okText: "Proceed",
        centered: true,
        width: 500,
        okButtonProps: {
          style: { background: themeColor }
        }
      });
      return;
    }
    if (attr === "timedAssignment" && value) overRideSettings("allowedTime", totalItems * 60 * 1000);
    overRideSettings(attr, value);
  };

  const scoringType = assignmentSettings.scoringType || tempTestSettings.scoringType || evalTypes.ITEM_LEVEL_EVALUATION;
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
    passwordPolicy = tempTestSettings.passwordPolicy,
    assignmentPassword = tempTestSettings.assignmentPassword,
    maxAttempts = tempTestSettings.maxAttempts,
    performanceBand = tempTestSettings.performanceBand,
    standardGradingScale = tempTestSettings.standardGradingScale,
    testContentVisibility = tempTestSettings.testContentVisibility || testContentVisibilityOptions.ALWAYS,
    passwordExpireIn = tempTestSettings.passwordExpireIn || 15 * 60,
    showMagnifier = tempTestSettings.showMagnifier,
    timedAssignment = tempTestSettings.timedAssignment,
    allowedTime = tempTestSettings.allowedTime,
    pauseAllowed = tempTestSettings.pauseAllowed,
    enableScratchpad = tempTestSettings.enableScratchpad
  } = assignmentSettings;
  const playerSkinType = assignmentSettings.playerSkinType || testSettings.playerSkinType;
  const accessiblilityData = {
    showMagnifier,
    enableScratchpad
  };

  return (
    <SettingsWrapper isAdvanced={isAdvanced}>
      <StyledDiv>
        {forClassLevel ? (
          <>
            <TestTypeSelector
              userRole={userRole}
              testType={assignmentSettings?.testType}
              disabled={freezeSettings}
              onAssignmentTypeChange={changeField("testType")}
              fullwidth
              showTestTypeOption
            />
            <PlayerSkinSelector
              testType={assignmentSettings?.testType}
              userRole={userRole}
              playerSkinType={assignmentSettings?.playerSkinType}
              disabled={freezeSettings}
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
                disabled={forClassLevel || freezeSettings}
                onChange={e => overRideSettings("markAsDone", e.target.value)}
                value={markAsDone}
              >
                {completionTypeKeys.map(item => (
                  <RadioBtn value={completionTypes[item]} key={item}>
                    <Label>{completionTypes[item]}</Label>
                  </RadioBtn>
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
                disabled={forClassLevel || freezeSettings}
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
                disabled={forClassLevel || freezeSettings}
                defaultChecked={safeBrowser}
                size="small"
                onChange={value => overRideSettings("safeBrowser", value)}
              />
              {safeBrowser && (
                <Password
                  disabled={forClassLevel || freezeSettings}
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
                  disabled={forClassLevel || freezeSettings}
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
                  disabled={forClassLevel || freezeSettings}
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
              <AlignRight
                disabled={freezeSettings}
                value={calcType}
                onChange={e => overRideSettings("calcType", e.target.value)}
              >
                {calculatorKeys.map(item => (
                  <RadioBtn data-cy={item} value={item} key={item}>
                    <Label>{calculators[item]}</Label>
                  </RadioBtn>
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
                disabled={forClassLevel || disableAnswerOnPaper || freezeSettings}
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
                disabled={forClassLevel || freezeSettings}
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
                    disabled={forClassLevel || freezeSettings}
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
                    disabled={forClassLevel || freezeSettings}
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
                  disabled={forClassLevel || freezeSettings}
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
        <StyledRowSettings gutter={16}>
          <Col span={6}>
            <Label>EVALUATION METHOD</Label>
          </Col>
          <Col span={18}>
            <AlignRight
              forClassLevel={forClassLevel || freezeSettings}
              // disabled={forClassLevel}
              onChange={e => {
                if (!forClassLevel && !freezeSettings) {
                  overRideSettings("scoringType", e.target.value);
                }
              }}
              value={scoringType}
            >
              <RadioBtn value={ALL_OR_NOTHING} data-cy={ALL_OR_NOTHING} key={ALL_OR_NOTHING}>
                {evalTypes.ALL_OR_NOTHING}
              </RadioBtn>
              <RadioBtn value={PARTIAL_CREDIT} data-cy={PARTIAL_CREDIT} key={PARTIAL_CREDIT}>
                {evalTypes.PARTIAL_CREDIT}
              </RadioBtn>
              <RadioBtn
                value={PARTIAL_CREDIT_IGNORE_INCORRECT}
                data-cy={PARTIAL_CREDIT_IGNORE_INCORRECT}
                key={PARTIAL_CREDIT_IGNORE_INCORRECT}
              >
                {evalTypes.PARTIAL_CREDIT_IGNORE_INCORRECT}
              </RadioBtn>
              <RadioBtn value={ITEM_LEVEL_EVALUATION} data-cy={ITEM_LEVEL_EVALUATION} key={ITEM_LEVEL_EVALUATION}>
                {evalTypes.ITEM_LEVEL_EVALUATION}
              </RadioBtn>
            </AlignRight>
          </Col>
        </StyledRowSettings>
        {/* Evaluation Method */}

        {/* Timed TEST */}
        <FeaturesSwitch
          inputFeatures="assessmentSuperPowersTimedTest"
          actionOnInaccessible="hidden"
          key="assessmentSuperPowersTimedTest"
          gradeSubject={gradeSubject}
        >
          <StyledRowSettings gutter={16} height="40">
            <Col span={12}>
              <Label>TIMED TEST</Label>
            </Col>
            <Col span={10} style={{ display: "flex", flexDirection: "column" }}>
              <Row style={{ display: "flex", alignItems: "center" }}>
                <AlignSwitchRight
                  data-cy="assignment-time-switch"
                  size="small"
                  defaultChecked={false}
                  disabled={forClassLevel || freezeSettings}
                  checked={timedAssignment}
                  onChange={value => updateTimedTestAttrs("timedAssignment", value)}
                />
                {timedAssignment && (
                  <>
                    {/* eslint-disable no-restricted-globals */}
                    <TimeSpentInput
                      onChange={e => {
                        if (e.target.value.length <= 3 && e.target.value <= 300) {
                          updateTimedTestAttrs("allowedTime", e.target.value * 60 * 1000);
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
                      disabled={freezeSettings}
                      data-cy="exit-allowed"
                      checked={pauseAllowed}
                      onChange={e => updateTimedTestAttrs("pauseAllowed", e.target.checked)}
                    >
                      <Label>Allow student to save and continue later</Label>
                    </CheckboxLabel>
                  </CheckBoxWrapper>
                )}
              </Row>
            </Col>
            <Col span={2} justify="end" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <Tooltip title="The time can be modified in one minute increments.  When the time limit is reached, students will be locked out of the assessment.  If the student begins an assessment and exits with time remaining, upon returning, the timer will start up again where the student left off.  This ensures that the student does not go over the allotted time.">
                <IconInfo color={lightGrey9} style={{ cursor: "pointer" }} />
              </Tooltip>
            </Col>
          </StyledRowSettings>
        </FeaturesSwitch>
        {/* Timed TEST */}

        {/* Test Content visibility */}
        {(userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN) && (
          <StyledRowSettings gutter={16}>
            <Col span={12}>
              <Label>ITEM CONTENT VISIBILITY TO TEACHERS</Label>
            </Col>
            <Col span={12}>
              <AlignRight
                disabled={forClassLevel || freezeSettings}
                onChange={e => overRideSettings("testContentVisibility", e.target.value)}
                value={testContentVisibility}
              >
                {testContentVisibilityTypes.map(item => (
                  <RadioBtn value={item.key} key={item.key}>
                    {item.value}
                  </RadioBtn>
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
              disabled={forClassLevel || freezeSettings}
              setSettingsData={val => overRideSettings("performanceBand", val)}
              performanceBand={performanceBand}
            />
          </DivBlock>
        </FeaturesSwitch>
        {!premium && <SubscriptionsBlock />}
        <DivBlock>
          <StandardProficiencyTable
            disabled={forClassLevel || freezeSettings}
            standardGradingScale={standardGradingScale}
            setSettingsData={val => overRideSettings("standardGradingScale", val)}
          />
        </DivBlock>
        <AdvancedButton onClick={advancedHandler} show={showAdvancedOption}>
          {showAdvancedOption ? "HIDE ADVANCED OPTIONS" : "SHOW ADVANCED OPTIONS"}
          <IconCaretDown color={themeColor} width={11} height={6} />
        </AdvancedButton>
        {showAdvancedOption && (
          <div>
            <Block id="accessibility">
              <Title>Accessibility</Title>
              {!isDocBased && (
                <RadioWrapper disabled={forClassLevel || freezeSettings} style={{ marginTop: "29px", marginBottom: 0 }}>
                  {Object.keys(accessibilities).map(key => {
                    const value = accessiblilityData[key];
                    return (
                      <StyledRowSettings key={accessibilities[key]} style={{ width: "100%" }}>
                        <Col span={12}>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{accessibilities[key]}</span>
                        </Col>
                        <Col span={12}>
                          <StyledRadioGroup
                            disabled={forClassLevel || freezeSettings}
                            onChange={e => overRideSettings(key, e.target.value)}
                            defaultValue={isUndefined(value) ? true : value}
                          >
                            <Radio value>ENABLE</Radio>
                            <Radio value={false}>DISABLE</Radio>
                          </StyledRadioGroup>
                        </Col>
                      </StyledRowSettings>
                    );
                  })}
                </RadioWrapper>
              )}
              {(assignmentSettings?.testType || testSettings.testType) !== "testlet" && !testSettings.isDocBased && (
                <FeaturesSwitch
                  inputFeatures="selectPlayerSkinType"
                  actionOnInaccessible="hidden"
                  key="selectPlayerSkin"
                  gradeSubject={gradeSubject}
                >
                  <PlayerSkinSelector
                    userRole={userRole}
                    playerSkinType={playerSkinType}
                    onAssignmentTypeChange={changeField("playerSkinType")}
                    testType={assignmentSettings?.testType || testSettings.testType}
                    selectBackgroundWhite
                    disabled={freezeSettings}
                  />
                </FeaturesSwitch>
              )}
            </Block>
          </div>
        )}
      </StyledDiv>
    </SettingsWrapper>
  );
};

export default connect(
  state => ({
    userRole: getUserRole(state),
    disableAnswerOnPaper: getDisableAnswerOnPaperSelector(state),
    premium: state?.user?.user?.features?.premium,
    totalItems: state?.tests?.entity?.isDocBased
      ? state?.tests?.entity?.summary?.totalQuestions
      : state?.tests?.entity?.summary?.totalItems,
    freezeSettings: getIsOverrideFreezeSelector(state)
  }),
  null
)(withRouter(Settings));
