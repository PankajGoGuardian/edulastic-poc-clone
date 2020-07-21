import { CheckboxLabel, CustomModalStyled, EduButton, SelectInputStyled, TextInputStyled } from "@edulastic/common";
import { Col, Form, Row, Select } from "antd";
import { omit, uniqBy } from "lodash";
import React, { Component } from "react";
import { ButtonsContainer, ModalFormItem } from "../../../../../common/styled";

const Option = Select.Option;

class EditSchoolAdminModal extends Component {
  onSaveSchoolAdmin = () => {
    this.props.form.validateFields((err, row = {}) => {
      if (!err) {
        const { schoolAdminData, updateSchoolAdmin, userOrgId } = this.props;
        if (!row.password) row = omit(row, ["password"]);
        row = omit(row, ["confirmPassword"]);
        updateSchoolAdmin({
          userId: schoolAdminData._id,
          data: Object.assign(row, {
            districtId: userOrgId
          })
        });
        this.onCloseModal();
      }
    });
  };

  handleConfirmPassword = (rule, value, callback) => {
    const { form = {} } = this.props;
    const { getFieldValue } = form;
    const password = getFieldValue("password");
    const confirmPassword = getFieldValue("confirmPassword");

    if (password !== confirmPassword) return callback("Password does not match");

    callback(); // no error
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  render() {
    const {
      modalVisible,
      schoolAdminData: { _source },
      schoolsList = [],
      t
    } = this.props;

    let { institutionDetails = [] } = _source;
    let schooleFinalList = [...schoolsList];
    if (institutionDetails.length) {
      institutionDetails = institutionDetails
        .filter(({ id = "", name = "" }) => id && name)
        .map(({ id, name }) => ({ _id: id, name }));
      schooleFinalList = uniqBy([...schooleFinalList, ...institutionDetails], "_id");
    }

    const schoolsOptions = [];
    schooleFinalList.map((row, index) => {
      schoolsOptions.push(
        <Option key={index} value={row?._id}>
          {row?.name}
        </Option>
      );
    });

    const { getFieldDecorator } = this.props.form;
    return (
      <CustomModalStyled
        visible={modalVisible}
        title={t("users.schooladmin.editsa.title")}
        onOk={this.onCreateSchoolAdmin}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <EduButton isGhost onClick={this.onCloseModal}>No, Cancel</EduButton>
            <EduButton onClick={this.onSaveSchoolAdmin}>Yes, Update</EduButton>
          </ButtonsContainer>
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("users.schooladmin.firstname")}>
              {getFieldDecorator("firstName", {
                rules: [
                  {
                    required: true,
                    message: t("users.schooladmin.editsa.validations.firstname")
                  }
                ],
                initialValue: _source.firstName
              })(<TextInputStyled placeholder={t("users.schooladmin.editsa.enterfirstname")} />)}
            </ModalFormItem>
          </Col>
          <Col span={24}>
            <ModalFormItem label={t("users.schooladmin.lastname")}>
              {getFieldDecorator("lastName", {
                rules: [
                  {
                    required: true,
                    message: t("users.schooladmin.editsa.validations.lastname")
                  }
                ],
                initialValue: _source.lastName
              })(<TextInputStyled placeholder={t("users.schooladmin.editsa.enterlastname")} />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("users.schooladmin.email")}>
              {getFieldDecorator("email", {
                rules: [
                  {
                    required: true,
                    message: t("users.schooladmin.editsa.validations.email")
                  },
                  {
                    type: "email",
                    message: t("users.schooladmin.editsa.validations.invalidemail")
                  }
                ],
                initialValue: _source.email
              })(<TextInputStyled placeholder={t("users.schooladmin.editsa.enteremail")} />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("users.schooladmin.editsa.password")}>
              {getFieldDecorator("password", {})(
                <TextInputStyled type="password" placeholder={t("users.schooladmin.editsa.enterpassword")} />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("users.schooladmin.editsa.confirmpassword")}>
              {getFieldDecorator("confirmPassword", {
                rules: [
                  {
                    validator: this.handleConfirmPassword,
                    message: t("users.schooladmin.editsa.validations.invalidpassword")
                  }
                ]
              })(<TextInputStyled type="password" placeholder={t("users.schooladmin.editsa.enterconfirmpassword")} />)}
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
                    message: t("users.schooladmin.editsa.validations.school")
                  }
                ],
                initialValue: _source.institutionIds
              })(
                <SelectInputStyled
                  mode="multiple"
                  placeholder={t("users.schooladmin.editsa.selectschool")}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {schoolsOptions}
                </SelectInputStyled>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem style={{ margin: "0px" }}>
              {getFieldDecorator("isPowerTeacher", {
                initialValue: _source?.isPowerTeacher,
                valuePropName: "checked"
              })(
                <CheckboxLabel>
                  {t("users.schooladmin.powertools")}
                </CheckboxLabel>
              )}
            </ModalFormItem>
          </Col>
        </Row>
      </CustomModalStyled>
    );
  }
}

const EditSchoolAdminModalForm = Form.create()(EditSchoolAdminModal);
export default EditSchoolAdminModalForm;
