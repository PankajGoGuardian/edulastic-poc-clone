// selectors
import { test } from "@edulastic/constants";
import { Col, Radio } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
// components
import { AlignRight, AlignSwitchRight, MaxAttemptIInput, Password, SettingsWrapper, StyledRowSettings } from "./styled";

const { releaseGradeTypes, calculatorKeys, calculators, releaseGradeLabels } = test;
const evaluationtypes = ["All or Nothing", "Partial Credit", "Dont penalize for incorrect selection"];
const releaseGradeKeys = ["DONT_RELEASE", "SCORE_ONLY", "WITH_RESPONSE", "WITH_ANSWERS"];

const Settings = ({ onUpdateMaxAttempts, testSettings, assignmentSettings, updateAssignmentSettings }) => {
  const [isAutomatic, setAssignmentCompletionType] = useState(0);
  const [type, setEvaluationType] = useState(0);
  const [showPassword, togglePasswordField] = useState(false);
  const [tempTestSettings, updateTempTestSettings] = useState({ ...testSettings });

  const updateMarkAsDone = e => {
    setAssignmentCompletionType(e.target.value);
  };

  const evalMethod = e => {
    setEvaluationType(e.target.value);
  };

  const overRideSettings = (key, value) => {
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
    updateTempTestSettings(newTempTestSettingsState);
    updateAssignmentSettings(newSettingsState);
  };
  const {
    releaseScore = tempTestSettings.releaseScore,
    maxAttempts = tempTestSettings.maxAttempts,
    safeBrowser = tempTestSettings.safeBrowser,
    sebPassword = tempTestSettings.sebPassword,
    shuffleQuestions = tempTestSettings.shuffleQuestions,
    shuffleAnswers = tempTestSettings.shuffleAnswers,
    calcType = tempTestSettings.calcType,
    answerOnPaper = tempTestSettings.answerOnPaper
  } = assignmentSettings;
  return (
    <SettingsWrapper>
      {/* Mark as done */}
      <StyledRowSettings gutter={16}>
        <Col span={8}>
          <RowTitle>Mark as Done</RowTitle>
        </Col>
        <Col span={16}>
          <AlignRight onChange={updateMarkAsDone} value={isAutomatic}>
            <Radio value={0}>Automatically</Radio>
            <Radio value={1}>Manually</Radio>
          </AlignRight>
        </Col>
      </StyledRowSettings>
      {/* Mark as done */}

      {/* Release score */}
      <StyledRowSettings gutter={16}>
        <Col span={8}>
          <RowTitle>Release Scores {releaseScore === releaseGradeLabels.DONT_RELEASE ? "[OFF]" : "[ON]"}</RowTitle>
        </Col>
        <Col span={16}>
          <AlignRight value={releaseScore} onChange={e => overRideSettings("releaseScore", e.target.value)}>
            {releaseGradeKeys.map(item => (
              <Radio value={item} key={item}>
                {releaseGradeTypes[item]}
              </Radio>
            ))}
          </AlignRight>
        </Col>
      </StyledRowSettings>
      {/* Release score */}
      {/* Maximum attempt */}
      <StyledRowSettings gutter={16}>
        <Col span={8}>
          <RowTitle>Maximum Attempts Allowed</RowTitle>
        </Col>
        <Col span={16}>
          <MaxAttemptIInput
            type="number"
            data-cy="maxAttempt"
            size="large"
            value={maxAttempts}
            onChange={e => onUpdateMaxAttempts(e.target.value)}
            min={1}
            step={1}
          />
        </Col>
      </StyledRowSettings>

      {/* Safe Exam Browser/Kiosk Mode */}

      <StyledRowSettings gutter={16}>
        <Col span={16}>
          <RowTitle>Safe Exam Browser/Kiosk Mode</RowTitle>
        </Col>
        <Col span={8}>
          <AlignSwitchRight defaultChecked={safeBrowser} onChange={value => overRideSettings("safeBrowser", value)} />
          {safeBrowser && (
            <Password
              prefix={
                <i
                  className={`fa fa-eye${showPassword ? "-slash" : ""}`}
                  onClick={() => togglePasswordField(!showPassword)}
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
      {/* Safe Exam Browser/Kiosk Mode */}

      {/* Shuffle Question */}
      <StyledRowSettings gutter={16}>
        <Col span={8}>
          <RowTitle>Shuffle Questions</RowTitle>
        </Col>
        <Col span={16}>
          <AlignSwitchRight
            defaultChecked={shuffleQuestions}
            onChange={value => overRideSettings("shuffleQuestions", value)}
          />
        </Col>
      </StyledRowSettings>
      {/* Shuffle Question */}

      {/* Shuffle Answer Choice */}
      <StyledRowSettings gutter={16}>
        <Col span={8}>
          <RowTitle>Shuffle Answer Choice</RowTitle>
        </Col>
        <Col span={16}>
          <AlignSwitchRight
            defaultChecked={shuffleAnswers}
            onChange={value => overRideSettings("shuffleAnswers", value)}
          />
        </Col>
      </StyledRowSettings>
      {/* Shuffle Answer Choice */}

      {/* Show Calculator */}
      <StyledRowSettings gutter={16}>
        <Col span={8}>
          <RowTitle>Show Calculator</RowTitle>
        </Col>
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
        <Col span={8}>
          <RowTitle>Answer on Paper</RowTitle>
        </Col>
        <Col span={16}>
          <AlignSwitchRight
            defaultChecked={answerOnPaper}
            onChange={value => overRideSettings("answerOnPaper", value)}
          />
        </Col>
      </StyledRowSettings>
      {/* Answer on Paper */}

      {/* Require Password */}
      <StyledRowSettings gutter={16}>
        <Col span={8}>
          <RowTitle>Require Password</RowTitle>
        </Col>
        <Col span={16}>
          <AlignSwitchRight defaultChecked />
        </Col>
      </StyledRowSettings>
      {/* Require Password */}

      {/* Evaluation Method */}
      <StyledRowSettings gutter={16} islast>
        <Col span={8}>
          <RowTitle>Evaluation Method</RowTitle>
        </Col>
        <Col span={16}>
          <AlignRight onChange={evalMethod} value={type}>
            {evaluationtypes.map((item, index) => (
              <Radio value={index} key={index}>
                {item}
              </Radio>
            ))}
          </AlignRight>
        </Col>
      </StyledRowSettings>
      {/* Evaluation Method */}
    </SettingsWrapper>
  );
};

export default Settings;

const RowTitle = styled.h4`
  font-weight: 600;
  margin: 0px;
`;
