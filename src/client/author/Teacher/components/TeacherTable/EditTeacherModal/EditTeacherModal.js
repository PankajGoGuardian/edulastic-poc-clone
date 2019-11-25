import React, { Component } from "react";
import { Form, Input, Row, Col } from "antd";

import { ButtonsContainer, OkButton, CancelButton, StyledModal, ModalFormItem } from "../../../../../common/styled";

class EditTeacherModal extends Component {
  onSaveTeacher = () => {
    this.props.form.validateFields((err, row) => {
      if (!err) {
        const { data, editTeacher, userOrgId } = this.props;
        editTeacher({
          userId: data?._id,
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
      data: { _source },
      form: { getFieldDecorator },
      t
    } = this.props;
    return (
      <StyledModal
        visible={modalVisible}
        title={t("users.teacher.editteacher.title")}
        onOk={this.onSaveTeacher}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <CancelButton onClick={this.onCloseModal}>{t("users.teacher.editteacher.nocancel")}</CancelButton>
            <OkButton onClick={this.onSaveTeacher}>{t("users.teacher.editteacher.yesupdate")}</OkButton>
          </ButtonsContainer>
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("users.teacher.editteacher.firstname")}>
              {getFieldDecorator("firstName", {
                rules: [
                  {
                    required: true,
                    message: t("users.teacher.editteacher.validations.firstname")
                  }
                ],
                initialValue: _source?.firstName
              })(<Input placeholder={t("users.teacher.editteacher.enterfirstname")} />)}
            </ModalFormItem>
          </Col>
          <Col span={24}>
            <ModalFormItem label={t("users.teacher.editteacher.lastname")}>
              {getFieldDecorator("lastName", {
                rules: [
                  {
                    required: true,
                    message: t("users.teacher.editteacher.validations.lastname")
                  }
                ],
                initialValue: _source?.lastName
              })(<Input placeholder={t("users.teacher.editteacher.enterlastname")} />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("users.teacher.editteacher.email")}>
              {getFieldDecorator("email", {
                rules: [
                  {
                    required: true,
                    message: t("users.teacher.editteacher.validations.email")
                  },
                  {
                    type: "email",
                    message: t("users.teacher.editteacher.validations.invalidemail")
                  }
                ],
                initialValue: _source?.email
              })(<Input placeholder={t("users.teacher.editteacher.enteremail")} />)}
            </ModalFormItem>
          </Col>
        </Row>
      </StyledModal>
    );
  }
}

const EditTeacherModalForm = Form.create()(EditTeacherModal);
export default EditTeacherModalForm;
