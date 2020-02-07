import React from "react";
import { AutoComplete, Form } from "antd";
import SearchDistrictByIdName from "./SearchDistrictByIdName";
import { compose } from "redux";
import { connect } from "react-redux";
import {
  getDistrictDataAction,
  getDistrictList,
  getIsDistrictLoading,
  getSelectedDistrict,
  setSelectedDistrict
} from "../../Components/CustomReportContainer/ducks";

const { Option: AutocompleteOption } = AutoComplete;

const DistrictSearch = Form.create({ name: "districtSearch" })(
  ({
    form: { getFieldDecorator, validateFields },
    loadingDistrict,
    getDistrictData,
    selectDistrict,
    districtList = [],
    getCustomReport
  }) => {
    const setSelectedDistrictInfo = option => {
      selectDistrict(option.props.index);
      getCustomReport(districtList[option.props.index]);
    };

    const searchDistrictData = evt => {
      evt.preventDefault();
      validateFields((err, { districtSearchOption, districtSearchValue }) => {
        if (!err) {
          getDistrictData({
            [districtSearchOption]: districtSearchValue
          });
        }
      });
    };
    const onDistrictSelect = (value, option) => setSelectedDistrictInfo(option);
    const dataSource = districtList.map(({ _source = {} }, index) => (
      <AutocompleteOption key={_source.name} index={index}>
        {_source.name}
      </AutocompleteOption>
    ));
    return (
      <SearchDistrictByIdName
        getFieldDecorator={getFieldDecorator}
        handleSubmit={searchDistrictData}
        autocomplete
        onSelect={onDistrictSelect}
        dataSource={dataSource}
        loading={loadingDistrict}
        filterOption={false}
        listOfRadioOptions={[
          {
            id: "name",
            label: "District Name",
            message: "Please enter valid district name"
          },
          {
            id: "id",
            label: "District Id",
            message: "Please enter valid District ID"
          }
        ]}
      />
    );
  }
);

const DistrictSearchForm = compose(
  connect(
    state => ({
      districtList: getDistrictList(state),
      loadingDistrict: getIsDistrictLoading(state),
      selectedDistrictData: getSelectedDistrict(state)
    }),
    {
      getDistrictData: getDistrictDataAction,
      selectDistrict: setSelectedDistrict
    }
  )
)(DistrictSearch);

export default DistrictSearchForm;
