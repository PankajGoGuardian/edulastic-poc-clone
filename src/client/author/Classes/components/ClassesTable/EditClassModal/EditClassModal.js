import React, { Component } from "react";
import { Form, Input, Row, Col, Select, Button, Modal } from "antd";
const Option = Select.Option;

import { ModalFormItem } from "./styled";

class EditClassModal extends Component {
  onSaveClass = () => {
    this.props.form.validateFields((err, row) => {
      const { selClassData: { _source: { parent, districtId } = {} } = {} } = this.props;
      if (!err) {
        const saveClassData = {
          name: row.name,
          type: "class",
          owners: row.teacher,
          parent,
          districtId,
          institutionId: row.institutionId,
          subject: row.subject,
          grade: row.grade
        };
        this.props.saveClass(saveClassData);
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  render() {
    const { modalVisible, selClassData } = this.props;
    const { _source: { owners = [], name, subject, grade, institutionId } = {} } = selClassData;
    const ownersData = owners.map(row => row.id);

    const schoolsOptions = [];
    // if (schoolsData.length !== undefined) {
    //   schoolsData.map((row, index) => {
    //     schoolsOptions.push(
    //       <Option key={index} value={row._id}>
    //         {row.name}
    //       </Option>
    //     );
    //   });
    // }

    const gradeOptions = [];
    gradeOptions.push(<Option value={"0"}>KinderGarten</Option>);
    for (let i = 1; i <= 12; i++) gradeOptions.push(<Option value={i.toString()}>Grade {i}</Option>);
    gradeOptions.push(<Option value="other">Other</Option>);

    const teacherOptions = [];
    // if (teacherList.length !== undefined) {
    //   teacherList.map(row => {
    //     teacherOptions.push(<Option value={row._id}>{row.firstName + " " + row.lastName}</Option>);
    //   });
    // }

    const { getFieldDecorator } = this.props.form;
    const {} = this.props;
    return (
      <Modal
        visible={modalVisible}
        title="Edit Class"
        onOk={this.onSaveClass}
        onCancel={this.onCloseModal}
        maskClosable={false}
        footer={[
          <Button type="primary" key="submit" onClick={this.onSaveClass}>
            Save Class >
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
                ],
                initialValue: name
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
                ],
                initialValue: subject
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
            <ModalFormItem label="Grade">
              {getFieldDecorator("grade", {
                rules: [
                  {
                    required: true,
                    message: "Please select grade"
                  }
                ],
                initialValue: grade
              })(<Select placeholder="Select Grade">{gradeOptions}</Select>)}
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
                ],
                initialValue: ownersData
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
                ],
                initialValue: institutionId
              })(<Select placeholder="Select School">{schoolsOptions}</Select>)}
            </ModalFormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

const EditClassModalForm = Form.create()(EditClassModal);
export default EditClassModalForm;
