/* eslint-disable */
import uuid from "uuid/v4";
import { fileApi } from "@edulastic/api";
import { aws } from "@edulastic/constants";
import { message } from "antd";

export const ALPHABET = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];

const getDisplayName = WrappedComponent => WrappedComponent.displayName || WrappedComponent.name || "Component";

const getPaginationInfo = ({ page, limit, count }) => ({
  from: (page - 1) * limit + 1,
  to: limit * page > count ? count : limit * page
});

const getNumeration = (index, type) => {
  const char = ALPHABET[index];

  if (!char) return index + 1;

  switch (type) {
    case "number":
      return index + 1;
    case "upper-alpha":
    case "uppercase":
      return char.toUpperCase();
    case "lower-alpha":
    case "lowercase":
      return char.toLowerCase();
    default:
      return index + 1;
  }
};

const isEmpty = str => {
  str = typeof str === "string" ? str.trim() : "";
  return str === "<p><br></p>" || str === "";
};

const s3Folders = Object.values(aws.s3Folders);
/**
 * upload a file to s3 using signed url
 * @param {file} file
 */
export const uploadToS3 = async (file, folder) => {
  if (!file) {
    throw new Error("file is missing");
  }
  if (!folder || !s3Folders.includes(folder)) {
    throw new Error("folder is invalid");
  }
  const result = await fileApi.getSignedUrl(file.name, folder);
  const formData = new FormData();
  const { fields, url } = result;

  Object.keys(fields).forEach(item => {
    formData.append(item, fields[item]);
  });

  formData.append("file", file);

  await fileApi.uploadBySignedUrl(url, formData);
  return `${url}/${fields.key}`;
};

function addProps() {
  $(this).attr("resprops", "{{resProps}}");
  const text = $("<div>")
    .append($(this).clone())
    .html();
  $(this).replaceWith(text);
}

const sanitizeSelfClosingTags = inputString =>
  inputString &&
  inputString
    .replace(/<hr>/g, "<hr/>")
    .replace(/<br>/g, "<br/>")
    .replace(/(<img("[^"]*"|[^\/">])*)>/gi, "$1/>");

const replaceForJsxParser = inputString =>
  inputString &&
  inputString
    .replace(/"{{resProps/g, "{resProps")
    .replace(/resProps}}"/g, "resProps}")
    .replace(/"{{lineHeight/g, "{lineHeight")
    .replace(/lineHeight}}"/g, "lineHeight}");

const escapeCurlyBraces = node => {
  if (node && (node.textContent.includes("{") || node.textContent.includes("}"))) {
    node.textContent = node.textContent.replace(/([{}]+)/g, "{'$1'}");
  }
};

const processCurlyBraces = nodes => {
  if (nodes.contents().length) {
    nodes.contents().each((index, node) => {
      if (node.nodeType === 3) {
        escapeCurlyBraces(node);
      } else {
        processCurlyBraces($(node));
      }
    });
  } else {
    escapeCurlyBraces(nodes[0]);
  }
  return nodes;
};

const parseTemplate = tmpl => {
  let temp = ` ${tmpl}`.slice(1);
  if (!window.$) {
    return "";
  }

  const parsedHTML = $("<div />").html(temp);

  $(parsedHTML)
    .find("textinput, mathinput, textdropdown, response")
    .each(addProps);

  $(parsedHTML)
    .find(".input__math")
    .each(function() {
      const latex = $(this).attr("data-latex");
      $(this).replaceWith(`<mathspan lineheight={{lineHeight}} latex="${latex}" />`);
    });

  temp = $(processCurlyBraces($(parsedHTML))).html();

  return replaceForJsxParser(sanitizeSelfClosingTags(temp));
};

export const getResponsesCount = element => {
  return $(element).find("textinput, textdropdown, mathinput").length;
};

export const reIndexResponses = htmlStr => {
  const parsedHTML = $("<div />").html(htmlStr);
  if (!$(parsedHTML).find("textinput, mathinput, textdropdown, response").length) {
    return htmlStr;
  }

  $(parsedHTML)
    .find("textinput, mathinput, textdropdown, response")
    .each(function(index) {
      $(this)
        .find("span")
        .remove("span");

      const id = $(this).attr("id");
      if (!id) {
        $(this).attr("id", uuid());
      }

      $(this).attr("responseIndex", index + 1);
      $(this).attr("contenteditable", false);

      const text = $("<div>")
        .append($(this).clone())
        .html();

      $(this).replaceWith(text);
    });

  return $(parsedHTML).html();
};

export const removeIndexFromTemplate = tmpl => {
  let temp = ` ${tmpl}`.slice(1);
  if (!window.$) {
    return temp;
  }
  const parsedHTML = $("<div />").html(temp);
  $(parsedHTML)
    .find("textinput, mathinput, textdropdown, response")
    .each(function() {
      $(this).removeAttr("responseindex");
      $(this).removeAttr("contenteditable");
    });
  return $(parsedHTML).html();
};

export const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];

export const beforeUpload = file => {
  const isAllowedType = allowedFileTypes.includes(file.type);
  if (!isAllowedType) {
    message.error("Image type not supported");
  }
  const withinSizeLimit = file.size / 1024 / 1024 < 2;
  if (!withinSizeLimit) {
    message.error("Image size should be less than 2MB");
  }
  return isAllowedType && withinSizeLimit;
};

export const canInsert = element => element.contentEditable !== "false";
export default {
  sanitizeSelfClosingTags,
  getDisplayName,
  getPaginationInfo,
  getNumeration,
  isEmpty,
  uploadToS3,
  parseTemplate,
  reIndexResponses,
  canInsert,
  removeIndexFromTemplate
};
