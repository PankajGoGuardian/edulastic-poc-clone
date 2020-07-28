import React, { useEffect, useState } from "react";
import { Button, Icon } from "antd";
import { Table, StyledFilterInput } from "../Common/StyledComponents";

const { Column } = Table;

export default function Logs({ logs, fetchLogsDataAction, districtId, isClasslink, loading }) {
  const [filteredLogs, setFilteredLogs] = useState([]);

  const getLogs = () => {
    fetchLogsDataAction({ districtId, isClasslink });
  };

  const search = value => {
    const newFilteredLogs = logs.filter(eachLog =>
      Object.values(eachLog).some(logValue =>
        String(logValue)
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    );

    setFilteredLogs(newFilteredLogs);
  };

  useEffect(() => {
    getLogs();
  }, [districtId]);

  useEffect(() => {
    setFilteredLogs(logs);
  }, [logs]);

  return (
    <>
      <Button onClick={getLogs} aria-label="Refresh Logs" title="Refresh Logs" style={{ marginBottom: "10px" }}>
        <Icon type="reload" />
      </Button>
      <StyledFilterInput placeholder="Search..." onSearch={search} />
      <Table
        rowKey={record => record._id}
        dataSource={filteredLogs}
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
