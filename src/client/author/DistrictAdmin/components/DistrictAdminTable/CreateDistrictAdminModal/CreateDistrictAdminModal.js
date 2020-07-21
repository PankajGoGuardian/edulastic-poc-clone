import { authApi } from "@edulastic/api";
import { CustomModalStyled, EduButton, TextInputStyled } from "@edulastic/common";
import { Col, Form, Row } from "antd";
import React from "react";
import { ButtonsContainer, ModalFormItem } from "../../../../../common/styled";

class CreateDistrictAdminModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailValidateStatus: "success",
      emailValidateMsg: "",
      email: "",
      fetching: false
    };
  }

  onCreateDistrictAdmin = async () => {
    const { email, emailValidateStatus } = this.state;
    let checkUserResponse = { userExists: true };

    if (emailValidateStatus === "success" && email.length > 0) {
      checkUserResponse = await authApi.checkUserExist({ email });
      if (checkUserResponse.userExists && checkUserResponse.role === "district-admin") {
        this.setState({
          emailValidateStatus: "error",
          emailValidateMsg: "Username already exists"
        });
      }
    } else if (email.length == 0) {
      this.setState({
        emailValidateStatus: "error",
        emailValidateMsg: "Please input Email"
      });
    } else if (this.checkValidEmail(email)) {
      this.setState({
        emailValidateStatus: "error",
        emailValidateMsg: "Username already exists"
      });
    } else {
      this.setState({
        emailValidateStatus: "error",
        emailValidateMsg: "Please input valid Email"
      });
    }

    this.props.form.validateFields((err, row) => {
      if (!err) {
        if (checkUserResponse.userExists && checkUserResponse.role === "district-admin") return;

        const firstName = row.name.split(" ", 1);
        let lastName = "";
        if (firstName.length < row.name.length) {
          const lastNameIndex = firstName[0].length + 1;
          lastName = row.name.substr(lastNameIndex, row.name.length);
        }
        const newUser = {
          firstName: firstName[0],
          lastName,
          password: row.password,
          email: this.state.email
        };
        this.props.createDistrictAdmin(newUser);
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  changeEmail = e => {
    if (e.target.value.length === 0) {
      this.setState({
        emailValidateStatus: "error",
        emailValidateMsg: "Please input Email",
        email: e.target.value
      });
    } else if (this.checkValidEmail(e.target.value)) {
      this.setState({
        emailValidateStatus: "success",
        emailValidateMsg: "",
        email: e.target.value
      });
    } else {
      this.setState({
        emailValidateStatus: "error",
        emailValidateMsg: "Please input valid Email",
        email: e.target.value
      });
    }
  };

  checkValidEmail(strEmail) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(strEmail).toLowerCase());
  }

  render() {
    const { modalVisible, t, form } = this.props;
    const { getFieldDecorator } = form;
    const { emailValidateStatus, emailValidateMsg } = this.state;

    return (
      <CustomModalStyled
        visible={modalVisible}
        title={t("users.districtadmin.createda.title")}
        onOk={this.onCreateDistrictAdmin}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <EduButton isGhost onClick={this.onCloseModal}>{t("users.districtadmin.createda.nocancel")}</EduButton>
            <EduButton onClick={this.onCreateDistrictAdmin}>{t("users.districtadmin.createda.yescreate")}</EduButton>
          </ButtonsContainer>
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("users.districtadmin.name")}>
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: t("users.districtadmin.createda.validations.name")
                  }
                ]
              })(<TextInputStyled placeholder={t("users.districtadmin.createda.entername")} />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem
              label={t("users.districtadmin.username")}
              validateStatus={emailValidateStatus}
              help={emailValidateMsg}
              required
              type="email"
            >
              <TextInputStyled
                placeholder={t("users.districtadmin.createda.enterusername")}
                autocomplete="new-password"
                onChange={this.changeEmail}
              />
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("users.districtadmin.password")}>
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                    message: t("users.districtadmin.createda.validations.password")
                  }
                ]
              })(
                <TextInputStyled
                  placeholder={t("users.districtadmin.createda.enterpassword")}
                  type="password"
                  autocomplete="new-password"
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
      </CustomModalStyled>
    );
  }
}

const CreateDistrictAdminModalForm = Form.create()(CreateDistrictAdminModal);
export default CreateDistrictAdminModalForm;
