import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import {
  MathInput,
  withWindowSizes,
  StaticMath,
  getInnerValuesForStatic,
  notification,
} from '@edulastic/common'

import { math, questionTitle } from '@edulastic/constants'
import { withNamespaces } from '@edulastic/localization'
import { mobileWidth } from '@edulastic/colors'

import { Label } from '../../../../styled/WidgetOptions/Label'

import { IconTrash } from '../../styled/IconTrash'
import { Container } from './styled/Container'
import { StyledRow } from './styled/StyledRow'
import { MathInputWrapper } from './styled/MathInputWrapper'

import { Field, UnitsDropdown, DefaultKeyPadMode, CustomUnit } from './options'
import { Row } from '../../../../styled/WidgetOptions/Row'
import { Col } from '../../../../styled/WidgetOptions/Col'
import EvaluationSettings from '../../../../components/EvaluationSettings'

const { methods: methodsConst, methodOptions: methodOptionsConst } = math

const MathFormulaAnswerMethod = ({
  onChange,
  onDelete,
  method,
  value,
  options,
  item,
  index,
  onChangeKeypad,
  onChangeAllowedOptions,
  onChangeShowDropdown,
  windowWidth,
  style = {},
  keypadOffset,
  allowedVariables,
  showDefaultMode,
  labelValue,
  renderExtra,
  keypadMode, // need only for Math w/Unit in cloze Math
  customUnits, // need only for Math w/Unit in cloze Math
  containerHeight,
  allowNumericOnly = null,
  isClozeMath, // this is from clozemath
  template = '',
  useTemplate, // this is from clozemath
  view,
  unitsDropdown, // this is for Math with unit
  isClozeMathWithUnit = false,
  t,
  isDocbasedSection,
  extraOptions,
}) => {
  /**
   * Setting _allowNumericOnly when the value is not set (null) and method is equivSymbolic
   * _allowNumericOnly is set to true when question type is Numeric Entry
   */

  useEffect(() => {
    if (
      method === methodsConst.EQUIV_SYMBOLIC &&
      allowNumericOnly === null &&
      item.title === questionTitle.NUMERIC_ENTRY
    ) {
      onChangeAllowedOptions('allowNumericOnly', true)
    }
  }, [method])

  const hasMutuallyExclusiveOptions = (selectedOptions = {}) => {
    let flag = false
    let warningMsg = ''

    if (selectedOptions.isExpanded && selectedOptions.isFactorised) {
      flag = true
      warningMsg = 'Expanded and Factored cannot be combined together'
    } else if (
      selectedOptions.isMixedFraction &&
      selectedOptions.isImproperFraction
    ) {
      flag = true
      warningMsg =
        'Mixed Fraction and Improper fraction cannot be combined together'
    }
    return [flag, warningMsg]
  }

  /**
   * Stores validation data (answer) of testItem
   * @param {string} prop
   * @param {string} val
   */
  const changeOptions = (prop, val, extra) => {
    const newOptions = {
      ...options,
      [prop]: val,
    }

    if (!val) {
      delete newOptions[prop]
    }
    const [error, errorMsg] = hasMutuallyExclusiveOptions(newOptions)
    if (error) {
      notification({ type: 'warn', msg: errorMsg })
      return false
    }

    onChange('options', newOptions, extra)
  }

  const methodOptions = methodOptionsConst && methodOptionsConst[method]
  const restrictKeys = allowedVariables
    ? allowedVariables.split(',').map((segment) => segment.trim())
    : []
  const customKeys = get(item, 'customKeys', [])
  const isShowDropdown = item.isUnits && item.showDropdown
  const warningFlag =
    options?.setThousandsSeparator?.[0] === options?.setDecimalSeparator?.[0] &&
    options?.setDecimalSeparator?.[0] !== undefined

  const mathInputProps = {
    hideKeypad: item.showDropdown,
    symbols: isShowDropdown ? ['basic'] : item.symbols,
    restrictKeys: isShowDropdown ? [] : restrictKeys,
    allowNumericOnly,
    customKeys: isShowDropdown ? [] : customKeys,
    showResponse: useTemplate,
    numberPad: item.numberPad,
    onBlur: () => null,
    onChangeKeypad,
    style,
  }

  const handleChangeMathInput = (val) => {
    if (isClozeMath && useTemplate) {
      onChangeAllowedOptions('template', val)
    } else {
      onChange('value', val)
    }
  }

  const studentTemplate = template.replace(
    /\\embed\{response\}/g,
    '\\MathQuillMathField{}'
  )

  const innerValues = getInnerValuesForStatic(studentTemplate, value)

  return (
    <Container
      data-cy="math-formula-answer"
      style={{ height: containerHeight }}
    >
      <Row gutter={24}>
        {!methodOptions?.includes('notExpected') && (
          <Col span={24}>
            <Label data-cy="answer-math-input">
              {labelValue || t('component.math.expectedAnswer')}
            </Label>
            <MathInputWrapper>
              {(!item.templateDisplay || !item.template) && (
                <MathInput
                  {...mathInputProps}
                  ALLOW
                  TOLERANCE
                  showDropdown
                  value={isClozeMath && useTemplate ? template : value}
                  onInput={handleChangeMathInput}
                  isDocbasedSection={isDocbasedSection}
                />
              )}
              {((item.template && item.templateDisplay) || useTemplate) && (
                <StaticMath
                  {...mathInputProps}
                  noBorder
                  latex={studentTemplate}
                  innerValues={innerValues}
                  onInput={handleChangeMathInput}
                />
              )}
              {/* when dropdown is selected */}
              {item.showDropdown && unitsDropdown(changeOptions)}
              {renderExtra}
            </MathInputWrapper>
          </Col>
        )}
        {index > 0 ? (
          <div
            style={{
              paddingTop: windowWidth >= mobileWidth.replace('px', '') ? 37 : 5,
            }}
          >
            {onDelete && (
              <IconTrash
                data-cy="delete-answer-method"
                onClick={onDelete}
                width={22}
                height={22}
              />
            )}
          </div>
        ) : null}
        {item.isUnits && (
          <Col span={24}>
            <UnitsDropdown
              item={item}
              options={options}
              onChange={changeOptions}
              keypadOffset={keypadOffset}
              onChangeShowDropdown={onChangeShowDropdown}
              unitsStyle={methodOptions?.includes('notExpected')}
              preview={view === 'preview'}
              view={view}
              keypadMode={keypadMode}
            />
          </Col>
        )}
      </Row>

      {methodOptions?.includes('field') && (
        <StyledRow gutter={24}>
          <Col span={12}>
            <Field value={options.field} onChange={changeOptions} />
          </Col>
        </StyledRow>
      )}
      {warningFlag ? (
        <div style={{ color: 'red', padding: '10px' }}>
          *Decimal Seperator and Thousand Seperator cannot have same values, ie.
          Dot
        </div>
      ) : null}
      {/* This needs only for Math w/Units in ClozMath type */}
      {(item.showDropdown || (isClozeMathWithUnit && showDefaultMode)) && (
        <StyledRow gutter={24}>
          <Col span={6}>
            <Label data-cy="unit-dropdown-default-mode">
              {t('component.options.defaultMode')}
            </Label>
            <DefaultKeyPadMode onChange={onChange} keypadMode={keypadMode} />
          </Col>
          {keypadMode === 'custom' && (
            <Col span={8}>
              <CustomUnit onChange={onChange} customUnits={customUnits} />
            </Col>
          )}
        </StyledRow>
      )}

      <EvaluationSettings
        method={method}
        options={options}
        extraOptions={extraOptions}
        allowNumericOnly={allowNumericOnly}
        allowedVariables={allowedVariables}
        onChangeMethod={onChange}
        changeOptions={changeOptions}
        onChangeAllowedOptions={onChangeAllowedOptions}
        templateDisplay={item?.templateDisplay}
        useTemplate={useTemplate}
      />
    </Container>
  )
}

