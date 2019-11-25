import React, { Component } from "react";
import { Form, Input, Row, Col, Button, Modal } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { StyledSpinContainer, StyledSpin } from "./styled";

import { ButtonsContainer, OkButton, CancelButton, StyledModal, ModalFormItem } from "../../../../../common/styled";

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
      numberValidate: {
        value: "",
        validateStatus: "success",
        validateMsg: ""
      }
    };
  }

  onAddCourse = async () => {
    let { nameValidate, numberValidate } = this.state;

    if (nameValidate.value.length == 0) {
      this.setState({
        nameValidate: {
          value: nameValidate.value,
          validateMsg: "Please input course name",
          validateStatus: "error"
        }
      });
    }

    if (numberValidate.value.length == 0) {
      this.setState({
        numberValidate: {
          value: numberValidate.value,
          validateMsg: "Please input course number",
          validateStatus: "error"
        }
      });
    }

    //check if name is exist
    if (
      nameValidate.validateStatus === "success" &&
      nameValidate.value.length > 0 &&
      numberValidate.validateStatus === "success" &&
      numberValidate.value.length > 0
    ) {
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
        }
      });
    } else {
      this.setState({
        nameValidate: {
          value: e.target.value,
          validateStatus: "success",
          validateMsg: ""
        }
      });
    }

    const numberValidate = { ...this.state.numberValidate };
    if (numberValidate.value.length > 0) {
      this.setState({
        numberValidate: {
          value: numberValidate.value,
          validateStatus: "success",
          validateMsg: ""
        }
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
        }
      });
    } else {
      this.setState({
        numberValidate: {
          value: e.target.value,
          validateStatus: "success",
          validateMsg: ""
        }
      });
    }

    const nameValidate = { ...this.state.nameValidate };
    if (nameValidate.value.length > 0) {
      this.setState({
        nameValidate: {
          value: nameValidate.value,
          validateStatus: "success",
          validateMsg: ""
        }
      });
    }
  };

  render() {
    const { modalVisible, t } = this.props;
    const { nameValidate, numberValidate, showSpin } = this.state;

    return (
      <StyledModal
        visible={modalVisible}
        title={t("course.addcourse")}
        onOk={this.onAddCourse}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <CancelButton onClick={this.onCloseModal}>{t("common.cancel")}</CancelButton>
            <OkButton onClick={this.onAddCourse}>{t("common.add")}</OkButton>
          </ButtonsContainer>
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem
              name="name"
              label={t("course.coursename")}
              validateStatus={nameValidate.validateStatus}
              help={nameValidate.validateMsg}
              required={true}
            >
              <Input placeholder={t("course.coursename")} onChange={this.handleCourseName} />
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem
              label={t("course.coursenumber")}
              name="number"
              validateStatus={numberValidate.validateStatus}
              help={numberValidate.validateMsg}
              required={true}
            >
              <Input placeholder={t("course.coursenumber")} onChange={this.handleCourseNumber} />
            </ModalFormItem>
          </Col>
        </Row>
        {showSpin && (
          <StyledSpinContainer>
            <StyledSpin size="large" />
          </StyledSpinContainer>
        )}
      </StyledModal>
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
