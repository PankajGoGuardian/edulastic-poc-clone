import React, { useState, memo } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Radio } from "antd";
import SearchDistrictTable from "../Components/SearchDistrictTable";
import { MainDiv, TextInput, FirstDiv } from "../Components/styled";
import { radioButtondata } from "../Data";
import { fetchTableData, updateClever, getTableData } from "../ducks";

const { Group: RadioGroup } = Radio;

function CleverSearch(props) {
  const [input, setInput] = useState("");
  const [radioInput, setRadioInput] = useState(radioButtondata[0].id);

  const searchData = function() {
    props.fetchTableData({
      search: {
        [radioInput]: input
      }
    });
  };
  return (
    <>
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
      <SearchDistrictTable data={props.tableData} updateClever={props.updateClever} />
    </>
  );
}

const mapStateToProps = state => ({
  tableData: getTableData(state)
});

const actionCreators = {
  fetchTableData,
  updateClever
};

const withConnect = connect(
  mapStateToProps,
  actionCreators
);

export default compose(
  withConnect,
  memo
)(CleverSearch);
