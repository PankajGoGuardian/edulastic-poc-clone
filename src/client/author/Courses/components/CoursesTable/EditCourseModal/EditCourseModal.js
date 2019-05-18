import React, { Component } from "react";
import { Form, Input, Row, Col, Button, Modal } from "antd";

import { ModalFormItem, StyledSpinContainer, StyledSpin } from "./styled";

import { courseApi } from "@edulastic/api";

class EditCourseModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameValidate: {
        value: this.props.courseData.name,
        validateStatus: "success",
        validateMsg: ""
      },
      showSpin: false,
      checkCourseExist: { totalCourses: 0, result: [] }
    };
  }

  onSaveCourse = async () => {
    const { nameValidate } = this.state;
    let checkCourseExist = { ...this.state.checkCourseExist };

    if (nameValidate.validateStatus === "success" && nameValidate.value.length > 0) {
      this.setState({ showSpin: true });
      checkCourseExist = await courseApi.searchCourse({
        districtId: this.props.userOrgId,
        page: 1,
        limit: 25,
        sortField: "name",
        order: "asc",
        search: {
          name: {
            type: "eq",
            value: nameValidate.value
          }
        }
      });
      this.setState({ showSpin: false, checkCourseExist });

      if (checkCourseExist.totalCourses > 0 && checkCourseExist.result[0]._id !== this.props.courseData._id) {
        this.setState({
          nameValidate: {
            value: nameValidate.value,
            validateStatus: "error",
            validateMsg: "Course name already exist"
          }
        });
      }
    } else {
      if (nameValidate.value.length == 0) {
        this.setState({
          nameValidate: {
            value: nameValidate.value,
            validateStatus: "error",
            validateMsg: "Please input course name"
          }
        });
      }
    }

    this.props.form.validateFields((err, row) => {
      if (!err) {
        if (checkCourseExist.totalCourses > 0 && checkCourseExist.result[0]._id !== this.props.courseData._id) return;
        this.props.saveCourse(row);
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  handleCourseName = e => {
    if (e.target.value.length == 0) {
      this.setState({
        nameValidate: {
          value: e.target.value,
          validateStatus: "error",
          validateMsg: "Please input course name"
        },
        checkCourseExist: { totalCourses: 0, data: [] }
      });
    } else {
      this.setState({
        nameValidate: {
          value: e.target.value,
          validateStatus: "success",
          validateMsg: ""
        },
        checkCourseExist: { totalCourses: 0, data: [] }
      });
    }
  };

  render() {
    const { modalVisible, courseData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { nameValidate, showSpin } = this.state;
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
            <ModalFormItem
              label="Course Name"
              validateStatus={nameValidate.validateStatus}
              help={nameValidate.validateMsg}
            >
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Please input course name"
                  }
                ],
                initialValue: courseData.name
              })(<Input placeholder="Course name" onChange={this.handleCourseName} />)}
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
        {showSpin && (
          <StyledSpinContainer>
            <StyledSpin size="large" />
          </StyledSpinContainer>
        )}
      </Modal>
    );
  }
}

const EditCourseModalForm = Form.create()(EditCourseModal);
export default EditCourseModalForm;
