import { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { uniqBy } from "lodash";
import * as qs from "query-string";
import { FireBaseService as Fbs } from "@edulastic/common";
import { roleuser } from "@edulastic/constants";
import { connect } from "react-redux";
import { compose } from "redux";
import { getUser } from "../../../src/selectors/user";
import { destroyNotificationMessage, notificationMessage } from "../../../../common/components/Notification/index";
import { receiveAssignmentClassList } from "../../../src/actions/assignments";

const collectionName = "AssignmentBulkActionEvents";

const NotificationListener = ({ user, location, fetchAssignmentClassList }) => {
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

  const updateNotificationStatus = (docId, status) => {
    Fbs.db
      .collection(collectionName)
      .doc(docId)
      .update({ status });
  };

  const showUserNotifications = docs => {
    uniqBy(docs, "__id").forEach(doc => {
      const { status, totalCount, successCount } = doc;
      if (status === "initiated") {
        setNotificationIds([...notificationIds, doc.__id]);
        notificationMessage({
          title: "Assignment Bulk Action Update",
          message: `${successCount} out of ${totalCount} classes successfully updated.`,
          notificationPosition: "bottomRight",
          notificationKey: doc.__id,
          duration: 10
        });

        // if status is initiated and we are displaying, convert status to viewed
        updateNotificationStatus(doc.__id, "viewed");
        if (districtId && testId && testType) fetchAssignmentClassList({ districtId, testId, testType });
      }
    });
  };

  useEffect(() => {
    if (user && roleuser.DA_SA_ROLE_ARRAY.includes(user.role)) {
      showUserNotifications(userNotifications);
    }
  }, [userNotifications]);

  useEffect(
    () => () => {
      destroyNotificationMessage();
    },
    []
  );

  return null;
};

export default compose(
  withRouter,
  connect(
    state => ({
      user: getUser(state)
    }),
    { fetchAssignmentClassList: receiveAssignmentClassList }
  )
)(NotificationListener);
