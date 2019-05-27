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
      curSel: "google"
    };
  }

  onInviteStudents = () => {
    this.props.form.validateFields((err, row) => {
      if (!err) {
        const { curSel } = this.state;
        let studentsList = [];
        let provider = "fl";
        const lines = row.students.split("\n");
        for (let i = 0; i < lines.length; i++) {
          studentsList.push(lines[i]);
        }

        this.props.inviteStudents({
          userDetails: studentsList,
          provider: curSel
        });
      }
    });
  };

  validateStudentsList = (rule, value, callback) => {
    const { curSel } = this.state;
    const lines = value.split("\n");

    let isValidate = true;
    if (curSel === "fl" || curSel === "lf") {
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].split(" ").length > 2) {
          isValidate = false;
          break;
        }
      }
    } else if (curSel === "google" || curSel === "mso") {
      for (let i = 0; i < lines.length; i++) {
        if (!this.checkValidEmail(lines[i])) {
          isValidate = false;
          break;
        }
      }
    }

    if (isValidate) {
      callback();
      return;
    } else {
      if (curSel === "fl") callback('Username should be in "FirstName LastName"');
      else if (curSel === "lf") {
        callback('Username should be in "LastName FirstName"');
      } else if (curSel === "google" || curSel === "mso") {
        callback("Username should be in email format");
      }
    }
  };

  checkValidEmail(strEmail) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(strEmail).toLowerCase());
  }

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
    const { placeHolderVisible, curSel } = this.state;

    let placeHolderComponent;
    if (curSel === "google") {
      placeHolderComponent = (
        <PlaceHolderText visible={placeHolderVisible}>
          Enter email like...
          <br />
          john.doe@yourschool.com
          <br />
          john.doe@yourschool.com
          <br />
          ...
        </PlaceHolderText>
      );
    } else if (curSel === "mso") {
      placeHolderComponent = (
        <PlaceHolderText visible={placeHolderVisible}>
          Enter email like...
          <br />
          john.doe@yourschool.com
          <br />
          john.doe@yourschool.com
          <br />
          ...
        </PlaceHolderText>
      );
    } else if (curSel === "fl") {
      placeHolderComponent = (
        <PlaceHolderText visible={placeHolderVisible}>
          Enter first and last names like...
          <br />
          John Doe
          <br />
          Jane Doe
          <br />
          ...
        </PlaceHolderText>
      );
    } else if (curSel === "lf") {
      placeHolderComponent = (
        <PlaceHolderText visible={placeHolderVisible}>
          Enter last and first names like...
          <br />
          Doe John
          <br />
          Doe Jane
          <br />
          ...
        </PlaceHolderText>
      );
    }

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
            <Select onChange={this.handleChange} defaultValue="google">
              <Option value="google">Google Usernames</Option>
              <Option value="mso">Office 365 Usernames</Option>
              <Option value="fl">Frist Name and Last Name</Option>
              <Option value="lf">Last Name and First Name</Option>
            </Select>
          </Col>
        </SelUserKindDiv>
        <Row>
          <Col span={24}>
            <FormItem>
              {placeHolderComponent}
              {getFieldDecorator("students", {
                rules: [
                  {
                    required: true,
                    message: "Please input Students Username"
                  },
                  {
                    validator: this.validateStudentsList
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
