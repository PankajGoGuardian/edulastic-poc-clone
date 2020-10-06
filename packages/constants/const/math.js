const methods = {
  EQUIV_SYMBOLIC: 'equivSymbolic',
  EQUIV_LITERAL: 'equivLiteral',
  EQUIV_SYNTAX: 'equivSyntax',
  // EQUIV_VALUE: "equivValue",
  // IS_SIMPLIFIED: "isSimplified",
  // IS_FACTORISED: "isFactorised",
  // IS_EXPANDED: "isExpanded",
  // IS_RATIONALIZED: "isRationalized",
  // STRING_MATCH: "stringMatch",
  // SET_EVALUATION: "setEvaluation",
  // CHECK_IF_TRUE: "isTrue"
}

const fields = {
  INTEGER: 'integerType',
  REAL: 'realType',
  COMPLEX: 'complexType',
}

const decimalSeparators = {
  DOT: '.',
  COMMA: ',',
}

const syntaxes = {
  DECIMAL: 'isDecimal',
  SIMPLE_FRACTION: 'isSimpleFraction',
  MIXED_FRACTION: 'isMixedFraction',
  IMPROPER_FRACTION: 'isImproperFraction',
  EXPONENT: 'isExponent',
  STANDARD_FORM: 'isStandardForm',
  SLOPE_INTERCEPT_FORM: 'isSlopeInterceptForm',
  POINT_SLOPE_FORM: 'isPointSlopeForm',
  NUMBER: 'numberType',
  INTEGER: 'integerType',
  SCIENTIFIC: 'scientificType',
  VARIABLE: 'variableType',
}

const mathInputTypes = {
  CLEAR: 'clear',
  WRONG: 'wrong',
  SUCCESS: 'success',
}

const units = [
  { value: 'units_us', label: 'Units (US)' },
  { value: 'units_si', label: 'Units (SI)' },
]

const symbols = [
  { value: 'basic', label: 'Basic', width: 400, height: 320 },
  {
    value: 'basic_wo_number',
    label: 'Basic w/o Numbers',
    width: 280,
    height: 250,
  },
  { value: 'intermediate', label: 'Intermediate', width: 520, height: 270 },
  {
    value: 'intermediate_wo_number',
    label: 'Intermediate w/o Numbers',
    width: 400,
    height: 250,
  },
  { value: 'advanced_matrices', label: 'Matrices', width: 300, height: 190 },
  {
    value: 'advanced_trignometry',
    label: 'Trignometry',
    width: 400,
    height: 250,
  },
  { value: 'geometry', label: 'Geometry', width: 400, height: 250 },
  { value: 'units_si', label: 'Units (SI)', width: 400, height: 250 },
  { value: 'units_us', label: 'Units (US)', width: 400, height: 250 },
  { value: 'all', label: 'Full', width: 520, height: 190 },
]

const symbolsAll = [
  { value: 'all', label: 'Full' },
  { value: 'qwerty', label: 'Keyboard' },
  { value: 'basic', label: 'Basic' },
  { value: 'basic_junior', label: 'Basic Junior' },
  { value: 'algebra', label: 'Algebra' },
  { value: 'comparison', label: 'Comparison' },
  { value: 'geometry', label: 'Geometry' },
  { value: 'matrices', label: 'Matrices' },
  { value: 'trigonometry', label: 'Trigonometry' },
  { value: 'sets', label: 'Sets' },
  { value: 'units_si', label: 'Units (SI)' },
  { value: 'units_us', label: 'Units (US Customary)' },
  { value: 'greek', label: 'Greek letters' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'grouping', label: 'Grouping Symbols' },
  { value: 'calculus', label: 'Calculus' },
  { value: 'misc', label: 'Miscellaneous' },
  { value: 'discrete', label: 'Discrete' },
  { value: 'general', label: 'General' },
]

const modes = [
  { value: 'text', label: 'Text' },
  { value: 'math', label: 'Math' },
]

const mathRenderOptions = [
  { value: '', label: '' },
  {
    value: 'mathjax',
    label: 'MathJax (response inputs rendered with MathQuill)',
  },
  { value: 'mathquill', label: 'MathQuill' },
]

const templateFontScaleOption = [
  { value: 'normal', label: 'Normal (100%)' },
  { value: 'boosted', label: 'Boosted (150%)' },
]

const EMBED_RESPONSE = '\\embed{response}'

