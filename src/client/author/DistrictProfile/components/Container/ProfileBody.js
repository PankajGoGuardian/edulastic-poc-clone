import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import produce from "immer";
import { omit, map, isEqual } from "lodash";
import { Layout, Form, Input, Button, Icon, Select, Tag } from "antd";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import {
  extraDesktopWidth,
  largeDesktopWidth,
  desktopWidth,
  borders,
  backgrounds,
  themeColor,
  title,
  red,
  fadedGreen,
  mobileWidthMax,
  white,
  mobileWidthLarge
} from "@edulastic/colors";
import { userApi } from "@edulastic/api";
import {
  resetMyPasswordAction,
  updateUserDetailsAction,
  deleteAccountAction,
  updateInterestedCurriculumsAction,
  removeSchoolAction,
  removeInterestedCurriculumsAction
} from "../../../../student/Login/ducks";
import { Wrapper } from "../../../../student/styled/index";
import DeleteAccountModal from "../DeleteAccountModal/DeleteAccountModal";
import DeleteSchoolModal from "../DeleteSchoolModal/DeleteSchoolModal";
import EmailConfirmModal from "../EmailConfirmModal/EmailConfirmModal";
import StandardSetModal from "../../../InterestedStandards/components/StandardSetsModal/StandardSetsModal";
import { getCurriculumsListSelector } from "../../../src/selectors/dictionaries";
import { getDictCurriculumsAction } from "../../../src/actions/dictionaries";
import Photo from "./Photo";

const FormItem = Form.Item;
class ProfileBody extends React.Component {
  state = {
    confirmDirty: false,
    showChangePassword: false,
    isEditProfile: false,
    showModal: false,
    selectedSchool: null,
    showDeleteSchoolModal: false,
    showStandardSetsModal: false,
    showEmailConfirmModal: false,
    showSaveStandSetsBtn: false,
    interestedCurriculums: []
  };

  static getDerivedStateFromProps(props, state) {
    const { interestedCurriculums } = props.user.orgData;
    if (!state.showSaveStandSetsBtn && !isEqual(interestedCurriculums, state.interestedCurriculums)) {
      return {
        interestedCurriculums: interestedCurriculums
      };
    }
    return null;
  }

