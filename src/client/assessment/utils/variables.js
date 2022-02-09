import {
  get,
  has,
  omitBy,
  cloneDeep,
  random,
  isEmpty,
  shuffle,
  range,
  isArray,
  keys,
  flatMapDeep,
  first,
  values,
  isUndefined,
  zipObject,
  maxBy,
  isEqual,
  round,
  intersection,
} from 'lodash'
import uuid from 'uuid'
import produce from 'immer'
import { questionType } from '@edulastic/constants'

const mathRegex = /<span class="input__math" data-latex="([^"]+)"><\/span>/g

const detectVariables = (str, isLatex = false) => {
  if (isLatex) {
    // const matches = str.match(/!([a-zA-Z])+([a-zA-Z]|[0-9])*/g);
    const matches = str.match(/@([a-zA-Z])+([a-zA-Z]|[0-9])*/g)
    // we should take a character as a dynamic variable
    return matches ? matches.map((match) => match.slice(1).substring(0, 1)) : []
  }
  // const matches = ` ${str}`.match(/([^\\]?\[)([a-zA-Z])+([a-zA-Z]|[0-9])*\]/g);
  // return matches ? matches.map(match => (match.startsWith("[") ? match.slice(1, -1) : match.slice(2, -1))) : [];
  const matches = str.match(/@([a-zA-Z])+([a-zA-Z]|[0-9])*/g)
  // we should take a character as a dynamic variable
  return matches ? matches.map((match) => match.slice(1).substring(0, 1)) : []
}

export const detectVariablesFromObj = (
  item,
  key = null,
  latexKeys = [],
  exceptions = []
) => {
  if (!item) return []
  const variables = []

  if (typeof item === 'string') {
    if (key && latexKeys.includes(key)) {
      variables.push(...detectVariables(item, true))
    } else {
      const latexes = item.match(mathRegex) || []
      latexes.forEach((latex) => {
        variables.push(...detectVariables(latex, true))
        item.replace(latex, '')
      })

      variables.push(...detectVariables(item))
    }
  } else if (Array.isArray(item)) {
    item.forEach((elem) => {
      variables.push(
        ...detectVariablesFromObj(elem, key, latexKeys, exceptions)
      )
    })
  } else if (typeof item === 'object') {
    for (const itemKey of Object.keys(item)) {
      if ([...exceptions, 'variable'].includes(itemKey)) continue
      variables.push(
        ...detectVariablesFromObj(
          item[itemKey],
          key ? `${key}.${itemKey}` : itemKey,
          latexKeys,
          exceptions
        )
      )
    }
  }
  return variables
}

export const updateVariables = (item, latexKeys = []) => {
  if (!item) return
  if (!item.variable) {
    item.variable = {
      variables: [],
    }
  }
  const { variables: itemVars = {} } = item.variable
  const newVariableNames = detectVariablesFromObj(item, null, latexKeys)
  const newVariables = {}
  let newExamples = [...(item.variable.examples || [])]
  newVariableNames.forEach((variableName) => {
    newVariables[variableName] = itemVars[variableName] || {
      id: uuid.v4(),
      name: variableName,
      type: 'NUMBER_RANGE',
      min: 0,
      max: 100,
      exampleValue: Math.round(Math.random() * 100),
    }
    newExamples = newExamples.map((example) => ({
      [variableName]: '',
      ...example,
    }))
  })

  if (!Object.keys(newVariables).length) {
    item.variable.variables = {}
    item.variable.examples = []
    item.variable.enabled = false
  } else {
    item.variable.examples = newExamples
    item.variable.variables = newVariables
  }
}

export const getMathTemplate = (exampleValue) =>
  `<span class="input__math" data-latex="${exampleValue}"></span>`

