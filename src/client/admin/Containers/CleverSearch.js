import React, { memo, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import SearchDistrictTable from "../SearchDistrictTable";
import MergeSyncTable from "../MergeSyncTable";
import { FirstDiv, H2, OuterDiv } from "../Common/StyledComponents";
import {
  fetchTableData as fetchTableDataAction,
  updateClever as updateCleverAction,
  getTableData,
  deleteDistrictId as deleteDistrictIdAction,
  getUsersDataAction,
  clearTableDataAction
} from "../SearchDistrictTable/ducks";
import {clearMergeDataAction} from "../MergeSyncTable/ducks";

import {SearchForm} from './SearchForm';

const listOfRadioOptions = [
  {
    id: "name",
    label: "District Name",
    message: "Please enter valid district name"
  },
  {
    id: "id",
    label: "District Id",
    message: "Please enter valid District ID"
  },
  {
    id: "cleverid",
    label: "Clever Id",
    message: "Please enter valid Clever ID"
  }
];

function CleverSearch(props) {
  const {
    fetchTableData,
    tableData,
    updateClever,
    deleteDistrictId,
    getUsersData,
    clearTableData,
    clearMergeData
  } = props;

  useEffect(() => () => {
    clearTableData();
    clearMergeData();
  }, []);

  return (
    <div>
      <OuterDiv>
        <H2>Search and Update District</H2>
        <FirstDiv>
          <SearchForm
            fetchTableData={fetchTableData}
            searchProps={{listOfRadioOptions}}
          />
        </FirstDiv>
        <SearchDistrictTable
          data={tableData}
          updateClever={updateClever}
          deleteDistrictId={deleteDistrictId}
          getUsersDataAction={getUsersData}
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
    fetchTableData: fetchTableDataAction,
    updateClever: updateCleverAction,
    deleteDistrictId: deleteDistrictIdAction,
    getUsersData: getUsersDataAction,
    clearTableData: clearTableDataAction,
    clearMergeData: clearMergeDataAction
  }
);

export default compose(
  withConnect,
  memo
)(CleverSearch);
