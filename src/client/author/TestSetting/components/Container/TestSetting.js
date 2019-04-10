import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
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
import { receiveTestSettingAction, updateTestSettingAction } from "../../ducks";

// selectors
import { getTestSettingSelector, getTestSettingLoadingSelector, getTestSettingUpdatingSelector } from "../../ducks";

import { getUserOrgId } from "../../../src/selectors/user";

const title = "Manage District";
const menuActive = { mainMenu: "Settings", subMenu: "Test Settings" };

class TestSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partialScore: false,
      timer: false
    };
  }

  componentDidMount() {
    const { loadTestSetting, userOrgId } = this.props;
    loadTestSetting({ orgId: userOrgId });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps._id !== this.props.testSetting._id) {
      if (nextProps.testSetting.hasOwnProperty("partialScore")) {
        this.setState({
          partialScore: nextProps.testSetting.partialScore
        });
      }
      if (nextProps.testSetting.hasOwnProperty("timer")) {
        this.setState({
          timer: nextProps.testSetting.timer
        });
      }
    }
  }

  changePartialScore = e => {
    this.setState({
      partialScore: e.target.value
    });
  };

  changeTimerScore = e => {
    this.setState({
      timer: e.target.value
    });
  };

  updateValue = () => {
    const { testSetting, updateTestSetting } = this.props;
    const { partialScore, timer } = this.state;
    const updateData = {
      body: {
        orgId: testSetting.orgId,
        orgType: testSetting.orgType,
        partialScore: partialScore,
        timer: timer
      }
    };
    updateTestSetting(updateData);
  };

  render() {
    const { testSetting, loading, updating } = this.props;

    return (
      <TestSettingDiv>
        <AdminHeader title={title} active={menuActive} />
        <StyledContent>
          <StyledLayout loading={updating || loading ? "true" : "false"}>
            {(updating || loading) && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <StyledRow>
              {testSetting.hasOwnProperty("partialScore") && (
                <React.Fragment>
                  <StyledLabel>Allow Partial Score </StyledLabel>
                  <StyledRdioGroup defaultValue={testSetting.partialScore} onChange={e => this.changePartialScore(e)}>
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false}>No</Radio>
                  </StyledRdioGroup>
                </React.Fragment>
              )}
            </StyledRow>
            <StyledRow>
              {testSetting.hasOwnProperty("timer") && (
                <React.Fragment>
                  <StyledLabel>Show Timer </StyledLabel>
                  <StyledRdioGroup defaultValue={testSetting.timer} onChange={e => this.changeTimerScore(e)}>
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false}>No</Radio>
                  </StyledRdioGroup>
                </React.Fragment>
              )}
            </StyledRow>
            <StyledRow>
              <SaveButton onClick={this.updateValue}>Save</SaveButton>
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
      testSetting: getTestSettingSelector(state),
      loading: getTestSettingLoadingSelector(state),
      updating: getTestSettingUpdatingSelector(state),
      userOrgId: getUserOrgId(state)
    }),
    {
      loadTestSetting: receiveTestSettingAction,
      updateTestSetting: updateTestSettingAction
    }
  )
);

export default enhance(TestSetting);

TestSetting.propTypes = {
  loadTestSetting: PropTypes.func.isRequired,
  updateTestSetting: PropTypes.func.isRequired,
  testSetting: PropTypes.object.isRequired,
  userOrgId: PropTypes.string.isRequired
};
