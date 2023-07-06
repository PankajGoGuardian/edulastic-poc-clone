export const studentIsEnrolled = ({
  isEnrolled,
  enrollmentStatus,
  archived,
}) => {
  return isEnrolled && enrollmentStatus !== 0 && !archived
}

export const studentIsUnEnrolled = ({
  isEnrolled,
  enrollmentStatus,
  archived,
}) => {
  return !isEnrolled && enrollmentStatus === 0 && archived
}
