import React, { Component } from "react";
import { Form, Row, Col, Button, Modal, Select } from "antd";
import { StyledTextArea, PlaceHolderText, SelUserKindDiv } from "./styled";

const FormItem = Form.Item;
const Option = Select.Option;

class InviteMultipleStudentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      placeHolderVisible: true,
      curSel: "google username"
    };
  }

  onInviteStudents = () => {
    debugger;
    this.props.form.validateFields((err, row) => {
      if (!err) {
        this.props.inviteStudents(row);
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

  handleChange = value => {
    this.setState({ curSel: value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible } = this.props;
    const { placeHolderVisible } = this.state;
    return (
      <Modal
        visible={modalVisible}
        title={"Bulk Add Students"}
        onOk={this.onInviteStudents}
        onCancel={this.onCloseModal}
        maskClosable={false}
        footer={[
          <Button type="primary" key="submit" onClick={this.onInviteStudents}>
            Add Students
          </Button>
        ]}
      >
        <Row>
          <Col span={24}>
            Add Students by typing or paste one or more student(s) names. User separate lines or semi-colon t add
            multiple students.
          </Col>
        </Row>
        <SelUserKindDiv>
          <Col span={8}>Add students by their:</Col>
          <Col span={12} offset={1}>
            <Select onChange={this.handleChange} defaultValue="google username">
              <Option value="google username">Google Usernames</Option>
              <Option value="office 365">Office 365 Usernames</Option>
              <Option value="first-last name">Frist Name and Last Name</Option>
              <Option value="last-first name">Last Name and First Name</Option>
            </Select>
          </Col>
        </SelUserKindDiv>
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
              {getFieldDecorator("add-students", {
                rules: [
                  {
                    required: true,
                    message: "Please input Students Email"
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

const InviteMultipleStudentModalForm = Form.create()(InviteMultipleStudentModal);
export default InviteMultipleStudentModalForm;
