// TODO: we should move some of the logic from componets to this file moving forward.
export const canEditTest = (test, userId) => {
  if (test?.freezeSettings === true || test?.isDocBased === true) {
    // when freeze settings enabled or test is doc based, user has to be an author to enable edit
    return test.authors.some((author) => author._id === userId)
  }
  return true
}
