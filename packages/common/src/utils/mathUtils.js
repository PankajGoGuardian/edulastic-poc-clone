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

const addSpaceDynamicParameters = (latex = "") =>
  latex.replace(new RegExp("(@.*?)", "g"), "\\text{$1}").replace(new RegExp("#", "g"), " \\#");

const addSpaceMatrixFraction = (latex = "") => {
  let updated = latex;
  const matrixRegex = /\\begin{[a-z]matrix}(.*?)\\end{[a-z]matrix}/g;
  const fractionRegex = /(\\frac(.*?)\\\\)/g;

  const addSpace = (str = "") => str.replace(fractionRegex, "$1[0.2em]");

  let match = matrixRegex.exec(updated);
  while (match != null) {
    const [, matrixContent] = match;
    updated = updated.replace(matrixContent, addSpace(matrixContent));
    match = matrixRegex.exec(updated);
  }

  return updated;
};

export const getMathHtml = latex => {
  if (!window.katex) return latex;

  /**
   * if the latex has dynamic parameters such as "2a\times3y", the katex produces an error.
   * that error occurred when there are some operators
   * so we need to insert spaces between operators and variables.
   */
  let _latex = addSpaceDynamicParameters(latex);

  /**
   * Vertical spacing between fractions in {matrix} is too tight.
   * this issue is in the Katex library, the solution is to add \\[0.2em].
   * this solution doesn't work in mathQuill, so we should add \\[0.2em] in here.
   * @see https://github.com/KaTeX/KaTeX/issues/312#issuecomment-307592919
   */
  _latex = addSpaceMatrixFraction(_latex);
  /**
   * Katex doesn't support the below commands
   * |--- mathQuill --|---- Katex -----|
   * |    overarc     |   overgroup    |
   * |  parallelogram |     text{▱}    |
   * |    undersim    | underset{\\sim}|
   * |---------------------------------|
   */
  _latex = _latex
    .replace(/overarc/g, "overgroup")
    .replace(/\\parallelogram/g, "\\text{▱}")
    .replace(/\\undersim/g, "\\underset{\\sim}");

  let katexString = window.katex.renderToString(_latex, {
    throwOnError: false,
    displayMode: true
  });
  // styles are applied to stimulus in itemBank/testReview(collapsed view)
  // it was affecting math content as well and EV-10152 was caused
  // we can use this class to omit styles from being applied to math
  // in itemBank/testReview(collapsed view)
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

// Adding any character after '/square' box
// mathQuill does't added extra space after '/square' key, which is needed to inerpret as square box
// it might be a bug for MathQuill lib
export const reformatMathInputLatex = latex => latex.replace(/\\square/g, "\\square ");
