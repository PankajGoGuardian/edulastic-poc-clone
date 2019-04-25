import React, { Component } from "react";
import * as moment from "moment";
import { Form, Input, Row, Col, Button } from "antd";

import { StyledModal, ModalFormItem, StyledDatePicker } from "./styled";

class EditTermModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.termData
    };
  }

  handleStartDateChange = value => {
    this.setState({ startDate: value.valueOf() });
  };

  handleEndDateChange = value => {
    this.setState({ endDate: value.valueOf() });
  };

  onSaveTerm = () => {
    this.props.form.validateFields((err, row) => {
      if (!err) {
        if (row.startDate > row.endDate) return;
        const updatedTermData = {
          _id: this.state._id,
          name: row.name,
          startDate: row.startDate.valueOf(),
          endDate: row.endDate.valueOf()
        };
        this.props.updateTerm(updatedTermData);
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible } = this.props;
    const { startDate, endDate, name } = this.state;
    const isOverlap = startDate > endDate ? true : false;

    return (
      <StyledModal
        visible={modalVisible}
        title="Edit School Year"
        onOk={this.onSaveTerm}
        onCancel={this.onCloseModal}
        footer={[
          <Button key="back" onClick={this.onCloseModal}>
            No, Cancel
          </Button>,
          <Button type="primary" key="submit" onClick={this.onSaveTerm}>
            Yes, Save >
          </Button>
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem label="School Year Name">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Please input School Year Name"
                  }
                ],
                initialValue: name
              })(<Input placeholder="Enter School Year Name" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem
              label="Start Date"
              validateStatus={isOverlap ? "error" : ""}
              help={isOverlap ? "Start date should not overlap end date for school year" : ""}
            >
              {getFieldDecorator("startDate", {
                rules: [{ required: true, message: "Please Select Start Date" }],
                initialValue: moment(new Date(startDate), "DD MMM YYYY")
              })(<StyledDatePicker format={"DD MMM YYYY"} onChange={this.handleStartDateChange} />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="End Date">
              {getFieldDecorator("endDate", {
                rules: [{ required: true, message: "Please Select End Date" }],
                initialValue: moment(new Date(endDate), "DD MMM YYYY")
              })(<StyledDatePicker format={"DD MMM YYYY"} onChange={this.handleEndDateChange} />)}
            </ModalFormItem>
          </Col>
        </Row>
      </StyledModal>
    );
  }
}

const EditTermModalForm = Form.create()(EditTermModal);
export default EditTermModalForm;
