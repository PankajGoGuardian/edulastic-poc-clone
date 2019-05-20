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
      showSpinName: false,
      checkCourseExist: { totalCourses: 0, result: [] },
      numberValidate: {
        value: this.props.courseData.number,
        validateStatus: "success",
        validateMsg: ""
      },
      showSpinNumber: false,
      checkCourseNumberExist: { totalCourses: 0, result: [] }
    };
  }

  onSaveCourse = async () => {
    let { nameValidate, numberValidate, checkCourseNameExist, checkCourseNumberExist } = this.state;

    //check if name is exist
    if (nameValidate.validateStatus === "success" && nameValidate.value.length > 0) {
      this.setState({ showSpinName: true });
      checkCourseNameExist = await courseApi.searchCourse({
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
      this.setState({ showSpinName: false, checkCourseNameExist });

      if (checkCourseNameExist.totalCourses > 0 && checkCourseNameExist.result[0]._id !== this.props.courseData._id) {
        nameValidate = {
          value: nameValidate.value,
          validateStatus: "error",
          validateMsg: "Course name already exists"
        };
        this.setState({ nameValidate });
      }
    } else if (nameValidate.value.length == 0) {
      nameValidate = {
        value: nameValidate.value,
        validateStatus: "error",
        validateMsg: "Please input name"
      };
      this.setState({ nameValidate });
    }

    // check if course number exist
    if (numberValidate.validateStatus === "success" && numberValidate.value.length > 0) {
      this.setState({ showSpinNumber: true });
      checkCourseNumberExist = await courseApi.searchCourse({
        districtId: this.props.userOrgId,
        page: 1,
        limit: 25,
        sortField: "number",
        order: "asc",
        search: {
          number: {
            type: "eq",
            value: numberValidate.value
          }
        }
      });
      this.setState({ showSpinNumber: false, checkCourseNumberExist });

      if (
        checkCourseNumberExist.totalCourses > 0 &&
        checkCourseNumberExist.result[0]._id !== this.props.courseData._id
      ) {
        numberValidate = {
          value: numberValidate.value,
          validateStatus: "error",
          validateMsg: "Course number already exists"
        };
        this.setState({ numberValidate });
      }
    } else if (numberValidate.value.length == 0) {
      numberValidate = {
        value: numberValidate.value,
        validateStatus: "error",
        validateMsg: "Please input course number"
      };
      this.setState({ numberValidate });
    }

    if (nameValidate.validateStatus === "success" && numberValidate.validateStatus === "success") {
      alert("Success");
      // this.props.saveCourse({ name: nameValidate.value, number: numberValidate.value });
    }
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

  handleCourseNumber = e => {
    if (e.target.value.length == 0) {
      this.setState({
        numberValidate: {
          value: e.target.value,
          validateStatus: "error",
          validateMsg: "Please input course number"
        },
        checkCourseNumberExist: { totalCourses: 0, data: [] }
      });
    } else {
      this.setState({
        numberValidate: {
          value: e.target.value,
          validateStatus: "success",
          validateMsg: ""
        },
        checkCourseNumberExist: { totalCourses: 0, data: [] }
      });
    }
  };

  render() {
    const { modalVisible, courseData } = this.props;
    const { nameValidate, numberValidate, showSpinName, showSpinNumber } = this.state;
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
              name="name"
              validateStatus={nameValidate.validateStatus}
              help={nameValidate.validateMsg}
              required={true}
            >
              <Input placeholder="Course name" defaultValue={courseData.name} onChange={this.handleCourseName} />
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem
              label="Course Number"
              name="number"
              validateStatus={numberValidate.validateStatus}
              help={numberValidate.validateMsg}
              required={true}
            >
              <Input defaultValue={courseData.number} placeholder="Course number" onChange={this.handleCourseNumber} />
            </ModalFormItem>
          </Col>
        </Row>
        {(showSpinName || showSpinNumber) && (
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
