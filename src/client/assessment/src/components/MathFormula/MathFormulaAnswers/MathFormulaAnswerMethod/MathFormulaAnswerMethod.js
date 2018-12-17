import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Select, Input, Checkbox } from 'antd';
import styled from 'styled-components';
import { IconTrash } from '@edulastic/icons';
import { greenDark, red, grey } from '@edulastic/colors';
import { FlexContainer } from '@edulastic/common';
import { math } from '@edulastic/constants';

import Options from '../../../common/Options';
import ThousandsSeparators from './ThousandsSeparators';
import { MathInput } from '../../common';

const {
  methods: methodsConst,
  fields: fieldsConst,
  decimalSeparators: decimalSeparatorsConst,
  syntaxes: syntaxesConst
} = math;

const methods = [
  methodsConst.EQUIV_SYMBOLIC,
  methodsConst.EQUIV_LITERAL,
  methodsConst.EQUIV_VALUE,
  methodsConst.IS_SIMPLIFIED,
  methodsConst.IS_FACTORISED,
  methodsConst.IS_EXPANDED,
  methodsConst.IS_UNIT,
  methodsConst.IS_TRUE,
  methodsConst.STRING_MATCH,
  methodsConst.EQUIV_SYNTAX
];

const fields = [fieldsConst.INTEGER, fieldsConst.REAL, fieldsConst.COMPLEX];

const decimalSeparators = [
  { value: decimalSeparatorsConst.DOT, label: 'Dot' },
  { value: decimalSeparatorsConst.COMMA, label: 'Comma' }
];

const syntaxes = [
  { value: '', label: '' },
  { value: syntaxesConst.NUMBER, label: 'Number' },
  { value: syntaxesConst.INTEGER, label: 'Integer' },
  { value: syntaxesConst.DECIMAL, label: 'Decimal' },
  { value: syntaxesConst.SCIENTIFIC, label: 'Scientific' },
  { value: syntaxesConst.VARIABLE, label: 'Variable' },
  { value: syntaxesConst.FRACTION, label: 'Fraction' },
  { value: syntaxesConst.MIXED_FRACTION, label: 'Mixed fraction' },
  { value: syntaxesConst.SIMPLE_FRACTION, label: 'Simple fraction' },
  { value: syntaxesConst.FRACTION_OR_DECIMAL, label: 'Fraction or decimal' }
];

