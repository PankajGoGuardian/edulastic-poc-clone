import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";

// components
import { Spin, Row, Radio } from "antd";
import { IconClose } from "@edulastic/icons";
import { EduButton } from "@edulastic/common";
import { StyledModal, DetailsContainer } from "./styled";

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
  const [mergeData, setMergeData] = useState([]);

  useEffect(() => {
    if (userIds.length > 1 && visible) {
      fetchUserDetails({ type, userIds });
    }
  }, [userIds, visible]);

  useEffect(() => {
    setMergeData(userDetails[0]);
  }, [userDetails]);

  const handleMerge = () => {
    mergeUsers({
      primaryUserId: mergeData._id,
      userIds: userIds.filter(id => id !== mergeData._id)
    });

    setTimeout(onSubmit, 5000);
  };

  const nameKeys = ["firstName", "middleName", "lastName"];

  const dataKeys = ["name", ...new Set(userDetails.flatMap(u => Object.keys(u)))].filter(
    k => !(nameKeys.includes(k) || k === "_id")
  );

  const curatedDetails = userDetails.map(user => {
    const u = { ...user };
    u.createdAt = user.createdAt && moment(user.createdAt).format("MMMM Do YYYY");
    u.name = nameKeys
      .map(k => user[k])
      .filter(n => n)
      .join(" ");
    return u;
  });

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
      {loading ? (
        <Spin />
      ) : (
        <DetailsContainer>
          {curatedDetails.map(user => (
            <div onClick={() => setMergeData(userDetails.find(u => u._id === user._id))}>
              <Radio checked={user?._id === mergeData?._id} />
              {dataKeys.map(dataKey => (
                <Row>
                  <b>{dataKey[0].toUpperCase() + dataKey.substring(1)}: </b>
                  {user[dataKey] === undefined ? "" : user[dataKey]}
                </Row>
              ))}
            </div>
          ))}
        </DetailsContainer>
      )}
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
