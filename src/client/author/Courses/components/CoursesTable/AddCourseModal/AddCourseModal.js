import React, { Component } from "react";
import { Form, Input, Row, Col, Button, Modal } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { ModalFormItem, StyledSpinContainer, StyledSpin } from "./styled";

import { courseApi } from "@edulastic/api";

class AddCourseModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameValidate: {
        value: "",
        validateStatus: "success",
        validateMsg: ""
      },
      showSpinName: false,
      checkCourseExist: { totalCourses: 0, result: [] },
      numberValidate: {
        value: "",
        validateStatus: "success",
        validateMsg: ""
      },
      showSpinNumber: false,
      checkCourseNumberExist: { totalCourses: 0, result: [] }
    };
  }

  onAddCourse = async () => {
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

      if (checkCourseNameExist.totalCourses > 0) {
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
    if (checkCourseNameExist.totalCourses > 0 && numberValidate.value.length > 0) {
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

      if (checkCourseNumberExist.totalCourses > 0) {
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
      this.props.addCourse({ name: nameValidate.value, number: numberValidate.value });
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
        checkCourseNameExist: { totalCourses: 0, data: [] }
      });
    } else {
      this.setState({
        nameValidate: {
          value: e.target.value,
          validateStatus: "success",
          validateMsg: ""
        },
        checkCourseNameExist: { totalCourses: 0, data: [] }
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
    const { modalVisible } = this.props;
    const { nameValidate, numberValidate, showSpinName, showSpinNumber } = this.state;

    return (
      <Modal
        visible={modalVisible}
        title="Add Course"
        onOk={this.onAddCourse}
        onCancel={this.onCloseModal}
        maskClosable={false}
        footer={[
          <Button type="primary" key="submit" onClick={this.onAddCourse}>
            Add Course >
          </Button>
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem
              name="name"
              label="Course Name"
              validateStatus={nameValidate.validateStatus}
              help={nameValidate.validateMsg}
              required={true}
            >
              <Input placeholder="Course name" onChange={this.handleCourseName} />
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
              <Input placeholder="Course number" onChange={this.handleCourseNumber} />
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

const AddCourseModalForm = Form.create()(AddCourseModal);

const enhance = compose(
  connect(state => ({
    dataSource: get(state, ["coursesReducer", "data"], [])
  }))
);

export default enhance(AddCourseModalForm);
