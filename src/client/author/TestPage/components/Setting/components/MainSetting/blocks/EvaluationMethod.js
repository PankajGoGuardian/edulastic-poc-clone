import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Radio, Checkbox } from "antd";

import { test } from "@edulastic/constants";

import { setMaxAttemptsAction, setSafeBroswePassword } from "../../../ducks";
import { setTestDataAction, getTestEntitySelector } from "../../../../../ducks";

import { Body, Title, Block, Description, StyledRadioGroup } from "../styled";
import FeaturesSwitch from "../../../../../../../features/components/FeaturesSwitch";
import { getUserFeatures, getUserRole } from "../../../../../../../student/Login/ducks";

const { type, evalTypes, evalTypeLabels, releaseGradeLabels } = test;

const { ASSESSMENT } = type;

class EvaluationMethod extends Component {
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
    const { windowWidth, entity, owner, isEditable } = this.props;

    const { scoringType, penalty } = entity;
    const isSmallSize = windowWidth < 993 ? 1 : 0;

    return (
      <FeaturesSwitch inputFeatures="assessmentSuperPowersEvaluationMethod" actionOnInaccessible="hidden">
        <Block id="evaluation-method" smallSize={isSmallSize}>
          <Title>Evaluation Method</Title>
          <Body smallSize={isSmallSize}>
            <StyledRadioGroup
              disabled={!owner || !isEditable}
              onChange={e => this.updateTestData("scoringType")(e.target.value)}
              value={scoringType}
            >
              {Object.keys(evalTypes).map(item => (
                <Radio value={item} key={item}>
                  {evalTypes[item]}
                </Radio>
              ))}
            </StyledRadioGroup>
            {scoringType === evalTypeLabels.PARTIAL_CREDIT && (
              <p>
                <Checkbox
                  disabled={!owner || !isEditable}
                  checked={penalty === false}
                  onChange={e => this.updateTestData("penalty")(!e.target.checked)}
                >
                  {"Don’t penalize for incorrect selection"}
                </Checkbox>
              </p>
            )}
            <Description>
              {
                "Choose if students should be awarded partial credit for their answers or not. If partial credit is allowed, then choose whether the student should be penalized for."
              }
            </Description>
          </Body>
        </Block>
      </FeaturesSwitch>
    );
  }
}

EvaluationMethod.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  setMaxAttempts: PropTypes.func.isRequired,
  setTestData: PropTypes.func.isRequired,
  owner: PropTypes.bool,
  isEditable: PropTypes.bool,
  entity: PropTypes.object.isRequired
};

EvaluationMethod.defaultProps = {
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
)(EvaluationMethod);
