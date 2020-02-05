import API from "./utils/API";

const api = new API();
const prefix = "/item-bank";

const fetchBuckets = () =>
  api
    .callApi({
      url: `${prefix}/buckets`,
      method: "get"
    })
    .then(({ data: response }) => response);

const createBucket = ({ collectionId, ...data }) =>
  api
    .callApi({
      url: `${prefix}/${collectionId}/buckets`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const updateBucket = ({ _id, collectionId, ...data }) =>
  api
    .callApi({
      url: `${prefix}/${collectionId}/buckets/${_id}`,
      method: "put",
      data
    })
    .then(result => result.data.result);

export default {
  fetchBuckets,
  createBucket,
  updateBucket
};
