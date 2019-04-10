import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import DistrictPolicyForm from "../DistrictPolicyForm/DistrictPolicyForm";

import { DistrictPolicyDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

// actions
import { receiveDistrictPolicyAction, updateDistrictPolicyAction } from "../../ducks";
// selectors
import { getDistrictPolicySelector, getDistrictPolicyLoadingSelector } from "../../ducks";

import { getUserOrgId } from "../../../src/selectors/user";

const title = "Manage District";
const menuActive = { mainMenu: "Settings", subMenu: "District Policies" };

class DistrictPolicy extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { loadDistrictPolicy, userOrgId } = this.props;
    loadDistrictPolicy({ orgId: userOrgId });
  }

  saveDistrictPolicy = data => {
    const { updateDistrictPolicy } = this.props;
    updateDistrictPolicy({
      body: data
    });
  };

  render() {
    const { districtPolicy, loading } = this.props;

    return (
      <DistrictPolicyDiv>
        <AdminHeader title={title} active={menuActive} />
        <StyledContent>
          <StyledLayout loading={loading ? "true" : "false"}>
            {loading && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            {Object.keys(districtPolicy).length > 0 && (
              <DistrictPolicyForm districtPolicy={districtPolicy} saveDistrictPolicy={this.saveDistrictPolicy} />
            )}
          </StyledLayout>
        </StyledContent>
      </DistrictPolicyDiv>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      districtPolicy: getDistrictPolicySelector(state),
      loading: getDistrictPolicyLoadingSelector(state),
      userOrgId: getUserOrgId(state)
    }),
    {
      loadDistrictPolicy: receiveDistrictPolicyAction,
      updateDistrictPolicy: updateDistrictPolicyAction
    }
  )
);

export default enhance(DistrictPolicy);

DistrictPolicy.propTypes = {
  loadDistrictPolicy: PropTypes.func.isRequired,
  updateDistrictPolicy: PropTypes.func.isRequired,
  districtPolicy: PropTypes.object.isRequired,
  userOrgId: PropTypes.string.isRequired
};
