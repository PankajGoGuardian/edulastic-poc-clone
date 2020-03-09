import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import AdminSubHeader from "../../../src/components/common/AdminSubHeader/SettingSubHeader";
import SaSchoolSelect from "../../../src/components/common/SaSchoolSelect";
import { roleuser } from "@edulastic/constants";

import { Radio, Row, Col, Select } from "antd";
import styled from "styled-components";
import { RadioBtn, RadioGrp } from "@edulastic/common";

import {
  TestSettingDiv,
  StyledContent,
  StyledLayout,
  SpinContainer,
  StyledSpin,
  StyledRow,
  StyledLabel,
  SaveButton,
  StyledRdioGroup,
  Break
} from "./styled";

// actions
import {
  receiveTestSettingAction,
  updateTestSettingAction,
  createTestSettingAction,
  setTestSettingValueAction,
  setTestSettingDefaultProfileAction
} from "../../ducks";

import { receivePerformanceBandAction } from "../../../PerformanceBand/ducks";
import { receiveStandardsProficiencyAction } from "../../../StandardsProficiency/ducks";

import { getUserOrgId, getUserRole } from "../../../src/selectors/user";

const title = "Manage District";
const menuActive = { mainMenu: "Settings", subMenu: "Test Settings" };

class TestSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testSetting: {
        partialScore: true,
        timer: true
      }
    };
  }

  componentDidMount() {
    const { loadTestSetting, userOrgId, loadPerformanceBand, loadStandardsProficiency, schoolId, role } = this.props;
    if (role === roleuser.SCHOOL_ADMIN) {
      loadTestSetting({ orgType: "institution", orgId: schoolId });
    } else {
      loadTestSetting({ orgId: userOrgId });
    }

    loadPerformanceBand({ orgId: userOrgId });
    loadStandardsProficiency({ orgId: userOrgId });
  }

  componentDidUpdate(prevProps) {
    /**
     * school selection is changed
     */
    if (prevProps.schoolId != this.props.schoolId && this.props.schoolId) {
      loadTestSetting({ orgType: "institution", orgId: this.props.schoolId });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.testSetting == null || Object.keys(nextProps.testSetting).length === 0) {
      return {
        testSetting: {
          partialScore: true,
          timer: true
        }
      };
    } else return { testSetting: nextProps.testSetting };
  }

  changePartialScore = e => {
    const testSetting = { ...this.state.testSetting };
    testSetting.partialScore = e.target.value;
    this.props.setTestSettingValue(testSetting, this.props.role === roleuser.SCHOOL_ADMIN);
  };

  changeTimerScore = e => {
    const testSetting = { ...this.state.testSetting };
    testSetting.timer = e.target.value;
    this.props.setTestSettingValue(testSetting, this.props.role === roleuser.SCHOOL_ADMIN);
  };

  updateValue = () => {
    const { testSetting } = this.state;
    const { createTestSetting, updateTestSetting, schoolId, role } = this.props;
    const updateData = {
      orgId: role === roleuser.SCHOOL_ADMIN ? schoolId : this.props.userOrgId,
      orgType: role === roleuser.SCHOOL_ADMIN ? "institution" : "district",
      partialScore: testSetting.partialScore,
      timer: testSetting.timer,
      testTypesProfile: testSetting.testTypesProfile
    };
    if (testSetting.hasOwnProperty("_id")) {
      updateTestSetting(updateData);
    } else {
      createTestSetting(updateData);
    }
  };

  render() {
    const {
      loading,
      updating,
      creating,
      history,
      standardsProficiencyProfiles,
      performanceBandProfiles,
      standardsProficiencyLoading,
      performanceBandLoading,
      setDefaultProfile
    } = this.props;

    const { testSetting } = this.state;
    const btnSaveStr = testSetting.hasOwnProperty("_id") ? "Save" : "Create";

    const performanceBandOptions = performanceBandProfiles.map(x => (
      <Select.Option key={x._id} value={x._id}>
        {x.name}
      </Select.Option>
    ));

    const standardsProficiencyOptions = standardsProficiencyProfiles.map(x => (
      <Select.Option key={x._id} value={x._id}>
        {x.name}
      </Select.Option>
    ));

    const performanceBand1 = performanceBandProfiles[0];
    const standardProficiency1 = standardsProficiencyProfiles[0];

    return (
      <TestSettingDiv>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={updating || loading || creating ? "true" : "false"}>
            <AdminSubHeader active={menuActive} history={history} />
            {(updating || loading || creating) && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <SaSchoolSelect />
            <StyledRow>
              <React.Fragment>
                <StyledLabel>Allow Partial Score </StyledLabel>
                <RadioGrp
                  defaultValue={testSetting.partialScore}
                  onChange={e => this.changePartialScore(e)}
                  value={testSetting.partialScore}
                >
                  <RadioBtn value={true}>Yes</RadioBtn>
                  <RadioBtn value={false}>No</RadioBtn>
                </RadioGrp>
              </React.Fragment>
            </StyledRow>
            <StyledRow>
              <React.Fragment>
                <StyledLabel>Show Timer </StyledLabel>
                <RadioGrp
                  defaultValue={testSetting.timer}
                  onChange={e => this.changeTimerScore(e)}
                  value={testSetting.timer}
                >
                  <RadioBtn value={true}>Yes</RadioBtn>
                  <RadioBtn value={false}>No</RadioBtn>
                </RadioGrp>
              </React.Fragment>
            </StyledRow>
            <StyledRow>
              <React.Fragment>
                <StyledLabel>Default Performance Band Profiles </StyledLabel>
              </React.Fragment>
              <FlexingRow>
                <Col span={8}>
                  <p>Common Test</p>
                  <StyledSelect
                    value={get(testSetting, "testTypesProfile.performanceBand.common")}
                    onChange={value => setDefaultProfile({ value, profileType: "performanceBand", testType: "common" })}
                    loading={performanceBandLoading}
                    placeholder="select one option"
                    size="large"
                  >
                    {performanceBandOptions}
                  </StyledSelect>
                </Col>
                <Col span={8}>
                  <p>Class Test</p>
                  <StyledSelect
                    value={get(testSetting, "testTypesProfile.performanceBand.class")}
                    onChange={value => setDefaultProfile({ value, profileType: "performanceBand", testType: "class" })}
                    loading={performanceBandLoading}
                    placeholder="select one option"
                    size="large"
                  >
                    {performanceBandOptions}
                  </StyledSelect>
                </Col>
                <Col span={8}>
                  <p>Practice Test</p>
                  <StyledSelect
                    value={get(testSetting, "testTypesProfile.performanceBand.practice")}
                    onChange={value =>
                      setDefaultProfile({ value, profileType: "performanceBand", testType: "practice" })
                    }
                    loading={performanceBandLoading}
                    placeholder="select one option"
                    size="large"
                  >
                    {performanceBandOptions}
                  </StyledSelect>
                </Col>
              </FlexingRow>
            </StyledRow>
            <StyledRow>
              <React.Fragment>
                <StyledLabel>Default Standard Proficiency Profiles </StyledLabel>
              </React.Fragment>
              <FlexingRow>
                <Col span={8}>
                  <p>Common Test</p>
                  <StyledSelect
                    value={get(testSetting, "testTypesProfile.standardProficiency.common")}
                    onChange={value =>
                      setDefaultProfile({ value, profileType: "standardProficiency", testType: "common" })
                    }
                    loading={standardsProficiencyLoading}
                    placeholder="select one option"
                    size="large"
                  >
                    {standardsProficiencyOptions}
                  </StyledSelect>
                </Col>
                <Col span={8}>
                  <p>Class Test</p>
                  <StyledSelect
                    value={get(testSetting, "testTypesProfile.standardProficiency.class")}
                    onChange={value =>
                      setDefaultProfile({ value, profileType: "standardProficiency", testType: "class" })
                    }
                    loading={standardsProficiencyLoading}
                    placeholder="select one option"
                    size="large"
                  >
                    {standardsProficiencyOptions}
                  </StyledSelect>
                </Col>
                <Col span={8}>
                  <p>Practice Test</p>
                  <StyledSelect
                    value={get(testSetting, "testTypesProfile.standardProficiency.practice")}
                    loading={standardsProficiencyLoading}
                    onChange={value =>
                      setDefaultProfile({ value, profileType: "standardProficiency", testType: "practice" })
                    }
                    placeholder="select one option"
                    size="large"
                  >
                    {standardsProficiencyOptions}
                  </StyledSelect>
                </Col>
              </FlexingRow>
            </StyledRow>

            <StyledRow>
              <SaveButton type="primary" onClick={this.updateValue}>
                {btnSaveStr}
              </SaveButton>
            </StyledRow>
          </StyledLayout>
        </StyledContent>
      </TestSettingDiv>
    );
  }
}