  handleSubmit = e => {
    const { form, user } = this.props;
    const { showChangePassword, isEditProfile } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const isnotNormalLogin = !!user.googleId || !!user.canvasId || !!user.cliId || !!user.cleverId || !!user.msoId;

        if (
          isnotNormalLogin ||
          (isEditProfile && values.email === user.email) ||
          (!isEditProfile && showChangePassword)
        ) {
          this.handleUpdateDetails(false);
        } else {
          this.setState({ showEmailConfirmModal: true });
        }
      }
    });
  };

  handleChangeEmail = () => {
    this.handleUpdateDetails(true);
  };

  handleUpdateDetails(isLogout) {
    const {
      form: { getFieldValue },
      user,
      updateUserDetails
    } = this.props;
    const { showChangePassword, isEditProfile } = this.state;
    const isnotNormalLogin = !!user.googleId || !!user.canvasId || !!user.cliId || !!user.cleverId || !!user.msoId;

    var data = {
      districtId: user.districtId,
      email: isEditProfile && !isnotNormalLogin ? getFieldValue("email") : user.email,
      firstName: isEditProfile ? getFieldValue("firstName") : user.firstName,
      lastName: isEditProfile ? getFieldValue("lastName") : user.lastName,
      title: isEditProfile ? getFieldValue("title") : user.title
    };
    if (showChangePassword) data["password"] = getFieldValue("password");

    updateUserDetails({
      data,
      userId: user._id,
      isLogout: isLogout
    });
    this.setState({ showEmailConfirmModal: false, isEditProfile: false, showChangePassword: false });
  }

  handleCancel = e => {
    e.preventDefault();
    this.setState({ isEditProfile: false, showChangePassword: false });
  };

  handleConfirmBlur = ({ target: { value } }) => {
    let { confirmDirty } = this.state;
    confirmDirty = confirmDirty || !!value;
    this.setState({ confirmDirty });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form, t } = this.props;
    if (value && value.length < 4) callback(t("common.title.confirmPasswordLengthErrorMessage"));
    else if (value && value !== form.getFieldValue("password")) callback(t("common.title.confirmPasswordMess"));
    else callback();
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form, t } = this.props;
    const { confirmDirty } = this.state;
    if (value && confirmDirty) {
      form.validateFields(["confirmPassword"], { force: true });
    }
    if (value && value.length < 4) callback(t("common.title.passwordLengthErrorMessage"));
    callback();
  };

  toggleModal = (modalType, value) => {
    if (modalType === "DELETE_ACCOUNT") this.setState({ showModal: value });
    else if (modalType === "REMOVE_SCHOOL") this.setState({ showDeleteSchoolModal: value, selectedSchool: null });
    else if (modalType === "EMAIL_CONFIRM") this.setState({ showEmailConfirmModal: false, isEditProfile: false });
  };

  hideMyStandardSetsModal = () => {
    this.setState({ showStandardSetsModal: false });
  };

  updateMyStandardSets = updatedStandards => {
    const { curriculums, updateInterestedCurriculums, user } = this.props;

    const curriculumsData = [];
    for (let i = 0; i < updatedStandards.length; i++) {
      const selStandards = curriculums.filter(item => item.curriculum === updatedStandards[i]);
      curriculumsData.push({
        _id: selStandards[0]._id,
        name: selStandards[0].curriculum,
        subject: selStandards[0].subject,
        grades: selStandards[0].grades
      });
    }

    const standardsData = {
      orgId: user._id,
      orgType: "teacher",
      curriculums: curriculumsData
    };

    updateInterestedCurriculums(standardsData);
    this.hideMyStandardSetsModal();
  };

  handleSaveStandardSets = () => {
    const { updateInterestedCurriculums, user } = this.props;
    const { interestedCurriculums } = this.state;

    const updatedInterestedCurriculums = map(interestedCurriculums, obj => omit(obj, ["orgType"]));

    const standardsData = {
      orgId: user._id,
      orgType: "teacher",
      curriculums: updatedInterestedCurriculums
    };

    updateInterestedCurriculums(standardsData);
    this.setState({ showSaveStandSetsBtn: false });
  };

  removeStandardSet = id => {
    this.setState({ showSaveStandSetsBtn: true });

    const updatedState = produce(this.state, draft => {
      draft.interestedCurriculums = draft.interestedCurriculums.filter(e => e._id != id);
    });

    const updatedInterestedCurriculums = updatedState.interestedCurriculums;
    this.setState({ interestedCurriculums: updatedInterestedCurriculums });
  };

  deleteProfile = () => {
    const { deleteAccount, user } = this.props;
    this.toggleModal("DELETE_ACCOUNT", false);
    deleteAccount(user._id);
  };

  getSchoolList = () => {
    const { user } = this.props;
    const schools = user.orgData.schools.map(school => (
      <StyledTag id={school._id}>
        {school.name}
        <Icon
          type="close"
          onClick={e => {
            if (user.orgData.schools.length > 1) this.setState({ selectedSchool: school, showDeleteSchoolModal: true });
          }}
        />
      </StyledTag>
    ));
    return schools;
  };

  getStandardSets = () => {
    const { user } = this.props;
    const { interestedCurriculums } = this.state;
    const curriculums = interestedCurriculums.map(curriculum => (
      <StyledTag id={curriculum._id}>
        {curriculum.name}
        <Icon type="close" onClick={() => this.removeStandardSet(curriculum._id)} />
      </StyledTag>
    ));
    return curriculums;
  };

  handleRemoveSchool = e => {
    const { selectedSchool } = this.state;
    const { removeSchool, user } = this.props;
    removeSchool({
      userId: user._id,
      schoolId: selectedSchool._id
    });
    this.toggleModal("REMOVE_SCHOOL", false);
  };

  handleSelectStandardButton = e => {
    const { getDictCurriculums } = this.props;
    getDictCurriculums();
    this.setState({ showStandardSetsModal: true });
  };

  checkUser = async (rule, value, callback) => {
    const { user, t } = this.props;

    if (value !== user.email) {
      const result = await userApi.checkUser({
        username: value,
        districtId: user.districtId
      });

      if (result.length > 0) callback(t("common.title.emailAlreadyExistsMessage"));
    }
    callback();
  };

  getEditProfileContent = () => {
    const {
      t,
      user,
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Details>
        <DetailRow padding="15px 0px">
          <DetailTitle>{t("common.title.userTitleLabel")}</DetailTitle>
          <DetailData>
            <InputItemWrapper>
              {getFieldDecorator("title", {
                initialValue: user.title
              })(
                <TitleSelect>
                  <Option value="Mr.">Mr.</Option>
                  <Option value="Mrs.">Mrs.</Option>
                  <Option value="Ms.">Ms.</Option>
                  <Option value="Dr.">Dr.</Option>
                </TitleSelect>
              )}
            </InputItemWrapper>{" "}
          </DetailData>
        </DetailRow>
        <DetailRow padding="15px 0px">
          <DetailTitle>{t("common.title.firstNameInputLabel")}</DetailTitle>
          <DetailData>
            <InputItemWrapper>
              {getFieldDecorator("firstName", {
                initialValue: user.firstName,
                rules: [
                  {
                    required: true,
                    message: t("common.title.firstName")
                  }
                ]
              })(<Input type="text" />)}
            </InputItemWrapper>{" "}
          </DetailData>
        </DetailRow>
        <DetailRow padding="15px 0px">
          <DetailTitle>{t("common.title.lastNameInputLabel")}</DetailTitle>
          <DetailData>
            <InputItemWrapper>
              {getFieldDecorator("lastName", {
                initialValue: user.lastName
              })(<Input type="text" />)}
            </InputItemWrapper>{" "}
          </DetailData>
        </DetailRow>
        <DetailRow>
          <DetailTitle>{t("common.title.emailUsernameLabel")}</DetailTitle>
          {user.googleId || user.canvasId || user.cliId || user.cleverId || !!user.msoId ? (
            <DetailData>{user.email}</DetailData>
          ) : (
            <DetailData>
              <InputItemWrapper>
                {getFieldDecorator("email", {
                  initialValue: user.email,
                  rules: [
                    { validator: this.checkUser },
                    { required: true, message: t("common.title.invalidEmailMessage") },
                    {
                      // validation so that no white spaces are allowed
                      message: t("common.title.invalidEmailMessage"),
                      pattern: /^\S*$/
                    },
                    { max: 256, message: t("common.title.emailLengthMessage") }
                  ]
                })(<Input type="text" />)}
              </InputItemWrapper>{" "}
            </DetailData>
          )}
        </DetailRow>
      </Details>
    );
  };

  render() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    const { flag, t, user, curriculums } = this.props;
    const {
      showChangePassword,
      isEditProfile,
      showModal,
      selectedSchool,
      showDeleteSchoolModal,
      showStandardSetsModal,
      showEmailConfirmModal,
      showSaveStandSetsBtn
    } = this.state;

    const interestedStaData = {
      curriculums: user.orgData.interestedCurriculums
    };
    return (
      <LayoutContent flag={flag}>
        <ProfileWrapper display="flex" bgColor="#f0f2f5" boxShadow="none" minHeight="max-content">
          <ProfileImgWrapper>
            <Photo user={user} />
          </ProfileImgWrapper>
          <RightContainer>
            <ProfileContentWrapper>
              <UserDetail>
                <SubHeader>
                  <Title>Instructor Information</Title>
                  {!isEditProfile && ["teacher", "district-admin", "school-admin"].includes(user.role) ? (
                    <>
                      <EditProfileButton
                        type="primary"
                        onClick={() => {
                          this.setState({ isEditProfile: true });
                        }}
                      >
                        <Icon type="edit" theme="filled" />
                        {t("common.title.editProfile")}
                      </EditProfileButton>
                      <DeleteAccountButton
                        onClick={() => {
                          this.setState({ showModal: true });
                        }}
                      >
                        <Icon type="close" />
                        {t("common.title.deleteAccount")}
                      </DeleteAccountButton>
                    </>
                  ) : null}
                </SubHeader>
                {!isEditProfile ? (
                  <Details>
                    <DetailRow>
                      <DetailTitle>{t("common.title.userTitleLabel")}</DetailTitle>
                      <DetailData>{user.title || "Title"}</DetailData>
                    </DetailRow>
                    <DetailRow>
                      <DetailTitle>{t("common.title.firstNameInputLabel")}</DetailTitle>
                      <DetailData>{user.firstName}</DetailData>
                    </DetailRow>
                    <DetailRow>
                      <DetailTitle>{t("common.title.lastNameInputLabel")}</DetailTitle>
                      <DetailData>{user.lastName || ""}</DetailData>
                    </DetailRow>
                    <DetailRow>
                      <DetailTitle>{t("common.title.emailUsernameLabel")}</DetailTitle>
                      <DetailData>{user.email}</DetailData>
                    </DetailRow>
                  </Details>
                ) : (
                  this.getEditProfileContent()
                )}
              </UserDetail>
              <ChangePasswordToggleButton
                onClick={() => {
                  this.setState({ showChangePassword: !showChangePassword });
                }}
              >
                <span>CHANGE PASSWORD</span>
                <Icon type={showChangePassword ? "caret-up" : "caret-down"} />
              </ChangePasswordToggleButton>

              {showChangePassword && (
                <FormWrapper>
                  <FormItemWrapper>
                    <Label>{t("common.title.newPasswordLabel")}</Label>
                    {getFieldDecorator("password", {
                      rules: [
                        {
                          required: true,
                          message: t("common.title.password")
                        },
                        {
                          validator: this.validateToNextPassword
                        }
                      ]
                    })(<Input type="password" />)}
                  </FormItemWrapper>{" "}
                  <FormItemWrapper>
                    <Label>{t("common.title.confirmPaswswordLabel")}</Label>
                    {getFieldDecorator("confirmPassword", {
                      rules: [
                        {
                          required: true,
                          message: t("common.title.password")
                        },
                        {
                          validator: this.compareToFirstPassword
                        }
                      ]
                    })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
                  </FormItemWrapper>{" "}
                </FormWrapper>
              )}
              {(isEditProfile || showChangePassword) && (
                <FormButtonWrapper>
                  <FormItem>
                    <SaveButton type="primary" onClick={this.handleSubmit}>
                      {t("common.title.save")}
                    </SaveButton>
                    <CancelButton type="primary" ghost onClick={this.handleCancel}>
                      {t("common.title.cancel")}
                    </CancelButton>
                  </FormItem>
                </FormButtonWrapper>
              )}
            </ProfileContentWrapper>

            {user.role.toUpperCase() === "TEACHER" && (
              <>
                <SchoolWrapper>
                  <SchoolLabel>My Schools</SchoolLabel>
                  <SchoolListWrapper>{this.getSchoolList()}</SchoolListWrapper>
                </SchoolWrapper>
                <SchoolWrapper>
                  <StandardSetsLabel>Standard Sets</StandardSetsLabel>
                  <StandardSetsList>{this.getStandardSets()}</StandardSetsList>
                  <StandardSetsButtons>
                    {showSaveStandSetsBtn && (
                      <SaveStandardSetsBtn onClick={this.handleSaveStandardSets}>SAVE</SaveStandardSetsBtn>
                    )}
                    <SelectSetsButton onClick={this.handleSelectStandardButton} type="primary">
                      Select your standard sets
                    </SelectSetsButton>
                  </StandardSetsButtons>
                </SchoolWrapper>
              </>
            )}
          </RightContainer>
        </ProfileWrapper>
        {showModal && (
          <DeleteAccountModal visible={showModal} toggleModal={this.toggleModal} deleteProfile={this.deleteProfile} />
        )}
        {showDeleteSchoolModal && (
          <DeleteSchoolModal
            visible={showDeleteSchoolModal}
            toggleModal={this.toggleModal}
            removeSchool={this.handleRemoveSchool}
            selectedSchool={selectedSchool}
          />
        )}
        {showStandardSetsModal && (
          <StandardSetModal
            modalVisible={showStandardSetsModal}
            saveMyStandardsSet={this.updateMyStandardSets}
            closeModal={this.hideMyStandardSetsModal}
            standardList={curriculums}
            interestedStaData={interestedStaData}
          />
        )}
        {showEmailConfirmModal && (
          <EmailConfirmModal
            visible={showEmailConfirmModal}
            toggleModal={this.toggleModal}
            changeEmail={this.handleChangeEmail}
          />
        )}
      </LayoutContent>
    );
  }
}

