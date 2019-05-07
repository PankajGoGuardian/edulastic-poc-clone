import React, { Component } from "react";
import { Form, Input, Row, Col, Select, Button, Modal } from "antd";
const Option = Select.Option;

import { ModalFormItem } from "./styled";

class AddClassModal extends React.Component {
  onAddClass = () => {
    this.props.form.validateFields((err, user) => {
      if (!err) {
        const createClassData = {
          name: user.name,
          type: "class",
          owners: user.teacher,
          institutionId: user.institutionId,
          subject: user.subject
        };

        this.props.addClass(createClassData);
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  render() {
    const { schoolsData, teacherList, modalVisible } = this.props;
    const schoolsOptions = [];
    if (schoolsData.length !== undefined) {
      schoolsData.map((row, index) => {
        schoolsOptions.push(
          <Option key={index} value={row._id}>
            {row.name}
          </Option>
        );
      });
    }

    const teacherOptions = [];
    if (teacherList.length !== undefined) {
      teacherList.map(row => {
        const name = `${row.firstName || ""}${row.lastName || ""}`;
        teacherOptions.push(<Option value={row._id}>{name}</Option>);
      });
    }

    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        visible={modalVisible}
        title="Add Class"
        onOk={this.onAddClass}
        onCancel={this.onCloseModal}
        footer={[
          <Button type="primary" key="submit" onClick={this.onAddClass}>
            Add Class >
          </Button>
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem label="Class Name">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Please input class name"
                  }
                ]
              })(<Input placeholder="Class name" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Subject">
              {getFieldDecorator("subject", {
                rules: [
                  {
                    required: true,
                    message: "Please select subject"
                  }
                ]
              })(
                <Select placeholder="Select Subject">
                  <Option value="Mathematics">Mathematics</Option>
                  <Option value="ELA">ELA</Option>
                  <Option value="Science">Science</Option>
                  <Option value="Social Studies">Social Studies</Option>
                  <Option value="Other Subjects">Other Subjects</Option>
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Teacher Name">
              {getFieldDecorator("teacher", {
                rules: [
                  {
                    required: true,
                    message: "Please select teacher"
                  }
                ]
              })(
                <Select mode="multiple" placeholder="Search by Username">
                  {teacherOptions}
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="School">
              {getFieldDecorator("institutionId", {
                rules: [
                  {
                    required: true,
                    message: "Please select school"
                  }
                ]
              })(<Select placeholder="Select School">{schoolsOptions}</Select>)}
            </ModalFormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

const AddClassModalForm = Form.create()(AddClassModal);
export default AddClassModalForm;
