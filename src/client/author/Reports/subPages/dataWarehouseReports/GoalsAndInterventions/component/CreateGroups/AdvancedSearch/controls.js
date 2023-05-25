import { drcThemeColor } from '@edulastic/colors'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import { IconClose } from '@edulastic/icons'
import { Button, Select, Tooltip } from 'antd'
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
  const { handleOnChange, options, value, id, path, pendingFields } = props

  return (
    <StyledSelect
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      onChange={handleOnChange}
      value={value}
      key={id}
      data-cy={getDataCyValue(path, 'fieldSelector')}
    >
      {options.map((item) => {
        const disabled =
          !pendingFields.includes(item.name) && item.name !== value
        return (
          <Select.Option
            value={item.name}
            key={item.name}
            disabled={disabled}
            data-cy={getDataCyValue(path, 'fieldOptions')}
          >
            <EduIf condition={disabled}>
              <EduThen>
                <Tooltip
                  placement="bottomLeft"
                  title="This field has already been used as a criterion."
                >
                  <div style={{ width: '100%' }}>{item.label}</div>
                </Tooltip>
              </EduThen>
              <EduElse>{item.label}</EduElse>
            </EduIf>
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

export const AddRule = ({ handleOnClick, rules, path, pendingFields }) => {
  const isDisabled = rules.length >= ruleLimit
  const noFieldLeft = pendingFields.length === 0
  const dataCyValue = path.length
    ? `addGroupRuleButton-${path[0]}`
    : 'addRuleButton'

  return (
    <>
      <RuleButton
        isBlue
        isGhost
        onClick={handleOnClick}
        disabled={isDisabled || noFieldLeft}
        data-cy={dataCyValue}
      >
        + ADD CRITERION
      </RuleButton>
      <EduIf condition={isDisabled}>
        <EduThen>
          <span className="error-message">Maximum of 10 criteria allowed!</span>
        </EduThen>
        <EduElse>
          <EduIf condition={noFieldLeft}>
            <span className="error-message">
              All fields has already been used as a criterion!
            </span>
          </EduIf>
        </EduElse>
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