const enhance = compose(
  React.memo,
  withNamespaces("profile"),
  Form.create(),
  connect(
    state => ({
      flag: state.ui.flag,
      user: state.user.user,
      curriculums: getCurriculumsListSelector(state)
    }),
    {
      resetMyPassword: resetMyPasswordAction,
      updateUserDetails: updateUserDetailsAction,
      deleteAccount: deleteAccountAction,
      updateInterestedCurriculums: updateInterestedCurriculumsAction,
      getDictCurriculums: getDictCurriculumsAction,
      removeSchool: removeSchoolAction,
      removeInterestedCurriculum: removeInterestedCurriculumsAction
    }
  )
);

export default enhance(ProfileBody);

ProfileBody.propTypes = {
  flag: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

const LayoutContent = styled(Layout.Content)`
  width: 100%;
`;

const ProfileWrapper = styled(Wrapper)`
  padding: 30px;
  margin: 0px;
  @media screen and (max-width: ${mobileWidthMax}) {
    padding: 20px;
  }
`;

const RightContainer = styled.div`
  width: calc(100% - 370px);

  @media (max-width: ${largeDesktopWidth}) {
    width: calc(100% - 270px);
  }
  @media (max-width: ${mobileWidthMax}) {
    width: 100%;
  }
`;

const ProfileContentWrapper = styled.div`
  width: 100%;
  background-color: ${white};
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 30px;
  overflow: hidden;
`;

const SchoolWrapper = styled(ProfileContentWrapper)`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const SchoolLabel = styled.span`
  font-weight: 600;
  font-size: 16px;
  min-width: 150px;
`;

const StandardSetsLabel = styled(SchoolLabel)``;

const SchoolListWrapper = styled.span`
  display: flex;
  display: inline-block;
`;

const StandardSetsList = styled(SchoolListWrapper)`
  width: 100%;
  margin-bottom: 5px;
`;

const StandardSetsButtons = styled.div`
  float: right;
`;

const StyledTag = styled(Tag)`
  background-color: ${fadedGreen};
  color: ${themeColor};
  border: none;
  font-weight: 600;
  padding: 2px 5px 2px 10px;
  margin: 5px;
  white-space: normal;
  i {
    color: ${themeColor} !important;
    margin-left: 10px !important;
  }
`;

const UserDetail = styled.div``;

const SubHeader = styled.div`
  overflow: hidden;
`;

const Title = styled.h3`
  color: ${title};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  float: left;
`;

const ProfileImgWrapper = styled.div`
  width: 350px;
  height: 300px;
  position: relative;
  background-color: ${white};
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${largeDesktopWidth}) {
    width: 250px;
    height: 200px;
  }
  @media (max-width: ${mobileWidthMax}) {
    display: none;
  }
