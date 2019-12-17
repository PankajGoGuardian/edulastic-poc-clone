import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Col, Icon, Row, Select, message } from "antd";
import moment from "moment";
import {
  getSortedTestActivitySelector,
  getAdditionalDataSelector,
  getClassResponseSelector
} from "../ClassBoard/ducks";
import { test as testConst, roleuser, assignmentPolicyOptions, assignmentStatusOptions } from "@edulastic/constants";
import { receiveTestActivitydAction } from "../src/actions/classBoard";
import { slice } from "./ducks";
import ClassHeader from "../Shared/Components/ClassHeader/ClassHeader";
import { getUserRole } from "../src/selectors/user";
import { ThemeButton } from "../src/components/common/ThemeButton";
/**
 * Imports from SimpleOptions for re-use
 */
import {
  OptionConationer,
  InitOptions,
  StyledRowButton,
  SettingsBtn,
  StyledRowLabel,
  StyledSelect
} from "../AssignTest/components/SimpleOptions/styled";
import DateSelector from "../AssignTest/components/SimpleOptions/DateSelector";
import TestTypeSelector from "../AssignTest/components/SimpleOptions/TestTypeSelector";
import Settings from "../AssignTest/components/SimpleOptions/Settings";
import selectsData from "../TestPage/components/common/selectsData";

/**
 * Imports related to testSettings
 */
import { getDefaultTestSettingsAction } from "../TestPage/ducks";
import { getTestEntitySelector } from "../AssignTest/duck";

export const releaseGradeKeys = ["DONT_RELEASE", "SCORE_ONLY", "WITH_RESPONSE", "WITH_ANSWERS"];
export const nonPremiumReleaseGradeKeys = ["DONT_RELEASE", "WITH_ANSWERS"];

function LCBAssignmentSettings({
  additionalData,
  loadTestActivity,
  match,
  history,
  loadAssignment,
  assignment = {},
  userRole,
  testSettings = {},
  loadTestSettings,
  changeAttrs,
  updateAssignmentSettings
}) {
  let { openPolicy, closePolicy } = selectsData;
  const { assignmentId, classId } = match.params || {};
  useEffect(() => {
    loadTestActivity(assignmentId, classId);
    loadAssignment({ assignmentId, classId });
    loadTestSettings();
  }, []);

  const [showSettings, setShowSettings] = useState(false);

  const { startDate, endDate, status } = assignment?.["class"]?.[0] || {};
  const changeField = key => {
    return value => {
      if (key === "openPolicy" && value === assignmentPolicyOptions.POLICY_AUTO_ON_STARTDATE) {
        message.info("Please select your prefered start date");
      } else if (key === "closePolicy" && value === assignmentPolicyOptions.POLICY_AUTO_ON_DUEDATE) {
        message.info("Please select your prefered due date");
      }
      changeAttrs({ key, value });
    };
  };
  const gradeSubject = { grades: assignment?.grades, subjects: assignment?.subjects };
  return (
    <div>
      <ClassHeader
        classId={match.params?.classId}
        active="settings"
        assignmentId={match.params?.assignmentId}
        additionalData={additionalData || {}}
        onCreate={() => history.push(`${match.url}/create`)}
      />
      <div>
        <OptionConationer>
          <InitOptions>
            <Row gutter={0}>
              <Col offset={22} span={2}>
                <ThemeButton
                  style={{ color: "#fff" }}
                  onClick={() => updateAssignmentSettings({ classId, assignmentId })}
                >
                  Save
                </ThemeButton>
              </Col>
            </Row>
            <DateSelector
              startDate={moment(startDate)}
              endDate={moment(endDate)}
              changeField={changeField}
              forClassLevel
              status={status}
              passwordPolicy={assignment?.passwordPolicy}
            />

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
              <Col span={12}>
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
            </Row>

            <TestTypeSelector
              userRole={userRole}
              testType={assignment?.testType}
              disabled
              onAssignmentTypeChange={changeField("testType")}
            />
            <StyledRowButton gutter={16}>
              <Col>
                <SettingsBtn onClick={() => setShowSettings(old => !old)}>
                  OVERRIDE TEST SETTINGS
                  {showSettings ? <Icon type="caret-up" /> : <Icon type="caret-down" />}
                </SettingsBtn>
              </Col>
            </StyledRowButton>

            {showSettings && (
              <Settings
                assignmentSettings={assignment}
                updateAssignmentSettings={options => {}}
                forClassLevel
                changeField={changeField}
                testSettings={testSettings}
                gradeSubject={gradeSubject}
                _releaseGradeKeys={releaseGradeKeys}
                isDocBased={assignment?.isDocBased}
              />
            )}
          </InitOptions>
        </OptionConationer>
      </div>
    </div>
  );
}

export default connect(
  state => ({
    additionalData: getAdditionalDataSelector(state),
    assignment: state?.LCBAssignmentSettings?.assignment,
    loading: state?.LCBAssignmentSettings?.loading,
    userRole: getUserRole(state),
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
