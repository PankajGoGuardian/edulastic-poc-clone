const SCHOOL_NOT_SELECTED = 1
const PREFERENCE_NOTSELECTED = 2
const DONE = 3
const INVITE_TEACHER_PENDING = 4
const ACCESS_WITHOUT_SCHOOL = 5

const signupStateBykey = Object.keys({
  SCHOOL_NOT_SELECTED,
  PREFERENCE_NOTSELECTED,
  DONE,
  INVITE_TEACHER_PENDING,
  ACCESS_WITHOUT_SCHOOL,
})

module.exports = {
  SCHOOL_NOT_SELECTED,
  PREFERENCE_NOTSELECTED,
  DONE,
  INVITE_TEACHER_PENDING,
  ACCESS_WITHOUT_SCHOOL,
  signupStateBykey,
}
