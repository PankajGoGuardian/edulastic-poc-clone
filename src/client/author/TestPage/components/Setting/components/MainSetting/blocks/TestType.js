import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Select } from "antd";

import { test } from "@edulastic/constants";

import { setMaxAttemptsAction, setSafeBroswePassword } from "../../../ducks";
import { setTestDataAction, getTestEntitySelector } from "../../../../../ducks";

import { Body, Title, Block, TestTypeSelect } from "../styled";

import { getUserFeatures, getUserRole } from "../../../../../../../student/Login/ducks";

const { type, releaseGradeLabels } = test;

const { Option } = Select;

const { ASSESSMENT, PRACTICE } = type;

const testTypes = {
  [ASSESSMENT]: "Asessment",
  [PRACTICE]: "Practice"
};

class TestType extends Component {
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
    const { windowWidth, entity, owner, userRole, isEditable = false } = this.props;

    const { testType } = entity;

    const isSmallSize = windowWidth < 993 ? 1 : 0;

    return (
      <Block id="test-type" smallSize={isSmallSize}>
        <Row>
          <Title>Test Type</Title>
          <Body smallSize={isSmallSize}>
            <TestTypeSelect
              defaultValue={testType}
              disabled={!owner || !isEditable}
              onChange={this.updateTestData("testType")}
            >
              {Object.keys(testTypes).map(key => (
                <Option key={key} value={key}>
                  {key === ASSESSMENT
                    ? userRole === "teacher"
                      ? "Class Assessment "
                      : "Common Assessment "
                    : testTypes[key]}
                </Option>
              ))}
            </TestTypeSelect>
          </Body>
        </Row>
      </Block>
    );
  }
}

TestType.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  setMaxAttempts: PropTypes.func.isRequired,
  setTestData: PropTypes.func.isRequired,
  owner: PropTypes.bool,
  isEditable: PropTypes.bool,
  entity: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired
};

TestType.defaultProps = {
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
)(TestType);
