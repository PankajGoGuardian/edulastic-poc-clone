import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { get, debounce, find } from "lodash";
import styled from "styled-components";
import { Form, Modal, Button, Input, Select } from "antd";
import { lightGrey3, linkColor, springGreen, white } from "@edulastic/colors";
import { RemoteAutocompleteDropDown } from "../../../../common/components/widgets/remoteAutoCompleteDropDown";
import { countryApi } from "@edulastic/api";
import { searchDistrictsRequestAction, createAndJoinSchoolRequestAction } from "../../duck";

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
    countryList: {}
  };

  async componentDidMount() {
    const countryList = await countryApi.getCountries();
    this.setState({
      ...this.state,
      countryList
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, handleCancel, districts, createAndJoinSchoolRequestAction } = this.props;
    const { keyword } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        const { name, districtId, address, city, country, state, zip } = values;
        const district = find(districts, ({ districtId: _id }) => _id === districtId) || {};
        const { districtName } = district;
        const body = {
          name,
          districtName: districtName || keyword,
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

        createAndJoinSchoolRequestAction({
          createSchool: body,
          joinSchool: {
            data: {
              currentSignUpState: "PREFERENCE_NOT_SELECTED",
              email: this.props.userInfo.email,
              firstName: this.props.userInfo.firstName
            },
            userId: this.props.userInfo._id
          }
        });
      }
    });
  };

  handleTyping = keyword => {
    this.setState({ ...this.state, keyword });
    this.onSearch(keyword);
  };

  onSearch = searchText => {
    const { searchDistrict, isSearching } = this.props;
    if (!isSearching && searchText.length > 2) {
      searchDistrict({ searchText });
    }
  };

  render() {
    const { isOpen, handleCancel, form, districts, isSearching, autocompleteDistricts } = this.props;
    const { getFieldDecorator } = form;
    const { keyword, countryList } = this.state;

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

    const countryOptions = Object.entries(countryList).map(([key, value]) => (
      <Option value={key} key={key}>
        {value}
      </Option>
    ));

    return (
      <StyledModal title={title} visible={isOpen} footer={footer} onCancel={handleCancel} width="50%">
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="Name">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "Please input School Name!" }]
            })(<Input placeholder="Enter your school name" />)}
          </Form.Item>
          <Form.Item label="District">
            {getFieldDecorator("districtId", {
              initialValue: { title: "" },
              rules: [
                { required: true, message: "Please input district name" },
                {
                  validator: (rule, value, callback) => {
                    if (value.title.length === 0) {
                      callback("Please input district name");
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
              />
            )}
          </Form.Item>
          <Form.Item label="Address">
            {getFieldDecorator("address", {
              rules: [{ required: true, message: "Please input school address" }]
            })(<Input placeholder="Enter your school address" />)}
          </Form.Item>
          <Form.Item label="City">
            {getFieldDecorator("city", {
              rules: [{ required: true, message: "Please input school city" }]
            })(<Input placeholder="Enter your school city" />)}
          </Form.Item>
          <FlexItems>
            <Form.Item label="Zip">
              {getFieldDecorator("zip", {
                rules: [{ required: true, message: "Please input Zip Code" }]
              })(<Input placeholder="Enter Zip Code" />)}
            </Form.Item>
            <Form.Item label="State">
              {getFieldDecorator("state", {
                rules: [{ required: true, message: "Please input State" }]
              })(<Input placeholder="Enter State" />)}
            </Form.Item>
          </FlexItems>

          <Form.Item label="Country">
            {getFieldDecorator("country", {
              rules: [{ required: true, message: "Please Select a country" }],
              initialValue: "US"
            })(
              <Select
                showSearch
                placeholder="Select a country"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
      fill: ${springGreen};
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
  background: ${springGreen};
  color: ${white};
  border: 0px;

  &:hover {
    background: ${springGreen};
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
  padding-left: 11.6%;
  justify-content: space-between;
  .ant-form-item:nth-child(2) {
    width: 50%;
  }
  .ant-form-item:nth-child(1) {
    width: 35%;
  }
`;

const CreateDistrict = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;
