import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import PerformanceBandTable from "../PerformanceBandTable/PerformanceBandTable";

import { PerformanceBandDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

// actions
import { receivePerformanceBandAction, updatePerformanceBandAction } from "../../ducks";

// selectors
import {
  getPerformanceBandSelector,
  getPerformanceBandLoadingSelector,
  getPerformanceBandUpdatingSelector
} from "../../ducks";

import { getUserOrgId } from "../../../src/selectors/user";

const title = "Manage District";
const menuActive = { mainMenu: "Settings", subMenu: "Performance Bands" };

class PerformanceBand extends Component {
  constructor(props) {
    super(props);
    this.updatePerformanceBand = this.updatePerformanceBand.bind(this);
  }

  componentDidMount() {
    const { loadPerformanceBand, userOrgId } = this.props;
    loadPerformanceBand({ orgId: userOrgId });
  }

  updatePerformanceBand = performanceBandData => {
    const data = {
      orgId: this.props.performanceBand.orgId,
      performanceBand: performanceBandData,
      orgType: this.props.performanceBand.orgType
    };
    this.props.updatePerformanceBand({ body: data });
  };

  render() {
    const { performanceBand, loading, updating } = this.props;
    const showSpin = loading || updating;

    return (
      <PerformanceBandDiv>
        <AdminHeader title={title} active={menuActive} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
            {loading && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            {Object.keys(performanceBand).length > 0 && performanceBand.performanceBand.length > 0 && (
              <PerformanceBandTable
                performanceBand={performanceBand}
                updatePerformanceBand={this.updatePerformanceBand}
              />
            )}
          </StyledLayout>
        </StyledContent>
      </PerformanceBandDiv>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      performanceBand: getPerformanceBandSelector(state),
      loading: getPerformanceBandLoadingSelector(state),
      updating: getPerformanceBandUpdatingSelector(state),
      userOrgId: getUserOrgId(state)
    }),
    {
      loadPerformanceBand: receivePerformanceBandAction,
      updatePerformanceBand: updatePerformanceBandAction
    }
  )
);

export default enhance(PerformanceBand);

PerformanceBand.propTypes = {
  loadPerformanceBand: PropTypes.func.isRequired,
  updatePerformanceBand: PropTypes.func.isRequired,
  performanceBand: PropTypes.object.isRequired,
  userOrgId: PropTypes.string.isRequired
};
