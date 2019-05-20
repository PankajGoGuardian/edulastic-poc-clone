import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import PerformanceBandTable from "../PerformanceBandTable/PerformanceBandTable";

import { StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

const title = "Manage District";
const menuActive = { mainMenu: "Settings", subMenu: "Performance Bands" };

class PerformanceBand extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { loading, updating, creating, history } = this.props;
    const showSpin = loading || updating || creating;

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
            <PerformanceBandTable />
          </StyledLayout>
        </StyledContent>
      </div>
    );
  }
}

const enhance = compose(
  connect(state => ({
    loading: get(state, ["performanceBandReducer", "loading"], false),
    updating: get(state, ["performanceBandReducer", "updating"], false),
    creating: get(state, ["performanceBandReducer", "creating"], false)
  }))
);

export default enhance(PerformanceBand);
