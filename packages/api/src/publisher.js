import API from "./utils/API";

const api = new API();

const getCollectionsData = districtId =>
  api.callApi({ url: `districts/${districtId}/publisher-metrics`, method: "get" }).then(result => result.data.result);

export default {
  getCollectionsData
};
