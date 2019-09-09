const methods = {
  EQUIV_SYMBOLIC: "equivSymbolic",
  EQUIV_LITERAL: "equivLiteral",
  EQUIV_VALUE: "equivValue",
  IS_SIMPLIFIED: "isSimplified",
  IS_FACTORISED: "isFactorised",
  IS_EXPANDED: "isExpanded",
  IS_RATIONALIZED: "isRationalized",
  STRING_MATCH: "stringMatch",
  EQUIV_SYNTAX: "equivSyntax",
  SET_EVALUATION: "setEvaluation",
  CHECK_IF_TRUE: "isTrue"
};

const fields = {
  INTEGER: "integerType",
  REAL: "realType",
  COMPLEX: "complexType"
};

const decimalSeparators = {
  DOT: ".",
  COMMA: ","
};

const syntaxes = {
  DECIMAL: "isDecimal",
  SIMPLE_FRACTION: "isSimpleFraction",
  MIXED_FRACTION: "isMixedFraction",
  EXPONENT: "isExponent",
  STANDARD_FORM: "isStandardForm",
  SLOPE_INTERCEPT_FORM: "isSlopeInterceptForm",
  POINT_SLOPE_FORM: "isPointSlopeForm",
  NUMBER: "numberType",
  INTEGER: "integerType",
  SCIENTIFIC: "scientificType",
  VARIABLE: "variableType"
};

const mathInputTypes = {
  CLEAR: "clear",
  WRONG: "wrong",
  SUCCESS: "success"
};

const units = [{ value: "units_us", label: "Units (US)" }, { value: "units_si", label: "Units (SI)" }];

const symbols = [
  { value: "basic", label: "Basic" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "units_si", label: "Units (SI)" },
  { value: "units_us", label: "Units (US)" },
  { value: "all", label: "Full" }
];

const symbolsAll = [
  { value: "all", label: "Full" },
  { value: "qwerty", label: "Keyboard" },
  { value: "basic", label: "Basic" },
  { value: "basic_junior", label: "Basic Junior" },
  { value: "algebra", label: "Algebra" },
  { value: "comparison", label: "Comparison" },
  { value: "geometry", label: "Geometry" },
  { value: "matrices", label: "Matrices" },
  { value: "trigonometry", label: "Trigonometry" },
  { value: "sets", label: "Sets" },
  { value: "units_si", label: "Units (SI)" },
  { value: "units_us", label: "Units (US Customary)" },
  { value: "greek", label: "Greek letters" },
  { value: "chemistry", label: "Chemistry" },
  { value: "grouping", label: "Grouping Symbols" },
  { value: "calculus", label: "Calculus" },
  { value: "misc", label: "Miscellaneous" },
  { value: "discrete", label: "Discrete" },
  { value: "general", label: "General" }
];

const modes = [{ value: "text", label: "Text" }, { value: "math", label: "Math" }];

const mathRenderOptions = [
  { value: "", label: "" },
  { value: "mathjax", label: "MathJax (response inputs rendered with MathQuill)" },
  { value: "mathquill", label: "MathQuill" }
];

const templateFontScaleOption = [
  { value: "normal", label: "Normal (100%)" },
  { value: "boosted", label: "Boosted (150%)" }
];

const EMBED_RESPONSE = "\\embed{response}";

const methodOptions = {
  [methods.EQUIV_SYMBOLIC]: [
    "ariaLabel",
    "allowEulersNumber",
    "isFactorised",
    "isExpanded",
    "isSimplified",
    "isMixedFraction",
    "ignoreAlphabeticCharacter",
    "ignoreAlphabeticCharacters",
    "inverseResult",
    "setDecimalSeparator",
    "setThousandsSeparator",
    "allowedVariables",
    "interpretAsSet",
    "isRationalized",
    "setListTypeResponse",
    "compareSides",
    "unit"
  ],
  [methods.EQUIV_LITERAL]: [
    "ariaLabel",
    "ignoreTrailingZeros",
    "setDecimalSeparator",
    "setThousandsSeparator",
    "ignoreOrder",
    "ignoreCoefficientOfOne",
    "inverseResult",
    "allowInterval",
    "allowedVariables"
  ],
  [methods.EQUIV_VALUE]: [
    "ariaLabel",
    "inverseResult",
    "isMixedFraction",
    "isSimpleFraction",
    "tolerance",
    "setThousandsSeparator",
    "significantDecimalPlaces",
    "ignoreAlphabeticCharacters",
    "allowNumericOnly",
    "allowedVariables",
    "interpretAsSet",
    "compareSides",
    "setListTypeResponse"
  ],

  [methods.SET_EVALUATION]: [],
  [methods.EQUIV_SYNTAX]: ["noExpeced", "syntax", "ignoreAlphabeticCharacters", "argument", "rule"],
  [methods.IS_SIMPLIFIED]: ["noExpeced", "setDecimalSeparator", "setThousandsSeparator", "inverseResult"],
  [methods.IS_FACTORISED]: ["noExpeced", "setDecimalSeparator", "setThousandsSeparator", "inverseResult", "field"],
  [methods.IS_EXPANDED]: ["noExpeced", "setDecimalSeparator", "setThousandsSeparator", "significantDecimalPlaces"],
  [methods.STRING_MATCH]: ["ariaLabel", "ignoreLeadingAndTrailingSpaces", "treatMultipleSpacesAsOne"],
  [methods.IS_RATIONALIZED]: [],
  [methods.CHECK_IF_TRUE]: ["noExpeced"]
};

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
  EMBED_RESPONSE
};
