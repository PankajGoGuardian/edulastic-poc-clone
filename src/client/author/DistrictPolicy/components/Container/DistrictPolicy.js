import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import DistrictPolicyForm from "../DistrictPolicyForm/DistrictPolicyForm";
import { DistrictPolicyDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

const title = "Manage District";
const menuActive = { mainMenu: "Settings", subMenu: "District Policies" };

class DistrictPolicy extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { loading, updating, creating, history } = this.props;
    const showSpin = loading || updating || creating;
    return (
      <DistrictPolicyDiv>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout showSpin={loading ? "true" : "false"}>
            {showSpin && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <DistrictPolicyForm />
          </StyledLayout>
        </StyledContent>
      </DistrictPolicyDiv>
    );
  }
}

const enhance = compose(
  connect(state => ({
    loading: get(state, ["districtPolicyReducer", "loading"], []),
    updating: get(state, ["districtPolicyReducer", "updating"], []),
    creating: get(state, ["districtPolicyReducer", "creating"], [])
  }))
);

export default enhance(DistrictPolicy);
