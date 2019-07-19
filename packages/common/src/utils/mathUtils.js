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
