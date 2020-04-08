import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { get, debounce, find } from "lodash";
import styled from "styled-components";
import { Form, Modal, Button, Input, Select, Row, Col } from "antd";
import { userApi } from "@edulastic/api";
import {
  lightGrey3,
  linkColor,
  themeColor,
  white,
  mobileWidthLarge,
  boxShadowDefault,
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
  smallDesktopWidth
} from "@edulastic/colors";
import { countryApi } from "@edulastic/api";
import { withNamespaces } from "@edulastic/localization";
import { RemoteAutocompleteDropDown } from "../../../../common/components/widgets/remoteAutoCompleteDropDown";
import { searchDistrictsRequestAction, createAndJoinSchoolRequestAction } from "../../duck";
import { states } from "./constants";
import { EduButton } from "@edulastic/common";

const { Option } = Select;
class RequestSchool extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    handleCancel: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    districts: PropTypes.array.isRequired,
    isSearching: PropTypes.bool.isRequired,
    searchDistrict: PropTypes.func.isRequired,
    userInfo: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
  };

  static defaultProps = {
    isOpen: false
  };

  state = {
    keyword: "",
    countryList: {},
    stateList: []
  };

  async componentDidMount() {
    const countryList = await countryApi.getCountries();
    this.setState({
      countryList,
      stateList: states
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, districts, createAndJoinSchoolRequestAction, homeSchool } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { name, districtId, address, city, country, state, zip } = values;
        const district = find(districts, ({ districtId: _id }) => _id === districtId.key) || {
          districtName: districtId.title
        };
        const { districtName } = district;
        const body = {
          name,
          districtName: districtName,
          location: {
            city,
            state,
            zip,
            address,
            country
          },
          requestNewSchool: true
        };

        if (district.districtId) {
          body.districtId = district.districtId;
        }
        if (homeSchool) {
          body.homeSchool = true;
        }
        const { firstName, middleName, lastName } = this.props.userInfo;
        createAndJoinSchoolRequestAction({
          createSchool: body,
          joinSchool: {
            data: {
              currentSignUpState: "PREFERENCE_NOT_SELECTED",
              email: this.props.userInfo.email,
              firstName,
              middleName,
              lastName
            },
            userId: this.props.userInfo._id
          }
        });
      }
    });
  };

  handleTyping = debounce(keyword => {
    this.onSearch(keyword);
  }, 500);

  onSearch = searchText => {
    const { searchDistrict, isSearching } = this.props;
    if (!isSearching && searchText.length > 2) {
      searchDistrict({ searchText });
    }
  };

  transformInput = value => {
    if (value) {
      return value.trim();
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

  render() {
    const { isOpen, handleCancel, form, isSearching, autocompleteDistricts, t } = this.props;
    const { getFieldDecorator } = form;
    const { keyword, countryList, stateList } = this.state;
    const country = form.getFieldValue("country");

    const title = (
      <Title>
        <h4>{t("component.signup.teacher.requestnewschool")}</h4>
        <span>{t("component.signup.teacher.infotext")}</span>
      </Title>
    );

    const footer = (
      <EduButton height="32px" data-cy="reqNewSchoolBtn" onClick={this.handleSubmit} htmlType="submit">
        <span>{t("component.signup.teacher.requestnewschool")}</span>
      </EduButton>
    );

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };

    const countryOptions = Object.entries(countryList).map(([key, value]) => (
      <Option value={key} key={key}>
        {value}
      </Option>
    ));

    const stateOptions = stateList.map(state => (
      <Option value={state} key={state}>
        {state}
      </Option>
    ));

    return (
      <StyledModal title={title} visible={isOpen} footer={footer} onCancel={handleCancel} centered>
        <FormWrapper {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="Name">
            {getFieldDecorator("name", {
              validateTrigger: ["onChange", "onBlur"],
              rules: [
                { transform: this.transformInput },
                { required: true, message: "Please provide a valid school name." }
              ]
            })(<Input data-cy="school" placeholder="Enter your school name" />)}
          </Form.Item>
          <Form.Item label="District">
            {getFieldDecorator("districtId", {
              initialValue: { key: "", title: "" },
              rules: [
                { required: true, message: "Please provide a valid district name." },
                {
                  validator: async (rule, value, callback) => {
                    if (value.title.length === 0 || value.key.length === 0) {
                      callback("Please provide a valid district name.");
                      return;
                    }

                    if (value.key === "Add New") {
                      callback();
                      return;
                    }

                    if (!!value.cleverId) {
                      callback(
                        "The enrollment for this district is handled by district SIS, Please contact admin to create your Edulastic account."
                      );
                      return;
                    }

                    const { userInfo } = this.props;
                    try {
                      let signOnMethod = "userNameAndPassword";
                      signOnMethod = userInfo.msoId ? "office365SignOn" : signOnMethod;
                      signOnMethod = userInfo.cleverId ? "cleverSignOn" : signOnMethod;
                      signOnMethod = userInfo.googleId ? "googleSignOn" : signOnMethod;
                      const checkDistrictPolicyPayload = {
                        districtId: value.key,
                        email: userInfo.email,
                        type: userInfo.role,
                        signOnMethod
                      };
                      const policyCheckResult = await userApi.validateDistrictPolicy(checkDistrictPolicyPayload);
                      callback();
                      return;
                    } catch (error) {
                      console.error(error);
                      callback(t("common.policyviolation"));
                      return;
                    }
                  }
                }
              ]
            })(
              <RemoteAutocompleteDropDown
                by={keyword}
                data={autocompleteDistricts}
                onSearchTextChange={this.handleTyping}
                iconType={"down"}
                createNew={true}
                createNewLabel="Create New District"
                existingLabel="Districts"
                placeholder="Enter your district name"
                isLoading={isSearching}
              />
            )}
          </Form.Item>
          <Form.Item label="Address">
            {getFieldDecorator("address", {
              rules: [{ required: false, message: "Please provide a valid school address." }]
            })(<Input data-cy="address" placeholder="Enter your school address" />)}
          </Form.Item>
          <Form.Item label="City">
            {getFieldDecorator("city", {
              rules: [{ required: false, message: "Please provide a valid city." }]
            })(<Input data-cy="city" placeholder="Enter your school city" />)}
          </Form.Item>
          <FlexItems type="flex">
            <CustomColumn xs={24} sm={4} noMargin>
              <Label>Zip</Label>
            </CustomColumn>
            <CustomColumn xs={24} sm={10}>
              <Form.Item style={{ width: "100%" }}>
                {getFieldDecorator("zip", {
                  validateTrigger: ["onChange", "onBlur"],
                  rules: [
                    { transform: this.transformInput },
                    { required: true, message: "Please provide a valid zip code." }
                  ]
                })(<Input data-cy="zip" placeholder="Enter Zip Code" />)}
              </Form.Item>
            </CustomColumn>
            <CustomColumn xs={24} sm={10}>
              <Form.Item label="State" style={{ width: "100%" }}>
                {getFieldDecorator("state", {
                  rules: [{ required: false, message: "Please provide a valid state." }],
                  initialValue: states[0]
                })(
                  country === "US" ? (
                    <Select
                      showSearch
                      placeholder="Select state"
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {stateOptions}
                    </Select>
                  ) : (
                    <Input data-cy="state" placeholder="Enter state" />
                  )
                )}
              </Form.Item>
            </CustomColumn>
          </FlexItems>
          <Form.Item label="Country">
            {getFieldDecorator("country", {
              rules: [{ required: true, message: "Please provide a valid country." }],
              initialValue: "United States"
            })(
              <Select
                data-cy="country"
                showSearch
                placeholder="Select a country"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={value => this.changeCountryHandler(value)}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {countryOptions}
              </Select>
            )}
          </Form.Item>
        </FormWrapper>
      </StyledModal>
    );
  }
}

const RequestSchoolModal = Form.create({ name: "request_school" })(RequestSchool);

const enhance = compose(
  withNamespaces("login"),
  withRouter,
  connect(
    state => ({
      isSearching: get(state, "signup.isSearching", false),
      districts: get(state, "signup.districts", []),
      autocompleteDistricts: get(state, "signup.autocompleteDistricts", [])
    }),
    {
      searchDistrict: searchDistrictsRequestAction,
      createAndJoinSchoolRequestAction: createAndJoinSchoolRequestAction
    }
  )
);
export default enhance(RequestSchoolModal);

const StyledModal = styled(Modal)`
  min-width: 60vw;
  .ant-modal-body {
    padding: 24px 70px 0px 0px;
    @media (max-width: ${extraDesktopWidthMax}) {
      padding-right: 80px;
    }
    @media (max-width: ${mediumDesktopExactWidth}) {
      padding-right: 70px;
    }
    @media (max-width: ${smallDesktopWidth}) {
      padding-right: 40px;
    }
    @media (max-width: ${mobileWidthLarge}) {
      padding-right: 10px;
    }
  }
  .ant-modal-content,
  .ant-modal-header {
    background-color: ${lightGrey3};
    border-bottom: 0px;
  }
  .ant-modal-header {
    padding: 40px 50px 10px;
  }
  .ant-modal-footer {
    display: flex;
    justify-content: center;
    border-top: 0px;
    padding: 10px 24px 40px;
  }

  .ant-form-item {
    text-align: center;
    display: flex;
    align-items: center;
  }
  .ant-form-item-required::before {
    display: none;
  }
  .ant-form-item label {
    font-weight: 600;
    font-size: 16px;
  }
  .ant-form-item-label {
    & > label::after {
      content: "";
    }
    align-self: start;
    padding-top: 5px;
  }
  .ant-select-arrow,
  .ant-modal-close-x {
    svg {
      fill: ${themeColor};
    }
  }
  .ant-select {
    width: 100%;
  }
  .ant-select-selection {
    height: 32px;
    overflow: hidden;
  }
  .ant-select-selection-selected-value {
    div:nth-child(1) {
      display: block;
      text-align: left;
    }
  }
  .ant-form-item-control {
    line-height: normal;
  }
  .ant-form > .ant-form-item:nth-child(2) {
    .ant-form-item-control-wrapper {
      display: flex;
      justify-content: left;
      align-items: center;
      .ant-form-item-control {
        width: 100%;
        .remote-autocomplete-dropdown {
          display: flex;
          margin: 0;
        }
      }
    }
  }
  .ant-modal-close-x svg {
    width: 20px;
    height: 20px;
  }
  .ant-select-selection,
  .ant-input {
    border: none;
    box-shadow: ${boxShadowDefault};
  }
  .remote-autocomplete-dropdown {
    border: none;
    box-shadow: ${boxShadowDefault};
  }
  .has-error .ant-input {
    border: 1px solid red;
  }

  @media (max-width: ${mobileWidthLarge}) {
    &.ant-modal {
      min-width: 90%;
      top: 20px;
    }
    .ant-row.ant-form-item {
      margin-bottom: 15px;
      &:nth-last-child(1) {
        margin: 0px;
      }
    }
  }
`;

const Label = styled.div`
  font-weight: 600;
  text-align: right;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  margin-right: 8px;
  padding-top: 5px;

  @media (max-width: ${mobileWidthLarge}) {
    text-align: left;
  }
`;

const FormWrapper = styled(Form)`
  .ant-row .ant-form-item-label {
    line-height: normal;
  }
  @media (max-width: ${mobileWidthLarge}) {
    .ant-row {
      flex-direction: column;
      .ant-form-item-label {
        text-align: left;
        padding: 0px;
      }
    }
  }
`;

const ActionButton = styled(Button)`
  font-weight: 600;
  font-size: 11px;
  border-radius: 4px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  min-width: 55%;
  background: ${themeColor};
  color: ${white};
  border: 0px;
  min-height: 40px;

  &:hover {
    background: ${themeColor};
  }

  @media (max-width: ${mobileWidthLarge}) {
    min-width: 100%;
  }
`;

const Title = styled.div`
  color: ${linkColor};
  h4 {
    font-weight: 700;
    font-size: 16px;
    @media (min-width: ${mediumDesktopExactWidth}) {
      font-size: 18px;
    }
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 22px;
    }
  }
  span {
    font-size: 13px;
    letter-spacing: -0.7px;
    @media (min-width: ${mediumDesktopExactWidth}) {
      font-size: 14px;
    }
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 16px;
    }
  }

  @media (max-width: ${mobileWidthLarge}) {
    text-align: center;
    font-size: 14px;
    h4 {
      font-size: 22px;
    }
  }
`;

const FlexItems = styled(Row)`
  margin-bottom: 0;
`;

const CustomColumn = styled(Col)`
  margin-bottom: 24px;
  @media (max-width: ${mobileWidthLarge}) {
    margin-bottom: ${({ noMargin }) => (noMargin ? "0px" : "15px")};
  }
`;
