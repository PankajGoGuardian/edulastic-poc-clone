import React from 'react'
import { Modal, Popover } from 'antd'
import styled from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import { variableTypes } from '@edulastic/constants'
import { SelectInputStyled } from '@edulastic/common'

const { Option } = SelectInputStyled

const VariableTypeSelector = ({
  t,
  value,
  variableName,
  hasExamples,
  onSelect,
}) => {
  const types = Object.keys(variableTypes)

  const handleSelect = (v) => {
    if (hasExamples) {
      Modal.confirm({
        title: t('component.options.confirm'),
        content: t('component.options.removePrevDynamicValues'),
        okText: t('component.options.confirm'),
        cancelText: t('component.options.cancel'),
        onOk: () => onSelect(variableName, 'type', v),
      })
    } else {
      onSelect(variableName, 'type', v)
    }
  }

  return (
    <Select
      size="large"
      data-cy="variableType"
      value={value}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
      onChange={handleSelect}
      style={{ width: '100%' }}
    >
      {types.map((key) => (
        <Option data-cy={key} key={key} value={key}>
          <Popover
            content={
              <ContentWrapper>
                {t(`component.helperText.${key}`)}
              </ContentWrapper>
            }
            placement="right"
          >
            <Wrapper>{variableTypes[key]}</Wrapper>
          </Popover>
        </Option>
      ))}
    </Select>
  )
}

export default withNamespaces('assessment')(VariableTypeSelector)

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

const ContentWrapper = styled.div`
  max-width: 320px;
`
const Select = styled(SelectInputStyled)`
  &.ant-select {
    .ant-select-selection-selected-value {
      /** In order to disable help text popover */
      pointer-events: none;
    }
  }
`
