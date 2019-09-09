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
  fadedGreen
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
                <Select>
                  <Option value="Mr.">Mr.</Option>
                  <Option value="Mrs.">Mrs.</Option>
                  <Option value="Ms.">Ms.</Option>
                  <Option value="Dr.">Dr.</Option>
                </Select>
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
        <Wrapper display="flex" bgColor="#f0f2f5" boxShadow="none" minHeight="max-content">
          <ProfileImgWrapper>
            <Photo user={user} />
          </ProfileImgWrapper>
          <div>
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
                    <CancelButton type="primary" ghost onClick={this.handleCancel}>
                      {t("common.title.cancel")}
                    </CancelButton>
                    <SaveButton type="primary" onClick={this.handleSubmit}>
                      {t("common.title.save")}
                    </SaveButton>
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
                  <div style={{ width: "min-content" }}>
                    {showSaveStandSetsBtn && (
                      <SaveStandardSetsBtn onClick={this.handleSaveStandardSets}>SAVE</SaveStandardSetsBtn>
                    )}
                    <SelectSetsButton onClick={this.handleSelectStandardButton} type="primary">
                      Select your standard sets
                    </SelectSetsButton>
                  </div>
                </SchoolWrapper>
              </>
            )}
          </div>
        </Wrapper>
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

const ProfileContentWrapper = styled.div`
  width: 1150px
  background-color:white;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
  overflow:hidden;

  @media (max-width: ${extraDesktopWidth}) {
    width: 800px;
    padding: 20px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    width: 735px;
    padding:15px;
  }

  @media (max-width: ${desktopWidth}) {
    width: 600px;
    padding:10px;
  }
`;

const SchoolWrapper = styled.div`
  width: 1150px;
  background-color: white;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  margin-top: 20px;

  @media (max-width: ${extraDesktopWidth}) {
    width: 800px;
    padding: 20px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    width: 735px;
    padding: 15px;
  }

  @media (max-width: ${desktopWidth}) {
    width: 600px;
    padding: 10px;
  }
`;

const SchoolLabel = styled.span`
  font-weight: 600;
  font-size: 16px;
  margin-left: 15px;
  width: 175px;
`;

const StandardSetsLabel = styled(SchoolLabel)``;

const SchoolListWrapper = styled.span`
  display: flex;
  display: inline-block;
`;

const StandardSetsList = styled(SchoolListWrapper)`
  width: 700px;
`;

const SelectSetsButton = styled(Button)`
  width: 200px;
  height: 40px;
  margin: 0 15px;
  background: ${themeColor};
  border-color: ${themeColor};
  font-size: 11px;
  color: white;
  text-transform: uppercase;
  float: right;
  font-weight: 600;

  @media (max-width: ${extraDesktopWidth}) {
    height: 36px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    width: 160px;
  }

  @media (max-width: ${desktopWidth}) {
    width: 100%;
    margin: 8px 0 0 0;
  }

  i {
    font-size: 14px;
  }
`;

const SaveStandardSetsBtn = styled(SelectSetsButton)`
  margin: 5px 15px;
  :hover{
    color ${themeColor};
  }

`;

const StyledTag = styled(Tag)`
  background-color: ${fadedGreen};
  color: ${themeColor};
  border: none;
  font-weight: 600;
  padding: 2px 5px 2px 10px;
  margin: 5px;
  i {
    color: ${themeColor} !important;
    margin-left: 10px !important;
  }
`;

const UserDetail = styled.div`
  padding: 5px 0rem 20px;

  @media (max-width: ${largeDesktopWidth}) {
    padding: 5px 0 20px;
  }

  @media (max-width: ${desktopWidth}) {
    padding: 5px 0 20px;
  }
`;

const SubHeader = styled.div`
  overflow: hidden;
`;

const EditProfileButton = styled(Button)`
  width: 200px;
  height: 40px;
  margin: 0 15px;
  background: ${themeColor};
  border-color: ${themeColor};
  font-size: 11px;
  color: white;
  text-transform: uppercase;
  float: right;
  font-weight: 600;

  @media (max-width: ${extraDesktopWidth}) {
    height: 36px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    width: 160px;
  }

  @media (max-width: ${desktopWidth}) {
    width: 100%;
    margin: 8px 0 0 0;
  }

  i {
    font-size: 14px;
  }
`;

