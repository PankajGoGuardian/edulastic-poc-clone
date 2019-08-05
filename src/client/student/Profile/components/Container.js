import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Layout, Form, Input, Button } from "antd";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { extraDesktopWidth, largeDesktopWidth, desktopWidth, borders, backgrounds } from "@edulastic/colors";

import ProfileImage from "../../assets/Profile.png";
import cameraIcon from "../../assets/photo-camera.svg";
import { Wrapper } from "../../styled";

const FormItem = Form.Item;
class ProfileContainer extends React.Component {
  state = {
    confirmDirty: false
  };

  handleSubmit = e => {
    const { form, login } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, { password, email }) => {
      if (!err) {
        login({
          password,
          email
        });
      }
    });
  };

  handleConfirmBlur = ({ target: { value } }) => {
    let { confirmDirty } = this.state;
    confirmDirty = confirmDirty || !!value;
    this.setState({ confirmDirty });
  };

  render() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    const { flag, t, user } = this.props;
    return (
      <LayoutContent flag={flag}>
        <Wrapper>
          <ProfileContentWrapper>
            <UserDetail>
              <UserTitle>Welcome {user.firstName || "Zack"}</UserTitle>
              <UserSubTitle>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget mauris nunc.
              </UserSubTitle>
            </UserDetail>
            <ProfileImgWrapper>
              <div />
              <span>
                <img src={cameraIcon} alt="" />
              </span>
            </ProfileImgWrapper>
            <FormWrapper onSubmit={this.handleSubmit}>
              <FormItemWrapper>
                <label>{t("common.title.firstNameInputLabel")}</label>
                {getFieldDecorator("First Name", {
                  rules: [
                    {
                      required: true,
                      message: t("common.title.firstName")
                    }
                  ],
                  initialValue: `${user.firstName}`
                })(<Input readOnly />)}
              </FormItemWrapper>
              <FormItemWrapper>
                <label>{t("common.title.lastNameInputLabel")}</label>
                {getFieldDecorator("Last Name", {
                  rules: [
                    {
                      required: true,
                      message: t("common.title.lastName")
                    }
                  ],
                  initialValue: `${user.lastName || ""}`
                })(<Input readOnly />)}
              </FormItemWrapper>
              <FormItemWrapper>
                <label>{t("common.title.emailInputLabel")}</label>
                {getFieldDecorator("email", {
                  rules: [
                    {
                      type: "email",
                      message: t("common.title.validemail")
                    },
                    {
                      required: true,
                      message: t("common.title.email")
                    }
                  ],
                  initialValue: `${user.email}`
                })(<Input type="email" readOnly />)}
              </FormItemWrapper>
              <FormItemWrapper>
                <label>{t("common.title.passwordInputLabel")}</label>
                {getFieldDecorator("password", {
                  rules: [
                    {
                      required: true,
                      message: t("common.title.password")
                    }
                  ]
                })(<Input type="password" readOnly />)}
              </FormItemWrapper>{" "}
              <FormButtonWrapper>
                <FormItem>
                  <CancelButton disabled type="primary" ghost htmlType="submit">
                    {t("common.title.cancel")}
                  </CancelButton>
                  <SaveButton disabled type="primary" htmlType="submit">
                    {t("common.title.save")}
                  </SaveButton>
                </FormItem>
              </FormButtonWrapper>
            </FormWrapper>
          </ProfileContentWrapper>
        </Wrapper>
      </LayoutContent>
    );
  }
}

const enhance = compose(
  React.memo,
  withNamespaces("profile"),
  Form.create(),
  connect(state => ({
    flag: state.ui.flag,
    user: state.user.user
  }))
);

export default enhance(ProfileContainer);

ProfileContainer.propTypes = {
  flag: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

const LayoutContent = styled(Layout.Content)`
  min-height: 100vh;
  width: 100%;
`;

const ProfileContentWrapper = styled.div`
  text-align: center;
`;

const UserDetail = styled.div`
  padding: 42px 0rem 54px;
  border-bottom: 1px solid ${borders.default};

  @media (max-width: ${largeDesktopWidth}) {
    padding: 25px 0 30px;
  }

  @media (max-width: ${desktopWidth}) {
    padding: 32px 0 20px;
  }
`;

const UserTitle = styled.h2`
  color: ${props => props.theme.profile.userHeadingTextColor};
  font-size: ${props => props.theme.profile.userHeadingTextSize};
  font-weight: ${props => props.theme.profile.userHeadingTextWeight};
  margin-bottom: 11px;

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 18px;
    margin-bottom: 7px;
  }

  @media (max-width: ${desktopWidth}) {
    font-size: 22px;
    margin-bottom: 11px;
  }
`;

const UserSubTitle = styled.p`
  color: ${props => props.theme.profile.userSubTitleTextColor};
  font-size: ${props => props.theme.profile.userSubTitleTextSize};
`;

const ProfileImgWrapper = styled.div`
  margin: 44px auto 30px;
  max-width: 146px;
  max-height: 146px;
  position: relative;

  div {
    width: 146px;
    height: 146px;
    border-radius: 50%;
    overflow: hidden;
    background: url(${ProfileImage}) no-repeat;
    background-size: cover;
    background-position: center center;
  }

  span {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    position: absolute;
    right: 5px;
    bottom: -1px;
    background: ${props => props.theme.profile.uploadIconBgColor};
    line-height: 30px;
    cursor: pointer;

    img {
      width: 17px;
    }
  }

  @media (max-width: ${extraDesktopWidth}) {
    max-width: 124px;
    max-height: 124px;
    margin-top: 25px;

    div {
      width: 124px;
      height: 124px;
    }
  }

  @media (max-width: ${largeDesktopWidth}) {
    max-width: 114px;
    max-height: 114px;
    margin-top: 30px;
    margin-bottom: 9px;

    div {
      width: 114px;
      height: 114px;
    }
  }

  @media (max-width: ${desktopWidth}) {
    max-width: 146px;
    max-height: 146px;
    margin-top: 41px;
    margin-bottom: 16px;

    div {
      width: 146px;
      height: 146px;
    }
  }
`;

const FormWrapper = styled(Form)`
  max-width: 749px;
  width: 100%;
  margin: 0px auto;
  text-align: left;

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
  width: 50%;
  display: inline-block;
  padding: 0px 15px;

  @media (max-width: 425px) {
    width: 100%;
    display: block;
  }
  label {
    font-size: ${props => props.theme.profile.formInputLabelSize};
    color: ${props => props.theme.profile.formInputLabelColor};
    font-weight: 600;
    letter-spacing: -0.4px;
  }
  .ant-form-explain {
    font-size: 12px;
  }
`;

const FormButtonWrapper = styled.div`
  text-align: center;
  margin-top: 46px;

  @media (max-width: ${extraDesktopWidth}) {
    margin-top: 27px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    margin-top: 34px;
  }

  @media (max-width: ${desktopWidth}) {
    margin-top: 24px;
  }
`;

const SaveButton = styled(Button)`
  width: 200px;
  height: 40px;
  margin: 0 15px;
  background: ${props => props.theme.profile.saveButtonBgColor};
  border-color: ${props => props.theme.profile.saveButtonBorderColor};
  font-size: ${props => props.theme.profile.saveButtonTextSize};
  color: ${props => props.theme.profile.saveButtonTextColor};
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
  background: ${props => props.theme.profile.cancelButtonBgColor};
  color: ${props => props.theme.profile.cancelButtonTextColor};

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
