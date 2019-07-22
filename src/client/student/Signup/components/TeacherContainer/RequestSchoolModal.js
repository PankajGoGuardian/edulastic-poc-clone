import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { get, debounce, find } from "lodash";
import styled from "styled-components";
import { Form, Modal, Button, Input, Select } from "antd";
import { lightGrey3, linkColor, themeColor, white } from "@edulastic/colors";
import { RemoteAutocompleteDropDown } from "../../../../common/components/widgets/remoteAutoCompleteDropDown";
import { countryApi } from "@edulastic/api";
import { searchDistrictsRequestAction, createAndJoinSchoolRequestAction } from "../../duck";
import { states } from "./constants";
const { Option } = Select;

class RequestSchool extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    handleCancel: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    districts: PropTypes.array.isRequired,
    isSearching: PropTypes.bool.isRequired,
    searchDistrict: PropTypes.func.isRequired,
    userInfo: PropTypes.object.isRequired
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
      ...this.state,
      countryList,
      stateList: states,
      initialState: "Alaska"
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, handleCancel, districts, createAndJoinSchoolRequestAction } = this.props;
    const { keyword } = this.state;
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

  render() {
    const { isOpen, handleCancel, form, districts, isSearching, autocompleteDistricts } = this.props;
    const { getFieldDecorator } = form;
    const { keyword, countryList, stateList, initialState } = this.state;

    const title = (
      <Title>
        <label>Request a new school</label>
        <br />
        Please fill the details to add a new school, Edualstic Support will create the school after verifying the data
      </Title>
    );

    const footer = (
      <ActionButton onClick={this.handleSubmit} type="primary" htmlType="submit">
        Request a new school
      </ActionButton>
    );

    const formItemLayout = {
      labelCol: {
        xs: { span: 16 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 8 },
        sm: { span: 20 }
      }
    };

    const changeCountryHandler = value => {
      if (value !== "US") {
        this.setState({
          ...this.state,
          stateList: [],
          initialState: ""
        });
      } else {
        this.setState({
          ...this.state,
          stateList: states,
          initialState: "Alaska"
        });
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
      <StyledModal title={title} visible={isOpen} footer={footer} onCancel={handleCancel} width="50%">
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="Name">
            {getFieldDecorator("name", {
              validateTrigger: ["onChange", "onBlur"],
              rules: [
                { transform: this.transformInput },
                { required: true, message: "Please provide a valid school name." }
              ]
            })(<Input placeholder="Enter your school name" />)}
          </Form.Item>
          <Form.Item label="District">
            {getFieldDecorator("districtId", {
              initialValue: { key: "", title: "" },
              rules: [
                { required: true, message: "Please provide a valid district name." },
                {
                  validator: (rule, value, callback) => {
                    if (value.title.length === 0 || value.key.length === 0) {
                      callback("Please provide a valid district name.");
                      return;
                    }
                    callback();
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
            })(<Input placeholder="Enter your school address" />)}
          </Form.Item>
          <Form.Item label="City">
            {getFieldDecorator("city", {
              rules: [{ required: false, message: "Please provide a valid city." }]
            })(<Input placeholder="Enter your school city" />)}
          </Form.Item>
          <FlexItems>
            <Form.Item label="Zip">
              {getFieldDecorator("zip", {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  { transform: this.transformInput },
                  { required: true, message: "Please provide a valid zip code." }
                ]
              })(<Input placeholder="Enter Zip Code" />)}
            </Form.Item>
            <Form.Item label="State">
              {getFieldDecorator("state", {
                rules: [{ required: false, message: "Please provide a valid state." }],
                initialValue: initialState
              })(
                <Select showSearch placeholder="Select state">
                  {stateOptions}
                </Select>
              )}
            </Form.Item>
          </FlexItems>

          <Form.Item label="Country">
            {getFieldDecorator("country", {
              rules: [{ required: true, message: "Please provide a valid country." }],
              initialValue: "United States"
            })(
              <Select
                showSearch
                placeholder="Select a country"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={value => changeCountryHandler(value)}
              >
                {countryOptions}
              </Select>
            )}
          </Form.Item>
        </Form>
      </StyledModal>
    );
  }
}

const RequestSchoolModal = Form.create({ name: "request_school" })(RequestSchool);

const enhance = compose(
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
  .ant-modal-content,
  .ant-modal-header {
    background-color: ${lightGrey3};
    border-bottom: 0px;
  }
  .ant-modal-footer {
    display: flex;
    justify-content: center;
    border-top: 0px;
    padding: 0px 16px 32px;
  }

  .ant-form-item {
    text-align: center;
    display: flex;
  }
  .ant-form-item-required::before {
    display: none;
  }
  .ant-form-item label {
    font-weight: 600;
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
`;

const ActionButton = styled(Button)`
  font-weight: 600;
  font-size: 12px;
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

  &:hover {
    background: ${themeColor};
  }
`;

const Title = styled.div`
  color: ${linkColor};
  font-size: 12px;
  label {
    font-weight: 800;
    font-size: 18px;
  }
`;

const FlexItems = styled.div`
  display: flex;
  align-items: flex-end;
  padding-left: 8.9%;
  justify-content: flex-start;
  .ant-form-item:nth-child(2) {
    width: 50%;
    margin-left: 5px;
  }
  .ant-form-item:nth-child(1) {
    width: 50%;
    margin-right: 5px;
  }
  .ant-form-item-control {
    line-height: initial;
  }
`;

const CreateDistrict = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;
