import { API } from "@edulastic/api";
import { message } from "antd";
const api = new API();

export const doValidate = (params, endpoint, method = "post") =>
  api
    .callApi({
      url: endpoint,
      method,
      data: method === "post" ? params : {},
      params: method === "get" ? params : {}
    })
    .then(({ data }) => data)
    .catch(({ data: errorData }) => message.error(errorData.message));

export const submit = (params, endpoint, method) =>
  api
    .callApi({
      url: endpoint,
      method,
      data: params
    })
    .then(({ data, status }) => ({ ...data, status }))
    .catch(({ data: errorData }) => message.error(errorData.message));
