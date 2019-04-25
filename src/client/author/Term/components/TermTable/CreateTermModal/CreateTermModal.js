import React, { Component } from "react";
import * as moment from "moment";
import { Form, Input, Row, Col, Button } from "antd";

import { StyledModal, ModalFormItem, StyledDatePicker } from "./styled";

class CreateTermModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(new Date(), "DD MMM YYYY"),
      endDate: moment(new Date(), "DD MMM YYYY")
    };
  }

  handleStartDateChange = value => {
    this.setState({ startDate: value });
  };

  handleEndDateChange = value => {
    this.setState({ endDate: value });
  };

  onCreateTerm = () => {
    this.props.form.validateFields((err, row) => {
      if (!err) {
        if (row.startDate.valueOf() > row.endDate.valueOf()) return;
        this.props.createTerm(row);
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible } = this.props;
    const { startDate, endDate } = this.state;
    const isOverlap = startDate.valueOf() > endDate.valueOf() ? true : false;

    return (
      <StyledModal
        visible={modalVisible}
        title="Create School Year"
        onOk={this.onCreateTerm}
        onCancel={this.onCloseModal}
        footer={[
          <Button key="back" onClick={this.onCloseModal}>
            No, Cancel
          </Button>,
          <Button type="primary" key="submit" onClick={this.onCreateTerm}>
            Yes, Create >
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
                ]
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
                initialValue: startDate
              })(<StyledDatePicker format={"DD MMM YYYY"} onChange={this.handleStartDateChange} />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="End Date">
              {getFieldDecorator("endDate", {
                rules: [{ required: true, message: "Please Select End Date" }],
                initialValue: endDate
              })(<StyledDatePicker format={"DD MMM YYYY"} onChange={this.handleEndDateChange} />)}
            </ModalFormItem>
          </Col>
        </Row>
      </StyledModal>
    );
  }
}

const CreateTermModalForm = Form.create()(CreateTermModal);
export default CreateTermModalForm;
