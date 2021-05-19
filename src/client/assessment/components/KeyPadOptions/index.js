import React, { useEffect, useMemo, useState, useRef } from 'react'
import uuidv4 from 'uuid/v4'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { isObject, isArray, isPlainObject } from 'lodash'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { math } from '@edulastic/constants'
import {
  Keyboard,
  FlexContainer,
  SimpleConfirmModal,
  HelperIcon,
} from '@edulastic/common'
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
import StyledLink from './styled/StyledLink'

import {
  storeCustomKeypadAction,
  fetchCustomKeypadAction,
  updateCustomKeypadAction,
  getCustomKeypads,
  deleteCustomKeypadAction,
} from './ducks'
import { StyledSelectContainer } from './styled/StyledSelectContainer'

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
  deleteCustomKeypad,
}) => {
  const symbol = item.symbols[0]
  const isCustom = isObject(symbol)
  const [selected, setSelected] = useState()
  const [modalVisibility, setModalVisibility] = useState(false)
  const initialSelectedKeypad = useRef()

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

  const symbolsData = useMemo(() => {
    const keypadList = [
      { value: 'custom', label: t('component.options.addCustom') },
      ...math.symbols,
    ]

    if (initialSelectedKeypad.current) {
      const sameId = (obj) => obj._id === initialSelectedKeypad.current._id
      const includedInCustom = storedKeypads.find(sameId)
      if (!includedInCustom) {
        keypadList.push(initialSelectedKeypad.current)
      }
    }

    return keypadList
  }, [item.symbols, storedKeypads])

  const allKeypads = useMemo(() => {
    const keypadList = [
      { value: 'custom', label: t('component.options.addCustom') },
      ...math.symbols,
    ]

    if (initialSelectedKeypad.current) {
      const sameId = (obj) => obj._id === initialSelectedKeypad.current._id
      const includedInCustom = storedKeypads.find(sameId)
      if (!includedInCustom) {
        keypadList.push(initialSelectedKeypad.current)
      }
    }

    return keypadList.concat(storedKeypads)
  }, [storedKeypads])

  const keypadIsUserCustomKeypad = useMemo(() => {
    if (!isCustom) {
      return false
    }
    const sameId = (obj) => obj._id === symbol._id
    return storedKeypads.some(sameId)
  }, [storedKeypads, symbol])

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
    if (selectedIndex >= 0) {
      setSelected(selectedIndex)
    }
  }, [allKeypads, symbol])

  useEffect(() => {
    fetchCustomKeypad()
    /**
     * the keypad selected in item, might not necessarily be part of user custom keypads
     * when user changes the dropdown, symbols[0] gets updated with latest user selection
     * but we need to preserve the earlier keypad data and make it available in dropdown
     * this ref will be preseving the initial keypad value in the item
     */
    if (isPlainObject(item?.symbols?.[0])) {
      initialSelectedKeypad.current = item.symbols[0]
    }
  }, [])

  const handleSymbolsChange = (valueIndx) => {
    const newSymbol = allKeypads[valueIndx]
    const data = [...item.symbols]
    if (newSymbol.value === 'custom') {
      data[0] = {
        title: '',
        label: 'label',
        value: new Array(18).fill(''),
      }
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
      if (!payload._id || (payload._id && !keypadIsUserCustomKeypad)) {
        if (!payload._id) {
          payload = { ...symbol, _id: uuidv4() }
        }
        storeCustomKeypad(payload)
      } else {
        updateCustomKeypad(payload)
      }
    }
  }

  const showModal = () => {
    setModalVisibility(true)
  }

  const hideModal = () => {
    setModalVisibility(false)
  }

  const handleDeleteCustomKeypad = () => {
    deleteCustomKeypad(symbol)
    const data = [...item.symbols]
    data[0] = 'basic'
    onChange('symbols', data)
    initialSelectedKeypad.current = null
    hideModal()
  }

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
                  {t('component.options.chooseKeypad')}
                </Label>
              </FlexContainer>
            </FlexContainer>
          </Row>
          <StyledSelectContainer hasCustomKeypads={storedKeypads.length > 0}>
            <SelectInputStyled
              size="large"
              value={selected}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              onChange={handleSymbolsChange}
              data-cy="text-formatting-options-select"
            >
              {storedKeypads.length > 0 &&
                storedKeypads.map((ite, index) => (
                  <Select.Option
                    key={item._id}
                    value={symbolsData.length + index}
                  >
                    {ite.label}
                  </Select.Option>
                ))}
              <Select.OptGroup
                label={t('component.options.standardKeypadLabel')}
              >
                {symbolsData.map((ite, indx) => (
                  <Select.Option key={indx} value={indx}>
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
            <FlexContainer
              justifyContent="space-between"
              marginBottom="10px"
              alignItems="baseline"
            >
              <Label>{t('component.options.labelCustomKeypad')}</Label>
              <FlexContainer justifyContent="space-between">
                {symbol._id && keypadIsUserCustomKeypad ? (
                  <>
                    <StyledLink
                      onClick={handleStoreCustomKeypad}
                      data-cy="cutom-keypad-update"
                    >
                      {t('component.options.updateCustomKeypad')}
                    </StyledLink>
                    <StyledLink> | </StyledLink>
                    <StyledLink
                      onClick={showModal}
                      data-cy="cutom-keypad-delete"
                    >
                      {t('component.options.deleteCustomKeypad')}
                    </StyledLink>
                    <HelperIcon
                      labelKey="component.options.updateOrDeleteCustomKeypad"
                      contentKey="component.math.helperText.updateOrDeleteCustomKeypad"
                    />
                  </>
                ) : (
                  <>
                    <StyledLink
                      onClick={handleStoreCustomKeypad}
                      data-cy="cutom-keypad-save"
                    >
                      {t('component.options.saveAndUseLater')}
                    </StyledLink>
                    <HelperIcon
                      labelKey="component.options.customKeypads"
                      contentKey="component.math.helperText.saveCustomKeypad"
                    />
                  </>
                )}
              </FlexContainer>
            </FlexContainer>
            <TextInputStyled
              onChange={handleCustomSymbolLabel}
              value={symbol.label}
              size="large"
              data-cy="custom-keypad-label"
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
      <SimpleConfirmModal
        title="Delete Keypad"
        description={`${
          symbol?.label?.trim?.() || `Custom keypad`
        } will be deleted permanently. Are you sure?`}
        visible={modalVisibility}
        onCancel={hideModal}
        onProceed={handleDeleteCustomKeypad}
        buttonText="Delete"
      />
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
      deleteCustomKeypad: deleteCustomKeypadAction,
    }
  )
)

export default enhance(KeyPadOptions)
