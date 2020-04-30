import { has } from "lodash";
import uuid from "uuid";
import produce from "immer";

const mathRegex = /<span class="input__math" data-latex="([^"]+)"><\/span>/g;

const detectVariables = (str, isLatex = false) => {
  if (isLatex) {
    // const matches = str.match(/!([a-zA-Z])+([a-zA-Z]|[0-9])*/g);
    const matches = str.match(/@([a-zA-Z])+([a-zA-Z]|[0-9])*/g);
    // we should take a character as a dynamic variable
    return matches ? matches.map(match => match.slice(1).substring(0, 1)) : [];
  }
  // const matches = ` ${str}`.match(/([^\\]?\[)([a-zA-Z])+([a-zA-Z]|[0-9])*\]/g);
  // return matches ? matches.map(match => (match.startsWith("[") ? match.slice(1, -1) : match.slice(2, -1))) : [];
  const matches = str.match(/@([a-zA-Z])+([a-zA-Z]|[0-9])*/g);
  // we should take a character as a dynamic variable
  return matches ? matches.map(match => match.slice(1).substring(0, 1)) : [];
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

export const getMathTemplate = latex =>
  latex !== "Recursion_Error" ? `<span class="input__math" data-latex="${latex}"></span>` : latex;

const replaceValue = (str, variables) => {
  if (!variables) return str;
  let result = str.replace(mathRegex, "{math-latex}");
  let mathContent = str.match(mathRegex);
  Object.keys(variables).forEach(variableName => {
    // replace dynamic variables here.
    result = result.replace(new RegExp(`@${variableName}`, "g"), variables[variableName].exampleValue);
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

export const replaceValues = (item, variableConfig, key = null, latexKeys = []) => {
  if (!item || !variableConfig || !variableConfig.enabled) return item;
  const { variables } = variableConfig;
  if (!variables) return item;
  if (typeof item === "string") {
    if (key && latexKeys.includes(key)) {
      item = replaceValue(item, variables);
    } else {
      item = replaceValue(item, variables);
      const latexes = item.match(mathRegex) || [];
      for (let i = 0; i < latexes.length; i++) {
        item = item.replace(latexes[i], replaceValue(latexes[i], variables));
      }
    }
  } else if (Array.isArray(item)) {
    for (let i = 0; i < item.length; i++) {
      item[i] = replaceValues(item[i], variableConfig, key, latexKeys);
    }
  } else if (typeof item === "object") {
    for (const itemKey of Object.keys(item)) {
      item[itemKey] = replaceValues(item[itemKey], variableConfig, key ? `${key}.${itemKey}` : itemKey, latexKeys);
    }
  }
  return item;
};

export const replaceVariables = (item, latexKeys = []) => {
  if (!has(item, "variable.variables") || !has(item, "variable.enabled") || !item.variable.enabled) return item;
  return produce(item, draft => {
    Object.keys(item).forEach(key => {
      if (key === "id" || key === "variable") return;
      draft[key] = replaceValues(draft[key], item.variable, key, latexKeys);
    });
  });
};
