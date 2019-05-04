import React, { useState, memo } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Radio } from "antd";
import SearchDistrictTable from "../SearchDistrictTable";
import MergeSyncTable from "../MergeSyncTable";
import { MainDiv, TextInput, FirstDiv } from "../Common/StyledComponents";
import { radioButtondata } from "../Data";
import { fetchTableData, updateClever, getTableData, deleteDistrictId } from "../SearchDistrictTable/ducks";
import {
  searchExistingDataApi,
  getMergeData,
  applyDeltaSyncChanges,
  syncSchools,
  applyClassNamesSync
} from "../MergeSyncTable/ducks";

const { Group: RadioGroup } = Radio;

function CleverSearch(props) {
  const {
    fetchTableData,
    tableData,
    updateClever,
    deleteDistrictId,
    searchExistingDataApi,
    mergeData,
    applyDeltaSyncChanges,
    syncSchools,
    applyClassNamesSync
  } = props;
  const [input, setInput] = useState("");
  const [radioInput, setRadioInput] = useState(radioButtondata[0].id);

  const searchData = function() {
    fetchTableData({
      [radioInput]: input
    });
  };
  return (
    <MainDiv>
      <h2>Search and Update District</h2>
      <FirstDiv>
        <TextInput
          circular
          placeholder="Search..."
          value={input}
          onChange={evt => setInput(evt.target.value)}
          onSearch={searchData}
          style={{ width: 300 }}
        />
        <div>
          <RadioGroup name="searchOptions" value={radioInput} onChange={evt => setRadioInput(evt.target.id)}>
            {radioButtondata.map(item => (
              <Radio key={item.id} id={item.id} value={item.id}>
                {item.label}
              </Radio>
            ))}
          </RadioGroup>
        </div>
      </FirstDiv>
      <SearchDistrictTable data={tableData} updateClever={updateClever} deleteDistrictId={deleteDistrictId} />
      <MergeSyncTable
        searchExistingDataApi={searchExistingDataApi}
        mergeData={mergeData}
        applyDeltaSyncChanges={applyDeltaSyncChanges}
        syncSchools={syncSchools}
        applyClassNamesSync={applyClassNamesSync}
      />
    </MainDiv>
  );
}

const mapStateToProps = state => ({
  tableData: getTableData(state),
  mergeData: getMergeData(state)
});

const withConnect = connect(
  mapStateToProps,
  {
    fetchTableData,
    updateClever,
    searchExistingDataApi,
    applyDeltaSyncChanges,
    syncSchools,
    applyClassNamesSync,
    deleteDistrictId
  }
);

export default compose(
  withConnect,
  memo
)(CleverSearch);
