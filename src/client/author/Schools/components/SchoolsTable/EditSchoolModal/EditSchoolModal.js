import React, { Component } from "react";
import { Form, Input, Row, Col } from "antd";
import { StyledEditSchoolModal, ModalTtile, StyledButton, StyledDescription, ModalFormItem } from "./styled";

class EditSchoolModal extends React.Component {
  onUpdateSchool = () => {
    this.props.form.validateFields((err, row) => {
      if (!err) {
        row.key = this.props.schoolData.key;
        this.props.updateSchool(row);
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible, schoolData } = this.props;
    return (
      <StyledEditSchoolModal
        visible={modalVisible}
        title={<ModalTtile>Edit School</ModalTtile>}
        onOk={this.onUpdateSchool}
        onCancel={this.onCloseModal}
        footer={[
          <StyledButton key="submit" onClick={this.onUpdateSchool}>
            Update School >
          </StyledButton>
        ]}
      >
        <StyledDescription>School Id - {schoolData._id}</StyledDescription>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Name">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Please input school name"
                  }
                ],
                initialValue: schoolData.name
              })(<Input placeholder="Enter School Name" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Address">
              {getFieldDecorator("address", {
                rules: [
                  {
                    required: true,
                    message: "Please input school address"
                  }
                ],
                initialValue: schoolData.address
              })(<Input placeholder="Enter School Address" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="City">
              {getFieldDecorator("city", {
                rules: [
                  {
                    required: true,
                    message: "Please input city name"
                  }
                ],
                initialValue: schoolData.city
              })(<Input placeholder="Enter City Name" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <ModalFormItem label="Zip">
              {getFieldDecorator("zip", {
                rules: [
                  {
                    required: true,
                    message: "Please input zip code"
                  }
                ],
                initialValue: schoolData.zip
              })(<Input placeholder="Enter Zip Code" />)}
            </ModalFormItem>
          </Col>
          <Col span={12}>
            <ModalFormItem label="State">
              {getFieldDecorator("state", {
                rules: [
                  {
                    required: true,
                    message: "Please input state"
                  }
                ],
                initialValue: schoolData.state
              })(<Input placeholder="Enter State" />)}
            </ModalFormItem>
          </Col>
        </Row>
      </StyledEditSchoolModal>
    );
  }
}

const EditSchoolModalForm = Form.create()(EditSchoolModal);
export default EditSchoolModalForm;
