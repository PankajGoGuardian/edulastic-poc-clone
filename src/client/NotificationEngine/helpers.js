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

export const deleteUserNotifications = (docs = [], callback = () => {}) => {
  const batch = Fbs.db.batch()
  docs.forEach((d) => {
    const ref = Fbs.db.collection(notificationsCollectionName).doc(d.__id)
    batch.delete(ref)
  })
  batch
    .commit()
    .then(callback)
    .catch((err) => console.error(err))
}

export const topicMeta = {
  [topicType.NEW_ASSIGNMENT]: {
    label: 'new',
    labelGroup: 'Assignments',
    color: '#ff5500',
  },
  [topicType.OVERALL_ASSIGNMENT_FEEDBACK]: {
    label: 'feedback',
    labelGroup: 'Assignments',
    color: '#2db7f5',
  },
  [topicType.ASSIGNMENT_GRADING]: {
    label: 'grading',
    labelGroup: 'Assignments',
    color: '#108ee9',
  },
  [topicType.SUBSCRIPTION_OFFER]: {
    label: 'offer',
    labelGroup: 'Subscriptions',
    color: '#87d068',
  },
}