`;

const Details = styled.div`
  padding: 30px 20px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0px 20px;
`;

const DetailTitle = styled.span`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  font-weight: 600;
  width: 150px;
  display: inline-block;
`;
const DetailData = styled.span`
  font-size: 14px;
  color: grey;
  display: inline-block;
  width: calc(100% - 150px);
`;

const Label = styled.label`
  text-transform: uppercase;
`;

const ChangePasswordToggleButton = styled.div`
  color: ${themeColor};
  padding-left: 20px;
  cursor: pointer;
  width: fit-content;
  span {
    margin-right: 20px;
    font-weight: 600;
  }
`;

const FormWrapper = styled(Form)`
  width: 100%;
  text-align: left;
  padding: 30px 20px 5px;
  display: flex;
  justify-content: space-between;

  .ant-input {
    height: 40px;
    background: ${backgrounds.primary};
    border: 1px solid ${borders.secondary};
    padding: 0 15px;
  }

  @media (max-width: ${desktopWidth}) {
    width: 100%;
    flex-direction: column;
  }
`;

const FormItemWrapper = styled(FormItem)`
  width: calc(50% - 10px);
  display: inline-block;
  label {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
    font-weight: 600;
  }
  .ant-form-explain {
    font-size: 12px;
  }
`;

const TitleSelect = styled(Select)`
  min-width: 100px;
