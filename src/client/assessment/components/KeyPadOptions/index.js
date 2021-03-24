import React, { useEffect, useMemo, useState } from 'react'
import uuidv4 from 'uuid/v4'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { isObject, isArray } from 'lodash'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { math } from '@edulastic/constants'
import { Keyboard, FlexContainer, EduButton } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { numBtnColors } from '@edulastic/colors'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'

// import NumberPad from "../NumberPad";
import KeyPad from '../KeyPad'
import Question from '../Question'
import { Subtitle } from '../../styled/Subtitle'
import { Label } from '../../styled/WidgetOptions/Label'
import { Row } from '../../styled/WidgetOptions/Row'
import { Col } from '../../styled/WidgetOptions/Col'
import { SelectInputStyled, TextInputStyled } from '../../styled/InputStyles'

import {
  storeCustomKeypadAction,
  fetchCustomKeypadAction,
  updateCustomKeypadAction,
  getCustomKeypads,
} from './ducks'
import { StyledSelectContainer } from './styled/StyledSelectContainer'

const defaultCustomKeypad = {
  label: 'label',
  title: '',
  value: [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ],
}

const KeyPadOptions = ({
  t,
  item,
  onChange,
  advancedAreOpen,
  fillSections,
  cleanSections,
  renderExtra,
  storedKeypads,
  storeCustomKeypad,
  updateCustomKeypad,
  fetchCustomKeypad,
}) => {
  const symbol = item.symbols[0]
  const isCustom = isObject(symbol)
  const [selected, setSelected] = useState()

  const btnStyle = useMemo(
    () =>
      isCustom
        ? {
            color: numBtnColors.color,
            borderColor: numBtnColors.borderColor,
            backgroundColor: numBtnColors.backgroundColor,
          }
        : {},
    [isCustom]
  )

  const symbolsData = useMemo(
    () => {
      return [
        { value: 'custom', label: t('component.options.addCustom') },
        // ...storedKeypads,
        ...math.symbols,
      ]
    },
    [
      // storedKeypads
    ]
  )

  const allKeypads = useMemo(() => {
    return [
      { value: 'custom', label: t('component.options.addCustom') },
      ...math.symbols,
      ...storedKeypads,
    ]
  }, [storedKeypads])

  const handleSymbolsChange = (valueIndx) => {
    const newSymbol = allKeypads[valueIndx]
    const data = [...item.symbols]
    if (newSymbol.value === 'custom') {
      data[0] = defaultCustomKeypad
    } else if (isArray(newSymbol.value)) {
      data[0] = newSymbol
    } else {
      data[0] = newSymbol.value
    }
    onChange('symbols', data)
  }

  const handleCustomSymbolLabel = (e) => {
    const { value: label } = e.target
    const data = [...item.symbols]
    data[0].label = label
    onChange('symbols', data)
  }

  const handleStoreCustomKeypad = () => {
    if (isCustom) {
      let payload = symbol
      if (!payload._id) {
        payload = { ...symbol, _id: uuidv4() }
        storeCustomKeypad(payload)
      } else {
        updateCustomKeypad(payload)
      }
    }
  }

  useEffect(() => {
    let selectedIndex = null
    if (isCustom) {
      if (symbol._id) {
        selectedIndex = allKeypads.findIndex((s) => s._id === symbol._id)
      } else {
        selectedIndex = 0
      }
    } else {
      selectedIndex = allKeypads.findIndex((s) => s.value === symbol)
    }
    setSelected(selectedIndex)
  }, [symbolsData, symbol, storedKeypads])

  useEffect(() => {
    fetchCustomKeypad()
  }, [])

  return (
    <Question
      section="advanced"
      label={t('component.options.keypad')}
      advancedAreOpen={advancedAreOpen}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle
        id={getFormattedAttrId(
          `${item?.title}-${t('component.options.keypad')}`
        )}
      >
        {t('component.options.keypad')}
      </Subtitle>

      <Row gutter={24}>
        <Col span={12}>
          <Row gutter={0}>
            <FlexContainer
              justifyContent="space-between"
              marginBottom="6px"
              alignItems="center"
            >
              <FlexContainer height="28px" alignItems="center">
                <Label marginBottom="0px">
                  {t('component.options.defaultMode')}
                </Label>
              </FlexContainer>
              {isCustom && (
                <EduButton
                  isGhost
                  height="28px"
                  onClick={handleStoreCustomKeypad}
                >
                  {symbol._id
                    ? t('component.options.updateCustomKeypad')
                    : t('component.options.saveCustomKeypad')}
                </EduButton>
              )}
            </FlexContainer>
          </Row>
          <StyledSelectContainer>
            <SelectInputStyled
              size="large"
              value={selected}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              onChange={handleSymbolsChange}
              data-cy="text-formatting-options-select"
            >
              {symbolsData.map((ite, indx) => (
                <Select.Option key={indx} value={indx}>
                  {ite.label}
                </Select.Option>
              ))}
              <Select.OptGroup label={t('component.options.customKeypadLabel')}>
                {storedKeypads.map((ite, index) => (
                  <Select.Option
                    key={item._id}
                    value={symbolsData.length + index}
                  >
                    {ite.label}
                  </Select.Option>
                ))}
              </Select.OptGroup>
            </SelectInputStyled>
          </StyledSelectContainer>
        </Col>
        <Col span={12} />
      </Row>

      {isCustom && (
        <Row gutter={24}>
          <Col span={12}>
            <Label>{t('component.options.label')}</Label>
            <TextInputStyled
              onChange={handleCustomSymbolLabel}
              value={symbol.label}
              size="large"
            />
          </Col>
        </Row>
      )}

      <Row gutter={24}>
        <Col span={24}>
          <FlexContainer justifyContent="flex-start" flexWrap="wrap">
            {symbol === 'qwerty' && <Keyboard onInput={() => {}} />}
            {symbol !== 'qwerty' && !item.showDropdown && (
              <KeyPad
                symbol={symbol}
                onChange={onChange}
                item={item}
                buttonStyle={btnStyle}
              />
            )}
          </FlexContainer>
        </Col>
      </Row>

      {isCustom && renderExtra}
    </Question>
  )
}

KeyPadOptions.propTypes = {
  t: PropTypes.func.isRequired,
  storedKeypads: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  storeCustomKeypad: PropTypes.func.isRequired,
  updateCustomKeypad: PropTypes.func.isRequired,
  fetchCustomKeypad: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  renderExtra: PropTypes.node,
}

KeyPadOptions.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
  renderExtra: null,
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    (state) => ({
      storedKeypads: getCustomKeypads(state),
    }),
    {
      fetchCustomKeypad: fetchCustomKeypadAction,
      storeCustomKeypad: storeCustomKeypadAction,
      updateCustomKeypad: updateCustomKeypadAction,
    }
  )
)

export default enhance(KeyPadOptions)
