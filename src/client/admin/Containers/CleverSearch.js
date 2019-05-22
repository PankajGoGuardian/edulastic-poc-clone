import React, { memo } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Form } from "antd";
import SearchDistrictTable from "../SearchDistrictTable";
import MergeSyncTable from "../MergeSyncTable";
import { FirstDiv, H2, OuterDiv } from "../Common/StyledComponents";
import {
  fetchTableData,
  updateClever,
  getTableData,
  deleteDistrictId,
  getUsersDataAction
} from "../SearchDistrictTable/ducks";
import SearchDistrictByIdName from "../Common/Form/SearchDistrictByIdName";

const WrappedForm = Form.create({ name: "validate_other" })(
  ({ fetchTableData, form: { getFieldDecorator, validateFields } }) => {
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

    return <SearchDistrictByIdName handleSubmit={searchData} getFieldDecorator={getFieldDecorator} />;
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
