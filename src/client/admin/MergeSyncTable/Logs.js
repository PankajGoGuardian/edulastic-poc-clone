import React, { useEffect } from "react";
import { Button, Icon } from "antd";
import { Table } from "../Common/StyledComponents";

const { Column } = Table;

export default function Logs({ logs, fetchLogsDataAction, districtId }) {
  useEffect(() => {
    fetchLogsDataAction(districtId);
  }, []);
  return (
    <>
      <Button
        onClick={() => fetchLogsDataAction(districtId)}
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
        loading={!logs.length}
      >
        <Column title="ID" dataIndex="_id" key="_id" />
        <Column title="District ID" dataIndex="districtId" key="districtId" />
        <Column title="Info" dataIndex="info" key="info" />
        <Column title="Message" dataIndex="message" key="message" />
        <Column
          title="Created Date"
          dataIndex="createdAt"
          key="createdAt"
          render={timeStamp => new Date(timeStamp).toLocaleDateString()}
        />
      </Table>
    </>
  );
}
