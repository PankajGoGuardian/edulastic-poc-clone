/* global $ */
export const getMathHtml = latex => {
  if (!katex) return latex;
  return katex.renderToString(latex, {
    throwOnError: false
  });
};

export const replaceLatexesWithMathHtml = val => {
  // Detecting latexes
  let jqueryEl = null;
  jqueryEl = $(`<p>${val}</p>`);
  if (!jqueryEl) return val;

  let newVal = ` ${val}`.slice(1);
  const latexHtmls = jqueryEl.find("span.input__math");
  if (!latexHtmls.length) return val;

  for (let i = 0; i < latexHtmls.length; i++) {
    const latexHtml = latexHtmls[i];
    const latex = latexHtml.getAttribute("data-latex");
    newVal = newVal.replace(
      latexHtml.outerHTML,
      `<span class="input__math" contenteditable="false" data-latex="${latex}">${getMathHtml(latex)}</span> `
    );
  }

  return newVal;
};

export const replaceMathHtmlWithLatexes = val => {
  let workstr = ` ${val}`.slice(1);
  const mathHtmls = $(val).find("span.input__math");
  if (!mathHtmls.length) return val;

  for (let i = 0; i < mathHtmls.length; i++) {
    const mathHtml = mathHtmls[i];
    const latex = mathHtml.getAttribute("data-latex");
    workstr = workstr.replace(mathHtml.outerHTML, `<span class="input__math" data-latex="${latex}"></span>`);
  }
  return workstr;
};
