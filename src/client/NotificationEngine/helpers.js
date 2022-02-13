import { FireBaseService as Fbs } from '@edulastic/common'

export const notificationsCollectionName = 'HackDayNotificationEngine'

export const notificationStatus = {
  INITIATED: 0,
  SEEN: 1,
  READ: 2,
  ARCHIVED: 3,
}

export const topicType = {
  NEW_ASSIGNMENT: 0,
  OVERALL_ASSIGNMENT_FEEDBACK: 1,
  ASSIGNMENT_GRADING: 2,
  SUBSCRIPTION_OFFER: 3,
}

export const updateUserNotifications = (
  docs = [],
  updateData = {},
  callback = () => {}
) => {
  const batch = Fbs.db.batch()
  docs.forEach((d) => {
    const ref = Fbs.db.collection(notificationsCollectionName).doc(d.__id)
    batch.update(ref, updateData)
  })
  batch
    .commit()
    .then(callback)
    .catch((err) => console.error(err))
}

export const deleteNotification = (docId, callback = () => {}) => {
  Fbs.db
    .collection(notificationsCollectionName)
    .doc(docId)
    .delete()
    .then(callback)
    .catch((err) => console.error(err))
}

export const topicMeta = {
  [topicType.NEW_ASSIGNMENT]: {
    label: 'New Assignment',
    labelGroup: 'Assignments',
  },
  [topicType.OVERALL_ASSIGNMENT_FEEDBACK]: {
    label: 'Overall Feedback',
    labelGroup: 'Assignments',
  },
  [topicType.ASSIGNMENT_GRADING]: {
    label: 'Assignment Grading',
    labelGroup: 'Assignments',
  },
  [topicType.SUBSCRIPTION_OFFER]: {
    label: 'Subscription Offer',
    labelGroup: 'Subscriptions',
  },
}