const enhance = compose(
  connect(
    (state, props) => ({
      testSetting: get(state, ["testSettingReducer", "data"], {}),
      loading: get(state, ["testSettingReducer", "loading"], false),
      updating: get(state, ["testSettingReducer", "updating"], false),
      creating: get(state, ["testSettingReducer", "creating"], false),
      standardsProficiencyLoading: get(state, ["standardsProficiencyReducer", "loading"], false),
      performanceBandLoading: get(state, ["performanceBandReducer", "loading"], false),
      performanceBandProfiles: get(state, ["performanceBandReducer", "profiles"], []),
      standardsProficiencyProfiles: get(state, ["standardsProficiencyReducer", "data"], []),
      userOrgId: getUserOrgId(state),
      role: getUserRole(state),
      schoolId: get(state, "user.saSettingsSchool")
    }),
    {
      loadTestSetting: receiveTestSettingAction,
      createTestSetting: createTestSettingAction,
      updateTestSetting: updateTestSettingAction,
      setTestSettingValue: setTestSettingValueAction,
      loadPerformanceBand: receivePerformanceBandAction,
      loadStandardsProficiency: receiveStandardsProficiencyAction,
      setDefaultProfile: setTestSettingDefaultProfileAction
    }
  )
);

const StyledSelect = styled(Select)`
  width: 100%;
  box-sizing: border-box;
  margin: 3px;
`;

const FlexingRow = styled(Row)`
  flex: 1 1;
  & > .ant-col {
    padding-left: 8px;
    padding-right: 8px;
  }
`;

export default enhance(TestSetting);

TestSetting.propTypes = {
  loadTestSetting: PropTypes.func.isRequired,
  updateTestSetting: PropTypes.func.isRequired,
  createTestSetting: PropTypes.func.isRequired,
  userOrgId: PropTypes.string.isRequired
};
