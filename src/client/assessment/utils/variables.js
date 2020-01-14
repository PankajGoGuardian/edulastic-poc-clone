import { has } from "lodash";
import uuid from "uuid";
import produce from "immer";

const mathRegex = /<span class="input__math" data-latex="([^"]+)"><\/span>/g;

const detectVariables = (str, isLatex = false) => {
  if (isLatex) {
    // const matches = str.match(/!([a-zA-Z])+([a-zA-Z]|[0-9])*/g);
    const matches = str.match(/@([a-zA-Z])+([a-zA-Z]|[0-9])*/g);
    return matches ? matches.map(match => match.slice(1)) : [];
  }
  // const matches = ` ${str}`.match(/([^\\]?\[)([a-zA-Z])+([a-zA-Z]|[0-9])*\]/g);
  // return matches ? matches.map(match => (match.startsWith("[") ? match.slice(1, -1) : match.slice(2, -1))) : [];
  const matches = str.match(/@([a-zA-Z])+([a-zA-Z]|[0-9])*/g);
  return matches ? matches.map(match => match.slice(1)) : [];
};

export const detectVariablesFromObj = (item, key = null, latexKeys = [], exceptions = []) => {
  if (!item) return [];
  const variables = [];

  if (typeof item === "string") {
    if (key && latexKeys.includes(key)) {
      variables.push(...detectVariables(item, true));
    } else {
      const latexes = item.match(mathRegex) || [];
      latexes.forEach(latex => {
        variables.push(...detectVariables(latex, true));
        item.replace(latex, "");
      });

      variables.push(...detectVariables(item));
    }
  } else if (Array.isArray(item)) {
    item.forEach(elem => {
      variables.push(...detectVariablesFromObj(elem, key, latexKeys, exceptions));
    });
  } else if (typeof item === "object") {
    for (const itemKey of Object.keys(item)) {
      if ([...exceptions, "variable"].includes(itemKey)) continue;
      variables.push(
        ...detectVariablesFromObj(item[itemKey], key ? `${key}.${itemKey}` : itemKey, latexKeys, exceptions)
      );
    }
  }
  return variables;
};

export const updateVariables = (item, latexKeys = []) => {
  if (!item) return;
  if (!item.variable) {
    item.variable = {
      variables: []
    };
  }
  const { variables: itemVars } = item.variable;
  const newVariableNames = detectVariablesFromObj(item, null, latexKeys);
  const newVariables = {};
  let newExamples = [...(item.variable.examples || [])];
  newVariableNames.forEach(variableName => {
    newVariables[variableName] = itemVars[variableName] || {
      id: uuid.v4(),
      name: variableName,
      type: "NUMBER_RANGE",
      min: 0,
      max: 100,
      decimal: 0,
      exampleValue: Math.round(Math.random() * 100)
    };
    newExamples = newExamples.map(example => ({ [variableName]: "", ...example }));
  });
  item.variable.examples = newExamples;
  item.variable.variables = newVariables;
};

const getMathTemplate = exampleValue => `<span class="input__math" data-latex="${exampleValue}"></span>`;

const replaceValue = (str, variables, isLatex = false, useMathTemplate) => {
  if (!variables) return str;
  let result = str.replace(mathRegex, "{math-latex}");
  let mathContent = str.match(mathRegex);
  Object.keys(variables).forEach(variableName => {
    if (isLatex) {
      result = result.replace(
        new RegExp(`@${variableName}`, "g"),
        useMathTemplate ? getMathTemplate(variables[variableName].exampleValue) : variables[variableName].exampleValue
      );
    } else {
      result = result.replace(
        new RegExp(`@${variableName}`, "g"),
        useMathTemplate ? getMathTemplate(variables[variableName].exampleValue) : variables[variableName].exampleValue
      );
    }
    if (mathContent) {
      mathContent = mathContent.map(content =>
        content.replace(new RegExp(`@${variableName}`, "g"), variables[variableName].exampleValue)
      );
    }
  });
  if (mathContent) {
    result = result
      .split("{math-latex}")
      .map((content, index) => `${content}${mathContent[index] || ""}`)
      .join("");
  }
  return result;
};

export const replaceValues = (item, variableConfig, key = null, latexKeys = [], useMathTemplate) => {
  if (!item || !variableConfig || !variableConfig.enabled) return item;
  const { variables } = variableConfig;
  if (!variables) return item;
  if (typeof item === "string") {
    if (key && latexKeys.includes(key)) {
      item = replaceValue(item, variables, true, useMathTemplate);
    } else {
      item = replaceValue(item, variables, false, useMathTemplate);
      const latexes = item.match(mathRegex) || [];
      for (let i = 0; i < latexes.length; i++) {
        item = item.replace(latexes[i], replaceValue(latexes[i], variables, true, useMathTemplate));
      }
    }
  } else if (Array.isArray(item)) {
    for (let i = 0; i < item.length; i++) {
      item[i] = replaceValues(item[i], variableConfig, key, latexKeys, useMathTemplate);
    }
  } else if (typeof item === "object") {
    for (const itemKey of Object.keys(item)) {
      item[itemKey] = replaceValues(
        item[itemKey],
        variableConfig,
        key ? `${key}.${itemKey}` : itemKey,
        latexKeys,
        useMathTemplate
      );
    }
  }
  return item;
};

export const replaceVariables = (item, latexKeys = [], useMathTemplate = true) => {
  if (!has(item, "variable.variables") || !has(item, "variable.enabled") || !item.variable.enabled) return item;
  return produce(item, draft => {
    Object.keys(item).forEach(key => {
      if (key === "id" || key === "variable") return;
      if (key === "validation") {
        useMathTemplate = false;
      }
      draft[key] = replaceValues(draft[key], item.variable, key, latexKeys, useMathTemplate);
    });
  });
};
