import React from "react";
import { Form, Input, Row, Col, Select, Spin, Checkbox } from "antd";

import { authApi, schoolApi } from "@edulastic/api";
import { ButtonsContainer, OkButton, CancelButton, StyledModal, ModalFormItem } from "../../../../../common/styled";

import { nameValidator } from "../../../../../common/utils/helpers";

const Option = Select.Option;

class CreateSchoolAdminModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailValidateStatus: "success",
      emailValidateMsg: "",
      email: "",
      schoolList: [],
      fetching: false,
      isPowerTeacher: false
    };
  }

  onCreateSchoolAdmin = async () => {
    const { email, emailValidateStatus } = this.state;
    let checkUserResponse = { userExists: true };

    if (emailValidateStatus === "success" && email.length > 0) {
      checkUserResponse = await authApi.checkUserExist({ email });
      if (checkUserResponse.userExists) {
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
        if (checkUserResponse.userExists) return;

        const firstName = row.name.split(" ", 1);
        let lastName = "";
        if (firstName.length < row.name.length) {
          const lastNameIndex = firstName[0].length + 1;
          lastName = row.name.substr(lastNameIndex, row.name.length);
        }

        const institutionIds = [];
        for (let i = 0; i < row.institutionIds.length; i++) {
          institutionIds.push(row.institutionIds[i].key);
        }

        const { email, isPowerTeacher } = this.state;
        const newUser = {
          firstName: firstName[0],
          lastName,
          password: row.password,
          email,
          institutionIds,
          isPowerTeacher
        };
        this.props.createSchoolAdmin(newUser);
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

  fetchSchool = async value => {
    this.setState({ schoolList: [], fetching: true });
    const searchParam = value ? { search: { name: [{ type: "cont", value }] } } : {};
    const schoolListData = await schoolApi.getSchools({
      districtId: this.props.userOrgId,
      limit: 25,
      page: 1,
      sortField: "name",
      order: "asc",
      ...searchParam
    });
    this.setState({ schoolList: schoolListData.data, fetching: false });
  };

  handleChange = value => {
    this.props.form.setFieldsValue({ institutionIds: value });
    this.setState({
      schoolList: [],
      fetching: false
    });
  };

  changePowerTool = e => this.setState({ isPowerTeacher: e.target.checked });

  validateName = (rule, value, callback) => {
    const { t } = this.props;
    if (!nameValidator(value)) {
      callback(t("users.schooladmin.createsa.validations.name"));
    } else {
      callback();
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible, t } = this.props;
    const { emailValidateStatus, emailValidateMsg, fetching, schoolList, isPowerTeacher } = this.state;

    return (
      <StyledModal
        visible={modalVisible}
        title={t("users.schooladmin.createsa.title")}
        onOk={this.onCreateSchoolAdmin}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <CancelButton onClick={this.onCloseModal}>{t("users.schooladmin.createsa.nocancel")}</CancelButton>
            <OkButton onClick={this.onCreateSchoolAdmin}>{t("users.schooladmin.createsa.yescreate")}</OkButton>
          </ButtonsContainer>
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("users.schooladmin.name")}>
              {getFieldDecorator("name", {
                validateTrigger: ["onBlur"],
                rules: [
                  {
                    validator: this.validateName
                  }
                ]
              })(<Input placeholder={t("users.schooladmin.createsa.entername")} />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem
              label={t("users.schooladmin.username")}
              validateStatus={emailValidateStatus}
              help={emailValidateMsg}
              required
              type="email"
            >
              <Input
                placeholder={t("users.schooladmin.createsa.enteremail")}
                autocomplete="new-password"
                onChange={this.changeEmail}
              />
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("users.schooladmin.password")}>
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                    message: t("users.schooladmin.createsa.validations.password")
                  }
                ]
              })(
                <Input
                  placeholder={t("users.schooladmin.createsa.enterpassword")}
                  type="password"
                  autocomplete="new-password"
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("users.schooladmin.school")}>
              {getFieldDecorator("institutionIds", {
                rules: [
                  {
                    required: true,
                    message: t("users.schooladmin.createsa.validations.school")
                  }
                ]
              })(
                <Select
                  mode="multiple"
                  labelInValue
                  placeholder={t("users.schooladmin.createsa.selectschool")}
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchSchool}
                  onChange={this.handleChange}
                  onFocus={this.fetchSchool}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {schoolList.map(school => (
                    <Option key={school._id} value={school._id}>
                      {school._source.name}
                    </Option>
                  ))}
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem>
              <Checkbox
                checked={isPowerTeacher}
                onChange={this.changePowerTool}
              >
                {t("users.schooladmin.powertools")}
              </Checkbox>
            </ModalFormItem>
          </Col>
        </Row>
      </StyledModal>
    );
  }
}

const CreateSchoolAdminModalForm = Form.create()(CreateSchoolAdminModal);
export default CreateSchoolAdminModalForm;
