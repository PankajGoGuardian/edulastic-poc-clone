import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Radio } from "antd";

import { test } from "@edulastic/constants";

import { setMaxAttemptsAction, setSafeBroswePassword } from "../../../ducks";
import { setTestDataAction, getTestEntitySelector } from "../../../../../ducks";

import { Body, Title, Block, BlueText, Description, StyledRadioGroup } from "../styled";

import { getUserFeatures, getUserRole } from "../../../../../../../student/Login/ducks";

const { releaseGradeTypes } = test;

const releaseGradeKeys = ["DONT_RELEASE", "SCORE_ONLY", "WITH_RESPONSE", "WITH_ANSWERS"];

class ReleaseScores extends Component {
  constructor(props) {
    super(props);

    this._releaseGradeKeys = releaseGradeKeys;
    if (!props.features.assessmentSuperPowersReleaseScorePremium) {
      this._releaseGradeKeys = [releaseGradeKeys[0], releaseGradeKeys[3]];
    }
  }

  updateFeatures = key => e => {
    const { setTestData } = this.props;
    const featVal = e.target.value;
    this.setState({ [key]: featVal });
    setTestData({
      [key]: featVal
    });
  };

  render() {
    const { windowWidth, entity, owner, isEditable } = this.props;

    const { releaseScore } = entity;

    const isSmallSize = windowWidth < 993 ? 1 : 0;

    return (
      <Block id="release-scores" smallSize={isSmallSize}>
        <Title>Release Scores</Title>
        <Body smallSize={isSmallSize}>
          <StyledRadioGroup
            disabled={!owner || !isEditable}
            onChange={this.updateFeatures("releaseScore")}
            value={releaseScore}
          >
            {this._releaseGradeKeys.map(item => (
              <Radio value={item} key={item}>
                {releaseGradeTypes[item]}
              </Radio>
            ))}
          </StyledRadioGroup>
          <Description>
            {"Select "}
            <BlueText>ON</BlueText>
            {" for students to see their scores instantly after submission."}
            <br />
            {"Select "}
            <BlueText>OFF</BlueText>
            {" to manually control when students get to see their scores."}
          </Description>
        </Body>
      </Block>
    );
  }
}

ReleaseScores.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  setTestData: PropTypes.func.isRequired,
  features: PropTypes.object.isRequired,
  owner: PropTypes.bool,
  isEditable: PropTypes.bool,
  entity: PropTypes.object.isRequired
};

ReleaseScores.defaultProps = {
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
)(ReleaseScores);
