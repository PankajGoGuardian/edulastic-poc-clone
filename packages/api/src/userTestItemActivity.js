import API from "./utils/API";

const api = new API();
const prefix = "/test-activity";

const create = ({ answers, testItemId, testActivityId, ...rest }, autoSave = false) =>
  api
    .callApi({
      url: `${prefix}/${testActivityId}/test-item/${testItemId}`,
      method: "post",
      data: { userResponse: answers, ...rest },
      params: { autoSave }
    })
    .then(result => result.data.result);

const updateUserWorkTestLevel = ({ testActivityId, groupId, userWork }) =>
  api
    .callApi({
      url: `${prefix}/${testActivityId}/user-work`,
      method: "put",
      data: { userWork, groupId }
    })
    .then(result => result.data.result);

export default {
  create,
  updateUserWorkTestLevel
};
