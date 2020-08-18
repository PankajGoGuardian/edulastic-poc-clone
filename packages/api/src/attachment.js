import { notification } from "@edulastic/common";
import API from "./utils/API";

const api = new API();
const blankApi = new API("", " ");
const prefix = "/attachments";

const isValidURL = str => {
  const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\\/]))?/;
  return regex.test(str);
};

const loadScratchFromUrl = dataUrl =>
  blankApi
    .callApi({
      url: dataUrl,
      method: "get"
    })
    .catch(() => {
      notification({ messageKey: "unableToRetrieve" });
    });

const loadAttachment = attachmentId =>
  api
    .callApi({
      url: `${prefix}/${attachmentId}`,
      method: "get"
    })
    .then(async result => {
      const attachment = result.data.result;
      if (attachment?.data?.scratchpad && isValidURL(attachment?.data?.scratchpad)) {
        try {
          const { data } = await loadScratchFromUrl(attachment?.data?.scratchpad);
          attachment.data.scratchpad = data;
        } catch (error) {
          attachment.data.scratchpad = "";
        }
      }
      return attachment;
    });

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
    .then(async result => {
      const { attachments, users } = result.data.result;
      for (const attachment of attachments) {
        if (attachment?.data?.scratchpad && isValidURL(attachment?.data?.scratchpad)) {
          try {
            const { data } = await loadScratchFromUrl(attachment?.data?.scratchpad);
            attachment.data.scratchpad = data;
          } catch (error) {
            attachment.data.scratchpad = "";
          }
        }
      }
      return { attachments, users };
    });

const updateAttachment = data =>
  api.callApi({
    url: `${prefix}/`,
    method: "put",
    data
  });

export default {
  loadAttachment,
  saveAttachment,
  loadAllAttachments,
  updateAttachment
};
