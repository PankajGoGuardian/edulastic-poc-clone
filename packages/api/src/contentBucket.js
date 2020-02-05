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

const createBucket = data =>
  api
    .callApi({
      url: `${prefix}/${data.collectionId}/buckets`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const updateBucket = ({ _id, ...data }) =>
  api
    .callApi({
      url: `${prefix}/${data.collectionId}/buckets/${_id}`,
      method: "put",
      data
    })
    .then(result => result.data.result);

export default {
  fetchBuckets,
  createBucket,
  updateBucket
};
