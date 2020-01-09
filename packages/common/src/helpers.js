/* eslint-disable */
import uuid from "uuid/v4";
import { isString, get, round } from "lodash";
import { fileApi } from "@edulastic/api";
import { aws, question, questionType } from "@edulastic/constants";
import { replaceLatexesWithMathHtml } from "./utils/mathUtils";
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
  const id = $(this).attr("id");
  $(this).attr("key", id);
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
      .replace(/(<img("[^"]*"|[^\/">])*)>/gi, "$1/>")
      .replace(/allowfullscreen="true"><\/iframe>/, "allowfullscreen=''></iframe>");

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
  if (nodes.prop("tagName") !== "IFRAME" && nodes.contents().length) {
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
    .find("textinput, mathinput, textdropdown, response, mathunit")
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
  return $(element).find("textinput, textdropdown, mathinput, mathunit").length;
};

export const reIndexResponses = htmlStr => {
  const parsedHTML = $("<div />").html(htmlStr);
  if (!$(parsedHTML).find("textinput, mathinput, mathunit, textdropdown, response, paragraphnumber").length) {
    return htmlStr;
  }

  $(parsedHTML)
    .find("textinput, mathinput, mathunit, textdropdown, response, paragraphnumber")
    .each(function(index) {
      $(this)
        .find("span")
        .remove("span");

      const id = $(this).attr("id") || uuid();
      $(this).attr({ id, key: id });
      $(this).attr("responseIndex", index + 1);
      $(this).attr("contenteditable", false);

      if ($(this).context.nodeName === "PARAGRAPHNUMBER") {
        $(this).html(`<label>${index + 1}</label>`);
      }

      const text = $("<div>")
        .append($(this).clone())
        .html();

      $(this).replaceWith(text);
    });

  return $(parsedHTML).html();
};

export const sanitizeForReview = stimulus => {
  if (!window.$) return stimulus;
  if (!stimulus) return question.DEFAULT_STIMULUS;
  const jqueryEl = $("<p>").append(stimulus);
  //remove br tag also
  // span needs to be checked because if we use matrix it comes as span tag (ref: EV-10640)
  const tagsToRemove = ["mathinput", "mathunit", "textinput", "textdropdown", "img", "table", "response", "br", "span"];
  let tagFound = false;
  tagsToRemove.forEach(tagToRemove => {
    jqueryEl.find(tagToRemove).each(function() {
      const elem = $(this).context;
      // replace if tag is not span
      // span comes when we use italic or bold
      let shouldReplace = elem.nodeName !== "SPAN"; // sanitize other tags (mainly input responses) from stimulus except span
      const latex = elem.getAttribute("data-latex");
      // sanitize span only if matrix is rendered using a span tag
      // do no sanitize if span does not have latex (in case we use bold or italic)
      if (elem.nodeName === "SPAN" && latex && latex.includes("matrix")) {
        shouldReplace = true;
      }
      if (shouldReplace) $(this).replaceWith("...");
      tagFound = true;
    });
  });
  //to remove any text after ...
  let splitJquery = jqueryEl.html();
  if (tagFound) {
    const firstIndexOf = jqueryEl.html().indexOf("...");
    if (firstIndexOf != -1) {
      splitJquery = jqueryEl.html().substr(0, firstIndexOf + 3);
    }
    if (splitJquery === "...") {
      splitJquery = question.DEFAULT_STIMULUS;
    }
  }
  if (splitJquery.includes("</p>")) {
    splitJquery = `${splitJquery.substr(0, splitJquery.indexOf("</p>"))} </p>`;
  }
  return sanitizeSelfClosingTags(splitJquery);
};

