import React, { memo } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import styled from "styled-components";
import { Radio, Form, Input, Icon } from "antd";
import SearchDistrictTable from "../SearchDistrictTable";
import MergeSyncTable from "../MergeSyncTable";
import { FirstDiv, Button, H2, OuterDiv } from "../Common/StyledComponents";
import { radioButtondata } from "../Data";
import {
  fetchTableData,
  updateClever,
  getTableData,
  deleteDistrictId,
  getUsersDataAction
} from "../SearchDistrictTable/ducks";

const { Group: RadioGroup } = Radio;

const CircularInput = styled(Input)`
  margin-right: 10px;
  border-radius: 20px;
`;

const WrappedForm = Form.create({ name: "validate_other" })(function searchUpdateDistrictForm({
  fetchTableData,
  form: { getFieldDecorator, validateFields }
}) {
  const searchData = function(evt) {
    evt.preventDefault();
    validateFields((err, { radioInput, searchDistrict }) => {
      if (!err) {
        fetchTableData({
          [radioInput]: searchDistrict
        });
      }
    });
  };

  return (
    <Form onSubmit={searchData} layout="inline">
      <Form.Item>
        {getFieldDecorator("searchDistrict", {
          initialValue: ""
        })(<CircularInput placeholder="Search..." style={{ width: 300 }} />)}
        <Button
          icon="search"
          type="submit"
          style={{
            position: "absolute",
            top: "0",
            right: "10px"
          }}
          aria-label="Search"
          noStyle
        >
          <Icon type="search" />
        </Button>
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("radioInput", {
          initialValue: radioButtondata.list[0].id
        })(
          <RadioGroup name="searchOptions">
            {radioButtondata.list.map(item => (
              <Radio key={item.id} id={item.id} value={item.id}>
                {item.label}
              </Radio>
            ))}
          </RadioGroup>
        )}
      </Form.Item>
    </Form>
  );
});

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
