import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";

// components
import { Radio, Tooltip } from "antd";
import { IconClose } from "@edulastic/icons";
import { EduButton } from "@edulastic/common";
import { StyledModal, StyledTable } from "./styled";

// ducks
import { actions, selectors } from "../ducks";

const MergeUsersModal = ({
  type,
  visible,
  loading,
  onSubmit,
  onCancel,
  userIds,
  userDetails,
  fetchUserDetails,
  mergeUsers
}) => {
  // state
  const [primaryUserId, setPrimaryUserId] = useState([]);

  useEffect(() => {
    if (userIds.length > 1 && visible) {
      fetchUserDetails({ type, userIds });
    }
  }, [userIds, visible]);

  useEffect(() => {
    setPrimaryUserId(userDetails[0]?._id);
  }, [userDetails]);

  const handleMerge = () => {
    mergeUsers({
      primaryUserId,
      userIds: userIds.filter(id => id !== primaryUserId),
      onMergeAction: onSubmit
    });
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
      render: (data, { _id }) =>
        _id === primaryUserId ? (
          <Tooltip title="The selected user will remain active">
            <Radio onClick={() => setPrimaryUserId(_id)} checked>
              {data}
            </Radio>
          </Tooltip>
        ) : (
          <Radio onClick={() => setPrimaryUserId(_id)}>{data}</Radio>
        ),
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: "Username",
      key: "username",
      dataIndex: "username",
      sorter: (a, b) => a.username.localeCompare(b.username)
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email)
    },
    {
      title: "LMS",
      key: "lms",
      dataIndex: "lms",
      sorter: (a, b) => a.lms.localeCompare(b.lms)
    },
    {
      title: "Id",
      dataIndex: "openId",
      sorter: (a, b) => a.openId.localeCompare(b.openId)
    },
    {
      title: "Assignments",
      key: "assignments",
      align: "center",
      dataIndex: "assignments",
      sorter: (a, b) => a.assignments < b.assignments
    },
    {
      title: "Created Date",
      key: "createdAt",
      dataIndex: "createdAt",
      sorter: (a, b) => a < b
    }
  ];

  const curatedDetails = userDetails.map(u => ({
    name: [u.firstName || "", u.middleName || "", u.lastName || ""].join(" ") || "-",
    username: u.username || "-",
    email: u.email || "-",
    lms: u.lms || "-",
    openId: u.openId,
    assignments: parseInt(u.assignments || 0),
    createdAt: moment(u.createdAt).format("MMM D, YYYY")
  }));

  return (
    <StyledModal
      title={
        <>
          <div>
            <span>Merge Accounts</span>
            <IconClose height={20} width={20} onClick={onCancel} style={{ cursor: "pointer" }} />
          </div>
          <p>
            All {type} accounts will get merged to a single account but assignment and other details will not be merged
            into one.
          </p>
        </>
      }
      visible={visible}
      onCancel={onCancel}
      footer={[
        <EduButton isGhost onClick={onCancel}>
          Cancel
        </EduButton>,
        <EduButton onClick={handleMerge} loading={loading}>
          Merge
        </EduButton>
      ]}
      centered
    >
      <StyledTable loading={loading} columns={columns} dataSource={curatedDetails} pagination={false} />
    </StyledModal>
  );
};

export default connect(
  state => ({
    loading: selectors.loading(state),
    userDetails: selectors.userDetails(state)
  }),
  {
    fetchUserDetails: actions.fetchUserDetailsRequest,
    mergeUsers: actions.mergeUsersRequest
  }
)(MergeUsersModal);