const MathFormulaAnswerMethod = ({ onChange, onDelete, method, value, aria_label, options }) => {
  const handleChangeOptions = (prop, val) => {
    onChange('options', {
      ...options,
      [prop]: val
    });
  };

  const handleChangeThousandsSeparator = ({ val, index }) => {
    let newSetThousandsSeparator = [''];

    if (options.setThousandsSeparator && options.setThousandsSeparator.length) {
      newSetThousandsSeparator = [...options.setThousandsSeparator];
    }

    newSetThousandsSeparator[index] = val;
    handleChangeOptions('setThousandsSeparator', newSetThousandsSeparator);
  };

  const handleAddThousandsSeparator = () => {
    let newSeparators = [];
    if (options.setThousandsSeparator && options.setThousandsSeparator.length) {
      newSeparators = [...options.setThousandsSeparator];
    }
    handleChangeOptions('setThousandsSeparator', [...newSeparators, '']);
  };

  const handleDeleteThousandsSeparator = (index) => {
    const newSetThousandsSeparator = [...options.setThousandsSeparator];
    newSetThousandsSeparator.splice(index, 1);
    handleChangeOptions('setThousandsSeparator', newSetThousandsSeparator);
  };

  return (
    <Container>
      <StyledRow gutter={32}>
        <Col span={12}>
          <Options.Label>Method</Options.Label>
          <Select
            size="large"
            value={method}
            style={{ width: '100%' }}
            onChange={val => onChange('method', val)}
          >
            {methods.map(val => (
              <Select.Option key={val} value={val}>
                {val}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={2} push={10}>
          <IconTrash
            style={{ cursor: 'pointer' }}
            width={22}
            height={22}
            color={greenDark}
            hoverColor={red}
            onClick={onDelete}
          />
        </Col>
      </StyledRow>

      {method === methods.IS_FACTORISED && (
        <StyledRow gutter={32}>
          <Col span={12}>
            <Options.Label>Field</Options.Label>
            <Select
              size="large"
              value={options.field || fields[0]}
              style={{ width: '100%' }}
              onChange={val => handleChangeOptions('field', val)}
            >
              {fields.map(val => (
                <Select.Option key={val} value={val}>
                  {val}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </StyledRow>
      )}

      {[
        methodsConst.EQUIV_SYMBOLIC,
        methodsConst.EQUIV_LITERAL,
        methodsConst.EQUIV_VALUE,
        methodsConst.IS_UNIT,
        methodsConst.STRING_MATCH
      ].includes(method) && (
        <StyledRow gutter={32}>
          <Col span={12}>
            <Options.Label>Value</Options.Label>
            <MathInput value={value} onInput={val => onChange('value', val)} />
          </Col>
          <Col span={12}>
            <Options.Label>ARIA label</Options.Label>
            <Input.TextArea
              size="large"
              value={aria_label}
              onChange={e => onChange('aria_label', e.target.value)}
            />
          </Col>
        </StyledRow>
      )}

      {method === methodsConst.STRING_MATCH && (
        <StyledRow gutter={32}>
          <Col span={12}>
            <Checkbox
              checked={options.ignoreLeadingAndTrailingSpaces}
              onChange={e =>
                handleChangeOptions('ignoreLeadingAndTrailingSpaces', e.target.checked)
              }
            >
              Ignore leading and trailing spaces
            </Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox
              checked={options.treatMultipleSpacesAsOne}
              onChange={e => handleChangeOptions('treatMultipleSpacesAsOne', e.target.checked)}
            >
              Treat multiple spaces as one
            </Checkbox>
          </Col>
        </StyledRow>
      )}

      {method === methodsConst.EQUIV_SYNTAX && (
        <StyledRow gutter={32}>
          <Col span={12}>
            <Options.Label>Rule</Options.Label>
            <Select
              size="large"
              value={options.syntax || ''}
              style={{ width: '100%' }}
              onChange={val => handleChangeOptions('syntax', val)}
            >
              {syntaxes.map(({ value: val, label }) => (
                <Select.Option key={val} value={val}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </StyledRow>
      )}

      {method === methodsConst.EQUIV_LITERAL && (
        <Fragment>
          <StyledRow gutter={32}>
            <Col span={12}>
              <Checkbox
                checked={options.ignoreOrder}
                onChange={e => handleChangeOptions('ignoreOrder', e.target.checked)}
              >
                Ignore order
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox
                checked={options.allowInterval}
                onChange={e => handleChangeOptions('allowInterval', e.target.checked)}
              >
                Allow interval
              </Checkbox>
            </Col>
          </StyledRow>

          <StyledRow gutter={32}>
            <Col span={12}>
              <Checkbox
                checked={options.ignoreTrailingZeros}
                onChange={e => handleChangeOptions('ignoreTrailingZeros', e.target.checked)}
              >
                Ignore trailing zeros
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox
                checked={options.inverseResult}
                onChange={e => handleChangeOptions('inverseResult', e.target.checked)}
              >
                Inverse result
              </Checkbox>
            </Col>
          </StyledRow>

          <StyledRow gutter={32}>
            <Col span={12}>
              <Checkbox
                checked={options.ignoreCoefficientOne}
                onChange={e => handleChangeOptions('ignoreCoefficientOne', e.target.checked)}
              >
                Ignore coefficient of 1
              </Checkbox>
            </Col>
          </StyledRow>
        </Fragment>
      )}

      {['equivSymbolic', 'equivValue', 'isTrue', 'equivSyntax'].includes(method) && (
        <StyledRow gutter={32}>
          {method !== methodsConst.EQUIV_SYNTAX && (
            <Col span={12}>
              <FlexContainer>
                <Input
                  style={{ width: '30%' }}
                  size="large"
                  type="number"
                  value={options.decimalPlaces}
                  onChange={e => handleChangeOptions('decimalPlaces', e.target.value)}
                />
                <Options.Label>Significant decimal places</Options.Label>
              </FlexContainer>
            </Col>
          )}
          {method !== methodsConst.IS_TRUE && (
            <Col span={12}>
              <Checkbox
                checked={options.ignoreText}
                onChange={e => handleChangeOptions('ignoreText', e.target.checked)}
              >
                Ignore text
              </Checkbox>
            </Col>
          )}
        </StyledRow>
      )}

      {[methodsConst.EQUIV_SYMBOLIC, methodsConst.EQUIV_VALUE].includes(method) && (
        <StyledRow gutter={32}>
          <Col span={12}>
            <Checkbox
              checked={options.compareSides}
              onChange={e => handleChangeOptions('compareSides', e.target.checked)}
            >
              Compare sides
            </Checkbox>
          </Col>
          {method === methodsConst.EQUIV_SYMBOLIC && (
            <Col span={12}>
              <Checkbox
                checked={options.allowEulersNumber}
                onChange={e => handleChangeOptions('allowEulersNumber', e.target.checked)}
              >
                {"Treat 'e' as Euler's number"}
              </Checkbox>
            </Col>
          )}
        </StyledRow>
      )}

      {![methodsConst.STRING_MATCH, methodsConst.EQUIV_SYNTAX].includes(method) && (
        <StyledRow gutter={32}>
          <Col span={12}>
            <Checkbox
              checked={options.allowThousandsSeparator}
              onChange={e => handleChangeOptions('allowThousandsSeparator', e.target.checked)}
            >
              Allow decimal marks
            </Checkbox>
          </Col>
        </StyledRow>
      )}

      {options.allowThousandsSeparator && (
        <StyledRow gutter={32}>
          <Col span={12}>
            <Options.Label>Decimal separator</Options.Label>
            <Select
              size="large"
              value={options.setDecimalSeparator || decimalSeparators[0].value}
              style={{ width: '100%' }}
              onChange={val => handleChangeOptions('setDecimalSeparator', val)}
            >
              {decimalSeparators.map(({ value: val, label }) => (
                <Select.Option key={val} value={val}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <ThousandsSeparators
            separators={options.setThousandsSeparator}
            onChange={handleChangeThousandsSeparator}
            onAdd={handleAddThousandsSeparator}
            onDelete={handleDeleteThousandsSeparator}
          />
        </StyledRow>
      )}
    </Container>
  );
};

MathFormulaAnswerMethod.propTypes = {
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  value: PropTypes.string,
  method: PropTypes.string,
  aria_label: PropTypes.string
};

MathFormulaAnswerMethod.defaultProps = {
  aria_label: '',
  value: '',
  method: ''
};

export default MathFormulaAnswerMethod;

const StyledRow = styled(Row)`
  margin-bottom: 15px;
`;

const Container = styled.div`
  border: 1px solid ${grey};
  padding: 25px;
  margin-bottom: 15px;

  :last-child {
    margin-bottom: 0;
  }
`;
