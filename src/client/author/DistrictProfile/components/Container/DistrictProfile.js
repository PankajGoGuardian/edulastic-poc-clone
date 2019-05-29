import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import DistrictProfileForm from "../DistrictProfileForm/DistrictProfileForm";

import { DistrictProfileDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";

const title = "Manage District";
const menuActive = { mainMenu: "District Profile", subMenu: "" };

class DistrictProfile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { updating, loading, creating, imageUploading, history } = this.props;

    return (
      <FeaturesSwitch inputFeatures="manageDistrict" actionOnInaccessible="hidden">
        <DistrictProfileDiv>
          <AdminHeader title={title} active={menuActive} history={history} />
          <StyledContent>
            <StyledLayout>
              {(updating || loading || creating || imageUploading) && (
                <SpinContainer>
                  <StyledSpin size="large" />
                </SpinContainer>
              )}
              <DistrictProfileForm />
            </StyledLayout>
          </StyledContent>
        </DistrictProfileDiv>
      </FeaturesSwitch>
    );
  }
}

const enhance = compose(
  connect(state => ({
    updating: get(state, ["districtProfileReducer", "updating"], false),
    loading: get(state, ["districtProfileReducer", "loading"], false),
    creating: get(state, ["districtProfileReducer", "creating"], false),
    imageUploading: get(state, ["districtProfileReducer", "imageUploading"], false)
  }))
);

export default enhance(DistrictProfile);
