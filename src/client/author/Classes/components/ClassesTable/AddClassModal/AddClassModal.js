import React, { Component } from "react";
import { get } from "lodash";
import { Form, Input, Row, Col, Select, Button, Modal, Spin } from "antd";
const Option = Select.Option;

import { schoolApi, userApi } from "@edulastic/api";

import { ModalFormItem } from "./styled";

class AddClassModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schoolList: [],
      fetchingSchool: false,
      teacherList: [],
      fetchingTeacher: []
    };
  }

  onAddClass = () => {
    this.props.form.validateFields((err, user) => {
      if (!err) {
        const teacherArr = [];
        for (let i = 0; i < user.teacher.length; i++) {
          teacherArr.push(user.teacher[i].key);
        }
        const createClassData = {
          name: user.name,
          type: "class",
          owners: teacherArr,
          institutionId: user.institutionId.key,
          subject: user.subject,
          tags: user.tags
        };

        this.props.addClass(createClassData);
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  fetchSchool = async value => {
    this.setState({ schoolList: [], fetchingSchool: true });
    const schoolListData = await schoolApi.getSchools({
      districtId: this.props.userOrgId,
      limit: 25,
      page: 1,
      sortField: "name",
      order: "asc",
      search: { name: { type: "cont", value } }
    });
    this.setState({ schoolList: schoolListData.data, fetchingSchool: false });
  };

  handleSchoolChange = value => {
    this.props.form.setFieldsValue({ institutionId: value });
    this.setState({
      schoolList: [],
      fetchingSchool: false
    });
  };

  fetchTeacher = async value => {
    this.setState({ teacherList: [], fetchingTeacher: true });
    const teacherListData = await userApi.fetchUsers({
      districtId: this.props.userOrgId,
      limit: 25,
      page: 1,
      type: "DISTRICT",
      search: {
        role: "teacher"
      }
    });
    this.setState({ teacherList: teacherListData.data, fetchingTeacher: false });
  };

  handleTeacherChange = value => {
    this.props.form.setFieldsValue({ teacher: value });
    this.setState({
      teacherList: [],
      fetchingTeacher: false
    });
  };

  render() {
    const { modalVisible } = this.props;
    const { fetchingSchool, schoolList, fetchingTeacher, teacherList } = this.state;

    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        visible={modalVisible}
        title="Add Class"
        onOk={this.onAddClass}
        onCancel={this.onCloseModal}
        maskClosable={false}
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
            <ModalFormItem label="Tags">
              {getFieldDecorator("tags", {
                rules: [
                  {
                    required: true,
                    message: "Please select tags"
                  }
                ]
              })(<Select placeholder="Select Tags" mode="tags" />)}
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
                <Select
                  mode="multiple"
                  labelInValue
                  placeholder="Search by Username"
                  notFoundContent={fetchingTeacher ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchTeacher}
                  onChange={this.handleTeacherChange}
                >
                  {teacherList.map(teacher => (
                    <Option key={teacher._id} value={teacher._id}>
                      {get(teacher, ["_source", "firstName"], "") + " " + get(teacher, ["_source", "lastName"], "")}
                    </Option>
                  ))}
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Select School">
              {getFieldDecorator("institutionId", {
                rules: [
                  {
                    required: true,
                    message: "Please select school"
                  }
                ]
              })(
                <Select
                  showSearch
                  labelInValue
                  placeholder="Please Select schools"
                  notFoundContent={fetchingSchool ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchSchool}
                  onChange={this.handleSchoolChange}
                >
                  {schoolList.map(school => (
                    <Option key={school._id} value={school._id}>
                      {school._source.name}
                    </Option>
                  ))}
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

const AddClassModalForm = Form.create()(AddClassModal);
export default AddClassModalForm;
