import React from "react";

import { Select } from "antd";
const Option = Select.Option;

import { StyledSelect } from "./styled";

class CountrySelect extends React.Component {
  state = {
    value: ""
  };

  handleSearch = value => {
    this.setState({
      value
    });
  };

  render() {
    const { countryList } = this.props;
    const { getFieldDecorator } = this.props.form;
    const options = [];
    Object.entries(countryList).map(([key, value]) => {
      if (value.indexOf(this.state.value) >= 0) {
        options.push(<Option value={key}>{value}</Option>);
      }
    });
    return (
      <React.Fragment>
        {getFieldDecorator("country", {
          rules: [{ required: true, message: "Please select Country" }]
        })(
          <StyledSelect
            showSearch
            placeholder="Select Country"
            onSearch={this.handleSearch}
            showArrow={false}
            filterOption={false}
            notFoundContent={null}
          >
            {options}
          </StyledSelect>
        )}
      </React.Fragment>
    );
  }
}

export default CountrySelect;
