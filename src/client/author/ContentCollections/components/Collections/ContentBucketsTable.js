import React from "react";
import { Icon } from "antd";
import { get } from "lodash";
import { StyledTable } from "../../styled";
import { themeColorLight, red } from "@edulastic/colors";
import { StyledScollBar, StatusText } from "../../styled";

const ContentBucketTable = ({ buckets }) => {
  const columns = [
    {
      title: "Bucket name",
      dataIndex: "name",
      key: "name",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "name", "");
        const next = get(b, "name", "");
        return next.localeCompare(prev);
      }
    },
    {
      title: "Clone Item",
      dataIndex: "canDuplicateItem",
      key: "canDuplicateItem",
      align: "center",
      render: value => getPermissionCell(value)
    },
    {
      title: "Clone Test",
      dataIndex: "canDuplicateTest",
      key: "canDuplicateTest",
      align: "center",
      render: value => getPermissionCell(value)
    },
    {
      title: "Clone Playlist",
      dataIndex: "canDuplicatePlayList",
      key: "canDuplicatePlayList",
      align: "center",
      render: value => getPermissionCell(value)
    },
    {
      title: "Item Visibility",
      dataIndex: "isItemVisible",
      key: "isItemVisible",
      align: "center",
      render: value => getPermissionCell(value)
    },
    {
      title: "Test Visibility",
      dataIndex: "isTestVisible",
      key: "isTestVisible",
      align: "center",
      render: value => getPermissionCell(value)
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: value => {
        if (value) return <StatusText color="green">ACTIVE</StatusText>;
        return <StatusText color="red">DISABLE</StatusText>;
      }
    }
  ];

  const getPermissionCell = value =>
    value ? <Icon type="check" style={{ color: themeColorLight }} /> : <Icon type="close" style={{ color: red }} />;

  return (
    <StyledScollBar>
      <StyledTable dataSource={buckets} columns={columns} pagination={false} />
    </StyledScollBar>
  );
};

export { ContentBucketTable };
