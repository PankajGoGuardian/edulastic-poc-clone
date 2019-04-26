import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import PerformanceBandTable from "../PerformanceBandTable/PerformanceBandTable";

import { StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

// actions
import { receivePerformanceBandAction, updatePerformanceBandAction } from "../../ducks";

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
    const { performanceBand, loading, updating, history } = this.props;
    const showSpin = loading || updating;

    return (
      <div>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
            {showSpin && (
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
      </div>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      performanceBand: get(state, ["performanceBandReducer", "data"], []),
      loading: get(state, ["performanceBandReducer", "loading"], false),
      updating: get(state, ["performanceBandReducer", "updating"], false),
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
