import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { roleuser } from "@edulastic/constants";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";

import SaSchoolSelect from "../../../src/components/common/SaSchoolSelect";

import AdminSubHeader from "../../../src/components/common/AdminSubHeader/SettingSubHeader";

import DistrictPolicyForm from "../DistrictPolicyForm/DistrictPolicyForm";
import { DistrictPolicyDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";
import { getUserRole } from "../../../src/selectors/user";
import { getSchoolAdminSettingsAccess } from "../../ducks";

const title = "Manage District";

class DistrictPolicy extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { loading, updating, creating, history, schoolLevelAdminSettings, role } = this.props;
    const showSpin = loading || updating || creating;
    const showSettings =
      (role === roleuser.SCHOOL_ADMIN && schoolLevelAdminSettings) || role === roleuser.DISTRICT_ADMIN;
    const menuActive = {
      mainMenu: "Settings",
      subMenu: role === roleuser.DISTRICT_ADMIN ? "District Policies" : "School Policies"
    };

    return (
      <DistrictPolicyDiv>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          {showSettings && (
            <StyledLayout showSpin={loading ? "true" : "false"}>
              <AdminSubHeader active={menuActive} history={history} />
              {showSpin && (
                <SpinContainer>
                  <StyledSpin size="large" />
                </SpinContainer>
              )}
              <SaSchoolSelect />
              <DistrictPolicyForm />
            </StyledLayout>
          )}
        </StyledContent>
      </DistrictPolicyDiv>
    );
  }
}

const enhance = compose(
  connect(state => ({
    loading: get(state, ["districtPolicyReducer", "loading"], []),
    updating: get(state, ["districtPolicyReducer", "updating"], []),
    creating: get(state, ["districtPolicyReducer", "creating"], []),
    schoolLevelAdminSettings: getSchoolAdminSettingsAccess(state),
    role: getUserRole(state)
  }))
);

export default enhance(DistrictPolicy);
