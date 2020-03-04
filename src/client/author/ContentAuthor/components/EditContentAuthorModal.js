import React from "react";
import { Form, Input, Row, Col } from "antd";

import {
  ButtonsContainer,
  OkButton,
  CancelButton,
  StyledModal,
  ModalFormItem
} from "../../../common/styled";

const EditContentAuthorModal = ({
  districtAdminData,
  updateDistrictAdmin,
  userOrgId,
  form,
  closeModal,
  modalVisible,
  districtAdminData: { _source }
}) => {
  const onSaveContentAuthor = () => {
    form.validateFields((err, row) => {
      if (!err) {
        updateDistrictAdmin({
          userId: districtAdminData._id,
          data: Object.assign(row, {
            districtId: userOrgId
          })
        });
        closeModal();
      }
    });
  };

  const { getFieldDecorator } = form;

  return (
    <StyledModal
      visible={modalVisible}
      title="Edit District Admin"
      onOk={onSaveContentAuthor}
      onCancel={closeModal}
      maskClosable={false}
      width="800px"
      centered
      footer={[
        <ButtonsContainer>
          <CancelButton onClick={closeModal}>No, Cancel</CancelButton>
          <OkButton onClick={onSaveContentAuthor}>Yes, Update</OkButton>
        </ButtonsContainer>
      ]}
    >
      <Row>
        <Col span={12}>
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
        <Col span={12}>
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
    </StyledModal>
  );
};

const EditContentAuthorModalForm = Form.create()(EditContentAuthorModal);
export default EditContentAuthorModalForm;
