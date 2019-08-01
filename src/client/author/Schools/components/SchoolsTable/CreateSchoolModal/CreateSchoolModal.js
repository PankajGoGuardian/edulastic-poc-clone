import React, { Component } from "react";
import { Modal, Form, Input, Row, Col, Button, Select } from "antd";
import { states } from "../../../../../student/Signup/components/TeacherContainer/constants";
import { StyledDescription, ModalFormItem, StyledSelect, StyledSpinContainer, StyledSpin } from "./styled";

import { countryApi, schoolApi } from "@edulastic/api";

const Option = Select.Option;
class CreateSchoolModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryList: [],
      name: "",
      nameValidateStatus: "success",
      nameValidateMsg: "",
      showSpin: false,
      stateList: []
    };
    this.onCreateSchool = this.onCreateSchool.bind(this);
  }

  async componentDidMount() {
    this.setState({ showSpin: true });
    const returnedCountryList = await countryApi.getCountries();
    this.setState({
      countryList: returnedCountryList,
      stateList: states,
      showSpin: false
    });
  }

  async onCreateSchool() {
    const { name, nameValidateStatus } = this.state;
    let checkSchoolExist;
    if (nameValidateStatus === "success" && name.length > 0) {
      checkSchoolExist = await schoolApi.searchSchoolsByName({
        districtId: this.props.userOrgId,
        schoolName: name
      });
      this.setState({ showSpin: false });

      if (checkSchoolExist.length > 0) {
        this.setState({
          nameValidateStatus: "error",
          nameValidateMsg: "School name already exists"
        });
      }
    } else if (!name.length) {
      this.setState({
        nameValidateStatus: "error",
        nameValidateMsg: "Please input school name"
      });
    }

    this.props.form.validateFields((err, row) => {
      if (!err) {
        if (checkSchoolExist.length > 0) return;
        row.name = name;
        this.props.createSchool(row);
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
        nameValidateMsg: "Please input school name"
      });
    } else {
      this.setState({
        name: e.target.value,
        nameValidateStatus: "success",
        nameValidateMsg: ""
      });
    }
  };

  changeCountryHandler = value => {
    const { form } = this.props;
    if (value !== "US") {
      this.setState({
        stateList: []
      });
      form.setFieldsValue({ state: "" });
    } else {
      this.setState({
        stateList: states
      });
      form.setFieldsValue({ state: states[0] });
    }
  };

  onCountryKeyDown = e => {
    if (e.key === "Backspace" || e.key === "Enter") return true;

    if (e.target.value.length >= 40) {
      e.preventDefault();
    }
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { modalVisible } = this.props;
    const { countryList, nameValidateStatus, nameValidateMsg, showSpin, stateList } = this.state;

    const CountryOptions = Object.entries(countryList).map(([key, value]) => <Option value={key}>{value}</Option>);

    const country = getFieldValue("country");
    const stateOptions = stateList.map(state => (
      <Option value={state} key={state}>
        {state}
      </Option>
    ));

    return (
      <Modal
        visible={modalVisible}
        title={"Create New School"}
        onOk={this.onCreateSchool}
        onCancel={this.onCloseModal}
        maskClosable={false}
        footer={[
          <Button key="submit" type="primary" onClick={this.onCreateSchool} disabled={showSpin}>
            Create New School >
          </Button>
        ]}
      >
        <StyledDescription>Please fill the details below to add new school.</StyledDescription>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Name" validateStatus={nameValidateStatus} help={nameValidateMsg} required={true}>
              <Input placeholder="Enter School Name" onChange={this.changeSchoolName} />
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Address">
              {getFieldDecorator("address", {})(<Input placeholder="Enter School Address" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="City">
              {getFieldDecorator("city", {})(<Input placeholder="Enter City Name" />)}
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
                ]
              })(<Input placeholder="Enter Zip Code" />)}
            </ModalFormItem>
          </Col>
          <Col span={11} offset={2}>
            <ModalFormItem label="State">
              {getFieldDecorator("state", { initialValue: states[0] })(
                country === "US" ? (
                  <Select showSearch showArrow={false} placeholder="Select state" style={{ width: "100%" }}>
                    {stateOptions}
                  </Select>
                ) : (
                  <Input placeholder="Enter state" />
                )
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Country">
              {getFieldDecorator("country", {
                initialValue: "US"
              })(
                <StyledSelect
                  showSearch
                  placeholder="Select Country"
                  showArrow={false}
                  optionFilterProp={"children"}
                  notFoundContent={null}
                  onChange={this.changeCountryHandler}
                  onInputKeyDown={this.onCountryKeyDown}
                >
                  {CountryOptions}
                </StyledSelect>
              )}
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

const CreateSchoolModalForm = Form.create()(CreateSchoolModal);
export default CreateSchoolModalForm;
