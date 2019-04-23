import React, { Component } from "react";
import { Form, Input, Row, Col, Button, Modal } from "antd";

import { ModalFormItem } from "./styled";

class AddCourseModal extends React.Component {
  onAddCourse = () => {
    this.props.form.validateFields((err, row) => {
      if (!err) {
        this.props.addCourse(row);
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  render() {
    const { modalVisible } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        visible={modalVisible}
        title="Add Course"
        onOk={this.onAddCourse}
        onCancel={this.onCloseModal}
        footer={[
          <Button type="primary" key="submit" onClick={this.onAddCourse}>
            Add Course >
          </Button>
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem label="Course Name">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Please input course name"
                  }
                ]
              })(<Input placeholder="Course name" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Course Number">
              {getFieldDecorator("number", {
                rules: [
                  {
                    required: true,
                    message: "Please input course number"
                  }
                ]
              })(<Input placeholder="Course number" />)}
            </ModalFormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

const AddCourseModalForm = Form.create()(AddCourseModal);
export default AddCourseModalForm;
