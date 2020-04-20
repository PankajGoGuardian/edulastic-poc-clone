import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { getUser } from "../author/src/selectors/user";
import { destroyNotificationMessage, notificationMessage } from "../common/components/Notification";
import { FireBaseService as Fbs } from "@edulastic/common";
import { uniqBy } from "lodash";

const hangoutFirestoreCollectionName = "HangoutsClassEvents";

const NotificationListener = ({ user }) => {
  const [notificationIds, setNotificationIds] = useState([]);
  const userNotifications = Fbs.useFirestoreRealtimeDocuments(
    db => db.collection(hangoutFirestoreCollectionName).where("studentID", "==", `${user?._id}`),
    [user?._id]
  );

  const updateNotificationStatus = (docId, status) => {
    Fbs.db
      .collection(hangoutFirestoreCollectionName)
      .doc(docId)
      .update({ status });
  };

  const closeNotification = (event, key, status) => {
    // update status to closed
    if (status !== "closed") {
      updateNotificationStatus(key, "closed");
    }
  };

  const onNotificationClick = (event, key, status) => {
    // update status to clicked
    if (status !== "clicked" && event?.target?.tagName.toLowerCase() === "a") {
      updateNotificationStatus(key, "clicked");
    }
  };

  const showUserNotifications = docs => {
    uniqBy(docs, "__id").map(doc => {
      const { classID, hangoutLink, status, modifiedAt, studentID } = doc;
      const groupInfo = user.orgData.classList.filter(o => o._id === classID)[0];
      const modifiedDateTime = new Date(modifiedAt.seconds * 1000).getTime();
      const currentDateTime = new Date().getTime();
      if (
        hangoutLink &&
        (status === "initiated" || status === "viewed") &&
        currentDateTime < modifiedDateTime + 60 * 60 * 1000 &&
        !notificationIds.includes(doc.__id)
      ) {
        setNotificationIds(doc.__id);
        notificationMessage({
          title: "Google Meet Video Call",
          message: `Google Meet video call is starting for ${groupInfo.name} class.`,
          showButton: true,
          buttonLink: hangoutLink,
          buttonText: "CLICK HERE TO JOIN",
          notificationPosition: "bottomRight",
          notificationKey: doc.__id,
          onCloseNotification: () => {
            closeNotification(event, doc.__id, status);
          },
          onButtonClick: () => {
            onNotificationClick(event, doc.__id, status);
          }
        });
        if (status === "initiated") {
          // if status is initiated and we are displaying, convert status to viewed
          updateNotificationStatus(doc.__id, "viewed");
        }
      }
    });
  };

  useEffect(
    () => () => {
      destroyNotificationMessage();
    },
    []
  );

  useEffect(() => {
    if (user && user.role === "student") {
      showUserNotifications(userNotifications);
    }
  }, [userNotifications]);
  return null;
};

export default compose(
  connect(
    state => ({
      user: getUser(state)
    }),
    {}
  )
)(NotificationListener);
