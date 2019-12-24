import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { get, pickBy } from "lodash";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import DistrictProfileForm from "../DistrictProfileForm/DistrictProfileForm";

import { StyledLayout, DistrictProfileHeader, SubHeader, Spacer, StyledButton, ButtonText } from "./styled";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import { Layout } from "antd";

const title = "Manage District";
const menuActive = { mainMenu: "District Profile", subMenu: "" };

class DistrictProfile extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    isInputEnabled: false
  };

  handleEditClick = () => {
    this.setState(prevState => ({ ...prevState, isInputEnabled: !prevState.isInputEnabled }));
  };

  saveFormRef = node => {
    this.formRef = node;
  };

  handleFormSubmit = event => {
    event.preventDefault();

    const { childRefArr } = this.formRef;
    const { userOrgId, districtProfile, form, createDistrictProfile, updateDistrictProfile } = this.formRef.props;
    const { logo, pageBackground, name, shortName, city, state, zip, nces, announcement } = districtProfile;

    if (!childRefArr.length) return null;

    form.validateFields((errors, values) => {
      if (errors) {
        return null;
      }

      const saveDistrictData = pickBy(
        {
          orgType: "district",
          orgId: userOrgId,
          logo,
          pageBackground,
          name,
          shortName,
          city,
          state,
          zip,
          nces,
          announcement
        },
        v => v !== "" && v !== undefined
      );

      if (!districtProfile._id) {
        createDistrictProfile(saveDistrictData);
      } else {
        updateDistrictProfile(saveDistrictData);
      }
      this.setState(prevState => ({ ...prevState, isInputEnabled: !prevState.isInputEnabled }));
    });
  };

  showButtons = isInputEnabled =>
    !isInputEnabled ? (
      <Fragment>
        <StyledButton type="primary" onClick={this.handleEditClick}>
          Edit
        </StyledButton>
      </Fragment>
    ) : (
      <Fragment>
        <StyledButton type="default" onClick={this.handleEditClick}>
          <ButtonText>Cancel</ButtonText>
        </StyledButton>
        <StyledButton type="primary" onClick={this.handleFormSubmit}>
          Save
        </StyledButton>
      </Fragment>
    );

  render() {
    const { history } = this.props;
    const { isInputEnabled } = this.state;
    return (
      <FeaturesSwitch inputFeatures="manageDistrict" actionOnInaccessible="hidden">
        <Layout>
          <DistrictProfileHeader>
            <AdminHeader title={title} active={menuActive} history={history} />
          </DistrictProfileHeader>
          <SubHeader>
            <Spacer />
            {this.showButtons(isInputEnabled)}
          </SubHeader>
          <StyledLayout>
            <DistrictProfileForm isInputEnabled={isInputEnabled} wrappedComponentRef={this.saveFormRef} />
          </StyledLayout>
        </Layout>
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
