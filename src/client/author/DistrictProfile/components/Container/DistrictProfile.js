import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import DistrictProfileForm from "../DistrictProfileForm/DistrictProfileForm";

import { DistrictProfileDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

const title = "Manage District";
const menuActive = { mainMenu: "District Profile", subMenu: "" };

class DistrictProfile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { updating, loading, creating, history } = this.props;

    return (
      <DistrictProfileDiv>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout>
            {(updating || loading || creating) && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <DistrictProfileForm />
          </StyledLayout>
        </StyledContent>
      </DistrictProfileDiv>
    );
  }
}

const enhance = compose(
  connect(state => ({
    updating: get(state, ["districtProfileReducer", "updating"], false),
    loading: get(state, ["districtProfileReducer", "loading"], false),
    creating: get(state, ["districtProfileReducer", "creating"], false)
  }))
);

export default enhance(DistrictProfile);
