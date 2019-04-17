import React, { Component } from "react";
import { Form, Input, Row, Col } from "antd";
import { StyledCreateSchoolModal, ModalTtile, StyledButton, StyledDescription, ModalFormItem } from "./styled";

// countryAPI
import { countryApi } from "@edulastic/api";
import CountrySelect from "../../../../Shared/Components/CountrySelect/CountrySelect";

class CreateSchoolModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryList: []
    };
  }

  async componentDidMount() {
    const returnedCountryList = await countryApi.getCountries();
    this.setState({
      countryList: returnedCountryList
    });
  }

  onCreateSchool = () => {
    this.props.form.validateFields((err, row) => {
      if (!err) {
        this.props.createSchool(row);
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible, form } = this.props;
    const { countryList } = this.state;

    return (
      <StyledCreateSchoolModal
        visible={modalVisible}
        title={<ModalTtile>Create New School</ModalTtile>}
        onOk={this.onCreateSchool}
        onCancel={this.onCloseModal}
        footer={[
          <StyledButton key="submit" onClick={this.onCreateSchool}>
            Create New School >
          </StyledButton>
        ]}
      >
        <StyledDescription>Please fill the details below to add new school.</StyledDescription>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Name">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Please input school name"
                  }
                ]
              })(<Input placeholder="Enter School Name" />)}
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
                ]
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
                ]
              })(<Input placeholder="Enter City Name" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <ModalFormItem label="Zip">
              {getFieldDecorator("zip", {
                rules: [
                  {
                    required: true,
                    message: "Please input zip code"
                  }
                ]
              })(<Input placeholder="Enter Zip Code" />)}
            </ModalFormItem>
          </Col>
          <Col span={12}>
            <ModalFormItem label="State">
              {getFieldDecorator("state", {
                rules: [
                  {
                    required: true,
                    message: "Please input state"
                  }
                ]
              })(<Input placeholder="Enter State" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Country">
              <CountrySelect form={form} countryList={countryList} />
            </ModalFormItem>
          </Col>
        </Row>
      </StyledCreateSchoolModal>
    );
  }
}

const CreateSchoolModalForm = Form.create()(CreateSchoolModal);
export default CreateSchoolModalForm;
