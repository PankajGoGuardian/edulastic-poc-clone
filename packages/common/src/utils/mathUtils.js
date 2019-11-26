/* global $ */
/* global katex */
import Helpers from "../helpers";

export const getMathHtml = latex => {
  if (!katex) return latex;
  return katex.renderToString(latex, {
    throwOnError: false
  });
};

export const replaceLatexesWithMathHtml = val => {
  // Detecting latexes
  const jqueryEl = $(`<p/>`).append(val);
  const latexHtmls = jqueryEl.find("span.input__math");
  if (!latexHtmls.length) return Helpers.sanitizeSelfClosingTags(val);

  // eslint-disable-next-line func-names
  jqueryEl.find("span.input__math").each(function () {
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
  jqueryEl.find("span.input__math").each(function () {
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
