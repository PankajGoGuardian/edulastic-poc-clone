import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { SchoolAdminDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";

import SchoolAdminTable from "../SchoolAdminTable/SchoolAdminTable";

const title = "Manage District";
const menuActive = { mainMenu: "Users", subMenu: "School Admin" };

class SchoolAdmin extends Component {
  render() {
    const { loading, updating, creating, deleting, history } = this.props;
    const showSpin = loading || updating || creating || deleting;

    return (
      <SchoolAdminDiv>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
            {showSpin && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <SchoolAdminTable />
          </StyledLayout>
        </StyledContent>
      </SchoolAdminDiv>
    );
  }
}

const enhance = compose(
  connect(state => ({
    loading: get(state, ["schoolAdminReducer", "loading"], false),
    updating: get(state, ["schoolAdminReducer", "updating"], false),
    creating: get(state, ["schoolAdminReducer", "creating"], false),
    deleting: get(state, ["schoolAdminReducer", "deleting"], false)
  }))
);

export default enhance(SchoolAdmin);

SchoolAdmin.propTypes = {
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  creating: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired
};
