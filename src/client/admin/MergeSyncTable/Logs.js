import React, { useEffect } from "react";
import { Table, Button } from "antd";

const { Column } = Table;

export default function Logs({ logs, fetchLogsDataAction, districtId }) {
  useEffect(() => {
    fetchLogsDataAction(districtId);
  }, []);
  return (
    <>
      <Button onClick={() => fetchLogsDataAction(districtId)}>Refresh Logs</Button>
      <Table rowKey={record => record._id} dataSource={logs} pagination={false} loading={!logs.length}>
        <Column title="ID" dataIndex="_id" key="_id" width={20} />
        <Column title="District ID" dataIndex="districtId" key="districtId" width={20} />
        <Column title="Info" dataIndex="info" key="info" width={50} />
        <Column title="Message" dataIndex="message" key="message" width={20} />
        <Column
          title="Created Date"
          dataIndex="createdAt"
          key="createdAt"
          width={20}
          render={timeStamp => new Date(timeStamp).toLocaleDateString()}
        />
        <Column title="__v" dataIndex="__v" key="__v" />
      </Table>
    </>
  );
}