const replaceValue = (str, variables, isLatex = false, useMathTemplate) => {
  if (!variables) return str
  let result = str.replace(mathRegex, '{math-latex}')
  let mathContent = str.match(mathRegex)
  Object.keys(variables).forEach((variableName) => {
    const isLengthOne = `${variables[variableName].exampleValue}`.length == 1
    if (isLatex) {
      if (isLengthOne) {
        result = result.replace(
          new RegExp(`{@${variableName}}`, 'g'),
          useMathTemplate
            ? getMathTemplate(variables[variableName].exampleValue)
            : ` ${variables[variableName].exampleValue}`
        )
      }
      result = result.replace(
        new RegExp(`@${variableName}`, 'g'),
        useMathTemplate
          ? getMathTemplate(variables[variableName].exampleValue)
          : ` ${variables[variableName].exampleValue}`
      )
    } else {
      if (isLengthOne) {
        result = result.replace(
          new RegExp(`{@${variableName}}`, 'g'),
          useMathTemplate
            ? getMathTemplate(variables[variableName].exampleValue)
            : variables[variableName].exampleValue
        )
      }
      result = result.replace(
        new RegExp(`@${variableName}`, 'g'),
        useMathTemplate
          ? getMathTemplate(variables[variableName].exampleValue)
          : variables[variableName].exampleValue
      )
    }
    if (mathContent) {
      mathContent = mathContent.map((content) => {
        if (isLengthOne) {
          content = content.replace(
            new RegExp(`{@${variableName}}`, 'g'),
            ` ${variables[variableName].exampleValue}`
          )
        }
        return content.replace(
          new RegExp(`@${variableName}`, 'g'),
          ` ${variables[variableName].exampleValue}`
        )
      })
    }
  })
  if (mathContent) {
    result = result
      .split('{math-latex}')
      .map((content, index) => `${content}${mathContent[index] || ''}`)
      .join('')
  }
  return result
}

export const replaceValues = (
  item,
  variableConfig,
  key = null,
  latexKeys = [],
  useMathTemplate
) => {
  if (!item || !variableConfig || !variableConfig.enabled) return item
  const { variables } = variableConfig
  if (!variables) return item
  if (typeof item === 'string') {
    if (key && latexKeys.includes(key)) {
      item = replaceValue(item, variables, true, useMathTemplate)
    } else {
      item = replaceValue(item, variables, false, useMathTemplate)
      const latexes = item.match(mathRegex) || []
      for (let i = 0; i < latexes.length; i++) {
        item = item.replace(
          latexes[i],
          replaceValue(latexes[i], variables, true, useMathTemplate)
        )
      }
    }
  } else if (Array.isArray(item)) {
    for (let i = 0; i < item.length; i++) {
      item[i] = replaceValues(
        item[i],
        variableConfig,
        key,
        latexKeys,
        useMathTemplate
      )
    }
  } else if (typeof item === 'object') {
    for (const itemKey of Object.keys(item)) {
      item[itemKey] = replaceValues(
        item[itemKey],
        variableConfig,
        key ? `${key}.${itemKey}` : itemKey,
        latexKeys,
        useMathTemplate
      )
    }
  }
  return item
}

export const replaceVariables = (
  item,
  latexKeys = [],
  useMathTemplate = true
) => {
  if (
    !has(item, 'variable.variables') ||
    !has(item, 'variable.enabled') ||
    !item.variable.enabled
  )
    return item
  const keysToIgnore = ['id', 'validation', 'variable', 'template']
  return produce(item, (draft) => {
    Object.keys(item).forEach((key) => {
      if (key === 'id' || key === 'variable') return
      if (
        [
          questionType.CLOZE_DROP_DOWN,
          questionType.CLOZE_IMAGE_DROP_DOWN,
          questionType.EXPRESSION_MULTIPART,
        ].includes(item.type)
      ) {
        keysToIgnore.push('options')
      }
      useMathTemplate = !keysToIgnore.includes(key)
      draft[key] = replaceValues(
        draft[key],
        item.variable,
        key,
        latexKeys,
        useMathTemplate
      )
    })
  })
}

