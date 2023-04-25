import { drcThemeColor } from '@edulastic/colors'
import { EduIf } from '@edulastic/common'
import { IconClose } from '@edulastic/icons'
import { Button, Select } from 'antd'
import React from 'react'
import { ruleLimit } from './config/qb-config'
import { GroupButton, RuleButton, StyledSelect } from './styled-components'

const getDataCyValue = (pathLevel = [], selectorName) => {
  if (pathLevel.length) {
    if (pathLevel.length == 2)
      return `groupLevel-${pathLevel[0]}-${selectorName}-${pathLevel[1]}`
    return `${selectorName}-${pathLevel[0]}`
  }
  return selectorName
}

export const FieldSelector = (props) => {
  const { handleOnChange, options, value, id, path } = props

  return (
    <StyledSelect
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      onChange={handleOnChange}
      value={value}
      key={id}
      data-cy={getDataCyValue(path, 'fieldSelector')}
    >
      {options.map((item) => {
        return (
          <Select.Option
            value={item.name}
            key={item.name}
            data-cy={getDataCyValue(path, 'fieldOptions')}
          >
            {item.label}
          </Select.Option>
        )
      })}
    </StyledSelect>
  )
}

export const CombinatorSelector = (props) => {
  const { handleOnChange, options, value, path } = props
  const dataCyValue = path.length
    ? `groupCombinatorSelector-${path[0]}`
    : 'combinatorSelector'
  return (
    <StyledSelect
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      onChange={handleOnChange}
      value={value}
      data-cy={dataCyValue}
      disabled
      style={{ width: '27%', maxWidth: '27%' }}
    >
      {options.map((item) => {
        return (
          <Select.Option
            value={item.name}
            key={item.name}
            data-cy={getDataCyValue(path, 'combinatorOptions')}
          >
            {item.label}
          </Select.Option>
        )
      })}
    </StyledSelect>
  )
}

export const OperatorSelector = (props) => {
  const { handleOnChange, options, value, path } = props

  return (
    <StyledSelect
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      onChange={handleOnChange}
      value={value}
      data-cy={getDataCyValue(path, 'operatorSelector')}
    >
      {options.map((item) => {
        return (
          <Select.Option
            value={item.name}
            key={item.name}
            data-cy={getDataCyValue(path, 'operatorOptions')}
          >
            {item.label}
          </Select.Option>
        )
      })}
    </StyledSelect>
  )
}

export const AddRule = ({ handleOnClick, rules, path }) => {
  const isDisabled = rules.length >= ruleLimit
  const dataCyValue = path.length
    ? `addGroupRuleButton-${path[0]}`
    : 'addRuleButton'

  return (
    <>
      <RuleButton
        isBlue
        isGhost
        onClick={handleOnClick}
        disabled={isDisabled}
        data-cy={dataCyValue}
      >
        + ADD CRITERIA
      </RuleButton>
      <EduIf condition={isDisabled}>
        <span className="error-message">Maximum of 10 criteria allowed!</span>
      </EduIf>
    </>
  )
}

export const AddRuleGroup = ({ handleOnClick, level, rules }) => {
  const isDisabled = rules.length >= ruleLimit

  if (level !== 0) return null
  return (
    <GroupButton
      onClick={handleOnClick}
      disabled={isDisabled}
      data-cy="addGroupButton"
      isBlue
      isGhost
    >
      GROUP CRITERIA
    </GroupButton>
  )
}

export const RemoveRuleAction = ({ handleOnClick, path }) => {
  return (
    <div className="ruleGroup-header-close">
      <Button
        onClick={handleOnClick}
        data-cy={getDataCyValue(path, 'removeRuleButton')}
        style={{ borderColor: drcThemeColor }}
      >
        <IconClose height={10} width={10} color={drcThemeColor} />
      </Button>
    </div>
  )
}