const methodOptions = {
  [methods.EQUIV_SYMBOLIC]: [
    'ariaLabel',
    'allowEulersNumber',
    'isFactorised',
    'isExpanded',
    'isSimplified',
    'isMixedFraction',
    'isImproperFraction',
    'ignoreAlphabeticCharacter',
    'inverseResult',
    'interpretAsSet',
    'interpretAsInterval',
    'interpretAsNumber',
    'isRationalized',
    'interpretAsList',
    'compareSides',
    'unit',
    'setDecimalSeparator',
    'setThousandsSeparator',
    'allowNumericOnly',
    'allowedVariables',
    'tolerance',
    'significantDecimalPlaces',
  ],
  [methods.EQUIV_LITERAL]: [
    'ariaLabel',
    'ignoreTrailingZeros',
    'ignoreOrder',
    'ignoreCoefficientOfOne',
    'literalIgnoreLeadingAndTrailingSpaces',
    'literalTreatMultipleSpacesAsOne',
    'inverseResult',
    'allowedVariables',
    'setDecimalSeparator',
    'setThousandsSeparator',
  ],
  [methods.EQUIV_VALUE]: [
    'ariaLabel',
    'inverseResult',
    'isMixedFraction',
    'isSimpleFraction',
    'tolerance',
    'significantDecimalPlaces',
    'allowNumericOnly',
    'allowedVariables',
    'interpretAsSet',
    'interpretAsInterval',
    'interpretAsNumber',
    'compareSides',
    'interpretAsList',
    'setThousandsSeparator',
  ],

  [methods.SET_EVALUATION]: [],
  [methods.EQUIV_SYNTAX]: ['notExpected', 'syntax', 'argument', 'rule'],
  [methods.IS_SIMPLIFIED]: [
    'notExpected',
    'inverseResult',
    'setDecimalSeparator',
    'setThousandsSeparator',
  ],
  [methods.IS_FACTORISED]: [
    'notExpected',
    'inverseResult',
    'setDecimalSeparator',
    'setThousandsSeparator',
    'field',
  ],
  [methods.IS_EXPANDED]: [
    'notExpected',
    'significantDecimalPlaces',
    'setDecimalSeparator',
    'setThousandsSeparator',
  ],
  [methods.STRING_MATCH]: [
    'ariaLabel',
    'ignoreLeadingAndTrailingSpaces',
    'treatMultipleSpacesAsOne',
  ],
  [methods.IS_RATIONALIZED]: ['notExpected'],
  [methods.CHECK_IF_TRUE]: ['notExpected'],
}

// TODO
// need to create finalised constants for the keys
const methodOptionsGrouped = {
  [methods.EQUIV_SYMBOLIC]: {
    'STUDENT’S RESPONSE SHOULD BE: ': [
      'isSimplified',
      'isMixedFraction',
      'isImproperFraction',
      'isFactorised',
      'isExpanded',
      'isRationalized',
      'requireIntervalNotation',
    ],
    'INTERPRET THE VALUES AS: ': [
      'automatic',
      'interpretAsSet',
      'interpretAsInterval',
      'interpretAsNumber',
      'interpretAsList',
    ],
    'SPECIAL HANDLING: ': [
      'ariaLabel',
      'allowEulersNumber',
      'ignoreAlphabeticCharacter',
      'inverseResult',
      'compareSides',
      'unit',
      'setDecimalSeparator',
      'setThousandsSeparator',
      'allowNumericOnly',
      'interpretTrigArgAsDegree',
      'allowedVariables',
      'tolerance',
      'significantDecimalPlaces',
    ],
  },
  [methods.EQUIV_LITERAL]: {
    'SPECIAL HANDLING: ': [
      'ariaLabel',
      'ignoreTrailingZeros',
      'ignoreOrder',
      'ignoreCoefficientOfOne',
      'literalIgnoreLeadingAndTrailingSpaces',
      'literalTreatMultipleSpacesAsOne',
      'inverseResult',
      'setDecimalSeparator',
      'setThousandsSeparator',
      'allowedVariables',
    ],
  },
  // [methods.EQUIV_SYNTAX]: {
  //   Default: ["notExpected", "syntax", "argument", "rule"]
  // }
}

const characterMapButtons = [
  '¡',
  '¿',
  'Ç',
  'Ñ',
  'ç',
  'ñ',
  'ý',
  'ÿ',
  'á',
  'â',
  'ã',
  'ä',
  'å',
  'æ',
  'À',
  'Á',
  'Â',
  'Ã',
  'Ä',
  'Å',
  'Æ',
  'à',
  'È',
  'É',
  'Ê',
  'Ë',
  'è',
  'é',
  'ê',
  'ë',
  'Ì',
  'Í',
  'Î',
  'Ï',
  'ì',
  'í',
  'î',
  'ï',
  'Ò',
  'Ó',
  'Ô',
  'Õ',
  'Ö',
  'Ø',
  'ð',
  'ò',
  'ó',
  'ô',
  'õ',
  'ö',
  'Ù',
  'Ú',
  'Û',
  'Ü',
  'ù',
  'ú',
  'û',
  'ü',
]

const KeyboardSize = { width: 50, height: 50 }

const defaultNumberPad = [
  '1',
  '2',
  '3',
  '+',
  '4',
  '5',
  '6',
  '-',
  '7',
  '8',
  '9',
  '\\times',
  '0',
  '.',
  'divide',
  '\\div',
]

module.exports = {
  methods,
  methodOptions,
  fields,
  decimalSeparators,
  syntaxes,
  mathInputTypes,
  units,
  symbols,
  symbolsAll,
  modes,
  mathRenderOptions,
  templateFontScaleOption,
  EMBED_RESPONSE,
  KeyboardSize,
  characterMapButtons,
  defaultNumberPad,
  methodOptionsGrouped,
}
