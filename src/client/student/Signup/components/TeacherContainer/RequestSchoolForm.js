import React from "react";
import { connect } from "react-redux";
import { get, debounce } from "lodash";
import styled from "styled-components";
import { Form, Input, Select, Row, Col } from "antd";
import { userApi, countryApi } from "@edulastic/api";
import { mobileWidthLarge } from "@edulastic/colors";

import { RemoteAutocompleteDropDown } from "../../../../common/components/widgets/remoteAutoCompleteDropDown";
import { searchDistrictsRequestAction } from "../../duck";
import { states } from "./constants";

const { Option } = Select;
class RequestSchoolForm extends React.Component {
  state = {
    keyword: "",
    countryList: {},
    stateList: []
  };

  transformInput = value => {
    if (value) {
      return value.trim();
    }
  };

  async componentDidMount() {
    const countryList = await countryApi.getCountries();
    this.setState({
      countryList,
      stateList: states
    });
  }

  handleTyping = debounce(keyword => {
    this.onSearch(keyword);
  }, 500);

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

  onSearch = searchText => {
    const { searchDistrict, isSearching } = this.props;
    if (!isSearching && searchText.length > 2) {
      searchDistrict({ searchText });
    }
  };

  render() {
    const { form, isSearching, autocompleteDistricts, t, userInfo, handleSubmit, fromUserProfile } = this.props;
    const { getFieldDecorator } = form;
    const { keyword, countryList, stateList } = this.state;
    const country = form.getFieldValue("country");
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
      <FormWrapper {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="Name">
          {getFieldDecorator("name", {
            validateTrigger: ["onChange", "onBlur"],
            rules: [
              { transform: this.transformInput },
              { required: true, message: "Please provide a valid school name." }
            ]
          })(<Input data-cy="school" placeholder="Enter your school name" />)}
        </Form.Item>
        {fromUserProfile ? (
          <Form.Item label="District">
            {getFieldDecorator("districtId", {
              initialValue: userInfo.orgData.districts?.[0].districtName
            })(<Input data-cy="district" disabled />)}
          </Form.Item>
        ) : (
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

                    if (value.cleverId) {
                      callback(
                        "The enrollment for this district is handled by district SIS, Please contact admin to create your Edulastic account."
                      );
                      return;
                    }

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
                      callback();
                      return;
                    } catch (error) {
                      console.error(error);
                      callback(t("common.policyviolation"));
                    }
                  }
                }
              ]
            })(
              <RemoteAutocompleteDropDown
                by={keyword}
                data={autocompleteDistricts}
                onSearchTextChange={this.handleTyping}
                iconType="down"
                createNew
                createNewLabel="Create New District"
                existingLabel="Districts"
                placeholder="Enter your district name"
                isLoading={isSearching}
              />
            )}
          </Form.Item>
        )}
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
    );
  }
}

export default connect(
  state => ({
    isSearching: get(state, "signup.isSearching", false),
    autocompleteDistricts: get(state, "signup.autocompleteDistricts", [])
  }),
  {
    searchDistrict: searchDistrictsRequestAction
  }
)(RequestSchoolForm);

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

const FlexItems = styled(Row)`
  margin-bottom: 0;
`;

const CustomColumn = styled(Col)`
  margin-bottom: 24px;
  @media (max-width: ${mobileWidthLarge}) {
    margin-bottom: ${({ noMargin }) => (noMargin ? "0px" : "15px")};
  }
`;
