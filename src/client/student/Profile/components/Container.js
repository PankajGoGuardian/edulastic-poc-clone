import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Layout, Form, Input, Button, Icon } from "antd";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import {
  extraDesktopWidth,
  largeDesktopWidth,
  desktopWidth,
  mobileWidthMax,
  borders,
  backgrounds,
  white
} from "@edulastic/colors";
import { resetMyPasswordAction } from "../../Login/ducks";
import { Wrapper } from "../../styled";
import Photo from "./Photo";

const FormItem = Form.Item;
class ProfileContainer extends React.Component {
  state = {
    confirmDirty: false,
    showChangePassword: false
  };

  handleSubmit = e => {
    const { form, user, resetMyPassword } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, { password }) => {
      if (!err) {
        resetMyPassword({
          newPassword: password,
          username: user.email
        });
        form.resetFields();
      }
    });
  };

  handleCancel = e => {
    e.preventDefault();
    const { form } = this.props;
    form.resetFields();
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

  render() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    const { flag, t, user } = this.props;
    const { showChangePassword } = this.state;
    return (
      <LayoutContent flag={flag}>
        <ProfileWrapper display="flex" bgColor="#f0f2f5" boxShadow="none" minHeight="max-content">
          <ProfileImgWrapper>
            <Photo height={200} windowWidth={200} />
          </ProfileImgWrapper>
          <ProfileContentWrapper>
            <TitleName>Welcome {user.firstName}</TitleName>
            <ProfileImgMobileWrapper>
              <Photo height={100} windowWidth={100} mode="small" />
            </ProfileImgMobileWrapper>
            <UserDetail>
              <Title>{t("common.title.student")}</Title>
              <Details>
                <DetailRow>
                  <DetailTitle>{t("common.title.firstNameInputLabel")}</DetailTitle>
                  <DetailData>{user.firstName}</DetailData>
                </DetailRow>
                <DetailRow>
                  <DetailTitle>{t("common.title.lastNameInputLabel")}</DetailTitle>
                  <DetailData>{user.lastName || "N/A"}</DetailData>
                </DetailRow>
                <DetailRow>
                  <DetailTitle>{t("common.title.emailUsernameLabel")}</DetailTitle>
                  <DetailData>{user.email || "N/A"}</DetailData>
                </DetailRow>
              </Details>
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
              <FormWrapper onSubmit={this.handleSubmit}>
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
                <FormButtonWrapper>
                  <FormItem>
                    <CancelButton type="primary" ghost onClick={this.handleCancel}>
                      {t("common.title.cancel")}
                    </CancelButton>
                    <SaveButton type="primary" htmlType="submit">
                      {t("common.title.save")}
                    </SaveButton>
                  </FormItem>
                </FormButtonWrapper>
              </FormWrapper>
            )}
          </ProfileContentWrapper>
        </ProfileWrapper>
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
      resetMyPassword: resetMyPasswordAction
    }
  )
);

export default enhance(ProfileContainer);

ProfileContainer.propTypes = {
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

const ProfileContentWrapper = styled.div`
  width: calc(100% - 370px);
  background-color: white;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;

  @media (max-width: ${largeDesktopWidth}) {
    width: calc(100% - 270px);
  }
  @media (max-width: ${mobileWidthMax}) {
    width: 100%;
  }
`;

const UserDetail = styled.div``;

const Title = styled.h3`
  color: ${props => props.theme.profile.userHeadingTextColor};
  font-size: ${props => props.theme.profile.userHeadingTextSize};
  font-weight: ${props => props.theme.profile.userHeadingTextWeight};
  margin-bottom: 10px;

  @media (max-width: ${mobileWidthMax}) {
    display: none;
  }
`;

const TitleName = styled.h1`
  text-align: center;
  font-weight: 600;
  display: none;
  @media (max-width: ${mobileWidthMax}) {
    display: block;
  }
`;

const ProfileImgMobileWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  @media (min-width: ${mobileWidthMax}) {
    display: none;
  }
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
  padding: 20px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0px 20px;
`;

const DetailTitle = styled.span`
  font-size: ${props => props.theme.profile.profileDetailFontSize};
  color: ${props => props.theme.profile.formInputLabelColor};
  font-weight: 600;
  min-width: 40%;
  width: 150px;
  display: inline-block;
`;

const DetailData = styled.span`
  margin-left: 20px;
  font-size: ${props => props.theme.profile.profileDetailFontSize};
  color: grey;
  display: inline-block;
  width: calc(100% - 150px);
`;

const Label = styled.label`
  text-transform: uppercase;
`;

const ChangePasswordToggleButton = styled.div`
  color: ${props => props.theme.profile.cancelButtonTextColor};
  font-size: ${props => props.theme.profile.changePasswordTextSize};
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
  flex-wrap: wrap;

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
  padding: 0px;
  label {
    font-size: ${props => props.theme.profile.formInputLabelSize};
    color: ${props => props.theme.profile.formInputLabelColor};
    font-weight: 600;
  }
  .ant-form-explain {
    font-size: 12px;
  }
`;

const FormButtonWrapper = styled.div`
  text-align: center;
  float: right;
  padding: 0px;
  width: 100%;
  @media (max-width: ${mobileWidthMax}) {
    float: none;
    padding-right: 0px;
  }
`;

const SaveButton = styled(Button)`
  width: 200px;
  min-height: 40px;
  height: auto;
  margin-left: 15px;
  float: right;
  background: ${props => props.theme.profile.saveButtonBgColor};
  border-color: ${props => props.theme.profile.saveButtonBorderColor};
  font-size: ${props => props.theme.profile.saveButtonTextSize};
  color: ${props => props.theme.profile.saveButtonTextColor};
  text-transform: uppercase;
  &:hover,
  &:focus {
    background: ${props => props.theme.profile.saveButtonBgColor};
    color: ${props => props.theme.profile.saveButtonTextColor};
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

const CancelButton = styled(SaveButton)`
  width: 200px;
  min-height: 40px;
  height: auto;
  margin: 0 15px;
  background: ${props => props.theme.profile.cancelButtonBgColor};
  color: ${props => props.theme.profile.cancelButtonTextColor};
  border: 1px solid ${props => props.theme.profile.cancelButtonTextColor};
  &:hover,
  &:focus {
    background: ${props => props.theme.profile.cancelButtonBgColor};
    color: ${props => props.theme.profile.cancelButtonTextColor};
  }

  @media (max-width: ${desktopWidth}) {
    margin: 0;
  }
`;
