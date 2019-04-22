import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { DistrictAdminDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";

import DistrictAdminTable from "../DistrictAdminTable/DistrictAdminTable";

const title = "Manage District";
const menuActive = { mainMenu: "Users", subMenu: "District Admin" };

class DistrictAdmin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { loading, updating, creating, deleting, history } = this.props;
    const showSpin = loading || updating || creating || deleting;

    return (
      <DistrictAdminDiv>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
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
    deleting: get(state, ["districtAdminReducer", "deleting"], false)
  }))
);

export default enhance(DistrictAdmin);

DistrictAdmin.propTypes = {
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  creating: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired
};
