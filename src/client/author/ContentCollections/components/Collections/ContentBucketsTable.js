import React, { useState, useEffect } from "react";
import { Icon } from "antd";
import { get } from "lodash";
import { StyledTable } from "../../styled";
import { themeColorLight, red } from "@edulastic/colors";
import { StyledScollBar, StatusText } from "../../styled";
import { isEqual } from "lodash";
import { caluculateOffset } from "../../util";

const ContentBucketTable = ({ buckets }) => {
  const [tableMaxHeight, setTableMaxHeight] = useState(200);
  const [bucketsTableRef, setBucketsTableRef] = useState(null);

  useEffect(() => {
    if (bucketsTableRef) {
      const tableMaxHeight = window.innerHeight - caluculateOffset(bucketsTableRef._container) - 40;
      setTableMaxHeight(tableMaxHeight);
    }
  }, [bucketsTableRef?._container?.offsetTop]);

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
    <StyledScollBar
      ref={ref => {
        if (!isEqual(ref, bucketsTableRef)) setBucketsTableRef(ref);
      }}
      maxHeight={tableMaxHeight}
    >
      <StyledTable dataSource={buckets} columns={columns} pagination={false} />
    </StyledScollBar>
  );
};

export { ContentBucketTable };
