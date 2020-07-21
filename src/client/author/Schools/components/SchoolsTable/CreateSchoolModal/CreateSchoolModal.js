import { countryApi, schoolApi } from "@edulastic/api";
import { CustomModalStyled, EduButton, SelectInputStyled, TextInputStyled } from "@edulastic/common";
import { Col, Form, Row, Select } from "antd";
import React, { Component } from "react";
import { ButtonsContainer, ModalFormItem } from "../../../../../common/styled";
import { states } from "../../../../../student/Signup/components/TeacherContainer/constants";
import { StyledSpin, StyledSpinContainer } from "./styled";

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
    const { modalVisible, t } = this.props;
    const { countryList, showSpin, stateList, nameValidateMsg, nameValidateStatus } = this.state;

    const CountryOptions = Object.entries(countryList).map(([key, value]) => <Option value={key}>{value}</Option>);

    const country = getFieldValue("country");
    const stateOptions = stateList.map(state => (
      <Option value={state} key={state}>
        {state}
      </Option>
    ));

    return (
      <CustomModalStyled
        visible={modalVisible}
        title={t("school.createschool")}
        onOk={this.onCreateSchool}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <EduButton isGhost onClick={this.onCloseModal}>{t("common.cancel")}</EduButton>
            <EduButton onClick={this.onCreateSchool} disabled={showSpin}>
              {t("school.createnewschool")}
            </EduButton>
          </ButtonsContainer>
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("school.name")} required help={nameValidateMsg} validateStatus={nameValidateStatus}>
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: t("school.validations.name")
                  }
                ]
              })(
                <TextInputStyled
                  placeholder={t("school.components.createschool.name")}
                  onChange={this.changeSchoolName}
                  maxLength={128}
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("school.address")}>
              {getFieldDecorator("address", {})(<TextInputStyled placeholder={t("school.components.createschool.address")} />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("school.city")}>
              {getFieldDecorator("city", {})(<TextInputStyled placeholder={t("school.components.createschool.city")} />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={12}>
            <ModalFormItem label={t("school.zip")}>
              {getFieldDecorator("zip", {
                rules: [
                  {
                    required: true,
                    message: t("school.validations.zip")
                  }
                ]
              })(<TextInputStyled placeholder={t("school.components.createschool.zip")} />)}
            </ModalFormItem>
          </Col>
          <Col span={12}>
            <ModalFormItem label={t("school.state")}>
              {getFieldDecorator("state", { initialValue: states[0] })(
                country === "US" ? (
                  <SelectInputStyled
                    showSearch
                    showArrow={false}
                    placeholder={t("school.components.createschool.selectstate")}
                    style={{ width: "100%" }}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    {stateOptions}
                  </SelectInputStyled>
                ) : (
                  <TextInputStyled placeholder={t("school.components.createschool.state")} />
                  )
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t("school.country")}>
              {getFieldDecorator("country", {
                initialValue: "US"
              })(
                <SelectInputStyled
                  showSearch
                  placeholder={t("school.components.createschool.country")}
                  showArrow={false}
                  optionFilterProp="children"
                  notFoundContent={null}
                  onChange={this.changeCountryHandler}
                  onInputKeyDown={this.onCountryKeyDown}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {CountryOptions}
                </SelectInputStyled>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        {showSpin && (
          <StyledSpinContainer>
            <StyledSpin size="large" />
          </StyledSpinContainer>
        )}
      </CustomModalStyled>
    );
  }
}

const CreateSchoolModalForm = Form.create()(CreateSchoolModal);
export default CreateSchoolModalForm;
