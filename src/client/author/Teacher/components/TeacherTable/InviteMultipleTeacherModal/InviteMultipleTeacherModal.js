import React, { Component } from "react";
import { Form, Row, Col, Button, Modal } from "antd";
import { StyledTextArea, PlaceHolderText } from "./styled";

const FormItem = Form.Item;

class InviteMultipleTeacherModal extends Component {
  constructor(props) {
    super(props);
    this.state = { placeHolderVisible: true };
  }

  onInviteTeachers = () => {
    this.props.form.validateFields((err, row) => {
      if (!err) {
        this.props.inviteTeachers(row);
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
      <Modal
        visible={modalVisible}
        title="Bulk Add Teacher"
        onOk={this.onInviteTeachers}
        onCancel={this.onCloseModal}
        maskClosable={false}
        footer={[
          <Button type="primary" key="submit" onClick={this.onInviteTeachers}>
            Add Teachers
          </Button>
        ]}
      >
        <Row>
          <Col span={24}>
            To add multiple teachers, type or paste teacher emails below. Teachers will receive an email inviting them
            to select a school and create a pssword.
            <br />
            Use seperate lines or emi-colons to add teachers.
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem>
              <PlaceHolderText visible={placeHolderVisible}>
                Enter email like...
                <br />
                john.doe@yourschool.com
                <br />
                john.doe@yourschool.com
                <br />
                ...
              </PlaceHolderText>
              {getFieldDecorator("invite-teacher", {
                rules: [
                  {
                    required: true,
                    message: "Please input Teacher Email"
                  }
                ]
              })(<StyledTextArea row={10} onChange={this.handleChangeTextArea} />)}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

const InviteMultipleTeacherModalForm = Form.create()(InviteMultipleTeacherModal);
export default InviteMultipleTeacherModalForm;
