import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { DistrictAdminDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import AdminSubHeader from "../../../src/components/common/AdminSubHeader/UserSubHeader";

import DistrictAdminTable from "../DistrictAdminTable/DistrictAdminTable";

const title = "Manage District";
const menuActive = { mainMenu: "Users", subMenu: "District Admin" };

class DistrictAdmin extends Component {
  render() {
    const { loading, updating, creating, deleting, history, routeKey } = this.props;
    const showSpin = loading || updating || creating || deleting;

    // issue : click on current active tab , doesn't re-renders page, because there is no state/route change //
    // --------------------------------- implemented solution -------------------------------------------------//
    // since route key changes everytime even if we are routing from one url to itself,
    // we are setting parent component div key as router location key, so that it re-renders on change.
    return (
      <DistrictAdminDiv key={routeKey}>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
            <AdminSubHeader active={menuActive} history={history} />
            {showSpin && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <DistrictAdminTable />
          </StyledLayout>
        </StyledContent>
      </DistrictAdminDiv>
    );
  }
}

const enhance = compose(
  connect(state => ({
    loading: get(state, ["districtAdminReducer", "loading"], false),
    updating: get(state, ["districtAdminReducer", "updating"], false),
    creating: get(state, ["districtAdminReducer", "creating"], false),
    deleting: get(state, ["districtAdminReducer", "deleting"], false),
    routeKey: get(state, ["router", "location", "key"])
  }))
);

export default enhance(DistrictAdmin);

DistrictAdmin.propTypes = {
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  creating: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired
};
