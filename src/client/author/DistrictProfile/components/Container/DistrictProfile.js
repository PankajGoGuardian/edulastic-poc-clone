import { EduButton } from "@edulastic/common";
import { IconSaveNew, IconPencilEdit } from "@edulastic/icons";
import { Layout } from "antd";
import { get, pickBy } from "lodash";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { roleuser } from "@edulastic/constants";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import DistrictProfileForm from "../DistrictProfileForm/DistrictProfileForm";
import { Spacer, StyledLayout, SubHeader, DropdownWrapper } from "./styled";
import { getUserRole, getSaSchoolsSortedSelector } from "../../../src/selectors/user";
import SaSchoolSelect from "../../../src/components/common/SaSchoolSelect";
import { receiveSchoolProfileAction } from "../../ducks";
import { getSchoolAdminSettingsAccess } from "../../../DistrictPolicy/ducks";

const title = "Manage District";

class DistrictProfile extends Component {
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
    const { userOrgId, form, createDistrictProfile, updateDistrictProfile } = this.formRef.props;
    const { districtProfile } = this.formRef.state;
    const { logo, pageBackground, name, shortName, city, state, zip, nces, announcement } = districtProfile;
    const { role, schoolId, schools } = this.props;
    const selectedSchoolData = schools?.find(item => item?._id === schoolId);
    if (!childRefArr.length) return null;

    form.validateFields(errors => {
      if (errors) {
        return null;
      }
      const isSA = role === roleuser.SCHOOL_ADMIN;
      const orgType = isSA ? "institution" : "district";
      const orgId = isSA ? schoolId : userOrgId;
      const saveDistrictData = pickBy(
        {
          orgType,
          orgId,
          logo,
          pageBackground,
          name: isSA ? selectedSchoolData?.name : name,
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

  showButtons = () => (
    <DropdownWrapper>
      <SaSchoolSelect
        onChange={value => {
          this.props.loadSchoolProfile(value);
          this.setState({ isInputEnabled: false });
        }}
      />
    </DropdownWrapper>
  );

  render() {
    const { history, role, isSAlevelSettingsAccess } = this.props;
    const { isInputEnabled } = this.state;
    const menuActive = {
      mainMenu: role === roleuser.SCHOOL_ADMIN ? "School Profile" : "District Profile",
      subMenu: ""
    };
    return (
      <FeaturesSwitch
        inputFeatures={role === roleuser.SCHOOL_ADMIN ? "manageSchool" : "manageDistrict"}
        actionOnInaccessible="hidden"
      >
        <Layout>
          <AdminHeader title={title} active={menuActive} history={history}>
            {(isSAlevelSettingsAccess || role === roleuser.DISTRICT_ADMIN) &&
              (!isInputEnabled ? (
                <Fragment>
                  <EduButton type="primary" onClick={this.handleEditClick}>
                    <IconPencilEdit />
                    Edit
                  </EduButton>
                </Fragment>
              ) : (
                <Fragment>
                  <EduButton isGhost onClick={this.handleEditClick}>
                    Cancel
                  </EduButton>
                  <EduButton type="primary" onClick={this.handleFormSubmit}>
                    <IconSaveNew /> Save
                  </EduButton>
                </Fragment>
              ))}
          </AdminHeader>
          <SubHeader>
            <Spacer />
            {this.showButtons()}
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
  connect(
    state => ({
      updating: get(state, ["districtProfileReducer", "updating"], false),
      loading: get(state, ["districtProfileReducer", "loading"], false),
      creating: get(state, ["districtProfileReducer", "creating"], false),
      imageUploading: get(state, ["districtProfileReducer", "imageUploading"], false),
      role: getUserRole(state),
      schoolId: get(state, "user.saSettingsSchool"),
      schools: getSaSchoolsSortedSelector(state),
      isSAlevelSettingsAccess: getSchoolAdminSettingsAccess(state)
    }),
    {
      loadSchoolProfile: receiveSchoolProfileAction
    }
  )
);

export default enhance(DistrictProfile);
