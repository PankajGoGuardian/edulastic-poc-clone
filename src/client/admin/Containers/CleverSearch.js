import React, { memo } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import styled from "styled-components";
import { Radio, Form, Input, Icon } from "antd";
import SearchDistrictTable from "../SearchDistrictTable";
import MergeSyncTable from "../MergeSyncTable";
import { FirstDiv, Button, H2, OuterDiv } from "../Common/StyledComponents";
import {
  fetchTableData,
  updateClever,
  getTableData,
  deleteDistrictId,
  getUsersDataAction
} from "../SearchDistrictTable/ducks";
import SearchedByIdName from "../Common/Form/SearchByIdName";

const WrappedForm = Form.create({ name: "validate_other" })(
  ({ fetchTableData, form: { getFieldDecorator, validateFields } }) => {
    function searchData(evt) {
      evt.preventDefault();
      validateFields((err, { radioInput, searchDistrict }) => {
        if (!err) {
          fetchTableData({
            [radioInput]: searchDistrict
          });
        }
      });
    }

    return <SearchedByIdName handleSubmit={searchData} getFieldDecorator={getFieldDecorator} />;
  }
);

function CleverSearch(props) {
  const { fetchTableData, tableData, updateClever, deleteDistrictId, getUsersDataAction } = props;

  return (
    <div>
      <OuterDiv>
        <H2>Search and Update District</H2>
        <FirstDiv>
          <WrappedForm fetchTableData={fetchTableData} />
        </FirstDiv>
        <SearchDistrictTable
          data={tableData}
          updateClever={updateClever}
          deleteDistrictId={deleteDistrictId}
          getUsersDataAction={getUsersDataAction}
        />
      </OuterDiv>
      <MergeSyncTable />
    </div>
  );
}

const mapStateToProps = state => ({
  tableData: getTableData(state)
});

const withConnect = connect(
  mapStateToProps,
  {
    fetchTableData,
    updateClever,
    deleteDistrictId,
    getUsersDataAction
  }
);

export default compose(
  withConnect,
  memo
)(CleverSearch);
