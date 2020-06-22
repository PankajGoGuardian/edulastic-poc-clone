import {
  backgrounds,
  desktopWidth,
  largeDesktopWidth,
  mobileWidthMax,
  themeColor,
  white
} from "@edulastic/colors";
import { MainContentWrapper } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { Button, Form, Icon, Input, Table, Tag } from "antd";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import styled from "styled-components";
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
    this.setState({ showChangePassword: false });
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

    const { t, user } = this.props;
    const { showChangePassword } = this.state;
    return (
      <MainContentWrapper>
        <ProfileWrapper display="flex" minHeight="max-content">
          <ProfileImgWrapper>
            <Photo height={224} windowWidth={224} />
          </ProfileImgWrapper>
          <ProfileContentWrapper>
            <TitleName>Welcome {user.firstName}</TitleName>
            <ProfileImgMobileWrapper>
              <Photo height={224} windowWidth={100} mode="small" />
            </ProfileImgMobileWrapper>
            <div>
              <Title>{t("common.title.student")}</Title>
              <Details>
                <DetailRow>
                  <DetailTitle>{t("common.title.firstNameInputLabel")}</DetailTitle>
                  <DetailData>{user.firstName || "Anonymous"}</DetailData>
                </DetailRow>
                <DetailRow>
                  <DetailTitle>{t("common.title.lastNameInputLabel")}</DetailTitle>
                  <DetailData>{user.lastName}</DetailData>
                </DetailRow>
                <DetailRow>
                  <DetailTitle>{t("common.title.emailUsernameLabel")}</DetailTitle>
                  <DetailData>{user.email}</DetailData>
                </DetailRow>
              </Details>
            </div>
            <ChangePasswordToggleButton
              onClick={() => {
                this.setState({ showChangePassword: !showChangePassword });
              }}
            >
              <span>CHANGE PASSWORD</span>
              <CaretIcon type={showChangePassword ? "caret-up" : "caret-down"} />
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
                  <FormButtonsWrapper>
                    <SaveButton type="primary" htmlType="submit">
                      {t("common.title.save")}
                    </SaveButton>
                    <CancelButton type="primary" ghost onClick={this.handleCancel}>
                      {t("common.title.cancel")}
                    </CancelButton>
                  </FormButtonsWrapper>
                </FormButtonWrapper>
              </FormWrapper>
            )}
            {user.role === "parent" && (
              <div style={{ paddingTop: 25 }}>
                <Title>Children details</Title>
                <ChildrenTable childs={user.children} />
              </div>
            )}
          </ProfileContentWrapper>
        </ProfileWrapper>
      </MainContentWrapper>
    );
  }
}

function ChildrenTable({ childs }) {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: text => <a>{text}</a>
    },
    {
      title: "Grade",
      dataIndex: "orgData",
      key: "grades",
      render: orgData => (orgData?.classList?.flatMap(x => x.grades) || []).join(",")
    },
    {
      title: "School",
      dataIndex: "orgData",
      key: "schools",
      render: orgData => orgData?.schools.map(x => <Tag key={x._id}> {x.name}</Tag>)
    },
    {
      title: "District",
      dataIndex: "orgData",
      key: "district",
      // In case of parent role table will be displayed and
      // for parent we can user first district to get the name
      render: orgData => orgData?.districts?.[0].districtName || ""
    }
  ];

  return <Table dataSource={childs} pagination={false} columns={columns} />;
}

const enhance = compose(
  React.memo,
  withNamespaces("profile"),
  Form.create(),
  connect(
    state => ({
      user: state.user.user
    }),
    {
      resetMyPassword: resetMyPasswordAction
    }
  )
);

export default enhance(ProfileContainer);

ProfileContainer.propTypes = {
  t: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

const ProfileWrapper = styled(Wrapper)`
  padding: 0px;
  margin: 0px;
`;

const ProfileContentWrapper = styled.div`
  width: calc(100% - 409px);
  background-color: white;
  border: 1px solid #b6b6cc;
  border-radius: 10px;
  padding: 32px 50px 22px 30px;
  @media (max-width: ${largeDesktopWidth}) {
    width: calc(100% - 270px);
  }
  @media (max-width: ${mobileWidthMax}) {
    width: 100%;
  }
`;

const Title = styled.h3`
  color: ${props => props.theme.profile.userHeadingTextColor};
  font-size: ${props => props.theme.profile.userHeadingTextSize};
  font-weight: ${props => props.theme.profile.userHeadingTextWeight};
  margin-bottom: 0px;

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
  width: 381px;
  height: 323px;
  position: relative;
  background-color: ${white};
  border: 1px solid #b6b6cc;
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
  padding: 50px 0px 0 20px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 0px 33px;
`;

const DetailTitle = styled.span`
  font-size: ${props => props.theme.profile.profileDetailFontSize};
  color: ${props => props.theme.profile.formInputLabelColor};
  font-weight: 600;
  width: 220px;
  display: inline-block;
`;

const DetailData = styled.span`
  font-size: ${props => props.theme.profile.profileDetailFontSize};
  color: ${props => props.theme.profile.userDetailsTextColor};
  font-weight: 600;
  display: inline-block;
`;

const Label = styled.label`
  text-transform: uppercase;
`;

const ChangePasswordToggleButton = styled.div`
  color: ${props => props.theme.profile.cancelButtonTextColor};
  font-size: ${props => props.theme.profile.changePasswordTextSize};
  padding-left: 20px;
  cursor: pointer;
  span {
    margin-right: 28px;
    font-weight: 600;
  }
`;

const CaretIcon = styled(Icon)`
  font-size: 15px;
`;

const FormWrapper = styled(Form)`
  width: 100%;
  text-align: left;
  padding: 40px 0px 0px 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .ant-input {
    height: 36px;
    background: ${backgrounds.primary};
    padding: 0 15px;
  }

  @media (max-width: ${desktopWidth}) {
    width: 100%;
    flex-direction: column;
  }
`;

const FormItemWrapper = styled(FormItem)`
  width: calc(50% - 17.5px);
  display: inline-block;
  padding: 0px;
  margin-bottom: 20px;
  label {
    font-size: ${props => props.theme.profile.formInputLabelSize};
    color: ${props => props.theme.profile.formInputLabelColor};
    font-weight: 600;
  }
  .ant-form-explain {
    font-size: 12px;
  }
`;

const FormButtonsWrapper = styled(FormItem)`
  margin-bottom: 0;
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

const ActionButton = styled(Button)`
  height: 36px;
  width: 150px;
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

  @media (max-width: ${largeDesktopWidth}) {
    padding: 0px 15px;
  }
`;

const SaveButton = styled(ActionButton)`
  &:hover,
  &:focus {
    background: ${themeColor};
    border-color: ${themeColor};
  }
`;

const CancelButton = styled(ActionButton)`
  background: ${white};
  color: ${themeColor};
  border: 1px solid ${themeColor};
  &:hover,
  &:focus {
    background: ${white};
    color: ${themeColor};
    border: 1px solid ${themeColor};
  }
`;
