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
      showSpin: false,
      checkCourseExist: { totalCourses: 0, result: [] }
    };
  }

  onAddCourse = async () => {
    const { nameValidate } = this.state;
    let checkCourseExist = { ...this.state.checkCourseExist };

    this.setState({ showSpin: true });

    if (nameValidate.validateStatus === "success" && nameValidate.value.length > 0) {
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

      if (checkCourseExist.totalCourses > 0) {
        this.setState({
          nameValidate: {
            value: nameValidate.value,
            validateStatus: "error",
            validateMsg: "Course name already exists"
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
        if (checkCourseExist.totalCourses > 0) return;
        this.props.addCourse(row);
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
    const { modalVisible } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { nameValidate, showSpin } = this.state;

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
                ]
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
                ]
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

const AddCourseModalForm = Form.create()(AddCourseModal);

const enhance = compose(
  connect(state => ({
    dataSource: get(state, ["coursesReducer", "data"], [])
  }))
);

export default enhance(AddCourseModalForm);
