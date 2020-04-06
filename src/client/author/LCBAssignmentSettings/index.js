import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Col, Icon, Row, Select, message, Tooltip } from "antd";
import moment from "moment";
import { test as testConst, assignmentPolicyOptions, assignmentStatusOptions } from "@edulastic/constants";
import { MainContentWrapper } from "@edulastic/common";
import { getAdditionalDataSelector } from "../ClassBoard/ducks";
import { receiveTestActivitydAction } from "../src/actions/classBoard";
import { slice } from "./ducks";
import ClassHeader from "../Shared/Components/ClassHeader/ClassHeader";
/**
 * Imports from SimpleOptions for re-use
 */
import {
  OptionConationer,
  InitOptions,
  StyledRowButton,
  SettingsBtn,
  StyledSelect,
  StyledRow
} from "../AssignTest/components/SimpleOptions/styled";
import DateSelector from "../AssignTest/components/SimpleOptions/DateSelector";
import Settings from "../AssignTest/components/SimpleOptions/Settings";
import selectsData from "../TestPage/components/common/selectsData";
import { EduButton } from "@edulastic/common";

/**
 * Imports related to testSettings
 */
import { getDefaultTestSettingsAction } from "../TestPage/ducks";
import { getTestEntitySelector } from "../AssignTest/duck";
import { InputLabel, InputLabelContainer, ClassHeading, ActionButton } from "./styled";
import { QuestionIcon } from "../../assessment/styled/Subtitle";

export const releaseGradeKeys = ["DONT_RELEASE", "SCORE_ONLY", "WITH_RESPONSE", "WITH_ANSWERS"];
export const nonPremiumReleaseGradeKeys = ["DONT_RELEASE", "WITH_ANSWERS"];

const { releaseGradeTypes } = testConst;

