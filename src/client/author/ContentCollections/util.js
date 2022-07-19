export const caluculateOffset = (offsetObject) => {
  if (offsetObject.offsetParent === null) return 0

  return offsetObject.offsetTop + caluculateOffset(offsetObject.offsetParent)
}

export function getTheRole(permission, role) {
  if (permission == null || permission == undefined) return role
  for (const element of permission) {
    if (element.toLowerCase() == 'author' || element.toLowerCase() == 'curator')
      return 'Author'
  }
  return role
}
