import API from "./utils/API";

const api = new API();
const prefix = "/clever/";

const searchUpdateDistrict = params =>
  api
    .callApi({
      url: `districts`,
      method: "get",
      params
    })
    .then(({ data }) => data);

const updateDistrictCleverId = ({ districtId, cleverId }) =>
  api
    .callApi({
      url: `districts/${districtId}/clever-id`,
      method: "put",
      data: { cleverId }
    })
    .then(({ data }) => data);

const deleteDistrictApi = districtId =>
  api
    .callApi({
      url: `districts/${districtId}`,
      method: "delete"
    })
    .then(({ data }) => data);

const fetchExistingDataMergeClever = ({ cleverDistrict, cleverId }) =>
  api
    .callApi({
      url: `${prefix}clever-district/${cleverDistrict}`,
      method: "get",
      params: { cleverId }
    })
    .then(({ data }) => data);

const applyDeltaSyncApi = data =>
  api
    .callApi({
      url: `${prefix}update-delta-sync-info`,
      method: "post",
      data
    })
    .then(({ data }) => data);

const selectedSchoolSyncApi = ({ cleverId, schoolCleverIds }) =>
  api
    .callApi({
      url: `${prefix}districts/${cleverId}/schools-sync`,
      method: "post",
      data: {
        schoolCleverIds
      }
    })
    .then(({ data }) => data);

const completeDistrictSync = ({ cleverId }) =>
  api
    .callApi({
      url: `${prefix}district/${cleverId}`,
      method: "get"
    })
    .then(({ data }) => data);

const fetchClassNamesSyncApi = data =>
  api
    .callApi({
      url: `${prefix}class-name-pattern`,
      method: "post",
      data
    })
    .then(({ data }) => data);

const uploadCSVtoClever = ({ districtId, mergeType, file }) => {
  const formData = new FormData();
  formData.append("file", file);
  return api
    .callApi({
      url: `${prefix}merge/${districtId}?mergeType=${mergeType}`,
      method: "post",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(({ data }) => data.result);
};

export default {
  searchUpdateDistrict,
  updateDistrictCleverId,
  fetchExistingDataMergeClever,
  applyDeltaSyncApi,
  selectedSchoolSyncApi,
  completeDistrictSync,
  fetchClassNamesSyncApi,
  deleteDistrictApi,
  uploadCSVtoClever
};
