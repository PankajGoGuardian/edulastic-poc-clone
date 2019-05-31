/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { connect } from "react-redux";
import { get } from "lodash";
import { Col, Radio, Select, Row, Icon, Checkbox, Input } from "antd";
import { test } from "@edulastic/constants";
import {
  AlignRight,
  AlignSwitchRight,
  StyledRowSettings,
  StyledRowSelect,
  SettingsWrapper,
  Password,
  StyledRowLabel,
  StyledSelect,
  StyledTable,
  StyledDiv,
  SpaceDiv,
  CheckBoxWrapper
} from "./styled";
import selectsData from "../../../TestPage/components/common/selectsData";

const releaseGradeKeys = ["DONT_RELEASE", "SCORE_ONLY", "WITH_RESPONSE", "WITH_ANSWERS"];
const evalTypeKeys = ["ALL_OR_NOTHING", "PARTIAL_CREDIT"];
const { calculatorKeys, calculators, releaseGradeTypes, evalTypes, evalTypeLabels } = test;

const Settings = ({
  testSettings,
  assignmentSettings,
  updateAssignmentSettings,
  isAdvanced,
  changeField,
  performanceBandData
}) => {
  const [isAutomatic, setAssignmentCompletionType] = useState(0);
  const [showPassword, togglePasswordField] = useState(false);
  const [tempTestSettings, updateTempTestSettings] = useState({ ...testSettings });

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

  const updateMarkAsDone = e => {
    setAssignmentCompletionType(e.target.value);
  };

  const {
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
    penalty = tempTestSettings.penalty
  } = assignmentSettings;

  return (
    <SettingsWrapper isAdvanced={isAdvanced}>
      <StyledDiv>
        {!isAdvanced && (
          <>
            <StyledRowLabel gutter={16}>
              <Col span={12}>Open Policy</Col>
              <Col span={12}>Close Policy</Col>
            </StyledRowLabel>
            <Row gutter={32}>
              <Col span={12}>
                <StyledSelect
                  data-cy="selectOpenPolicy"
                  placeholder="Please select"
                  cache="false"
                  value={assignmentSettings.openPolicy}
                  onChange={changeField("openPolicy")}
                >
                  {selectsData.openPolicy.map(({ value, text }, index) => (
                    <Select.Option key={index} value={value} data-cy="open">
                      {text}
                    </Select.Option>
                  ))}
                </StyledSelect>
              </Col>
              <Col span={12}>
                <StyledSelect
                  data-cy="selectClosePolicy"
                  placeholder="Please select"
                  cache="false"
                  value={assignmentSettings.closePolicy}
                  onChange={changeField("closePolicy")}
                >
                  {selectsData.closePolicy.map(({ value, text }, index) => (
                    <Select.Option data-cy="class" key={index} value={value}>
                      {text}
                    </Select.Option>
                  ))}
                </StyledSelect>
              </Col>
            </Row>
          </>
        )}

        {/* Mark as done */}
        {!isAdvanced && <SpaceDiv />}
        <StyledRowSettings gutter={16}>
          <Col span={8}>Mark as Done</Col>
          <Col span={16}>
            <AlignRight onChange={updateMarkAsDone} value={isAutomatic}>
              <Radio value={0}>Automatically</Radio>
              <Radio value={1}>Manually</Radio>
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
                suffix={<Icon type="eye" theme="filled" onClick={() => togglePasswordField(!showPassword)} />}
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
          <Col span={8}>Require Password</Col>
          <Col span={16}>
            <AlignSwitchRight
              defaultChecked
              size="small"
              onChange={value => overRideSettings("requirePassword", value)}
            />
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
