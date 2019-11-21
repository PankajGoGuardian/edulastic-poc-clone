import React, { Component } from "react";
import { Form, Row, Col } from "antd";
import { StyledTextArea, PlaceHolderText, AddMulitpleTeachersModal, TextWrapper } from "./styled";

import { ButtonsContainer, OkButton, CancelButton, ModalFormItem } from "../../../../../common/styled";

class InviteMultipleTeacherModal extends Component {
  constructor(props) {
    super(props);
    this.state = { placeHolderVisible: true };
  }

  onInviteTeachers = () => {
    const { addTeachers, userOrgId: districtId, closeModal } = this.props;

    this.props.form.validateFields((err, row) => {
      if (!err) {
        const { teachersList } = row;
        const userDetails = teachersList.split(/;|\n/);
        addTeachers({ districtId, userDetails });
        closeModal();
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  handleChangeTextArea = e => {
    if (e.target.value.length > 0) this.setState({ placeHolderVisible: false });
    else this.setState({ placeHolderVisible: true });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible } = this.props;
    const { placeHolderVisible } = this.state;
    return (
      <AddMulitpleTeachersModal
        visible={modalVisible}
        title="Bulk Add Teacher"
        onOk={this.onInviteTeachers}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <CancelButton onClick={this.onCloseModal}>No, Cancel</CancelButton>
            <OkButton onClick={this.onInviteTeachers}>Yes, Add Teachers</OkButton>
          </ButtonsContainer>
        ]}
      >
        <Row>
          <TextWrapper span={24}>
            To add multiple teachers, type or paste teacher emails below. Teachers will receive an email inviting them
            to select a school and create a password.
            <br />
            Use seperate lines or semi-colons to add teachers.
          </TextWrapper>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem>
              <PlaceHolderText visible={placeHolderVisible}>
                Enter email like...
                <br />
                john.doe@yourschool.com
                <br />
                john.doe@yourschool.com
                <br />
                ...
              </PlaceHolderText>
              {getFieldDecorator("teachersList", {
                rules: [
                  {
                    required: true,
                    message: "Please input Teacher Email"
                  }
                ]
              })(<StyledTextArea row={10} onChange={this.handleChangeTextArea} />)}
            </ModalFormItem>
          </Col>
        </Row>
      </AddMulitpleTeachersModal>
    );
  }
}

const InviteMultipleTeacherModalForm = Form.create()(InviteMultipleTeacherModal);
export default InviteMultipleTeacherModalForm;