function LCBAssignmentSettings({
  additionalData,
  loadTestActivity,
  match,
  history,
  loadAssignment,
  assignment = {},
  testSettings = {},
  loadTestSettings,
  changeAttrs,
  updateAssignmentSettings
}) {
  const { openPolicy, closePolicy } = selectsData;
  const { assignmentId, classId } = match.params || {};
  useEffect(() => {
    loadTestActivity(assignmentId, classId);
    loadAssignment({ assignmentId, classId });
    loadTestSettings();
  }, []);

  const [showSettings, setShowSettings] = useState(false);

  const { startDate, endDate, status, dueDate } = assignment?.["class"]?.[0] || {};
  const changeField = key => value => {
    if (key === "openPolicy" && value === assignmentPolicyOptions.POLICY_AUTO_ON_STARTDATE) {
      message.info("Please select your prefered start date");
    } else if (key === "closePolicy" && value === assignmentPolicyOptions.POLICY_AUTO_ON_DUEDATE) {
      message.info("Please select your prefered due date");
    }
    changeAttrs({ key, value });
  };
  const gradeSubject = { grades: assignment?.grades, subjects: assignment?.subjects };

  const resetToDefault = () => {
    loadTestActivity(assignmentId, classId);
    loadAssignment({ assignmentId, classId });
    loadTestSettings();
  };

  const className = additionalData?.className;

  return (
    <div>
      <ClassHeader
        classId={match.params?.classId}
        active="settings"
        assignmentId={match.params?.assignmentId}
        additionalData={additionalData || {}}
        onCreate={() => history.push(`${match.url}/create`)}
      />
      <MainContentWrapper>
        <OptionConationer>
          <InitOptions style={{ padding: "30px 50px" }}>
            <ClassHeading>{className ? `Settings for ${className}` : "loading..."}</ClassHeading>
            <DateSelector
              startDate={moment(startDate)}
              endDate={moment(endDate)}
              dueDate={dueDate ? moment(dueDate) : undefined}
              changeField={changeField}
              forClassLevel
              status={status}
              passwordPolicy={assignment?.passwordPolicy}
            />

            <Row gutter={32}>
              <StyledRow>
                <Col span={12} style={{ padding: "0px 16px" }}>
                  <InputLabelContainer>
                    <InputLabel>open policy</InputLabel>
                  </InputLabelContainer>
                  <StyledSelect
                    data-cy="selectOpenPolicy"
                    placeholder="Please select"
                    cache="false"
                    value={assignment?.openPolicy}
                    onChange={changeField("openPolicy")}
                    disabled={
                      assignment?.passwordPolicy === testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC ||
                      status !== assignmentStatusOptions.NOT_OPEN
                    }
                  >
                    {openPolicy.map(({ value, text }, index) => (
                      <Select.Option key={index} value={value} data-cy="open">
                        {text}
                      </Select.Option>
                    ))}
                  </StyledSelect>
                </Col>
                <Col span={12} style={{ padding: "0px 16px" }}>
                  <InputLabelContainer>
                    <InputLabel>close policy</InputLabel>
                  </InputLabelContainer>
                  <StyledSelect
                    data-cy="selectClosePolicy"
                    placeholder="Please select"
                    cache="false"
                    value={assignment?.closePolicy}
                    onChange={changeField("closePolicy")}
                    disabled={status === assignmentStatusOptions.DONE}
                  >
                    {closePolicy.map(({ value, text }, index) => (
                      <Select.Option data-cy="class" key={index} value={value}>
                        {text}
                      </Select.Option>
                    ))}
                  </StyledSelect>
                </Col>
              </StyledRow>

              {/* Release score */}
              <Col span={12}>
                <InputLabelContainer>
                  <InputLabel>RELEASE SCORES</InputLabel>
                </InputLabelContainer>
                <StyledSelect
                  data-cy="selectRelaseScore"
                  placeholder="Please select"
                  cache="false"
                  value={assignment?.releaseScore}
                  onChange={changeField("releaseScore")}
                >
                  {releaseGradeKeys.map((item, index) => (
                    <Select.Option data-cy="class" key={index} value={item}>
                      {releaseGradeTypes[item]}
                    </Select.Option>
                  ))}
                </StyledSelect>
              </Col>
              {/* Release score */}
            </Row>
            <StyledRowButton gutter={16}>
              <Col>
                <SettingsBtn onClick={() => setShowSettings(old => !old)}>
                  TEST LEVEL SETTINGS
                  <Tooltip title="Below settings can’t be changed here. To modify edit the test and make changes.">
                    <span>
                      <QuestionIcon
                        customStyle={{ position: "relative", bottom: "8px", marginLeft: "6px" }}
                        id="test-level-settings"
                        onClick={event => {
                          event.stopPropagation();
                        }}
                      />
                    </span>
                  </Tooltip>
                  {showSettings ? (
                    <Icon style={{ marginLeft: "-12px" }} type="caret-up" />
                  ) : (
                    <Icon type="caret-down" style={{ marginLeft: "-10px" }} />
                  )}
                </SettingsBtn>
              </Col>
            </StyledRowButton>

            {showSettings && (
              <Settings
                assignmentSettings={assignment}
                updateAssignmentSettings={() => {}}
                forClassLevel
                changeField={changeField}
                testSettings={testSettings}
                gradeSubject={gradeSubject}
                _releaseGradeKeys={releaseGradeKeys}
                isDocBased={assignment?.isDocBased}
              />
            )}
            <Row gutter={0}>
              <Col offset={12}>
                <Col span={12} style={{ paddingLeft: "16px" }}>
                  <EduButton height="40px" width="100%" isGhost onClick={() => resetToDefault()}>
                    CANCEL
                  </EduButton>
                </Col>
                <Col span={12} style={{ paddingLeft: "16px" }}>
                  <EduButton height="40px" onClick={() => updateAssignmentSettings({ classId, assignmentId })}>
                    UPDATE
                  </EduButton>
                </Col>
              </Col>
            </Row>
          </InitOptions>
        </OptionConationer>
      </MainContentWrapper>
    </div>
  );
}

export default connect(
  state => ({
    additionalData: getAdditionalDataSelector(state),
    assignment: state?.LCBAssignmentSettings?.assignment,
    loading: state?.LCBAssignmentSettings?.loading,
    testSettings: getTestEntitySelector(state)
  }),
  {
    loadTestActivity: receiveTestActivitydAction,
    loadAssignment: slice.actions.loadAssignment,
    updateAssignmentSettings: slice.actions.updateAssignmentClassSettings,
    changeAttrs: slice.actions.changeAttribute,
    updateLocally: slice.actions.updateAssignment,
    loadTestSettings: getDefaultTestSettingsAction
  }
)(LCBAssignmentSettings);
