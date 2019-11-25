import React, { Component } from "react";
import { Form, Input, Row, Col, Select, Button } from "antd";
const Option = Select.Option;

import { ButtonsContainer, OkButton, CancelButton, StyledModal, ModalFormItem } from "../../../../../common/styled";

class EditSchoolAdminModal extends Component {
  onSaveSchoolAdmin = () => {
    this.props.form.validateFields((err, row) => {
      if (!err) {
        const { schoolAdminData, updateSchoolAdmin, userOrgId } = this.props;
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

  onCloseModal = () => {
    this.props.closeModal();
  };

  render() {
    const {
      modalVisible,
      schoolAdminData: { _source },
      schoolsList,
      t
    } = this.props;
    const schoolsOptions = [];
    schoolsList.map((row, index) => {
      schoolsOptions.push(
        <Option key={index} value={row._id}>
          {row.name}
        </Option>
      );
    });

    const { getFieldDecorator } = this.props.form;
    return (
      <StyledModal
        visible={modalVisible}
        title={t("users.schooladmin.editsa.title")}
        onOk={this.onCreateSchoolAdmin}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <CancelButton onClick={this.onCloseModal}>No, Cancel</CancelButton>
            <OkButton onClick={this.onSaveSchoolAdmin}>Yes, Update</OkButton>
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
              })(<Input placeholder={t("users.schooladmin.editsa.enterfirstname")} />)}
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
              })(<Input placeholder={t("users.schooladmin.editsa.enterlastname")} />)}
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
              })(<Input placeholder={t("users.schooladmin.editsa.enteremail")} />)}
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
                <Select
                  mode="multiple"
                  placeholder={t("users.schooladmin.editsa.selectschool")}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {schoolsOptions}
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
      </StyledModal>
    );
  }
}

const EditSchoolAdminModalForm = Form.create()(EditSchoolAdminModal);
export default EditSchoolAdminModalForm;
