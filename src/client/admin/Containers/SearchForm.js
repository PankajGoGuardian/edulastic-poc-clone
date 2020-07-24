import React from "react";
import { Form } from "antd";

import SearchDistrictByIdName from "../Common/Form/SearchDistrictByIdName";

export const SearchForm = Form.create({ name: "validate_other" })(
    ({ fetchTableData, searchProps = {}, form: { getFieldDecorator, validateFields } }) => {
      function searchData(evt) {
        evt.preventDefault();
        validateFields((err, { districtSearchOption, districtSearchValue }) => {
          if (!err) {
            fetchTableData({
              [districtSearchOption]: districtSearchValue
            });
          }
        });
      }
  
      return (
        <SearchDistrictByIdName
          handleSubmit={searchData}
          getFieldDecorator={getFieldDecorator}
          {...searchProps}
        />
      );
    }
);