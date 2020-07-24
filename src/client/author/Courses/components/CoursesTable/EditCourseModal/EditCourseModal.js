import { courseApi } from "@edulastic/api";
import { CustomModalStyled, EduButton, FieldLabel, TextInputStyled } from "@edulastic/common";
import { Col, Form, Row } from "antd";
import React from "react";
import { ButtonsContainer, ModalFormItem } from "../../../../../common/styled";
import { StyledSpin, StyledSpinContainer } from "./styled";

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
      numberValidate: {
        value: this.props.courseData.number,
        validateStatus: "success",
        validateMsg: ""
      }
    };
  }

  onSaveCourse = async () => {
    const { nameValidate, numberValidate } = this.state;
    const { courseData, userOrgId: districtId } = this.props;

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

    // check if name is exist
    if (
      nameValidate.validateStatus === "success" &&
      nameValidate.value.length > 0 &&
      numberValidate.validateStatus === "success" &&
      numberValidate.value.length > 0
    ) {
      this.setState({ showSpin: true });
      const checkCourseExist = await courseApi.searchCourse({
        districtId,
        page: 1,
        limit: 25,
        sortField: "name",
        order: "asc",
        search: {
          name: [
            {
              type: "eq",
              value: nameValidate.value
            }
          ],
          number: [
            {
              type: "eq",
              value: numberValidate.value
            }
          ]
        }
      });

      this.setState({ showSpin: false });

      if (
        checkCourseExist.totalCourses == 0 ||
        (checkCourseExist.totalCourses == 1 && checkCourseExist.result[0]._id === courseData._id)
      )
        this.props.saveCourse({
          name: nameValidate.value,
          number: numberValidate.value,
          districtId
        });
      else {
        this.setState({
          nameValidate: {
            value: nameValidate.value,
            validateMsg: "Course name already exist",
            validateStatus: "error"
          },
          numberValidate: {
            value: numberValidate.value,
            validateMsg: "Course number already exist",
            validateStatus: "error"
          }
        });
      }
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
    const { modalVisible, courseData, t } = this.props;
    const { nameValidate, numberValidate, showSpin } = this.state;
    return (
      <CustomModalStyled
        visible={modalVisible}
        title={t("course.editcourse")}
        onOk={this.onSaveCourse}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <EduButton isGhost onClick={this.onCloseModal}>{t("common.cancel")}</EduButton>
            <EduButton onClick={this.onSaveCourse}>{t("course.updatecourse")}</EduButton>
          </ButtonsContainer>
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem
              name="name"
              validateStatus={nameValidate.validateStatus}
              help={nameValidate.validateMsg}
              required
            >
              <FieldLabel>{t("course.coursename")}</FieldLabel>
              <TextInputStyled
                placeholder={t("course.coursename")}
                defaultValue={courseData.name}
                onChange={this.handleCourseName}
              />
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem
              name="number"
              validateStatus={numberValidate.validateStatus}
              help={numberValidate.validateMsg}
              required
            >
              <FieldLabel>{t("course.coursenumber")}</FieldLabel>
              <TextInputStyled
                defaultValue={courseData.number}
                placeholder={t("course.coursenumber")}
                onChange={this.handleCourseNumber}
              />
            </ModalFormItem>
          </Col>
        </Row>
        {showSpin && (
          <StyledSpinContainer>
            <StyledSpin size="large" />
          </StyledSpinContainer>
        )}
      </CustomModalStyled>
    );
  }
}

const EditCourseModalForm = Form.create()(EditCourseModal);
export default EditCourseModalForm;
