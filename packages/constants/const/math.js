const methods = {
  EQUIV_SYMBOLIC: 'equivSymbolic',
  EQUIV_LITERAL: 'equivLiteral',
  EQUIV_VALUE: 'equivValue',
  IS_SIMPLIFIED: 'isSimplified',
  IS_FACTORISED: 'isFactorised',
  IS_EXPANDED: 'isExpanded',
  IS_UNIT: 'isUnit',
  IS_TRUE: 'isTrue',
  STRING_MATCH: 'stringMatch',
  EQUIV_SYNTAX: 'equivSyntax'
};

const fields = {
  INTEGER: 'integer',
  REAL: 'real',
  COMPLEX: 'complex'
};

const decimalSeparators = {
  DOT: '.',
  COMMA: ','
};

const syntaxes = {
  DECIMAL: 'isDecimal',
  SIMPLE_FRACTION: 'isSimpleFraction',
  MIXED_FRACTION: 'isMixedFraction',
  EXPONENT: 'isExponent',
  STANDARD_FORM: 'isStandardForm',
  SLOPE_INTERCEPT_FORM: 'isSlopeInterceptForm',
  POINT_SLOPE_FORM: 'isPointSlopeForm'
};

const mathInputTypes = {
  CLEAR: 'clear',
  WRONG: 'wrong',
  SUCCESS: 'success'
};

const EMBED_RESPONSE = '\\embed{response}';

module.exports = {
  methods,
  fields,
  decimalSeparators,
  syntaxes,
  mathInputTypes,
  EMBED_RESPONSE
};
