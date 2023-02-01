import React from 'react'
import { Select, Button } from 'antd'
import { IconClose } from '@edulastic/icons'
import { drcThemeColor } from '@edulastic/colors'
import { ruleLimit } from './qb-config'
import {
  StyledSelect,
  RuleButton,
  GroupButton,
} from '../components/styled-components'

export const FieldSelector = (props) => {
  const { handleOnChange, options, value, id } = props
  return (
    <StyledSelect
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      style={{ minWidth: '150px' }}
      onChange={handleOnChange}
      value={value}
      key={id}
    >
      {options.map((item) => {
        return (
          <Select.Option value={item.name} key={item.name}>
            {item.label}
          </Select.Option>
        )
      })}
    </StyledSelect>
  )
}

export const CombinatorSelector = (props) => {
  const { handleOnChange, options, value } = props
  return (
    <StyledSelect
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      onChange={handleOnChange}
      value={value}
    >
      {options.map((item) => {
        return (
          <Select.Option value={item.name} key={item.name}>
            {item.label}
          </Select.Option>
        )
      })}
    </StyledSelect>
  )
}

export const OperatorSelector = (props) => {
  const { handleOnChange, options, value } = props
  return (
    <StyledSelect
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      onChange={handleOnChange}
      value={value}
    >
      {options.map((item) => {
        return (
          <Select.Option value={item.name} key={item.name}>
            {item.label}
          </Select.Option>
        )
      })}
    </StyledSelect>
  )
}

export const AddRule = ({ handleOnClick, rules }) => {
  const isDisabled = rules.length >= ruleLimit
  return (
    <RuleButton onClick={handleOnClick} disabled={isDisabled}>
      +Rule
    </RuleButton>
  )
}

export const AddRuleGroup = ({ handleOnClick, level, rules }) => {
  const isDisabled = rules.length >= ruleLimit

  if (level !== 0) return null
  return (
    <GroupButton onClick={handleOnClick} disabled={isDisabled}>
      +Group
    </GroupButton>
  )
}

export const RemoveRuleAction = ({ handleOnClick }) => {
  return (
    <div className="ruleGroup-header-close">
      <Button onClick={handleOnClick}>
        <IconClose height={10} width={10} color={drcThemeColor} />
      </Button>
    </div>
  )
}
