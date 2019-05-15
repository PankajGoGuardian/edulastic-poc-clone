import React, { Component } from "react";
import { Modal, Form, Input, Row, Col, Button } from "antd";
import { StyledDescription, ModalFormItem, StyledSpinContainer, StyledSpin } from "./styled";

import { schoolApi } from "@edulastic/api";

class EditSchoolModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.schoolData.name,
      nameValidateStatus: "success",
      nameValidateMsg: "",
      showSpin: false,
      checkSchoolExist: { totalSchools: 0, data: [] }
    };
    this.onUpdateSchool = this.onUpdateSchool.bind(this);
  }

  async onUpdateSchool() {
    const { name, nameValidateStatus } = this.state;
    let checkSchoolExist = { ...this.state.checkSchoolExist };

    if (nameValidateStatus === "success" && name.length > 0) {
      this.setState({ showSpin: true });
      checkSchoolExist = await schoolApi.getSchools({
        districtId: this.props.userOrgId,
        search: {
          name: {
            type: "eq",
            value: name
          }
        }
      });
      this.setState({ showSpin: false, checkSchoolExist });

      if (checkSchoolExist.totalSchools > 0 && checkSchoolExist.data[0]._id !== this.props.schoolData._id) {
        this.setState({
          nameValidateStatus: "error",
          nameValidateMsg: "School name already exists"
        });
      }
    } else {
      if (name.length == 0) {
        this.setState({
          nameValidateStatus: "error",
          nameValidateMsg: "Please input school name"
        });
      }
    }

    this.props.form.validateFields((err, row) => {
      if (!err) {
        if (checkSchoolExist.totalSchools > 0 && checkSchoolExist.data[0]._id !== this.props.schoolData._id) return;
        row.name = name;
        row.key = this.props.schoolData.key;
        this.props.updateSchool(row);
      }
    });
  }

  onCloseModal = () => {
    this.props.closeModal();
  };

  changeSchoolName = e => {
    if (e.target.value.length == 0) {
      this.setState({
        name: e.target.value,
        nameValidateStatus: "error",
        nameValidateMsg: "Please input school name",
        checkSchoolExist: { totalSchools: 0, data: [] }
      });
    } else {
      this.setState({
        name: e.target.value,
        nameValidateStatus: "success",
        nameValidateMsg: "",
        checkSchoolExist: { totalSchools: 0, data: [] }
      });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible, schoolData } = this.props;
    const { nameValidateStatus, nameValidateMsg, showSpin } = this.state;

    return (
      <Modal
        visible={modalVisible}
        title={"Edit School"}
        onOk={this.onUpdateSchool}
        onCancel={this.onCloseModal}
        maskClosable={false}
        footer={[
          <Button key="submit" type="primary" onClick={this.onUpdateSchool} disabled={showSpin}>
            Update School >
          </Button>
        ]}
      >
        <StyledDescription>School Id - {schoolData._id}</StyledDescription>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Name" validateStatus={nameValidateStatus} help={nameValidateMsg} required={true}>
              <Input placeholder="Enter School Name" onChange={this.changeSchoolName} defaultValue={schoolData.name} />
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Address">
              {getFieldDecorator("address", {
                rules: [
                  {
                    required: true,
                    message: "Please input school address"
                  }
                ],
                initialValue: schoolData.address
              })(<Input placeholder="Enter School Address" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="City">
              {getFieldDecorator("city", {
                rules: [
                  {
                    required: true,
                    message: "Please input city name"
                  }
                ],
                initialValue: schoolData.city
              })(<Input placeholder="Enter City Name" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <ModalFormItem label="Zip">
              {getFieldDecorator("zip", {
                rules: [
                  {
                    required: true,
                    message: "Please input zip code"
                  }
                ],
                initialValue: schoolData.zip
              })(<Input placeholder="Enter Zip Code" />)}
            </ModalFormItem>
          </Col>
          <Col span={11} offset={2}>
            <ModalFormItem label="State">
              {getFieldDecorator("state", {
                rules: [
                  {
                    required: true,
                    message: "Please input state"
                  }
                ],
                initialValue: schoolData.state
              })(<Input placeholder="Enter State" />)}
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

const EditSchoolModalForm = Form.create()(EditSchoolModal);
export default EditSchoolModalForm;