export const removeIndexFromTemplate = tmpl => {
  let temp = ` ${tmpl}`.slice(1);
  if (!window.$) {
    return temp;
  }
  const parsedHTML = $("<div />").html(temp);
  $(parsedHTML)
    .find("textinput, mathinput, mathunit, textdropdown, response")
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

export const calculateWordsCount = ele =>
  $("<div>")
    .html(ele)
    .text()
    .split(/\W/g)
    .filter(i => !!i.trim()).length;
export const canInsert = element => element.contentEditable !== "false";

const getPoints = item => {
  if (!item) {
    return 0;
  }
  if (item.itemLevelScoring && !isNaN(item.itemLevelScore)) {
    return item.itemLevelScore;
  }

  return get(item, ["data", "questions"], []).reduce(
    (acc, q) => acc + (q.scoringDisabled ? 0 : get(q, ["validation", "validResponse", "score"], 0)),
    0
  );
};

const getQuestionLevelScore = (item, questions, totalMaxScore, newMaxScore) => {
  let questionScore = {};
  const maxScore = newMaxScore || totalMaxScore;
  if (item.itemLevelScoring === true) {
    questions.forEach((o, i) => {
      if (i === 0) {
        questionScore[o.id] = maxScore;
      } else {
        questionScore[o.id] = 0;
      }
    });
  } else {
    let currentTotal = 0;
    questions.forEach((o, i) => {
      if (i === questions.length - 1) {
        questionScore[o.id] = round(maxScore - currentTotal, 2);
      } else {
        const score = round(get(o, ["validation", "validResponse", "score"], 0) * (maxScore / totalMaxScore), 2);
        questionScore[o.id] = score;
        currentTotal += score;
      }
    });
  }
  return questionScore;
};

export const getSelection = () => {
  let sel = "";
  if (window.getSelection) {
    sel = window.getSelection();
  } else if (document.getSelection) {
    sel = document.getSelection();
  } else if (document.selection) {
    sel = document.selection.createRange();
  }
  return sel;
};

export const clearSelection = () => {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
};

/**
 *
 * @param {string} className class name of new element, default is 'token active-word
 * @param {string} tag new element tag name, default is span
 * @returns {boolean}
 */
export const highlightSelectedText = (className = "token active-word", tag = "span") => {
  const selection = getSelection();
  if (!selection.rangeCount) {
    console.log("Unable to find a native DOM range from the current selection.");
    return;
  }
  const range = selection.getRangeAt(0);
  const { endContainer, endOffset, startContainer, startOffset, commonAncestorContainer } = range;
  if (startOffset === endOffset) {
    clearSelection();
    return;
  }

  if (get(commonAncestorContainer, "offsetParent.tagName", null) === "TABLE") {
    message.error("You can not select text with a table. Please select a text inside the table.");
    clearSelection();
    return;
  }

  if (
    (endContainer && endContainer.parentNode.className === className) ||
    (startContainer && startContainer.parentNode.className === className)
  ) {
    message.error("You are highlighting already selected text. Please select a distinct text and try again.");
    clearSelection();
    return;
  }

  try {
    const node = document.createElement(tag);
    const fragment = range.extractContents();

    node.setAttribute("class", className);
    node.appendChild(fragment);
    range.insertNode(node);

    clearSelection();
    return true;
  } catch (err) {
    message.error("Something went wrong. Please select a text and try again.");
    clearSelection();
  }
};

export const decodeHTML = str => {
  if (!window.$) {
    return str;
  }
  const jQuery = window.$;
  return jQuery("<div>")
    .html(str)
    .html();
};

export const rgbToHexc = orig => {
  const rgb = orig.replace(/\s/g, "").match(/^rgba?\((\d+),(\d+),(\d+)/i);
  return rgb && rgb.length === 4
    ? `#${`0${parseInt(rgb[1], 10).toString(16)}`.slice(-2)}${`0${parseInt(rgb[2], 10).toString(16)}`.slice(
        -2
      )}${`0${parseInt(rgb[3], 10).toString(16)}`.slice(-2)}`
    : orig;
};

export const hexToRGB = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);

  const g = parseInt(hex.slice(3, 5), 16);

  const b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
};

export const formatBytes = (bytes = 0, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const isMobileDevice = () => {
  const prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
  const mq = query => {
    return window.matchMedia(query).matches;
  };

  if ("ontouchstart" in window || (window.DocumentTouch && document instanceof DocumentTouch)) {
    return true;
  }

  const query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join("");
  return mq(query);
};

/**
 * this function is not considering border width
 * @param {string} text string for measuring width and height
 * @param {object} style styles for text, it can be styles of parent element or null
 * @return {object} calculated width and height of text
 */
export const measureText = (text, style = {}) => {
  const fakeEm = document.createElement("div");
  const innerEm = document.createElement("span");
  document.body.appendChild(fakeEm);
  if (style.fontSize) {
    fakeEm.style.fontSize = style.fontSize;
  }

  if (style.padding) {
    fakeEm.style.padding = style.padding;
  }

  if (style.height) {
    fakeEm.style.height = style.height;
  }

  if (style.letterSpacing) {
    fakeEm.style.letterSpacing = style.letterSpacing;
  }

  if (style.lineHeight) {
    fakeEm.style.lightingColor = style.lineHeight;
  }

  if (style.maxWidth) {
    fakeEm.style.maxWidth = `${style.maxWidth}px`;
  }

  fakeEm.style.position = "absolute";
  fakeEm.style.left = "-1000px";
  fakeEm.style.top = "-1000px";
  fakeEm.style.visibility = "hidden";

  innerEm.innerHTML = replaceLatexesWithMathHtml(text);
  fakeEm.appendChild(innerEm);

  /**
   * +10 will be ellipsis width
   */
  const result = {
    width: fakeEm.offsetWidth + 10,
    height: fakeEm.offsetHeight,
    scrollWidth: fakeEm.scrollWidth + 10,
    scrollHeight: fakeEm.scrollHeight
  };

  document.body.removeChild(fakeEm);
  return result;
};
export const getFormattedAttrId = inputString => {
  if (!inputString) return "";

  const matchBlankSpaces = /[\s]+/g;
  const matchHiphens = /[-]+/g;
  return inputString
    .replace(matchBlankSpaces, "-") // replace space+ to hyphen
    .replace(matchHiphens, "-") // replace hyphen+ single hyphen
    .toLowerCase();
};

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
  getPoints,
  getQuestionLevelScore,
  removeIndexFromTemplate,
  calculateWordsCount,
  formatBytes,
  isMobileDevice,
  measureText,
  getFormattedAttrId
};
