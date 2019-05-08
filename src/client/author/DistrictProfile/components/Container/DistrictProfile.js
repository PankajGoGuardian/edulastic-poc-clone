import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import DistrictProfileForm from "../DistrictProfileForm/DistrictProfileForm";

import { DistrictProfileDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

// actions
import { receiveDistrictProfileAction, updateDistrictProfileAction } from "../../ducks";
import { getUserOrgId } from "../../../src/selectors/user";

const title = "Manage District";
const menuActive = { mainMenu: "District Profile", subMenu: "" };

class DistrictProfile extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { loadDistrictProfile, userOrgId } = this.props;
    loadDistrictProfile({ orgId: userOrgId });
  }

  saveDistrictProfile = data => {
    const { updateDistrictProfile } = this.props;
    const updateData = (({
      orgType,
      orgId,
      name,
      shortName,
      city,
      state,
      zip,
      nces,
      logo,
      announcement,
      pageBackground
    }) => ({ orgType, orgId, name, shortName, city, state, zip, nces, logo, announcement, pageBackground }))(data);
    updateDistrictProfile({ body: updateData });
  };

  render() {
    const { districtProfile, updating, loading, history } = this.props;

    return (
      <DistrictProfileDiv>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout>
            {(updating || loading) && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            {Object.keys(districtProfile).length > 0 && (
              <DistrictProfileForm
                districtProfile={districtProfile}
                saveDistrictProfile={this.saveDistrictProfile}
                history={history}
              />
            )}
          </StyledLayout>
        </StyledContent>
      </DistrictProfileDiv>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      districtProfile: get(state, ["districtProfileReducer", "data"], {}),
      userOrgId: getUserOrgId(state),
      updating: get(state, ["districtProfileReducer", "updating"], false),
      loading: get(state, ["districtProfileReducer", "loading"], false)
    }),
    {
      loadDistrictProfile: receiveDistrictProfileAction,
      updateDistrictProfile: updateDistrictProfileAction
    }
  )
);

export default enhance(DistrictProfile);

DistrictProfile.propTypes = {
  districtProfile: PropTypes.object.isRequired,
  loadDistrictProfile: PropTypes.func.isRequired,
  updateDistrictProfile: PropTypes.func.isRequired,
  userOrgId: PropTypes.string.isRequired
};
