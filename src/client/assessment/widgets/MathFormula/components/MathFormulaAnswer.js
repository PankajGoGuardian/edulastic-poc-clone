import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withNamespaces } from '@edulastic/localization'
import { response } from '@edulastic/constants'

import MathFormulaAnswerMethod from './MathFormulaAnswerMethod'
import { getStylesFromUiStyleToCssStyle } from '../../../utils/helpers'
import { Row } from '../../../styled/WidgetOptions/Row'
import { Col } from '../../../styled/WidgetOptions/Col'
import SelectUnit from '../../ClozeMath/ClozeMathAnswers/ClozeMathUnitAnswer/SelectUnit'

class MathFormulaAnswer extends Component {
  render() {
    const {
      answer,
      onChange,
      onAdd,
      onDelete,
      item,
      onChangeKeypad,
      onChangeAllowedOptions,
      keypadOffset,
      onChangeShowDropdown,
      toggleAdditional,
      view = '',
      extraOptions,
    } = this.props

    const handleChangeMethod = (index) => (prop, val) => {
      onChange({ index, prop, value: val })
    }

    const { minWidth, expectedAnsMinHeight } = response
    const cssStyles = getStylesFromUiStyleToCssStyle(item.uiStyle)
    cssStyles.width = cssStyles.width || `${minWidth}px`
    cssStyles.height = cssStyles.height || `${expectedAnsMinHeight}px`
    // Validation data (answer)
    const { options: { unit = '' } = {} } = answer[0] || {}

    // Adding new fields to testItem to store custom value for keypadMode & customUnits
    const { keypadMode, customUnits = '' } = item

    const dropdownUnit = (changeOptions) => (
      <SelectUnit
        height={cssStyles.height || '36px'}
        width={cssStyles.width || '140px'}
        fontSize={cssStyles.fontSize}
        customUnits={customUnits}
        onChange={changeOptions}
        unit={unit}
        keypadMode={keypadMode}
        view={view}
      />
    )
    return (
      <Row>
        <Col span={24}>
          {answer.map((method, i) => (
            <MathFormulaAnswerMethod
              onDelete={() => onDelete(i)}
              key={i}
              item={item}
              index={i}
              answer={answer}
              onChange={handleChangeMethod(i)}
              onChangeKeypad={onChangeKeypad}
              onChangeAllowedOptions={onChangeAllowedOptions}
              allowedVariables={item.allowedVariables || ''}
              allowNumericOnly={item.allowNumericOnly}
              template={item.template}
              useTemplate={item.useTemplate}
              onChangeShowDropdown={onChangeShowDropdown}
              onAdd={onAdd}
              keypadOffset={keypadOffset}
              style={cssStyles}
              toggleAdditional={toggleAdditional}
              showDefaultMode={item?.isUnits}
              view={view}
              unitsDropdown={dropdownUnit}
              keypadMode={keypadMode}
              customUnits={customUnits}
              extraOptions={extraOptions}
              {...method}
            />
          ))}
        </Col>
      </Row>
    )
  }
}

MathFormulaAnswer.propTypes = {
  answer: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeAllowedOptions: PropTypes.func.isRequired,
  onChangeShowDropdown: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  keypadOffset: PropTypes.number.isRequired,
  onChangeKeypad: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  toggleAdditional: PropTypes.func,
}

MathFormulaAnswer.defaultProps = {
  toggleAdditional: () => null,
}

export default withNamespaces('assessment')(MathFormulaAnswer)
