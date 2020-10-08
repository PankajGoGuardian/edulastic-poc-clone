import React, { useState, useEffect } from 'react'
import { Select } from 'antd'
import CancelApplyActions from './CancelApplyActions'
import { CLASS_NAME_PATTERN_CONFIG, DISABLE_SUBMIT_TITLE } from '../Data'
import { CheckboxLabel } from '@edulastic/common'

const { Option } = Select

export default function ClassNamePattern({
  orgId,
  orgType,
  applyClassNamesSync,
  classNamePattern = 0,
  overrideClassName = false,
  disableFields,
  isClasslink,
}) {
  const [selectState, setSelectState] = useState(
    CLASS_NAME_PATTERN_CONFIG[classNamePattern]
  )
  const [overrideClassNameState, setOverrideClassNameState] = useState(
    overrideClassName
  )
  const cancelApplyButtonProps = disableFields
    ? { disabled: disableFields, title: DISABLE_SUBMIT_TITLE }
    : {}
  const setValueBackToDefault = () =>
    setSelectState(CLASS_NAME_PATTERN_CONFIG[classNamePattern])

  useEffect(() => {
    setValueBackToDefault()
  }, [classNamePattern])

  const handleApplyClick = () =>
    applyClassNamesSync({
      orgId,
      orgType,
      classNamePattern: selectState,
      overrideClassName: overrideClassNameState,
      isClasslink,
    })
  const onOverrideChange = ({ target }) => {
    setOverrideClassNameState(target.checked)
  }

  return (
    <>
      <CheckboxLabel
        style={{ margin: '10px 0px 20px 0px' }}
        checked={overrideClassNameState}
        onChange={onOverrideChange}
      >
        Override Class Name
      </CheckboxLabel>
      <h3>Edulastic Class Names</h3>
      <Select
        value={selectState}
        style={{ width: '350px' }}
        onChange={(value) => setSelectState(value)}
      >
        <Option value="DEFAULT">
          {`Default ${isClasslink ? 'Edlink' : 'Clever'} Names`}
        </Option>
        <Option value="CNAME_TLNAME_PERIOD">
          Course Name - Teacher LastName - Period
        </Option>
        <Option value="CNAME_TLNAME_TERM">
          Course Name - Teacher LastName - Term
        </Option>
      </Select>
      <CancelApplyActions
        {...cancelApplyButtonProps}
        onApplyAction={handleApplyClick}
        onCancelAction={setValueBackToDefault}
      />
    </>
  )
}
