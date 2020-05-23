import { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { uniqBy } from "lodash";
import * as qs from "query-string";
import { FireBaseService as Fbs, notification } from "@edulastic/common";
import { roleuser } from "@edulastic/constants";
import { connect } from "react-redux";
import { compose } from "redux";
import { getUser } from "../../../src/selectors/user";
import { receiveAssignmentClassList, receiveAssignmentsSummaryAction } from "../../../src/actions/assignments";

const collectionName = "AssignmentBulkActionEvents";

const NotificationListener = ({ user, location, fetchAssignmentClassList, fetchAssignmentsSummaryAction }) => {
  const [notificationIds, setNotificationIds] = useState([]);
  let districtId = "";
  let testId = "";
  const { testType = "" } = qs.parse(location.search);
  if (testType) {
    const locationArray = location?.pathname?.split("/") || [];
    districtId = locationArray[locationArray?.length - 2] || "";
    testId = locationArray[locationArray?.length - 1] || "";
  }
  const userNotifications = Fbs.useFirestoreRealtimeDocuments(
    db => db.collection(collectionName).where("userId", "==", `${user?._id}`),
    [user?._id]
  );

  const deleteNotificationDocument = docId => {
    Fbs.db
      .collection(collectionName)
      .doc(docId)
      .delete();
  };

  const showUserNotifications = docs => {
    uniqBy(docs, "__id").forEach(doc => {
      const { processStatus, message, statusCode, isBulkAction, status } = doc;
      if (isBulkAction && status === "initiated" && processStatus === "done" && !notificationIds.includes(doc.__id)) {
        setNotificationIds([...notificationIds, doc.__id]);
        if (statusCode === 200) {
          notification({ type: "success", msg: message, key: doc.__id });
        } else {
          notification({ msg: message, key: doc.__id });
        }

        // if status is initiated and we are displaying, convert status to viewed
        deleteNotificationDocument(doc.__id);
        if (districtId && testId && testType) {
          fetchAssignmentsSummaryAction({ districtId });
          fetchAssignmentClassList({ districtId, testId, testType });
        }
      }
    });
  };

  useEffect(() => {
    if (user && roleuser.DA_SA_ROLE_ARRAY.includes(user.role)) {
      showUserNotifications(userNotifications);
    }
  }, [userNotifications]);

  return null;
};

export default compose(
  withRouter,
  connect(
    state => ({
      user: getUser(state)
    }),
    {
      fetchAssignmentClassList: receiveAssignmentClassList,
      fetchAssignmentsSummaryAction: receiveAssignmentsSummaryAction
    }
  )
)(NotificationListener);
