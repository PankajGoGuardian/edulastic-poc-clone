import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Radio } from "antd";

import { test } from "@edulastic/constants";

import { setMaxAttemptsAction, setSafeBroswePassword } from "../../../ducks";
import { setTestDataAction, getTestEntitySelector } from "../../../../../ducks";

import { Body, Title, Block, Description, StyledRadioGroup } from "../styled";
import FeaturesSwitch from "../../../../../../../features/components/FeaturesSwitch";
import { getUserFeatures, getUserRole } from "../../../../../../../student/Login/ducks";

const { calculators, calculatorKeys } = test;

class ShowCalculator extends Component {
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

    const { calcType } = entity;

    const isSmallSize = windowWidth < 993 ? 1 : 0;

    return (
      <FeaturesSwitch inputFeatures="assessmentSuperPowersShowCalculator" actionOnInaccessible="hidden">
        <Block id="show-calculator" smallSize={isSmallSize}>
          <Title>Show Calculator</Title>
          <Body smallSize={isSmallSize}>
            <StyledRadioGroup
              disabled={!owner || !isEditable}
              onChange={this.updateFeatures("calcType")}
              value={calcType}
            >
              {calculatorKeys.map(item => (
                <Radio value={item} key={item}>
                  {calculators[item]}
                </Radio>
              ))}
            </StyledRadioGroup>
            <Description>
              {
                "Choose if student can use a calculator, also select the type of calculator that would be shown to the students."
              }
            </Description>
          </Body>
        </Block>
      </FeaturesSwitch>
    );
  }
}

ShowCalculator.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  setTestData: PropTypes.func.isRequired,
  owner: PropTypes.bool,
  isEditable: PropTypes.bool,
  entity: PropTypes.object.isRequired
};

ShowCalculator.defaultProps = {
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
)(ShowCalculator);
