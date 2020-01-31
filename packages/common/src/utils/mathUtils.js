/* global $ */
import Helpers from "../helpers";

const addCustomClassToMath = mathHtml => {
  if (!window.$) return mathHtml;
  const jqueryEl = $(mathHtml);
  jqueryEl.addClass("edu");
  // eslint-disable-next-line func-names
  jqueryEl.find("*").each(function() {
    $(this).addClass("edu");
  });
  const node = jqueryEl[0]; // returns the main parent node
  return node.outerHTML; // get the complete HTML content
};

export const getMathHtml = latex => {
  if (!window.katex) return latex;

  /**
   * if the latex has dynamic parameters such as "2a\times3y", the katex produces an error.
   * that error occurred when there are some operators
   * so we need to insert spaces between operators and variables.
   */
  const _latex = latex.replace(new RegExp("(@.)", "g"), " $1").replace(new RegExp("#", "g"), " \\#");

  let katexString = window.katex.renderToString(_latex, {
    throwOnError: false,
    displayMode: true
  });
  // styles are applied to stimulus in itemBank/testReview(collapsed view)
  // it was affecting math content as well and EV-10152 was caused
  // we can use this class to omit styles from being applied to math in itemBank/testReview(collapsed view)
  katexString = addCustomClassToMath(katexString);
  return katexString;
};

export const replaceLatexesWithMathHtml = val => {
  if (!window.$) {
    return val;
  }
  // Detecting latexes
  const jqueryEl = $(`<p/>`).append(val);
  const latexHtmls = jqueryEl.find("span.input__math");
  if (!latexHtmls.length) return Helpers.sanitizeSelfClosingTags(val);

  // eslint-disable-next-line func-names
  jqueryEl.find("span.input__math").each(function() {
    const katexHtml = getMathHtml($(this).attr("data-latex"));
    $(this)
      .attr("contenteditable", "false")
      .html(katexHtml);
  });

  return Helpers.sanitizeSelfClosingTags(jqueryEl.html());
};

export const replaceMathHtmlWithLatexes = val => {
  const jqueryEl = $(`<p/>`).append(val);
  const mathHtmls = jqueryEl.find("span.input__math");
  if (!mathHtmls.length) return Helpers.sanitizeSelfClosingTags(val);

  // eslint-disable-next-line func-names
  jqueryEl.find("span.input__math").each(function() {
    $(this)
      .removeAttr("contenteditable")
      .html("");
  });
  return Helpers.sanitizeSelfClosingTags(jqueryEl.html());
};

export const getInnerValuesForStatic = (studentTemplate, userAnswer) => {
  const escapeRegExp = string => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/&amp;/g, "&");
  const regexTemplate = new RegExp(
    escapeRegExp(studentTemplate || "").replace(/\\\\MathQuillMathField\\\{\\\}/g, "(.*)"),
    "g"
  );

  if (userAnswer && userAnswer.length > 0) {
    const userInnerValues = regexTemplate.exec(userAnswer);
    if (userInnerValues && userInnerValues.length > 0) {
      return userInnerValues.slice(1);
    }
  }
  return [];
};
