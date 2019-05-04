import React, { useState } from "react";
import { Radio, Button, Table } from "antd";
import SyncTableData from "../Data/syncTableData.json";

const { Group: RadioGroup } = Radio;
const { Column } = Table;

export default function Sync({ schools, cleverId, syncSchools }) {
  const [radioInput, setRadioInput] = useState("syncSelectedSchools");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const reSyncSchools = () => {
    syncSchools({
      radioInput,
      cleverId,
      schoolCleverIds: selectedRowKeys
    });
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    hideDefaultSelections: true
  };

  return (
    <div>
      <RadioGroup name="syncOptions" value={radioInput} onChange={evt => setRadioInput(evt.target.id)}>
        <Radio key="syncSelectedSchools" id="syncSelectedSchools" value="syncSelectedSchools">
          Sync Selected Schools
        </Radio>
        <Radio key="syncCompleteDistrict" id="syncCompleteDistrict" value="syncCompleteDistrict">
          Sync Complete District
        </Radio>
      </RadioGroup>
      <Button type="primary" onClick={reSyncSchools}>
        Resync
      </Button>
      <div>
        <Table
          rowKey={record => record.id}
          dataSource={schools}
          pagination={false}
          rowSelection={rowSelection}
          bordered
        >
          <Column title="School Name" dataIndex="name" key="name" />
          <Column title="School Clever Id" dataIndex="id" key="schoolCleverId" />
        </Table>
      </div>
    </div>
  );
}
