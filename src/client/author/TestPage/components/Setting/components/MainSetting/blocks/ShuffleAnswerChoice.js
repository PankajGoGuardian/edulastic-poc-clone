import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch } from "antd";

import { test } from "@edulastic/constants";

import { setMaxAttemptsAction, setSafeBroswePassword } from "../../../ducks";
import { setTestDataAction, getTestEntitySelector } from "../../../../../ducks";

import { Body, Title, Block, BlueText, Description } from "../styled";
import FeaturesSwitch from "../../../../../../../features/components/FeaturesSwitch";
import { getUserFeatures, getUserRole } from "../../../../../../../student/Login/ducks";

const { type, releaseGradeLabels } = test;

const { ASSESSMENT } = type;

class ShuffleAnswerChoice extends Component {
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

    const { shuffleAnswers } = entity;
    const isSmallSize = windowWidth < 993 ? 1 : 0;

    return (
      <FeaturesSwitch inputFeatures="assessmentSuperPowersShuffleAnswerChoice" actionOnInaccessible="hidden">
        <Block id="show-answer-choice" smallSize={isSmallSize}>
          <Title>Shuffle Answer Choice</Title>
          <Body smallSize={isSmallSize}>
            <Switch
              disabled={!owner || !isEditable}
              defaultChecked={shuffleAnswers}
              onChange={this.updateTestData("shuffleAnswers")}
            />
            <Description>
              {"If set to "}
              <BlueText>ON</BlueText>
              {
                ", answer choices for multiple choice and multiple select questions will be randomly shuffled for students."
              }
              <br />
              {"Text to speech does not work when the answer choices are shuffled."}
            </Description>
          </Body>
        </Block>
      </FeaturesSwitch>
    );
  }
}

ShuffleAnswerChoice.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  setMaxAttempts: PropTypes.func.isRequired,
  setTestData: PropTypes.func.isRequired,
  owner: PropTypes.bool,
  isEditable: PropTypes.bool,
  entity: PropTypes.object.isRequired
};

ShuffleAnswerChoice.defaultProps = {
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
)(ShuffleAnswerChoice);
