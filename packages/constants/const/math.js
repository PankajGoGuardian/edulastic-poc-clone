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
  NUMBER: 'number',
  INTEGER: 'integer',
  DECIMAL: 'decimal',
  SCIENTIFIC: 'scientific',
  VARIABLE: 'variable',
  FRACTION: 'fraction',
  MIXED_FRACTION: 'mixedFraction',
  SIMPLE_FRACTION: 'simpleFraction',
  FRACTION_OR_DECIMAL: 'fractionOrDecimal'
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