const transformOpts = (options) => {
  const transformedOptions = {}
  const optionKeys = Object.keys(options)
  optionKeys.forEach((key) => {
    const optionVal = options[key]

    if (key === 'setThousandsSeparator') {
      if (optionVal.length) {
        const stringArr = `[${optionVal.map((f) => `'${f}'`)}]`
        if (optionVal.includes('.') && !options.setDecimalSeparator) {
          transformedOptions.setDecimalSeparator = ','
        }
        transformedOptions[key] = stringArr
      }
    } else if (key === 'setDecimalSeparator') {
      if (optionVal === ',' && !options.setThousandsSeparator) {
        transformedOptions.setThousandsSeparator = '.'
      }
      transformedOptions[key] = optionVal
    } else if (key === 'allowedUnits') {
      transformedOptions[key] = `[${optionVal}]`
    } else if (key === 'syntax') {
      if (options.argument === undefined) {
        transformedOptions[key] = optionVal
      } else {
        transformedOptions[optionVal] = options.argument
      }
    } else if (key === 'significantDecimalPlaces') {
      transformedOptions.isDecimal = optionVal
    } else {
      transformedOptions[key] = optionVal
    }
  })
  return transformedOptions
}
export const getOptionsForMath = (validations) => {
  let transformedOptions = {}
  validations.forEach((val) => {
    const options = omitBy(val.options || {}, (f) => f === false)
    transformedOptions = transformOpts(options)
  })

  return transformedOptions
}

export const getOptionsForClozeMath = (variables, validations) => {
  const transformedOptions = {}
  const formularKeys = Object.keys(variables).filter((key) => {
    const { type } = variables[key] || {}
    return type === 'FORMULA'
  })
  if (isEmpty(formularKeys)) {
    return {}
  }

  const mathInputs = validations.validResponse.value || []
  const mathUnits = validations.validResponse?.mathUnits?.value
  const maths = isArray(mathUnits)
    ? mathInputs.concat(mathUnits.map((m) => [m]))
    : mathInputs

  formularKeys.forEach((key) => {
    const mathFields = maths.filter((m) => m[0].value.includes(`@${key}`))
    if (mathFields.length > 1) {
      // TODO: show a popup here
    } else if (mathFields.length === 1) {
      const opts = transformOpts(get(mathFields, '[0][0].options', {}))
      if (!isEmpty(opts)) {
        transformedOptions[key] = opts
      }
    }
  })
  return transformedOptions
}

/** used the below methods to generate variables */
export const SEQUENCE_TYPES = ['NUMBER_SEQUENCE', 'TEXT_SEQUENCE']
export const SET_TYPES = ['NUMBER_SET', 'TEXT_SET']
export const TEXT_TYPES = ['TEXT_SEQUENCE', 'TEXT_SET']

export const cartesian = (args, combinationsCount) => {
  const r = []
  const available = args.reduce((acc, curr) => acc * curr.length, 1)

  const helper = () => {
    const c = []
    for (let j = 0; j < args.length; j++) {
      const randomIndex = random(0, args[j].length - 1)
      c.push(args[j][randomIndex])
    }
    return c
  }

  let n = 0
  while (n < combinationsCount && n < available) {
    const combination = helper()
    if (!r.some((a) => isEqual(a, combination))) {
      n++
      r.push(combination)
    }
  }
  return r
}

export const generateExample = (variable) => {
  const { type, set = '', sequence = '', decimal } = variable
  let { min, max, step } = variable
  if (!step) {
    step = 1
  }

  if (type === 'NUMBER_RANGE') {
    if (Number.isInteger(parseFloat(step))) {
      min = parseInt(min, 10)
      // need to include endpoint
      max = parseInt(max, 10) + 1
      step = parseInt(step, 10)
    } else {
      min = parseFloat(min)
      max = parseFloat(max)
      step = parseFloat(step)
      //  need to include endpoint
      max = parseFloat(max) + step
    }

    const decimalPart = step.toString().split('.')[1]?.length || 1
    const arr = range(min, max, step)
      .map((x) => round(x, decimalPart))
      .filter((x) => x >= variable.min && x <= variable.max)
    if (isUndefined(decimal)) {
      return arr
    }

    return arr.map((x) => x.toFixed(decimal))
  }
  if (SEQUENCE_TYPES.includes(type)) {
    if (isArray(sequence)) {
      return sequence
    }
    return sequence
      .split(',')
      .filter((x) => x.trim())
      .filter((x) => x)
  }
  if (SET_TYPES.includes(type)) {
    if (isArray(set)) {
      return set
    }
    return set
      .split(',')
      .filter((x) => x.trim())
      .filter((x) => x)
  }
  console.log('ERROR, unknown type:', type)
}