const DeleteAccountButton = styled(Button)`
  width: 200px;
  height: 40px;
  margin: 0 15px;
  background: white !important;
  font-size: 11px;
  text-transform: uppercase;
  float: right;
  border: 1px solid ${red} !important;
  color: ${red};
  font-weight: 600;

  &:hover {
    color: ${red} !important;
  }

  &:focus {
    color: ${red} !important;
  }

  @media (max-width: ${extraDesktopWidth}) {
    height: 36px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    width: 160px;
  }

  @media (max-width: ${desktopWidth}) {
    width: 100%;
    margin: 8px 0 0 0;
  }

  i {
    font-size: 14px;
  }
`;

const Title = styled.h3`
  color: ${title};
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 11px;
  float: left;

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 18px;
    margin-bottom: 7px;
  }

  @media (max-width: ${desktopWidth}) {
    font-size: 18px;
    margin-bottom: 11px;
  }
`;

const ProfileImgWrapper = styled.div`
  width: 400px;
  height: 350px;
  position: relative;
  background-color: white;
  display: flex;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 20px @media (max-width: ${extraDesktopWidth}) {
    width: 300px;
    height: 250px;
    margin-right: 10px;
    margin-bottom: 20px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    max-width: 250px;
    max-height: 200px;
    margin-right: 10px;
    margin-bottom: 20px;
  }

  @media (max-width: ${desktopWidth}) {
    max-width: 200px;
    max-height: 200px;
    margin-right: 20px;
    margin-bottom: 20px;
  }
`;

const Details = styled.div`
  margin: 10px 0px 0px 25px;
`;

const DetailRow = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
`;
const DetailTitle = styled.span`
  font-size: 15px;
  color: rgba(0, 0, 0, 0.65);
  font-weight: 600;
  width: 20%;
  display: inline-block;
`;
const DetailData = styled.span`
  font-size: 15px;
  color: grey;
  display: inline-block;
  width: 50%;
`;

const Label = styled.label`
  text-transform: uppercase;
`;

const ChangePasswordToggleButton = styled.div`
  color: ${themeColor};
  padding-left: 25px;
  cursor: pointer;
  width: fit-content;
  span {
    margin-right: 20px;
    font-weight: 600;
  }
`;

const FormWrapper = styled(Form)`
  width: 100%;
  margin-left: 15px;
  text-align: left;
  margin-top: 30px;

  .ant-form-item {
    margin-bottom: 22px;
  }

  .ant-input {
    height: 40px;
    background: ${backgrounds.primary};
    border: 1px solid ${borders.secondary};
    padding: 0 24px;
  }

  @media (max-width: ${extraDesktopWidth}) {
    max-width: 647px;

    .ant-form-item-control {
      line-height: 35px;
    }

    .ant-form-item {
      margin-bottom: 8px;
    }

    .ant-input {
      height: 30px;
    }
  }

  @media (max-width: ${largeDesktopWidth}) {
    .ant-form-item-control {
      line-height: 34px;
    }

    .ant-form-item {
      margin-bottom: 0;
    }
  }

  @media (max-width: ${desktopWidth}) {
    width: 100%;

    .ant-form-item {
      margin-bottom: 7px;
      padding: 0 5px;
    }

    .ant-form-item-control {
      line-height: 43px;
    }

    .ant-input {
      height: 40px;
    }
  }
`;

const FormItemWrapper = styled(FormItem)`
  width: 49%;
  display: inline-block;
  padding: 0px 15px;

  @media (max-width: 425px) {
    width: 100%;
    display: block;
  }
  label {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.65);
    font-weight: 600;
    letter-spacing: -0.4px;
  }
  .ant-form-explain {
    font-size: 12px;
  }
`;

const InputItemWrapper = styled(FormItem)`
  width: 50%;
  display: inline-block;
  margin-bottom: 0 !important;

  @media (max-width: 425px) {
    width: 100%;
    display: block;
  }
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
`;

const FormButtonWrapper = styled.div`
  text-align: center;
  float: right;
  padding-right: 20px;
`;

const SaveButton = styled(Button)`
  width: 200px;
  height: 40px;
  margin: 0 15px;
  background: ${themeColor};
  border-color: ${themeColor};
  font-size: 11px;
  color: white;
  text-transform: uppercase;

  @media (max-width: ${extraDesktopWidth}) {
    height: 36px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    width: 160px;
  }

  @media (max-width: ${desktopWidth}) {
    width: 100%;
    margin: 8px 0 0 0;
  }
`;

const CancelButton = styled(SaveButton)`
  width: 200px;
  height: 40px;
  margin: 0 15px;
  background: white;
  color: ${themeColor};
  border: 1px solid ${themeColor};

  @media (max-width: ${extraDesktopWidth}) {
    height: 36px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    width: 160px;
  }

  @media (max-width: ${desktopWidth}) {
    width: 100%;
    margin: 0;
  }
`;
