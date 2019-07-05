import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { test } from "@edulastic/constants";

import { setMaxAttemptsAction, setSafeBroswePassword } from "../../../ducks";
import { setTestDataAction, getTestEntitySelector } from "../../../../../ducks";

import { Body, Title, Block, MaxAnswerChecksInput } from "../styled";
import FeaturesSwitch from "../../../../../../../features/components/FeaturesSwitch";
import { getUserFeatures, getUserRole } from "../../../../../../../student/Login/ducks";

const { type, releaseGradeLabels } = test;

const { ASSESSMENT } = type;

class MainSetting extends Component {
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

  onPerformanceBandUpdate = item => {
    const { setTestData, entity = {} } = this.props;
    const { performanceBands } = entity;
    const newPerformanceBands = {
      ...performanceBands,
      [item]: {
        ...performanceBands[item],
        isAbove: !performanceBands[item].isAbove
      }
    };
    setTestData({
      performanceBands: newPerformanceBands
    });
  };

  render() {
    const { windowWidth, entity, owner, isEditable } = this.props;

    const { maxAnswerChecks } = entity;

    const isSmallSize = windowWidth < 993 ? 1 : 0;

    return (
      <FeaturesSwitch inputFeatures="assessmentSuperPowersCheckAnswerTries" actionOnInaccessible="hidden">
        <Block id="check-answer-tries-per-question" smallSize={isSmallSize}>
          <Title>Check Answer Tries Per Question</Title>
          <Body smallSize={isSmallSize}>
            <MaxAnswerChecksInput
              disabled={!owner || !isEditable}
              onChange={e => this.updateTestData("maxAnswerChecks")(e.target.value)}
              size="large"
              value={maxAnswerChecks}
              type="number"
              min={0}
              placeholder="Number of tries"
            />
          </Body>
        </Block>
      </FeaturesSwitch>
    );
  }
}

MainSetting.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  setMaxAttempts: PropTypes.func.isRequired,
  setTestData: PropTypes.func.isRequired,
  owner: PropTypes.bool,
  isEditable: PropTypes.bool,
  entity: PropTypes.object.isRequired
};

MainSetting.defaultProps = {
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
)(MainSetting);
