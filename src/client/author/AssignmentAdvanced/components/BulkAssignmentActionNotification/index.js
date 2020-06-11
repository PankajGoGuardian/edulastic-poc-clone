import { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { uniqBy } from "lodash";
import * as qs from "query-string";
import { FireBaseService as Fbs, notification as antdNotification } from "@edulastic/common";
import { roleuser } from "@edulastic/constants";
import { connect } from "react-redux";
import { compose } from "redux";
import { getUser } from "../../../src/selectors/user";
import { receiveAssignmentClassList, receiveAssignmentsSummaryAction } from "../../../src/actions/assignments";
import {
  closeHangoutNotification as closeFirebaseNotification,
  destroyNotificationMessage,
  notificationMessage
} from "../../../../common/components/Notification";
import { setAssignmentBulkActionStatus } from "../../ducks";

const collectionName = "AssignmentBulkActionEvents";
const DOWNLOAD_GRADES_AND_RESPONSE = "DOWNLOAD_GRADES_AND_RESPONSE";

const NotificationListener = ({
  user,
  location,
  fetchAssignmentClassList,
  fetchAssignmentsSummaryAction,
  setBulkActionStatus,
  history
}) => {
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

  const onNotificationClick = (e, docId) => {
    /**
     * Note: As this function gets invoked on clicking anywhere in the notification.
     * So making sure that the user clicked on Download button in the notification by
     * and only than the notification document is getting deleted.
     */
    if (e?.target?.tagName.toLowerCase() === "a") {
      closeFirebaseNotification(docId);
      deleteNotificationDocument(docId);
    }
  };

  const showUserNotifications = docs => {
    uniqBy(docs, "__id").forEach(doc => {
      const { processStatus, message, statusCode, isBulkAction, status, action, downloadLink } = doc;
      if (isBulkAction && status === "initiated" && processStatus === "done" && !notificationIds.includes(doc.__id)) {
        setNotificationIds([...notificationIds, doc.__id]);
        if (statusCode === 200) {
          if (action === DOWNLOAD_GRADES_AND_RESPONSE) {
            notificationMessage({
              title: "Download Grades/Responses",
              message,
              showButton: true,
              buttonLink: downloadLink,
              buttonText: "DOWNLOAD",
              notificationPosition: "bottomRight",
              notificationKey: doc.__id,
              onCloseNotification: () => {
                deleteNotificationDocument(doc.__id);
              },
              onButtonClick: e => {
                onNotificationClick(e, doc.__id);
              }
            });
          } else antdNotification({ type: "success", msg: message, key: doc.__id });
        } else {
          antdNotification({ msg: message, key: doc.__id });
        }

        if (action !== DOWNLOAD_GRADES_AND_RESPONSE || statusCode !== 200) {
          // if status is initiated and we are displaying, delete the notification document from firebase
          deleteNotificationDocument(doc.__id);
        }
        if (districtId && testId && testType && action !== DOWNLOAD_GRADES_AND_RESPONSE) {
          fetchAssignmentsSummaryAction({ districtId });
          fetchAssignmentClassList({ districtId, testId, testType });
        }

        // if user at assignments home page and bulk action has been processed successfully
        const isAssignmentsHomePage =
          !districtId &&
          !testId &&
          !testType &&
          location?.pathname?.includes("author/assignments") &&
          statusCode == 200;

        if (isAssignmentsHomePage) {
          history.push("author/assignments");
        }
        setBulkActionStatus(false);
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
    {
      fetchAssignmentClassList: receiveAssignmentClassList,
      fetchAssignmentsSummaryAction: receiveAssignmentsSummaryAction,
      setBulkActionStatus: setAssignmentBulkActionStatus
    }
  )
)(NotificationListener);
