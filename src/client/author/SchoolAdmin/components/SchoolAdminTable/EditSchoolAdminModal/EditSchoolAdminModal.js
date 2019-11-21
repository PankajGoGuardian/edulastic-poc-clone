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
      schoolsList
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
        title="Edit School Admin"
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
            <ModalFormItem label="First Name">
              {getFieldDecorator("firstName", {
                rules: [
                  {
                    required: true,
                    message: "Please input First Name"
                  }
                ],
                initialValue: _source.firstName
              })(<Input placeholder="Enter First Name" />)}
            </ModalFormItem>
          </Col>
          <Col span={24}>
            <ModalFormItem label="Last Name">
              {getFieldDecorator("lastName", {
                rules: [
                  {
                    required: true,
                    message: "Please input Last Name"
                  }
                ],
                initialValue: _source.lastName
              })(<Input placeholder="Enter Last Name" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Email">
              {getFieldDecorator("email", {
                rules: [
                  {
                    required: true,
                    message: "Please input E-mail"
                  },
                  {
                    type: "email",
                    message: "The input is not valid E-mail"
                  }
                ],
                initialValue: _source.email
              })(<Input placeholder="Enter E-mail" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Select School">
              {getFieldDecorator("institutionIds", {
                rules: [
                  {
                    required: true,
                    message: "Please select school"
                  }
                ],
                initialValue: _source.institutionIds
              })(
                <Select
                  mode="multiple"
                  placeholder="Select school"
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
