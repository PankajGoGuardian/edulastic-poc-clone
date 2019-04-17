import React from "react";

import { Select } from "antd";
const Option = Select.Option;

import { StyledSelect } from "./styled";

class CountrySelect extends React.Component {
  render() {
    const { countryList } = this.props;
    const { getFieldDecorator } = this.props.form;
    const options = [];
    Object.entries(countryList).map(([key, value]) => {
      options.push(<Option value={key}>{value}</Option>);
    });
    return (
      <React.Fragment>
        {getFieldDecorator("country", {
          rules: [{ required: true, message: "Please select Country" }]
        })(<StyledSelect placeholder="Select Country">{options}</StyledSelect>)}
      </React.Fragment>
    );
  }
}

export default CountrySelect;
