import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { setMaxAttemptsAction, setSafeBroswePassword } from "../../../ducks";
import { setTestDataAction, getTestEntitySelector } from "../../../../../ducks";
import { MaxAttempts, Body, Title, Block } from "../styled";
import { getUserFeatures, getUserRole } from "../../../../../../../student/Login/ducks";

class MaximumAttemptsAllowed extends Component {
  updateAttempt = e => {
    const { setMaxAttempts } = this.props;
    let { value = 0 } = e.target;
    if (value < 0) value = 0;
    setMaxAttempts(value);
  };

  render() {
    const { entity, owner, isEditable } = this.props;

    const { maxAttempts } = entity;

    return (
      <Block id="maximum-attempts-allowed">
        <Title>Maximum Attempts Allowed</Title>
        <Body>
          <MaxAttempts
            type="number"
            disabled={!owner || !isEditable}
            size="large"
            value={maxAttempts}
            onChange={this.updateAttempt}
            min={1}
            step={1}
          />
        </Body>
      </Block>
    );
  }
}

MaximumAttemptsAllowed.propTypes = {
  setMaxAttempts: PropTypes.func.isRequired,
  owner: PropTypes.bool,
  isEditable: PropTypes.bool,
  entity: PropTypes.object.isRequired
};

MaximumAttemptsAllowed.defaultProps = {
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
)(MaximumAttemptsAllowed);