export const processNonSequence = (nonSsequences, combinationsCount) => {
  const results = {}
  const input_list = []
  const variableNames = keys(nonSsequences)

  variableNames.forEach((variableName) => {
    input_list.push(generateExample(nonSsequences[variableName]))
  })

  const allCombinations = cartesian(input_list, combinationsCount)
  variableNames.forEach((variableName, index) => {
    results[variableName] = flatMapDeep(allCombinations, (c) => c[index])
  })
  return results
}

export const processSequence = (sequences) => {
  const results = {}
  keys(sequences).forEach((variableName) => {
    results[variableName] = generateExample(sequences[variableName])
  })
  return results
}

export const mergeResults = (sequences, nonSequences, combinationsCount) => {
  const results = {}
  const nonSequenceResults = processNonSequence(nonSequences, combinationsCount)
  const sequenceResults = processSequence(sequences)

  const nonSequenceLength = first(values(nonSequenceResults)).length

  first(values(sequenceResults)).forEach((a, replicationNumber) => {
    const replication = cloneDeep(nonSequenceResults)

    keys(sequenceResults).forEach((variableName) => {
      replication[variableName] = new Array(nonSequenceLength).fill(
        sequenceResults[variableName][replicationNumber]
      )
    })
    keys(replication).forEach((variableName) => {
      results[variableName] = [
        ...(results[variableName] || []),
        ...replication[variableName],
      ]
    })
  })
  return results
}

export const shuffleCombinations = (combinations, combinationsCount) => {
  let results = []
  if (isEmpty(combinations)) {
    return results
  }
  const variableNames = keys(combinations)
  const combinationLength = maxBy(values(combinations), (c) => c.length).length
  for (let i = 0; i < combinationLength + 1; i++) {
    const combination = values(combinations)
      .map((value) => value[i])
      .filter((x) => !isUndefined(x))

    if (!isEmpty(combination)) {
      results.push(zipObject(variableNames, combination))
    }
  }
  results = shuffle(results)
  results = results
    .map((comb, index) => ({
      key: index,
      ...comb,
    }))
    .slice(0, combinationsCount)

  return results
}

export const generateExamples = (variables, combinationsCount) => {
  const nonSequences = {}
  const sequences = {}
  let results = {}

  keys(variables).forEach((variableName) => {
    const variable = variables[variableName]
    if (SEQUENCE_TYPES.includes(variable.type)) {
      sequences[variableName] = variable
    } else if (variable.type !== 'FORMULA') {
      nonSequences[variableName] = variable
    }
  })

  if (!isEmpty(sequences) && !isEmpty(nonSequences)) {
    results = mergeResults(sequences, nonSequences, combinationsCount)
  } else if (!isEmpty(sequences)) {
    results = processSequence(sequences)
  } else if (!isEmpty(nonSequences)) {
    results = processNonSequence(nonSequences, combinationsCount)
  }

  const examplesValues = shuffleCombinations(results, combinationsCount)

  // remove combinations that has undefined
  const filtered = examplesValues.filter(
    (examples) => !values(examples).includes(undefined)
  )
  return filtered
}

export const createVariable = (type) => {
  let newVariable = {
    type,
    exampleValue: '',
  }
  switch (newVariable.type) {
    case 'NUMBER_RANGE':
      newVariable = {
        ...newVariable,
        min: 0,
        max: 10,
        step: 1,
      }
      break
    case 'TEXT_SET':
    case 'NUMBER_SET':
      newVariable = {
        ...newVariable,
        set: '',
      }
      break
    case 'NUMBER_SEQUENCE':
    case 'TEXT_SEQUENCE':
      newVariable = {
        ...newVariable,
        sequence: '',
      }
      break
    case 'FORMULA':
      newVariable = {
        ...newVariable,
        formula: '',
      }
      break
    default:
      break
  }
  return newVariable
}

