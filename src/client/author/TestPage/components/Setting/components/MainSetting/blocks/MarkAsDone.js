import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { test } from "@edulastic/constants";

import { setMaxAttemptsAction, setSafeBroswePassword } from "../../../ducks";
import { setTestDataAction, getTestEntitySelector } from "../../../../../ducks";
import { Body, Title, Block, BlueText, Description, StyledRadioGroup, CompletionTypeRadio } from "../styled";
import FeaturesSwitch from "../../../../../../../features/components/FeaturesSwitch";
import { getUserFeatures, getUserRole } from "../../../../../../../student/Login/ducks";

const { completionTypes } = test;

class MarkAsDone extends Component {
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

    const { markAsDone } = entity;

    const isSmallSize = windowWidth < 993 ? 1 : 0;

    return (
      <FeaturesSwitch inputFeatures="assessmentSuperPowersMarkAsDone" actionOnInaccessible="hidden">
        <Block id="mark-as-done" smallSize={isSmallSize}>
          <Title>Mark as Done</Title>
          <Body smallSize={isSmallSize}>
            <StyledRadioGroup
              disabled={!owner || !isEditable}
              onChange={this.updateFeatures("markAsDone")}
              value={markAsDone}
            >
              {Object.keys(completionTypes).map(item => (
                <CompletionTypeRadio value={completionTypes[item]} key={completionTypes[item]}>
                  {completionTypes[item]}
                </CompletionTypeRadio>
              ))}
            </StyledRadioGroup>
            <Description>
              {"Control when class will be marked as Done. "}
              <BlueText>Automatically</BlueText>
              {" when all students are graded and due date has passed OR "}
              <BlueText>Manually</BlueText>
              {' when you click the "Mark as Done" button.'}
            </Description>
          </Body>
        </Block>
      </FeaturesSwitch>
    );
  }
}

MarkAsDone.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  setTestData: PropTypes.func.isRequired,
  owner: PropTypes.bool,
  isEditable: PropTypes.bool,
  entity: PropTypes.object.isRequired
};

MarkAsDone.defaultProps = {
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
)(MarkAsDone);
