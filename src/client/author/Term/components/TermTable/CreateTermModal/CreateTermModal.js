import React, { Component } from "react";
import * as moment from "moment";
import { Form, Input, Row, Col, Button } from "antd";

import { StyledModal, ModalFormItem, StyledDatePicker } from "./styled";

class CreateTermModal extends React.Component {
  constructor(props) {
    super(props);

    const defaultSchoolName = this.getValidateSchoolYearname();
    this.state = {
      startDate: moment(new Date(), "DD MMM YYYY"),
      endDate: moment(new Date(), "DD MMM YYYY").add(1, "years"),
      defaultSchoolName
    };
  }

  getValidateSchoolYearname() {
    const currentYear = new Date().getFullYear();
    let defaultSchoolName = currentYear + "-" + (currentYear + 1).toString().substring(2, 4);
    return defaultSchoolName;
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

  checkSchoolNameUnique = (rule, value, callback) => {
    const sameSchoolNameRow = this.props.dataSource.filter(item => item.name === value);
    if (sameSchoolNameRow.length <= 0) {
      callback();
      return;
    }
    callback("School name should be unique.");
  };

  disableStartDate = startValue => {
    const toDayDate = moment(new Date(), "DD MMM YYYY");
    toDayDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    const { endDate } = this.state;

    if (startValue.valueOf() < toDayDate.valueOf) return true;
    if (startValue.valueOf() > endDate) return true;
    return false;
  };

  disableEndDate = endValue => {
    const { startDate } = this.state;
    const toDayDate = moment(new Date(), "DD MMM YYYY");
    toDayDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    if (startDate >= endValue.valueOf()) return true;
    if (toDayDate.valueOf() > endValue.valueOf()) return true;
    return false;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible } = this.props;
    const { startDate, endDate, defaultSchoolName } = this.state;
    const isOverlap = startDate.valueOf() >= endDate.valueOf() ? true : false;

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
                  },
                  { validator: this.checkSchoolNameUnique }
                ],
                initialValue: defaultSchoolName
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
              })(
                <StyledDatePicker
                  format={"DD MMM YYYY"}
                  onChange={this.handleStartDateChange}
                  disabledDate={this.disableStartDate}
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="End Date">
              {getFieldDecorator("endDate", {
                rules: [{ required: true, message: "Please Select End Date" }],
                initialValue: endDate
              })(
                <StyledDatePicker
                  format={"DD MMM YYYY"}
                  onChange={this.handleEndDateChange}
                  disabledDate={this.disableEndDate}
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
      </StyledModal>
    );
  }
}

const CreateTermModalForm = Form.create()(CreateTermModal);
export default CreateTermModalForm;
