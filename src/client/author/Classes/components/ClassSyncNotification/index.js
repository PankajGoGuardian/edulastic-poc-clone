import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { FireBaseService as Fbs } from "@edulastic/common";
import { roleuser } from "@edulastic/constants";
import { uniqBy, pull } from "lodash";
import notification from "@edulastic/common/src/components/Notification";
import {
  destroyNotificationMessage
} from "../../../../common/components/Notification";
import { getUser } from "../../../src/selectors/user";
import {
  fetchStudentsByIdAction,
  removeClassSyncNotificationAction,
  setGroupSyncDataAction, setSyncClassLoadingAction
} from "../../../ManageClass/ducks";
import {fetchGroupsAction} from "../../../sharedDucks/groups";

const firestoreGoogleClassSyncStatusCollection = "GoogleClassSyncStatus";

const ClassSyncNotificationListener = ({ user, removeClassSyncDetails, fetchStudentsById, setSyncClassLoading, setGroupSyncData, fetchGroups }) => {
  const [notificationIds, setNotificationIds] = useState([]);
  const userNotifications = Fbs.useFirestoreRealtimeDocuments(
    db => db.collection(firestoreGoogleClassSyncStatusCollection).where("userId", "==", `${user?._id}`),
    [user?._id]
  );

  const closeNotification = (event, key, data) => {
    // delete the doc from firestore
    setNotificationIds([...pull(notificationIds, [key])]);
    // execute delete request
    removeClassSyncDetails();
    const { groupId, studentsSaved } = data;
    if(groupId){
      fetchStudentsById({classId: groupId});
    } else {
      if (studentsSaved) {
        setGroupSyncData(studentsSaved);
      }
      setSyncClassLoading(false);
      fetchGroups();
    }
  };

  const showUserNotifications = docs => {
    uniqBy(docs, "__id").map(doc => {
      const { status, studentsSaved, counter, groupId } = doc;

      if((status === "completed" || counter === 0) && !notificationIds.includes(doc.__id)){
        setNotificationIds([...notificationIds, doc.__id]);
        // show sync complete notification
        notification({
          msg: "Class sync task completed.",
          type: "success",
          onClose: () => {closeNotification(event, doc.__id, {groupId, studentsSaved})}
        });
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
    if (user && user.role === roleuser.TEACHER) {
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
    {
      removeClassSyncDetails: removeClassSyncNotificationAction,
      fetchStudentsById: fetchStudentsByIdAction,
      setGroupSyncData: setGroupSyncDataAction,
      fetchGroups: fetchGroupsAction,
      setSyncClassLoading: setSyncClassLoadingAction
    }
  )
)(ClassSyncNotificationListener);
