import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch } from "antd/lib/index";

import { test } from "@edulastic/constants";
import { red, green, blueBorder } from "@edulastic/colors";

import { setMaxAttemptsAction, setSafeBroswePassword } from "../../../ducks";
import { setTestDataAction, getTestEntitySelector } from "../../../../../ducks";

import { InputPassword, Body, Title, Block, Description, MessageSpan } from "../styled";
import FeaturesSwitch from "../../../../../../../features/components/FeaturesSwitch";
import { getUserFeatures, getUserRole } from "../../../../../../../student/Login/ducks";

const { type, releaseGradeLabels } = test;

const { ASSESSMENT } = type;

class RequirePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputBlur: false
    };
  }

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

  handleBlur = () => {
    this.setState({ inputBlur: true });
  };

  render() {
    const { windowWidth, entity, owner, isEditable } = this.props;

    const { requirePassword, assignmentPassword } = entity;
    const isSmallSize = windowWidth < 993 ? 1 : 0;

    let validationMessage = "";

    const isPasswordValid = () => {
      const { inputBlur } = this.state;

      if (!inputBlur) return blueBorder;
      if (assignmentPassword.split(" ").length > 1) {
        validationMessage = "Password must not contain space";
        return red;
      }
      if (assignmentPassword.length >= 6 && assignmentPassword.length <= 25) {
        return green;
      }

      validationMessage = "Password is too short";
      if (assignmentPassword.length > 25) validationMessage = "Password is too long";
      return red;
    };

    return (
      <FeaturesSwitch inputFeatures="assessmentSuperPowersRequirePassword" actionOnInaccessible="hidden">
        <Block id="require-password" smallSize={isSmallSize}>
          <Title>Require Password</Title>
          <Body smallSize={isSmallSize}>
            <Switch
              disabled={!owner || !isEditable}
              defaultChecked={requirePassword}
              onChange={this.updateTestData("requirePassword")}
            />
            {requirePassword && (
              <>
                <InputPassword
                  required
                  color={isPasswordValid()}
                  onBlur={this.handleBlur}
                  onChange={e => this.updateTestData("assignmentPassword")(e.target.value)}
                  size="large"
                  value={assignmentPassword}
                  type="text"
                  placeholder="Enter Password"
                />
                {validationMessage ? <MessageSpan>{validationMessage}</MessageSpan> : ""}
              </>
            )}
            <Description>
              {
                "Require your students to type a password when opening the assessment. Password ensures that your students can access this assessment only in the classroom."
              }
            </Description>
          </Body>
        </Block>
      </FeaturesSwitch>
    );
  }
}

RequirePassword.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  setMaxAttempts: PropTypes.func.isRequired,
  setTestData: PropTypes.func.isRequired,
  owner: PropTypes.bool,
  isEditable: PropTypes.bool,
  entity: PropTypes.object.isRequired
};

RequirePassword.defaultProps = {
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
)(RequirePassword);
