import API from "./utils/API";

const api = new API();
const prefix = "/attachments";

const loadAttachment = attachmentId =>
  api
    .callApi({
      url: `${prefix}/${attachmentId}`,
      method: "get"
    })
    .then(result => result.data.result);

const saveAttachment = data =>
  api
    .callApi({
      url: `${prefix}/`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const loadAllAttachments = filter =>
  api
    .callApi({
      url: `${prefix}/`,
      method: "get",
      params: filter
    })
    .then(result => result.data.result);

export default {
  loadAttachment,
  saveAttachment,
  loadAllAttachments
};
