import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { get } from "lodash";
import moment from "moment";

import { StyledAuditTable, StyledButton } from "./styled";

const statusColors = {
  rejected: "#CE5A7C",
  published: "#798CA8",
  "content error": "#CE5A7C",
  inreview: "#51A9B7"
};

const AuditList = ({ auditTrails: { attachments, users }, handleShowNotes }) => {
  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "createdAt", "");
        const next = get(b, "createdAt", "");
        return prev > next;
      },
      render: createdAt => {
        const date = new Date(createdAt);
        return <span>{moment(date).format("MMM DD, YYYY")}</span>;
      },
      width: 200
    },
    {
      title: "Name",
      dataIndex: "userId",
      key: "userId",
      render: value => {
        const { firstName, lastName } = users.find(rv => rv._id === value) || {};
        return (
          <span>
            {firstName} {lastName}
          </span>
        );
      },
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "userId", "");
        const next = get(b, "userId", "");
        const { firstName: prevFirstName, lastName: prevLastName } = users.find(rv => rv._id === prev) || {};
        const { firstName: nextFirstName, lastName: nextLastName } = users.find(rv => rv._id === next) || {};
        return `${nextFirstName}${nextLastName}`.localeCompare(`${prevFirstName}${prevLastName}`);
      },
      width: 250
    },
    {
      title: "Action",
      dataIndex: "status",
      key: "status",
      render: value => (
        <span style={{ textTransform: "uppercase", color: statusColors[value], fontSize: "11px" }}>
          {value === "inreview" ? "in review" : value}
        </span>
      ),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "status", "");
        const next = get(b, "status", "");
        return next.localeCompare(prev);
      },
      width: 250
    },
    {
      title: "Comments",
      dataIndex: "data.note",
      key: "data.note",
      render: value => <span>{value}</span>,
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const prev = get(a, "data.note", "");
        const next = get(b, "data.note", "");
        return next.localeCompare(prev);
      }
    },
    {
      title: "Annotations",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      render: _id => <StyledButton onClick={() => handleShowNotes(_id)}>Show notes</StyledButton>,
      width: 200
    }
  ];

  return <StyledAuditTable dataSource={attachments} columns={columns} pagination={false} />;
};

AuditList.propTypes = {
  auditTrails: PropTypes.shape({
    attachments: PropTypes.arrayOf(PropTypes.object),
    users: PropTypes.arrayOf(PropTypes.object)
  })
};

export default AuditList;
