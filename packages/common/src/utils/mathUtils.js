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

const sanitizeLatex = latex => {
  let _latex = latex
    .replace(/\\\\\$/g, "\\$")
    .replace(/\\\\text/g, "\\text")
    .replace(/\\\\pi/g, "\\pi")
    .replace(/\\\\Box/g, "\\Box")
    .replace(/\\\\times/g, "\\times")
    .replace(/\\\\&=/g, "=")
    .replace(/&=/g, "=")
    .replace(/\\"/g, "")
    .replace(/">/g, "")
    .replace(new RegExp("(@.*?)", "g"), "\\text{$1}")
    .replace(new RegExp("#", "g"), " \\#")
    .replace(/overarc/g, "overgroup")
    .replace(/\\parallelogram/g, "\\text{▱}")
    .replace(/\\undersim/g, "\\underset{\\sim}");

  if (_latex.substr(-1) === "\\") {
    _latex = _latex.slice(0, -1);
  }
  return _latex;
};

export const getMathHtml = latex => {
  if (!window.katex) return latex;

  /**
   * if the latex has dynamic parameters such as "@a\times@b",
   * the katex produces an error.
   * that error occurred when there are some operators
   * so we need to insert spaces between operators and variables.
   * @see https://snapwiz.atlassian.net/browse/EV-11172
   * Katex doesn't support the below commands
   * @see https://snapwiz.atlassian.net/browse/EV-12829
   * |--- mathQuill --|---- Katex -----|
   * |    overarc     |   overgroup    |
   * |  parallelogram |     text{▱}    |
   * |    undersim    | underset{\\sim}|
   * |---------------------------------|
   * Also, some of the migrated/authored questions have wrong latex.
   * @see https://snapwiz.atlassian.net/browse/EV-11865
   * |--- incorrect --|--- correct ----|
   * |       //$      |      /$        |
   * |       //$      |      /$        |
   * |     //text     |     /text      |
   * |      //pi      |      /pi       |
   * |     //Box      |     /Box       |
   * |      //&=      |       =        |
   * |        &=      |       =        |
   * |        \"      |                |
   * |        ">      |                |
   * |---------------------------------|
   * Another issue is the latex has a backslash at last of
   * We should remove it.
   */
  let _latex = sanitizeLatex(latex);

  /**
   * Vertical spacing between fractions in {matrix} is too tight.
   * this issue is in the Katex library, the solution is to add \\[0.2em].
   * this solution doesn't work in mathQuill, so we should add \\[0.2em] in here.
   * @see https://github.com/KaTeX/KaTeX/issues/312#issuecomment-307592919
   */
  _latex = addSpaceMatrixFraction(_latex);

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
    const latex = $(this).attr("data-latex");
    /**
     * parse math content only if there is latex attribute present
     * @see https://snapwiz.atlassian.net/browse/EV-13580
     */
    if (latex) {
      const katexHtml = getMathHtml(latex);
      $(this)
        .attr("contenteditable", "false")
        .html(katexHtml);
    }
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

/**
 *
 * @param {string} template
 *
 * as latex does not consider white spaces for space, we should remove it
 * However, latex uses \ \ to render space, so those spaces should be preserved
 * the function removes all the spaces which are preceded/followed by alphanumric character
 * eg, \frac{7  }{  8} gets converted to \frac{7}{8}
 */
const removeWhiteSpacesInLatex = (template = "") => {
  if (typeof template !== "string") {
    return template;
  }
  return template.replace(/(?<=\w)\s+|\s+(?=\w)/g, "");
};

/**
 *
 * @param {string} template
 * function creates a escaped regex template by appending \ for all the escape characters
 */
const createEscapedRegExp = latexTemplate => {
  const escapedTemplate = latexTemplate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/&amp;/g, "&");
  return removeWhiteSpacesInLatex(escapedTemplate);
};

export const getInnerValuesForStatic = (studentTemplate, userAnswer) => {
  const regexTemplate = new RegExp(
    createEscapedRegExp(studentTemplate || "").replace(/\\\\MathQuillMathField\\\{\\\}/g, "(.*)"),
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
