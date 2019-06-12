/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { connect } from "react-redux";
import { get } from "lodash";
import { Col, Radio, Select, Icon, Checkbox, Input } from "antd";
import { green, red, blueBorder } from "@edulastic/colors";
import { test } from "@edulastic/constants";
import {
  AlignRight,
  AlignSwitchRight,
  StyledRowSettings,
  StyledRowSelect,
  SettingsWrapper,
  Password,
  StyledSelect,
  StyledTable,
  StyledDiv,
  SpaceDiv,
  CheckBoxWrapper,
  MessageSpan
} from "./styled";

const releaseGradeKeys = ["DONT_RELEASE", "SCORE_ONLY", "WITH_RESPONSE", "WITH_ANSWERS"];
const evalTypeKeys = ["ALL_OR_NOTHING", "PARTIAL_CREDIT"];
const completionTypeKeys = ["AUTOMATICALLY", "MANUALLY"];
const { calculatorKeys, calculators, releaseGradeTypes, evalTypes, evalTypeLabels, completionTypes } = test;

const Settings = ({
  testSettings,
  assignmentSettings,
  updateAssignmentSettings,
  isAdvanced,
  changeField,
  performanceBandData
}) => {
  const [showPassword, setShowSebPassword] = useState(false);
  const [tempTestSettings, updateTempTestSettings] = useState({ ...testSettings });
  const [passwordStatus, setPasswordStatus] = useState({
    color: blueBorder,
    message: ""
  });

  const { performanceBand = [] } = performanceBandData;

  const columns = [
    {
      title: "Performance Bands",
      dataIndex: "name",
      width: "35%",
      key: "name"
    },
    {
      title: "Above or At Standard",
      dataIndex: "aboveOrAtStandard",
      width: "25%",
      key: "aboveOrAtStandard",
      render: value => <Checkbox checked={value} />
    },
    {
      title: "From",
      dataIndex: "from",
      width: "15%",
      key: "from",
      render: text => <span>{`${text}%`}</span>
    },
    {
      title: "To",
      width: "25%",
      key: "to",
      dataIndex: "to",
      className: "action-wrapper",
      render: text => (
        <div>
          <Icon type="minus-circle" />
          {`${text}%`}
          <Icon type="plus-circle" />
        </div>
      )
    }
  ];

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
    } else {
      let validationMessage = "Password is too short";
      if (assignmentPassword.length > 25) validationMessage = "Password is too long";
      setPasswordStatus({
        color: red,
        message: validationMessage
      });
      return;
    }
  };
  const overRideSettings = (key, value) => {
    if (key === "maxAnswerChecks" && value < 0) value = 0;
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
  };

  const {
    markAsDone = tempTestSettings.markAsDone,
    releaseScore = tempTestSettings.releaseScore,
    safeBrowser = tempTestSettings.safeBrowser,
    sebPassword = tempTestSettings.sebPassword,
    shuffleQuestions = tempTestSettings.shuffleQuestions,
    shuffleAnswers = tempTestSettings.shuffleAnswers,
    calcType = tempTestSettings.calcType,
    showQuestionsAfterSubmission = tempTestSettings.showQuestionsAfterSubmission,
    answerOnPaper = tempTestSettings.answerOnPaper,
    maxAnswerChecks = tempTestSettings.maxAnswerChecks,
    scoringType = tempTestSettings.scoringType,
    penalty = tempTestSettings.penalty,
    requirePassword = tempTestSettings.requirePassword,
    assignmentPassword = tempTestSettings.assignmentPassword
  } = assignmentSettings;

  return (
    <SettingsWrapper isAdvanced={isAdvanced}>
      <StyledDiv>
        {/* Mark as done */}
        <StyledRowSettings gutter={16}>
          <Col span={8}>Mark as Done</Col>
          <Col span={16}>
            <AlignRight onChange={e => overRideSettings("markAsDone", e.target.value)} value={markAsDone}>
              {completionTypeKeys.map(item => (
                <Radio value={completionTypes[item]} key={item}>
                  {completionTypes[item]}
                </Radio>
              ))}
            </AlignRight>
          </Col>
        </StyledRowSettings>
        {/* Mark as done */}

        {/* Release score */}
        <StyledRowSelect gutter={16}>
          <Col span={10}>Release Scores</Col>
          <Col span={14}>
            <StyledSelect
              data-cy="selectRelaseScore"
              placeholder="Please select"
              cache="false"
              value={releaseScore}
              onChange={changeField("releaseScore")}
            >
              {releaseGradeKeys.map((item, index) => (
                <Select.Option data-cy="class" key={index} value={item}>
                  {releaseGradeTypes[item]}
                </Select.Option>
              ))}
            </StyledSelect>
          </Col>
        </StyledRowSelect>
        {/* Release score */}

        {/* Require Safe Exam Browser */}
        <StyledRowSettings gutter={16}>
          <Col span={16}>Require Safe Exam Browser</Col>
          <Col span={8}>
            <AlignSwitchRight
              defaultChecked={safeBrowser}
              size="small"
              onChange={value => overRideSettings("safeBrowser", value)}
            />
            {safeBrowser && (
              <Password
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
        {/* Require Safe Exam Browser */}

        {/* show questions */}
        <StyledRowSettings gutter={16}>
          <Col span={12}>Show Questions to Students After Submission</Col>
          <Col span={12}>
            <AlignSwitchRight
              defaultChecked={showQuestionsAfterSubmission}
              size="small"
              onChange={value => overRideSettings("showQuestionsAfterSubmission", value)}
            />
          </Col>
        </StyledRowSettings>
        {/* show questions */}

        {/* Shuffle Question */}
        <StyledRowSettings gutter={16}>
          <Col span={8}>Shuffle Questions</Col>
          <Col span={16}>
            <AlignSwitchRight
              size="small"
              defaultChecked={shuffleQuestions}
              onChange={value => overRideSettings("shuffleQuestions", value)}
            />
          </Col>
        </StyledRowSettings>
        {/* Shuffle Question */}

        {/* Shuffle Answer Choice */}
        <StyledRowSettings gutter={16}>
          <Col span={8}>Shuffle Answer Choice</Col>
          <Col span={16}>
            <AlignSwitchRight
              size="small"
              defaultChecked={shuffleAnswers}
              onChange={value => overRideSettings("shuffleAnswers", value)}
            />
          </Col>
        </StyledRowSettings>
        {/* Shuffle Answer Choice */}

        {/* Show Calculator */}
        <StyledRowSettings gutter={16}>
          <Col span={8}>Show Calculator</Col>
          <Col span={16}>
            <AlignRight value={calcType} onChange={e => overRideSettings("calcType", e.target.value)}>
              {calculatorKeys.map(item => (
                <Radio value={item} key={item}>
                  {calculators[item]}
                </Radio>
              ))}
            </AlignRight>
          </Col>
        </StyledRowSettings>
        {/* Show Calculator */}

        {/* Answer on Paper */}
        <StyledRowSettings gutter={16}>
          <Col span={8}>Answer on Paper</Col>
          <Col span={16}>
            <AlignSwitchRight
              size="small"
              defaultChecked={answerOnPaper}
              onChange={value => overRideSettings("answerOnPaper", value)}
            />
          </Col>
        </StyledRowSettings>
        {/* Answer on Paper */}

        {/* Require Password */}
        <StyledRowSettings gutter={16}>
          <Col span={16}>Require Password</Col>
          <Col span={8}>
            <AlignSwitchRight
              defaultChecked={requirePassword}
              size="small"
              onChange={value => overRideSettings("requirePassword", value)}
            />
            {requirePassword && (
              <>
                <Password
                  onChange={e => overRideSettings("assignmentPassword", e.target.value)}
                  size="large"
                  value={assignmentPassword}
                  type={"text"}
                  placeholder="Enter Password"
                  color={passwordStatus.color}
                />
                <MessageSpan>{passwordStatus.message}</MessageSpan>
              </>
            )}
          </Col>
        </StyledRowSettings>
        {/* Require Password */}

        {/* Check Answer Tries Per Question */}
        <StyledRowSettings gutter={16}>
          <Col span={16}>Check Answer Tries Per Question</Col>
          <Col span={8}>
            <Input
              onChange={e => overRideSettings("maxAnswerChecks", e.target.value)}
              size="large"
              value={maxAnswerChecks}
              type={"number"}
              min={0}
              placeholder="Number of tries"
            />
          </Col>
        </StyledRowSettings>
        {/* Check Answer Tries Per Question */}

        {/* Evaluation Method */}
        <StyledRowSettings gutter={16}>
          <Col span={6}>Evaluation Method</Col>
          <Col span={18}>
            <AlignRight onChange={e => overRideSettings("scoringType", e.target.value)} value={scoringType}>
              {evalTypeKeys.map(item => (
                <Radio value={item} key={item}>
                  {evalTypes[item]}
                </Radio>
              ))}
            </AlignRight>
            {scoringType === evalTypeLabels.PARTIAL_CREDIT && (
              <CheckBoxWrapper>
                <Checkbox checked={penalty === false} onChange={e => overRideSettings("penalty", !e.target.checked)}>
                  {"Don’t penalize for incorrect selection"}
                </Checkbox>
              </CheckBoxWrapper>
            )}
          </Col>
        </StyledRowSettings>
        {/* Evaluation Method */}
      </StyledDiv>

      <StyledDiv>
        <StyledTable columns={columns} dataSource={performanceBand} pagination={false} isAdvanced={isAdvanced} />
      </StyledDiv>
    </SettingsWrapper>
  );
};

export default connect(
  state => ({
    performanceBandData: get(state, ["performanceBandReducer", "data"], [])
  }),
  null
)(Settings);
