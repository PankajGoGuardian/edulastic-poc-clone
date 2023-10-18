const apiUri = process.env.REACT_APP_API_URI

export const getApiUri = () => {
  if (apiUri) {
    return apiUri
  }
  const currentOrigin = window.location.origin
  const url = new URL(currentOrigin)
  return `${url.origin}/api/`
}
