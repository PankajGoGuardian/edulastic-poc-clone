import { notification } from "@edulastic/common";
import qs from "qs";
import API from "./utils/API";

const api = new API();
const prefix = "/clever/";
const atlasPrefix = "/atlas/";

const searchUpdateDistrict = params =>
  api
    .callApi({
      url: `districts`,
      method: "get",
      params,
      paramsSerializer: params => qs.stringify(params)
    })
    .then(({ data }) => data);

const searchClasslinkDistrict = params =>
  api
    .callApi({
      url: `${atlasPrefix}districts/classlink`,
      method: "get",
      params,
      paramsSerializer: params => qs.stringify(params)
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

const updateDistrictClasslinkId = ({ districtId, atlasId }) =>
    api
      .callApi({
        url: `${atlasPrefix}merge/${districtId}`,
        method: "post",
        data: { atlasId }
      })
      .then(({ data }) => data);

const deleteDistrictApi = districtId =>
  api
    .callApi({
      url: `districts/${districtId}`,
      method: "delete"
    })
    .then(({ data }) => data);

const fetchExistingDataMergeClever = ({ districtId, cleverId }) =>
  api
    .callApi({
      url: `${prefix}clever-district/${districtId}`,
      method: "get",
      params: { cleverId }
    })
    .then(({ data }) => data);

const fetchExistingDataMergeClasslink = ({ districtId, atlasId }) =>
  api
    .callApi({
      url: `${atlasPrefix}${atlasId}/district/${districtId}`,
      method: "get"
    })
    .then(({ data }) => data);

const deleteClasslinkDistrictApi = districtId =>
  api
    .callApi({
      url: `${atlasPrefix}district/${districtId}`,
      method: "delete"
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

const applyAtlasDeltaSyncApi = ({atlasId, ...data}) =>
  api
    .callApi({
      url: `${atlasPrefix}${atlasId}/delta-sync-config`,
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

const selectedAtlasSchoolSyncApi = ({ atlasId, atlasSchoolIds }) =>
  api
    .callApi({
      url: `${atlasPrefix}district/${atlasId}/schools-sync`,
      method: "post",
      data: {
        atlasSchoolIds
      }
    })
    .then(({ data }) => data);

// TODO: re-check why this call gets stuck at pending 
const completeAtlasDistrictSync = ({ atlasId }) =>
  api
    .callApi({
      url: `${atlasPrefix}district-sync/${atlasId}`,
      method: "post"
    })
    .then(({ data }) => data);

const fetchCleverClassNamesSyncApi = data =>
  api
    .callApi({
      url: `${prefix}class-name-pattern`,
      method: "post",
      data
    })
    .then(({ data }) => data);

const fetchAtlasClassNamesSyncApi = data =>
  api
    .callApi({
      url: `${atlasPrefix}${data.orgId}/class-name-pattern`,
      method: "post",
      data
    })
    .then(({ data }) => data);

const enableDisableCleverSyncApi = ({ syncEnabled, districtId }) =>
  api
    .callApi({
      url: `${prefix}district/${districtId}/clever-sync-status`,
      method: "put",
      data: {
        syncEnabled
      }
    })
    .then(({ data }) => data);

const enableDisableClasslinkSyncApi = ({ syncEnabled, districtId }) =>
  api
    .callApi({
      url: `${atlasPrefix}/district/${districtId}/sync-status`,
      method: "put",
      data: {
        syncEnabled
      }
    })
    .then(({ data }) => data);

const fetchCurriculumDataApi = () =>
  api
    .callApi({
      url: `/curriculum`,
      method: "get"
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

const uploadCSVtoAtlas = ({ districtId, file, mergeType }) => {
  const formData = new FormData();
  formData.append("file", file);
  return api
    .callApi({
      url: `${atlasPrefix}${districtId}/mergeids?mergeType=${mergeType}`,
      method: "post",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(({ data }) => data.result);
};

const updateCleverSubjectStandardApi = data =>
  api
    .callApi({
      url: `${prefix}update-subject-mapping`,
      method: "post",
      data
    })
    .then(({ data }) => data);

const updateAtlasSubjectStandardApi = data =>
  api
    .callApi({
      url: `${atlasPrefix}${data.orgId}/subject-mapping`,
      method: "post",
      data
    })
    .then(({ data }) => data);

const logsDataApi = districtId =>
  api
    .callApi({
      url: `${prefix}district/${districtId}/clever-log`,
      method: "get"
    })
    .then(({ data }) => data);

const logsAtlasDataApi = (districtId) =>
    api
      .callApi({
        url: `${atlasPrefix}district/${districtId}/setup-logs`,
        method: "get"
      })
      .then(({ data }) => data);

const getUsersDataApi = districtId =>
  api
    .callApi({
      url: `${prefix}districtstats/${districtId}/`,
      method: "get"
    })
    .then(({ data }) => data);

const getClasslinkUsersDataApi = districtId =>
  api
    .callApi({
      url: `${atlasPrefix}${districtId}/district-stats`,
      method: "get"
    })
    .then(({ data }) => data);

const manageSubscription = data =>
  api
    .callApi({
      url: "/subscription",
      method: "post",
      data
    })
    .then(({ data: response }) => response)
    .catch(({ data: errorData }) => notification({ msg: errorData.message }));

const searchUsersByEmailIds = data =>
  api
    .callApi({
      url: `/search/users/by-emails`,
      method: "post",
      data
    })
    .then(({ data: response }) => response);

const searchUsersByEmailsOrIds = data =>
  api
    .callApi({
      url: `/search/users/by-emails-or-ids`,
      method: "post",
      data
    })
    .then(({ data: response }) => response);

const searchSchoolsById = data =>
  api
    .callApi({
      url: `/search/schools`,
      method: "post",
      data
    })
    .then(({ data: response }) => response);

const saveOrgPermissionsApi = ({ permissions, districtId }) =>
  api
    .callApi({
      url: `districts/${districtId}`,
      method: "put",
      data: {
        permissions
      }
    })
    .then(({ data }) => data);

export default {
  searchUpdateDistrict,
  updateDistrictCleverId,
  updateDistrictClasslinkId,
  fetchExistingDataMergeClever,
  fetchExistingDataMergeClasslink,
  applyDeltaSyncApi,
  applyAtlasDeltaSyncApi,
  selectedSchoolSyncApi,
  completeDistrictSync,
  selectedAtlasSchoolSyncApi,
  completeAtlasDistrictSync,
  fetchCleverClassNamesSyncApi,
  fetchAtlasClassNamesSyncApi,
  deleteDistrictApi,
  deleteClasslinkDistrictApi,
  enableDisableCleverSyncApi,
  enableDisableClasslinkSyncApi,
  fetchCurriculumDataApi,
  uploadCSVtoClever,
  uploadCSVtoAtlas,
  updateCleverSubjectStandardApi,
  updateAtlasSubjectStandardApi,
  logsDataApi,
  logsAtlasDataApi,
  getUsersDataApi,
  getClasslinkUsersDataApi,
  manageSubscription,
  searchUsersByEmailIds,
  searchSchoolsById,
  saveOrgPermissionsApi,
  searchUsersByEmailsOrIds,
  searchClasslinkDistrict
};