export const hasDuplicatedParams = (variables, validation) => {
  const mathInputs = flatMapDeep(
    validation?.validResponse?.value || [],
    (c) => c
  )
  const mathUnits = validation?.validResponse?.mathUnits?.value
  const maths = mathUnits ? mathInputs.concat(mathUnits) : mathInputs

  return keys(variables).some(
    (variable) =>
      maths.filter((x) => x.value.includes(`@${variable}`)).length > 1
  )
}

/**
 * @param {Object} variables
 */
export const validSequence = (variables) => {
  const sequences = {}

  keys(variables).forEach((variableName) => {
    const variable = variables[variableName]
    if (SEQUENCE_TYPES.includes(variable.type)) {
      sequences[variableName] = variable
    }
  })
  const seqArrays = values(processSequence(sequences))
  return seqArrays?.every((seq) => seq.length === seqArrays[0]?.length)
}

/**
 * @param {Object} variables
 */
export const checkDynamicParameters = (variables, validation, qType) => {
  const _keys = Object.keys(variables)
  for (const key of _keys) {
    const {
      type = '',
      exampleValue = '',
      formula = '',
      set: _set = '',
      sequence = '',
      name,
    } = variables[key]
    switch (true) {
      // variables must be set
      case type !== 'FORMULA' && !exampleValue && exampleValue !== 0:
        return {
          invalid: true,
          errMessage: 'Some or more variables have empty or no values defined',
        }
      // formula must be set
      case type === 'FORMULA' && !formula:
        return { invalid: true, errMessage: 'Formula is required' }
      // avoids recursion
      case !!intersection(_keys, _set.split(',')).length:
        return {
          invalid: true,
          errMessage: `Your dynamic parameter "${name}" contains a text entry that is also a parameter name. This is not supported right now. Please rename the impacted parameters or entries so that there is no naming overlap.`,
        }
      case !!intersection(_keys, sequence.split(',')).length:
        return {
          invalid: true,
          errMessage: `Your dynamic parameter "${name}" contains a text entry that is also a parameter name. This is not supported right now. Please rename the impacted parameters or entries so that there is no naming overlap.`,
        }
      default:
        break
    }
  }

  if (
    qType === 'expressionMultipart' &&
    hasDuplicatedParams(variables, validation)
  ) {
    // @see https://snapwiz.atlassian.net/browse/EV-29283
    return {
      invalid: true,
      errMessage: `Same dynamic variable can not be used in two or more input boxes.`,
    }
  }

  if (!validSequence(variables)) {
    return {
      invalid: true,
      errMessage: `All dynamic parameters of sequence type need to have the same number of items`,
    }
  }

  return { invalid: false, errMessage: '' }
}

export const hasMathFormula = (variables) =>
  Object.keys(variables).some((key) => {
    const { type } = variables[key] || {}
    return type === 'FORMULA'
  })

const getVariableValue = (variables, variableName, example) => {
  if (variables[variableName].type === 'FORMULA') {
    return variables[variableName].formula
  }
  const value = example
    ? example[variableName]
    : variables[variableName].exampleValue
  if (TEXT_TYPES.includes(variables[variableName].type)) {
    return `"${value}"`
  }
  return value
}

export const getLatexValuePairs = ({
  id,
  variables,
  example,
  options,
  isClozeMath,
}) => ({
  id,
  latexes: Object.keys(variables)
    .map((variableName) => variables[variableName])
    .filter((variable) => variable.type === 'FORMULA')
    .reduce(
      (lx, variable) => [
        ...lx,
        {
          id: variable.name,
          formula: variable.formula,
          options: isClozeMath ? options[variable.name] || {} : options,
        },
      ],
      []
    ),
  variables: Object.keys(variables).map((variableName) => ({
    id: variableName,
    value: getVariableValue(variables, variableName, example),
  })),
})
