import React from "react";
import { get } from "lodash";
import { connect } from "react-redux";
import { useRealtimeV2 } from "@edulastic/common";
import { removeItemBankPermissionAction, addItemBankPermissionAction } from "./student/Login/ducks";

const RealTimeCollectionWatch = ({ userData, addItemBankPermission, removeItemBankPermission }) => {
  const { userId, districtIds } = userData;
  const topics = districtIds.map(districtId => `collection:permission:districtId:${districtId}`);
  useRealtimeV2(topics, {
    // For user level permissions orgId will be userId
    addPermission: payload => {
      if (payload.orgId === userId) {
        addItemBankPermission(payload);
      }
    },
    deletePermission: payload => {
      if (payload.orgId === userId) {
        removeItemBankPermission(payload);
      }
    }
  });
  return null;
};

export default connect(
  ({ user }) => ({
      userData: {
        userId: get(user, "user._id", ""),
        districtIds: get(user, "user.districtIds", [])
      }
    }),
  {
    addItemBankPermission: addItemBankPermissionAction,
    removeItemBankPermission: removeItemBankPermissionAction
  }
)(RealTimeCollectionWatch);
