import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Radio, Select } from 'antd'
import { get, isObject } from 'lodash'

import {
  MathKeyboard,
  MathFormulaDisplay,
  FieldLabel,
  SelectInputStyled,
  RadioBtn,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { toggleAdvancedSections } from '../../../../../actions/questions'
import { setDropDownInUseAction } from '../../../../../../student/Sidebar/ducks'
import { Row } from '../../../../../styled/WidgetOptions/Row'
import { Col } from '../../../../../styled/WidgetOptions/Col'
import { getStylesFromUiStyleToCssStyle } from '../../../../../utils/helpers'

const { Option } = Select

const UnitsDropdownPure = ({
  item,
  onChange,
  t,
  keypadOffset,
  preview,
  selected,
  options,
  onChangeShowDropdown,
  disabled,
  keypadMode = 'units_us',
  view,
  setDropDownInUse,
}) => {
  const [offset, updateOffset] = useState(keypadOffset)

  const onChnageRadioGroup = (e) => {
    onChangeShowDropdown(e.target.value === 'dropdown')
  }

  const handleChange = (value) => {
    if (preview) {
      onChange(value)
    } else {
      onChange('unit', value)
    }
  }

  const scrollToKeypad = () => {
    window.scrollTo({
      top: keypadOffset - 115,
      behavior: 'smooth',
    })
    updateOffset(keypadOffset)
  }

  useEffect(() => {
    if (offset !== keypadOffset && offset === 0) {
      scrollToKeypad()
    }
  }, [keypadOffset])

  const symbol = get(item, 'symbols', [])[0] // units_us units_si

  // Only for math with units
  const customUnits = item?.customUnits?.split(',') || []

  // Get predefined math keyboard data
  let allBtns = MathKeyboard.KEYBOARD_BUTTONS.filter((btn) =>
    btn.types.includes(keypadMode)
  )

  // Get data entered by author on custom mode
  if (keypadMode === 'custom')
    allBtns = customUnits.map((key) => ({
      handler: key,
      label: key,
      types: [isObject(symbol) ? symbol.label : symbol],
      command: 'write',
    }))

  const cssStyles = getStylesFromUiStyleToCssStyle(item.uiStyle)
  const getLabel = (btn) => {
    const label = `<span class="input__math" data-latex="${
      btn.handler || ''
    }"></span>`

    return (
      <MathFormulaDisplay
        dangerouslySetInnerHTML={{ __html: label }}
        fontSize={cssStyles.fontSize}
      />
    )
  }

  const dropdownWrapper = useRef(null)
  const menuStyle = {
    top: `${dropdownWrapper.current?.clientHeight}px !important`,
    left: `0px !important`,
  }
  return (
    <>
      {!preview && (
        <Row marginTop={15}>
          <Col span={24}>
            <FieldLabel marginBottom="0" data-cy="answer-math-unit-dropdown">
              {t('component.math.showDropdown')}
              <SubLabel>&nbsp;(Use keypad section to customize)</SubLabel>
            </FieldLabel>
          </Col>
          <Col span={24}>
            <Radio.Group
              onChange={onChnageRadioGroup}
              value={item.showDropdown ? 'dropdown' : 'keypad'}
            >
              <RadioBtn value="dropdown" data-cy="dropdown">
                <FieldLabel display="inline-block">
                  {t('component.math.dropdown')}
                </FieldLabel>
              </RadioBtn>
              <RadioBtn value="keypad" data-cy="keypad">
                <FieldLabel display="inline-block">
                  {t('component.math.keypad')}
                </FieldLabel>
              </RadioBtn>
            </Radio.Group>
          </Col>
        </Row>
      )}
      {item.showDropdown && view !== 'edit' && (
        <DropdownWrapper menuStyle={menuStyle} ref={dropdownWrapper}>
          <SelectInputStyled
            value={getLabel({
              handler: preview ? selected : options ? options.unit : '',
            })}
            onChange={handleChange}
            disabled={disabled}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            style={{
              visibility: item.showDropdown ? 'visible' : 'hidden',
              height: item.showDropdown ? cssStyles.height || '100%' : 0,
              width: item.showDropdown ? cssStyles.width : 0,
            }}
            onFocus={() => setDropDownInUse(true)}
            onBlur={() => setDropDownInUse(false)}
            data-cy="selectUnitDropdown"
          >
            {allBtns.map((btn, i) => (
              <Option value={btn.handler} key={i} data-cy={btn.dataCy}>
                {getLabel(btn)}
              </Option>
            ))}
          </SelectInputStyled>
        </DropdownWrapper>
      )}
    </>
  )
}

UnitsDropdownPure.propTypes = {
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  keypadOffset: PropTypes.number,
  selected: PropTypes.string,
  preview: PropTypes.bool,
  t: PropTypes.func.isRequired,
  onChangeShowDropdown: PropTypes.func,
  disabled: PropTypes.bool,
  setDropDownInUse: PropTypes.func,
}

UnitsDropdownPure.defaultProps = {
  keypadOffset: 0,
  preview: false,
  disabled: false,
  selected: '',
  onChangeShowDropdown: () => null,
  setDropDownInUse: () => {},
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(null, {
    handleAdvancedOpen: toggleAdvancedSections,
    setDropDownInUse: setDropDownInUseAction,
  })
)

export const UnitsDropdown = enhance(UnitsDropdownPure)

const DropdownWrapper = styled.div`
  position: relative;
  height: 100%;
  .ant-select-dropdown {
    ${({ menuStyle }) => menuStyle};
    min-width: 100%;
    width: auto !important;
  }
  .ant-select {
    min-width: 85px;
    svg {
      display: inline-block;
    }
  }
`

const SubLabel = styled.span`
  text-transform: initial;
`
