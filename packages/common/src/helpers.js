/* eslint-disable */
import { fileApi } from "@edulastic/api";
import { aws } from "@edulastic/constants";

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
  inputString
    .replace(/<hr>/g, "<hr/>")
    .replace(/<br>/g, "<br/>")
    .replace(/(<img("[^"]*"|[^\/">])*)>/gi, "$1/>");

const replaceForJsxParser = inputString =>
  inputString
    .replace(/"{{resProps/g, "{resProps")
    .replace(/resProps}}"/g, "resProps}")
    .replace(/"{{lineHeight/g, "{lineHeight")
    .replace(/lineHeight}}"/g, "lineHeight}");

const parseTemplate = tmpl => {
  let temp = ` ${tmpl}`.slice(1);
  if (!window.$) {
    return "";
  }

  const parsedHTML = $.parseHTML(temp);

  $(parsedHTML)
    .find("textinput, mathinput, textdropdown, response")
    .each(addProps);

  $(parsedHTML)
    .find(".input__math")
    .each(function() {
      const latex = $(this).attr("data-latex");
      $(this).replaceWith(`<mathspan lineheight={{lineHeight}} latex="${latex}" />`);
    });

  temp = $("<div />")
    .append(parsedHTML)
    .html();

  return replaceForJsxParser(sanitizeSelfClosingTags(temp));
};

export const getResponsesCount = element => {
  return $(element).find("textinput, textdropdown, mathinput").length;
};

export const reIndexResponses = html => {
  const parsedHTML = $.parseHTML(html);
  if (!$(parsedHTML).find("textinput, mathinput, textdropdown, response").length) {
    return false;
  }
  $(parsedHTML)
    .find("textinput, mathinput, textdropdown, response")
    .each(function(index) {
      $(this)
        .find("span")
        .remove("span");
      $(this).attr("index", index);
      let text = $(this).text();
      $(this).html(`<span class="index">${index + 1}</span>${text}`);

      text = $("<div>")
        .append($(this).clone())
        .html();

      $(this).replaceWith(text);
    });

  const temp = $("<div />")
    .append(parsedHTML)
    .html();

  return temp;
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
  canInsert
};
