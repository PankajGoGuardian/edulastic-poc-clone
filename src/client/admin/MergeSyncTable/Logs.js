import React, { useEffect } from "react";
import { Button, Icon } from "antd";
import { Table } from "../Common/StyledComponents";

const { Column } = Table;

export default function Logs({
  logs,
  fetchLogsDataAction,
  districtId,
  isClasslink,
  loading
}) {

  const getLogs = () => {
    fetchLogsDataAction({districtId, isClasslink});
  }

  useEffect(() => {
    getLogs();
  }, [districtId]);

  return (
    <>
      <Button
        onClick={getLogs}
        aria-label="Refresh Logs"
        title="Refresh Logs"
        style={{ marginBottom: "10px" }}
      >
        <Icon type="reload" />
      </Button>
      <Table
        rowKey={record => record._id}
        dataSource={logs}
        pagination={{
          position: "both",
          pageSize: 10
        }}
        loading={loading}
      >
        <Column title="ID" dataIndex="_id" key="_id" />
        <Column title="District ID" dataIndex="districtId" key="districtId" />
        <Column title="Info" dataIndex="info" key="info" />
        <Column title="Message" dataIndex="message" key="message" />
        <Column
          title="Created Date"
          dataIndex="createdAt"
          key="createdAt"
          render={timeStamp => new Date(timeStamp).toLocaleString()}
        />
      </Table>
    </>
  );
}
