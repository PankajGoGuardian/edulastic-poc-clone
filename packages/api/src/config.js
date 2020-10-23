export default {
  api:
    process.env.REACT_APP_API_URI ||
    'https://4uwpei20if.execute-api.us-east-1.amazonaws.com/development/api',
  apis:
    process.env.POI_APP_APIS_URI ||
    process.env.POI_APP_API_URI ||
    'https://4uwpei20if.execute-api.us-east-1.amazonaws.com/development/api',
}