`;

const InputItemWrapper = styled(FormItem)`
  width: 50%;
  display: inline-block;
  margin-bottom: 0 !important;
  .ant-form-explain {
    font-size: 12px;
  }
  .ant-input {
    height: 40px;
    background: ${backgrounds.primary};
    border: 1px solid ${borders.secondary};
    padding: 0 24px;
  }
  .ant-select {
    width:100%
    height: 40px;
  }
  .ant-select-selection{
    background: ${backgrounds.primary};
  }
  .ant-select-selection__rendered{
    line-height:40px;
    margin: 0 24px !important;
  }
  
  @media (max-width: ${mobileWidthLarge}) {
    width: 100%;
    display: block;
  }
`;

const FormButtonWrapper = styled.div`
  text-align: center;
  float: right;
  padding-right: 20px;
`;

const EditProfileButton = styled(Button)`
  height: 40px;
  margin-left: 15px;
  background: ${themeColor};
  border-color: ${themeColor};
  font-size: 11px;
  color: ${white};
  text-transform: uppercase;
  float: right;
  font-weight: 600;
  padding: 0px 30px;
  i {
    font-size: 14px;
  }

  @media (max-width: ${extraDesktopWidth}) {
    height: 36px;
  }
  @media (max-width: ${largeDesktopWidth}) {
    padding: 0px 15px;
  }
  @media (max-width: ${desktopWidth}) {
    width: 100%;
    margin: 8px 0 0 0;
  }
`;

const DeleteAccountButton = styled(EditProfileButton)`
  background: ${white};
  border: 1px solid ${red} !important;
  color: ${red};
  &:hover,
  &:focus {
    color: ${red} !important;
  }
`;

const SaveButton = styled(EditProfileButton)`
  background: ${themeColor};
  border-color: ${themeColor};
  color: ${white};
  width: 130px;
`;

const CancelButton = styled(EditProfileButton)`
  background: ${white};
  color: ${themeColor};
  border: 1px solid ${themeColor};
  width: 130px;
`;

const SelectSetsButton = styled(EditProfileButton)`
  background: ${themeColor};
  border-color: ${themeColor};
  color: ${white};
  padding: 0px 20px;
`;

const SaveStandardSetsBtn = styled(SelectSetsButton)`
  margin: 5px 0px 5px 15px;
  :hover{
    color ${themeColor};
  }
`;
