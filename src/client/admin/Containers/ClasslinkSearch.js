import React, { memo, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import SearchDistrictTable from "../SearchDistrictTable";
import MergeSyncTable from "../MergeSyncTable";
import { FirstDiv, H2, OuterDiv } from "../Common/StyledComponents";
import {
  updateClasslink as updateClasslinkAction,
  getTableData,
  deleteDistrictId as deleteDistrictIdAction,
  getUsersDataAction,
  clearTableDataAction,
  fetchClasslinkTableDataAction
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
    id: "classlinkId",
    label: "Classlink Id",
    message: "Please enter valid Classlink ID"
  }
];

function ClasslinkSearch(props) {
  const {
    fetchTableData,
    tableData,
    updateClasslink,
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
          <SearchForm fetchTableData={fetchTableData} searchProps={{listOfRadioOptions}} />
        </FirstDiv>
        <SearchDistrictTable
          data={tableData}
          updateClasslink={updateClasslink}
          deleteDistrictId={deleteDistrictId}
          getUsersDataAction={getUsersData}
          isClasslink
        />
      </OuterDiv>
      <MergeSyncTable isClasslink />
    </div>
  );
}

const mapStateToProps = state => ({
  tableData: getTableData(state)
});

const withConnect = connect(
  mapStateToProps,
  {
    updateClasslink: updateClasslinkAction,
    deleteDistrictId: deleteDistrictIdAction,
    getUsersData: getUsersDataAction,
    clearTableData: clearTableDataAction,
    fetchTableData: fetchClasslinkTableDataAction,
    clearMergeData: clearMergeDataAction
  }
);

export default compose(
  withConnect,
  memo
)(ClasslinkSearch);
