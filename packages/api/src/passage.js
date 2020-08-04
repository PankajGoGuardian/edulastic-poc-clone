import API from "./utils/API";

const api = new API();
const prefix = "/passage";

/**
 * create passage
 * @param {Object} data
 */
const create = data =>
  api
    .callApi({
      url: prefix,
      method: "post",
      data
    })
    .then(result => result.data.result);

const update = ({ _id, ...data }) =>
  api
    .callApi({
      url: `${prefix}/${_id}`,
      method: "put",
      data
    })
    .then(result => result.data.result);

const duplicate = ({ passageId, testItemIds }) =>
  api
    .callApi({
      url: `${prefix}/${passageId}/duplicate`,
      method: "post",
      data: { testItemIds }
    })
    .then(result => result.data.result);

const getById = _id =>
  api
    .callApi({
      url: `${prefix}/${_id}`,
      method: "get"
    })
    .then(result => result.data.result);

export default {
  create,
  update,
  getById,
  duplicate
};
