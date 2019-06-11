import React, { Component } from "react";
import { get, debounce } from "lodash";
import { Form, Input, Row, Col, Select, Button, Modal, Spin } from "antd";
import { grades } from "@edulastic/constants";
import { schoolApi, userApi } from "@edulastic/api";
import { ModalFormItem } from "./styled";

const { Option } = Select;
const { GRADES_LIST } = grades;

class AddClassModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schoolList: [],
      fetchingSchool: false,
      teacherList: [],
      fetchingTeacher: []
    };
    this.fetchSchool = debounce(this.fetchSchool, 1000);
    this.fetchTeacher = debounce(this.fetchTeacher, 1000);
    this.fetchCoursesForDistrict = debounce(this.fetchCoursesForDistrict, 1000);
  }

  onAddClass = () => {
    this.props.form.validateFieldsAndScroll((err, user) => {
      if (!err) {
        const { teacher, name, institutionId, subject, tags, courseId, grade } = user;
        const teacherArr = [];
        for (let i = 0; i < teacher.length; i++) {
          teacherArr.push(teacher[i].key);
        }
        const createClassData = {
          name,
          type: "class",
          owners: teacherArr,
          institutionId: institutionId.key,
          subject,
          tags,
          courseId,
          // here multiple grades has to be sent as a comma separated string
          grade: grade.join(",")
        };
        this.props.addClass(createClassData);
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  fetchSchool = async value => {
    // here searchParams is added only when value exists
    const searchParam = value ? { search: { name: { type: "cont", value } } } : {};
    this.setState({ schoolList: [], fetchingSchool: true });
    const schoolListData = await schoolApi.getSchools({
      districtId: this.props.userOrgId,
      limit: 25,
      page: 1,
      sortField: "name",
      order: "asc",
      ...searchParam
    });
    this.setState({ schoolList: schoolListData.data, fetchingSchool: false });
  };

  handleSchoolChange = () => {
    // this code was commented out since the form handles setting of fields automatically, and
    // there is no need to manually set fields
    // this.props.form.setFieldsValue({ institutionId: value });
    this.setState({
      schoolList: [],
      fetchingSchool: false
    });
  };

  fetchCoursesForDistrict = value => {
    const { userOrgId: districtId, searchCourseList } = this.props;
    const searchTerms = {
      districtId,
      active: 1,
      page: 0,
      limit: 50
    };
    value &&
      Object.assign(searchTerms, {
        search: {
          name: { type: "cont", value },
          number: { type: "cont", value },
          operator: "or"
        }
      });
    searchCourseList(searchTerms);
  };

  fetchTeacher = async value => {
    this.setState({ teacherList: [], fetchingTeacher: true });
    const searchData = {
      districtId: this.props.userOrgId,
      limit: 25,
      page: 1,
      role: "teacher"
    };
    value &&
      Object.assign(searchData, {
        search: {
          username: { type: "con", value }
        }
      });
    const { result: teacherListData } = await userApi.fetchUsers(searchData);
    this.setState({ teacherList: teacherListData, fetchingTeacher: false });
  };

  handleTeacherChange = value => {
    // this code was commented out since the form handles setting of fields automatically, and
    // there is no need to manually set fields
    //this.props.form.setFieldsValue({ teacher: value });
    this.setState({
      teacherList: [],
      fetchingTeacher: false
    });
  };

  render() {
    const { modalVisible, coursesForDistrictList } = this.props;
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
            <ModalFormItem label="Course">
              {getFieldDecorator("courseId")(
                <Select
                  showSearch
                  onSearch={this.fetchCoursesForDistrict}
                  onFocus={this.fetchCoursesForDistrict}
                  notFoundContent={null}
                  placeholder="Please enter 1 or more characters"
                >
                  {coursesForDistrictList.map(course => (
                    <Option key={course._id} value={course._id}>{`${course.name} - ${course.number}`}</Option>
                  ))}
                </Select>
              )}
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
            <ModalFormItem label="Grades">
              {getFieldDecorator("grade", {
                rules: [
                  {
                    required: true,
                    message: "Please select grades"
                  }
                ]
              })(
                <Select mode="multiple" placeholder="Select Grades">
                  {GRADES_LIST.map(({ value, label }) => (
                    <Option key={value} value={value}>
                      {label}
                    </Option>
                  ))}
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
              })(<Select placeholder="Please enter 2 or more characters" mode="tags" />)}
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
                  placeholder="Search by Username - Please enter 3 or more characters"
                  notFoundContent={fetchingTeacher ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchTeacher}
                  onFocus={this.fetchTeacher}
                  onChange={this.handleTeacherChange}
                >
                  {teacherList.map(teacher => (
                    <Option key={teacher._id} value={teacher._id}>
                      {`${get(teacher, ["_source", "firstName"], "")} ${get(teacher, ["_source", "lastName"], "")}`}
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
                  onFocus={this.fetchSchool}
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
