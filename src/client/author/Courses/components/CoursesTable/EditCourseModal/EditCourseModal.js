import React, { Component } from "react";
import { Form, Input, Row, Col, Button, Modal } from "antd";

import { StyledModal, ModalFormItem } from "./styled";

class EditCourseModal extends React.Component {
  onSaveCourse = () => {
    this.props.form.validateFields((err, row) => {
      if (!err) {
        this.props.saveCourse(row);
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  checkNameUnique = (rule, value, callback) => {
    const dataSource = this.props.dataSource.filter(item => item.key != this.props.courseData.key);
    const sameNameRow = dataSource.filter(item => item.name === value);
    if (sameNameRow.length <= 0) {
      callback();
      return;
    }
    callback("Course name should be unique.");
  };

  render() {
    const { modalVisible, courseData } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        visible={modalVisible}
        title="Edit Course"
        onOk={this.onSaveCourse}
        onCancel={this.onCloseModal}
        maskClosable={false}
        footer={[
          <Button type="primary" key="submit" onClick={this.onSaveCourse}>
            Save Course >
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
                  },
                  { validator: this.checkNameUnique }
                ],
                initialValue: courseData.name
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
                ],
                initialValue: courseData.number
              })(<Input placeholder="Course number" />)}
            </ModalFormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

const EditCourseModalForm = Form.create()(EditCourseModal);
export default EditCourseModalForm;
