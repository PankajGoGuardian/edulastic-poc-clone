import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch } from "antd";

import { test } from "@edulastic/constants";

import { setMaxAttemptsAction, setSafeBroswePassword } from "../../../ducks";
import { setTestDataAction, getTestEntitySelector } from "../../../../../ducks";

import { InputPassword, Body, Title, Block, Description } from "../styled";
import FeaturesSwitch from "../../../../../../../features/components/FeaturesSwitch";
import { getUserFeatures, getUserRole } from "../../../../../../../student/Login/ducks";

const { type, releaseGradeLabels } = test;

const { ASSESSMENT } = type;

class RequireSafeExamBrowser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPassword: false
    };
  }

  handleShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  setPassword = e => {
    const { setSafePassword } = this.props;
    setSafePassword(e.target.value);
  };

  updateTestData = key => value => {
    const { setTestData, setMaxAttempts } = this.props;
    switch (key) {
      case "testType":
        if (value === ASSESSMENT) {
          setMaxAttempts(1);
          setTestData({
            releaseScore: releaseGradeLabels.DONT_RELEASE,
            maxAnswerChecks: 0
          });
        } else {
          setMaxAttempts(3);
          setTestData({
            releaseScore: releaseGradeLabels.WITH_ANSWERS,
            maxAnswerChecks: 3
          });
        }
        break;
      case "scoringType":
        setTestData({
          penalty: false
        });
        break;
      case "safeBrowser":
        if (!value)
          setTestData({
            sebPassword: ""
          });
        break;
      case "maxAnswerChecks":
        if (value < 0) value = 0;
        break;
      default:
        return null;
    }
    setTestData({
      [key]: value
    });
  };

  render() {
    const { showPassword } = this.state;
    const { windowWidth, entity, owner, isEditable } = this.props;

    const { safeBrowser, sebPassword } = entity;

    const isSmallSize = windowWidth < 993 ? 1 : 0;

    return (
      <FeaturesSwitch inputFeatures="assessmentSuperPowersRequireSafeExamBrowser" actionOnInaccessible="hidden">
        <Block id="require-safe-exame-browser" smallSize={isSmallSize}>
          <Title>Require Safe Exam Browser</Title>
          <Body smallSize={isSmallSize}>
            <Switch
              disabled={!owner || !isEditable}
              defaultChecked={safeBrowser}
              onChange={this.updateTestData("safeBrowser")}
            />
            {safeBrowser && (
              <InputPassword
                disabled={!owner || !isEditable}
                prefix={<i className={`fa fa-eye${showPassword ? "-slash" : ""}`} onClick={this.handleShowPassword} />}
                onChange={this.setPassword}
                size="large"
                value={sebPassword}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
              />
            )}
            <Description>
              {
                "Ensure secure testing environment by using Safe Exam Browser to lockdown the student's device. To use this feature Safe Exam Browser (on Windows/Mac only) must be installed."
              }
            </Description>
          </Body>
        </Block>
      </FeaturesSwitch>
    );
  }
}

RequireSafeExamBrowser.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  setMaxAttempts: PropTypes.func.isRequired,
  setTestData: PropTypes.func.isRequired,
  setSafePassword: PropTypes.func.isRequired,
  owner: PropTypes.bool,
  isEditable: PropTypes.bool,
  entity: PropTypes.object.isRequired
};

RequireSafeExamBrowser.defaultProps = {
  owner: false,
  isEditable: false
};

export default connect(
  state => ({
    entity: getTestEntitySelector(state),
    features: getUserFeatures(state),
    userRole: getUserRole(state)
  }),
  {
    setMaxAttempts: setMaxAttemptsAction,
    setSafePassword: setSafeBroswePassword,
    setTestData: setTestDataAction
  }
)(RequireSafeExamBrowser);
