import React, { Component } from "react";
import * as moment from "moment";
import { Form, Input, Row, Col, Button, Modal } from "antd";

import { ModalFormItem, StyledDatePicker } from "./styled";

class CreateTermModal extends React.Component {
  constructor(props) {
    super(props);

    let dataSource = [...this.props.dataSource];
    let startDate, endDate, defaultSchoolYear;

    if (dataSource.length > 0) {
      startDate = moment(dataSource[0].endDate).add(1, "days");
      endDate = moment(dataSource[0].endDate).add(1, "years");
      defaultSchoolYear = startDate.format("YYYY") + "-" + endDate.format("YYYY");
    } else {
      startDate = moment(new Date()).add(1, "days");
      endDate = moment(new Date()).add(1, "years");
      defaultSchoolYear = startDate.format("YYYY") + "-" + endDate.format("YYYY");
    }

    this.state = {
      startDate,
      endDate,
      defaultSchoolYear
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

  checkSchoolNameUnique = (rule, value, callback) => {
    const sameSchoolNameRow = this.props.dataSource.filter(item => item.name === value);
    if (sameSchoolNameRow.length <= 0) {
      callback();
      return;
    }
    callback("School name should be unique.");
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
    const { startDate, endDate, defaultSchoolYear } = this.state;

    return (
      <Modal
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
                initialValue: defaultSchoolYear
              })(<Input placeholder="Enter School Year Name" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Start Date">
              {getFieldDecorator("startDate", {
                initialValue: startDate
              })(<StyledDatePicker format={"DD MMM YYYY"} disabled={true} />)}
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
      </Modal>
    );
  }
}

const CreateTermModalForm = Form.create()(CreateTermModal);
export default CreateTermModalForm;
