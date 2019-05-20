import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import { Radio } from "antd";

import {
  TestSettingDiv,
  StyledContent,
  StyledLayout,
  SpinContainer,
  StyledSpin,
  StyledRow,
  StyledLabel,
  SaveButton,
  StyledRdioGroup
} from "./styled";

// actions
import {
  receiveTestSettingAction,
  updateTestSettingAction,
  createTestSettingAction,
  setTestSettingValueAction
} from "../../ducks";

import { getUserOrgId } from "../../../src/selectors/user";

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
    const { loadTestSetting, userOrgId } = this.props;
    loadTestSetting({ orgId: userOrgId });
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
    this.props.setTestSettingValue(testSetting);
  };

  changeTimerScore = e => {
    const testSetting = { ...this.state.testSetting };
    testSetting.timer = e.target.value;
    this.props.setTestSettingValue(testSetting);
  };

  updateValue = () => {
    const { testSetting } = this.state;
    const { createTestSetting, updateTestSetting } = this.props;
    const updateData = {
      orgId: this.props.userOrgId,
      orgType: "district",
      partialScore: testSetting.partialScore,
      timer: testSetting.timer
    };
    if (testSetting.hasOwnProperty("_id")) {
      updateTestSetting(updateData);
    } else {
      createTestSetting(updateData);
    }
  };

  render() {
    const { loading, updating, creating, history } = this.props;
    const { testSetting } = this.state;
    const btnSaveStr = testSetting.hasOwnProperty("_id") ? "Save" : "Create";

    return (
      <TestSettingDiv>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={updating || loading || creating ? "true" : "false"}>
            {(updating || loading || creating) && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <StyledRow>
              <React.Fragment>
                <StyledLabel>Allow Partial Score </StyledLabel>
                <StyledRdioGroup
                  defaultValue={testSetting.partialScore}
                  onChange={e => this.changePartialScore(e)}
                  value={testSetting.partialScore}
                >
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </StyledRdioGroup>
              </React.Fragment>
            </StyledRow>
            <StyledRow>
              <React.Fragment>
                <StyledLabel>Show Timer </StyledLabel>
                <StyledRdioGroup
                  defaultValue={testSetting.timer}
                  onChange={e => this.changeTimerScore(e)}
                  value={testSetting.timer}
                >
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </StyledRdioGroup>
              </React.Fragment>
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
    state => ({
      testSetting: get(state, ["testSettingReducer", "data"], {}),
      loading: get(state, ["testSettingReducer", "loading"], false),
      updating: get(state, ["testSettingReducer", "updating"], false),
      creating: get(state, ["testSettingReducer", "creating"], false),
      userOrgId: getUserOrgId(state)
    }),
    {
      loadTestSetting: receiveTestSettingAction,
      createTestSetting: createTestSettingAction,
      updateTestSetting: updateTestSettingAction,
      setTestSettingValue: setTestSettingValueAction
    }
  )
);

export default enhance(TestSetting);

TestSetting.propTypes = {
  loadTestSetting: PropTypes.func.isRequired,
  updateTestSetting: PropTypes.func.isRequired,
  createTestSetting: PropTypes.func.isRequired,
  userOrgId: PropTypes.string.isRequired
};