MathFormulaAnswerMethod.propTypes = {
  onChange: PropTypes.func.isRequired,
  onChangeShowDropdown: PropTypes.func.isRequired,
  onChangeAllowedOptions: PropTypes.func.isRequired,
  onChangeKeypad: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  options: PropTypes.object,
  value: PropTypes.string,
  method: PropTypes.string,
  style: PropTypes.object,
  t: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  useTemplate: PropTypes.bool,
  allowedVariables: PropTypes.string.isRequired,
  allowNumericOnly: PropTypes.any.isRequired,
  windowWidth: PropTypes.number.isRequired,
  keypadOffset: PropTypes.number.isRequired,
  keypadMode: PropTypes.string,
  customUnits: PropTypes.string,
  isClozeMath: PropTypes.bool,
  showDefaultMode: PropTypes.bool,
  containerHeight: PropTypes.any,
  labelValue: PropTypes.string,
  renderExtra: PropTypes.any,
  template: PropTypes.string,
  unitsDropdown: PropTypes.func,
  isClozeMathWithUnit: PropTypes.bool,
  view: PropTypes.string,
}

MathFormulaAnswerMethod.defaultProps = {
  value: '',
  method: '',
  style: {},
  options: {},
  labelValue: '',
  isClozeMath: false,
  useTemplate: false,
  showDefaultMode: false,
  customUnits: '',
  containerHeight: 'auto',
  keypadMode: 'units_us',
  renderExtra: null,
  unitsDropdown: () => {},
  template: '',
  isClozeMathWithUnit: false,
  view: '',
}

export default withWindowSizes(
  withNamespaces('assessment')(MathFormulaAnswerMethod)
)
