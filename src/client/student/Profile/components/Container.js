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
        <Wrapper display="flex" bgColor="#f0f2f5" boxShadow="none" minHeight="max-content">
          <ProfileImgWrapper>
            <div />
          </ProfileImgWrapper>
          <ProfileContentWrapper>
            <UserDetail>
              <Title>Instructor Information</Title>
              <Details>
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
            </UserDetail>
            <FormWrapper onSubmit={this.handleSubmit}>
              <FormItemWrapper>
                <Label>{t("common.title.newPasswordLabel")}</Label>
                {getFieldDecorator("password", {
                  rules: [
                    {
                      required: true,
                      message: t("common.title.password")
                    }
                  ]
                })(<Input type="password" />)}
              </FormItemWrapper>{" "}
              <FormItemWrapper>
                <Label>{t("common.title.confirmPaswswordLabel")}</Label>
                {getFieldDecorator("password", {
                  rules: [
                    {
                      required: true,
                      message: t("common.title.password")
                    }
                  ]
                })(<Input type="password" />)}
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
  width: 100%;
`;

const ProfileContentWrapper = styled.div`
  width: 1150px
  background-color:white;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;

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
  padding: 5px 0rem 30px;

  @media (max-width: ${largeDesktopWidth}) {
    padding: 5px 0 30px;
  }

  @media (max-width: ${desktopWidth}) {
    padding: 5px 0 20px;
  }
`;

const Title = styled.h3`
  color: ${props => props.theme.profile.userHeadingTextColor};
  font-size: ${props => props.theme.profile.userHeadingTextSize};
  font-weight: ${props => props.theme.profile.userHeadingTextWeight};
  margin-bottom: 11px;

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 18px;
    margin-bottom: 7px;
  }

  @media (max-width: ${desktopWidth}) {
    font-size: 18px;
    margin-bottom: 11px;
  }
`;

const UserSubTitle = styled.p`
  color: ${props => props.theme.profile.userSubTitleTextColor};
  font-size: ${props => props.theme.profile.userSubTitleTextSize};
`;

const ProfileImgWrapper = styled.div`
  width: 400px;
  height: 350px;
  position: relative;
  background-color: white;
  display: flex;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  div {
    width: 250px;
    height: 250px;
    border-radius: 50%;
    overflow: hidden;
    background: url(${ProfileImage}) no-repeat;
    background-size: cover;
    background-position: center center;
    margin: auto;
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
    width: 300px;
    height: 250px;

    div {
      width: 200px;
      height: 200px;
    }
  }

  @media (max-width: ${largeDesktopWidth}) {
    max-width: 250px;
    max-height: 200px;

    div {
      width: 150px;
      height: 150px;
    }
  }

  @media (max-width: ${desktopWidth}) {
    max-width: 200px;
    max-height: 200px;

    div {
      width: 146px;
      height: 146px;
    }
  }
`;

const Details = styled.div`
  margin: 30px 0px 0px 25px;
`;

const DetailRow = styled.div`
  padding: 15px 0px;
`;
const DetailTitle = styled.span`
  font-size: 15px;
  color: ${props => props.theme.profile.formInputLabelColor};
  font-weight: 600;
  width: 20%;
  display: inline-block;
`;
const DetailData = styled.span`
  font-size: 15px;
  color: grey;
  display: inline-block;
`;

const Label = styled.label`
  text-transform: uppercase;
`;

const FormWrapper = styled(Form)`
  width: 100%;
  margin-left: 15px;
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
  width: 49%;
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
