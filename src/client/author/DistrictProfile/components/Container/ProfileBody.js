import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Layout, Form, Input, Button, Icon, Select } from "antd";
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
  red
} from "@edulastic/colors";
import { resetMyPasswordAction, updateUserDetailsAction, deleteAccountAction } from "../../../../student/Login/ducks";
import { Wrapper } from "../../../../student/styled/index";
import DeleteAccountModal from "../DeleteAccountModal/DeleteAccountModal";
import Photo from "./Photo";

const FormItem = Form.Item;
class ProfileBody extends React.Component {
  state = {
    confirmDirty: false,
    showChangePassword: false,
    isEditProfile: false,
    showModal: false
  };

  handleSubmit = e => {
    const { form, user, resetMyPassword, updateUserDetails } = this.props;
    const { showChangePassword, isEditProfile } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (showChangePassword) {
          resetMyPassword({
            newPassword: values.password,
            username: user.email
          });
        }
        if (isEditProfile) {
          updateUserDetails({
            data: {
              districtId: user.districtId,
              email: user.email,
              firstName: values.firstName,
              lastName: values.lastName,
              title: values.title
            },
            userId: user._id
          });
        }
        this.setState({ isEditProfile: false, showChangePassword: false });
      }
    });
  };

  handleCancel = e => {
    e.preventDefault();
    const { form } = this.props;
    this.setState({ isEditProfile: false, showChangePassword: false });
  };

  handleConfirmBlur = ({ target: { value } }) => {
    let { confirmDirty } = this.state;
    confirmDirty = confirmDirty || !!value;
    this.setState({ confirmDirty });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    const { confirmDirty } = this.state;
    if (value && confirmDirty) {
      form.validateFields(["confirmPassword"], { force: true });
    }
    callback();
  };

  toggleModal = value => {
    this.setState({ showModal: value });
  };

  deleteProfile = () => {
    const { deleteAccount, user } = this.props;
    this.toggleModal(false);
    deleteAccount(user._id);
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
                initialValue: user.title || "Title",
                rules: [
                  {
                    required: true,
                    message: t("common.title.userTitle")
                  }
                ]
              })(
                <Select>
                  <Option value="Title">Title</Option>
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
                initialValue: user.lastName,
                rules: [
                  {
                    required: true,
                    message: t("common.title.lastName")
                  }
                ]
              })(<Input type="text" />)}
            </InputItemWrapper>{" "}
          </DetailData>
        </DetailRow>
        <DetailRow>
          <DetailTitle>{t("common.title.emailUsernameLabel")}</DetailTitle>
          <DetailData>{user.email}</DetailData>
        </DetailRow>
      </Details>
    );
  };

  render() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    const { flag, t, user } = this.props;
    const { showChangePassword, isEditProfile, showModal } = this.state;
    return (
      <LayoutContent flag={flag}>
        <Wrapper display="flex" bgColor="#f0f2f5" boxShadow="none" minHeight="max-content">
          <ProfileImgWrapper>
            <Photo user={user} />
          </ProfileImgWrapper>
          <ProfileContentWrapper>
            <UserDetail>
              <SubHeader>
                <Title>Instructor Information</Title>
                {!isEditProfile && (
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
                )}
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
        </Wrapper>
        {showModal && (
          <DeleteAccountModal visible={showModal} toggleModal={this.toggleModal} deleteProfile={this.deleteProfile} />
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
      user: state.user.user
    }),
    {
      resetMyPassword: resetMyPasswordAction,
      updateUserDetails: updateUserDetailsAction,
      deleteAccount: deleteAccountAction
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

  @media (max-width: ${extraDesktopWidth}) {
    width: 300px;
    height: 250px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    max-width: 250px;
    max-height: 200px;
  }

  @media (max-width: ${desktopWidth}) {
    max-width: 200px;
    max-height: 200px;
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
