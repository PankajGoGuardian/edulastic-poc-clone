import React, { Component } from 'react'
import Form from "antd/es/Form";
import Input from "antd/es/Input";
import Row from "antd/es/Row";
import Col from "antd/es/Col";

import {
  ButtonsContainer,
  OkButton,
  CancelButton,
  StyledModal,
  ModalFormItem,
} from '../../../../../common/styled'

class EditDistrictAdminModal extends React.Component {
  onSaveDistrictAdmin = () => {
    this.props.form.validateFields((err, row) => {
      if (!err) {
        const { districtAdminData, updateDistrictAdmin, userOrgId } = this.props
        updateDistrictAdmin({
          userId: districtAdminData._id,
          data: Object.assign(row, {
            districtId: userOrgId,
          }),
        })
        this.onCloseModal()
      }
    })
  }

  onCloseModal = () => {
    this.props.closeModal()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {
      modalVisible,
      districtAdminData: { _source },
    } = this.props
    return (
      <StyledModal
        visible={modalVisible}
        title="Edit District Admin"
        onOk={this.onSaveDistrictAdmin}
        onCancel={this.onCloseModal}
        maskClosable={false}
        width="800px"
        centered
        footer={[
          <ButtonsContainer>
            <CancelButton onClick={this.onCloseModal}>No, Cancel</CancelButton>
            <OkButton onClick={this.onSaveDistrictAdmin}>Yes, Update</OkButton>
          </ButtonsContainer>,
        ]}
      >
        <Row>
          <Col span={12}>
            <ModalFormItem label="First Name">
              {getFieldDecorator('firstName', {
                rules: [
                  {
                    required: true,
                    message: 'Please input First Name',
                  },
                ],
                initialValue: _source.firstName,
              })(<Input placeholder="Enter First Name" />)}
            </ModalFormItem>
          </Col>
          <Col span={12}>
            <ModalFormItem label="Last Name">
              {getFieldDecorator('lastName', {
                rules: [
                  {
                    required: true,
                    message: 'Please input Last Name',
                  },
                ],
                initialValue: _source.lastName,
              })(<Input placeholder="Enter Last Name" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Email">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: 'Please input E-mail',
                  },
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail',
                  },
                ],
                initialValue: _source.email,
              })(<Input placeholder="Enter E-mail" />)}
            </ModalFormItem>
          </Col>
        </Row>
      </StyledModal>
    )
  }
}

const EditDistrictAdminModalForm = Form.create()(EditDistrictAdminModal)
export default EditDistrictAdminModalForm
