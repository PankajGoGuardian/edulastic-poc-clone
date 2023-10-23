// TODO: we should move some of the logic from componets to this file moving forward.
export const canEditTest = (test, userId) => {
  if (test?.freezeSettings === true || test?.isDocBased === true) {
    // when freeze settings enabled or test is doc based, user has to be an author to enable edit
    return test.authors.some((author) => author._id === userId)
  }
  return true
}

export const isRestrictedTimeWindowForAssignment = (
  startDate,
  serverTimeStamp,
  isPaused,
  isOutsideTimeWindow
) => {
  return (
    !(Date(startDate) > new Date(serverTimeStamp) || !startDate || isPaused) &&
    isOutsideTimeWindow
  )
}

export const assignmentStatus = (status, isPaused, startDate) => {
  return status === 'NOT OPEN' && startDate && startDate < Date.now()
    ? `IN PROGRESS${isPaused ? ' (PAUSED)' : ''}`
    : `${status}${isPaused && status !== 'DONE' ? ' (PAUSED)' : ''}`
}
