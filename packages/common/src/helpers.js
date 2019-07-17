/* eslint-disable */
import uuid from "uuid/v4";
import { isString, get } from "lodash";
import { fileApi } from "@edulastic/api";
import { aws, question, questionType } from "@edulastic/constants";
import { message } from "antd";
import { empty } from "rxjs";

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

const sanitizeSelfClosingTags = inputString => {
  let _inputString = typeof inputString === "number" ? inputString.toString() : inputString;

  const sanitizedString =
    _inputString &&
    _inputString
      .replace(/<hr>/g, "<hr/>")
      .replace(/<br>/g, "<br/>")
      .replace(/(<img("[^"]*"|[^\/">])*)>/gi, "$1/>");

  return sanitizedString;
};

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

export const sanitizeForReview = stimulus => {
  if (!stimulus) return stimulus;
  let jqueryEl;
  try {
    jqueryEl = $(stimulus);
  } catch (err) {
    jqueryEl = $("<p>").append(stimulus);
  }

  // eslint-disable-next-line func-names
  const tagsToRemove = ["mathinput", "textinput", "textdropdown", "img", "table"];
  tagsToRemove.forEach(tagToRemove => {
    jqueryEl.find(tagToRemove).each(function() {
      $(this).replaceWith("...");
    });
  });
  return sanitizeSelfClosingTags(jqueryEl.html());
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

/**
 * does question have enough data !?
 *  This is only the begnning. This func is going to grow to handle
 *  the idiosyncraices of  multiple questions types.
 *  "To inifinity and beyond" ~ Buzz Lightyear, or someone wise!
 */
export const isIncompleteQuestion = item => {
  // if resource type question it doesnt have stimulus or options.

  const emptyChoiceError = "Answer choices should not be empty";

  if (question.resourceTypeQuestions.includes(item.type)) {
    return [false];
  }

  if (!item.stimulus) {
    return [true, "Question text shouldnot be empty"];
  }

  if (item.options) {
    // options check for expression multipart type question.
    if (item.type === questionType.EXPRESSION_MULTIPART) {
      const optionsCount = get(item, ["response_ids", "dropDowns", "length"], 0);
      if (optionsCount !== Object.keys(item.options).length) {
        return [true, emptyChoiceError];
      }
      const options = Object.values(item.options);
      for (const opt of options) {
        if (!opt.length) {
          return [true, emptyChoiceError];
        }
        const hasEmptyOptions = opt.some(opt => !opt);
        if (hasEmptyOptions) return [true, emptyChoiceError];
      }
    } else {
      // for other question types.
      const hasEmptyOptions = item.options.some(opt => {
        return (opt.hasOwnProperty("label") && !opt.label.trim()) || (isString(opt) && opt.trim() === "");
      });

      if (hasEmptyOptions) return [true, emptyChoiceError];
    }
  }

  return [false];
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
  sanitizeForReview,
  canInsert,
  removeIndexFromTemplate,
  isIncompleteQuestion
};
