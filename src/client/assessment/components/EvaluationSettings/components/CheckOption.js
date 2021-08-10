import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import { CheckboxLabel } from '@edulastic/common'
import LabelWithHelper from './LabelWithHelper'

const reverseDir = ['enablePartialCredit', 'applyPenaltyForWrong']

const CheckOption = ({ optionKey, options, onChange }) => {
  const onClickHandler = () => {
    onChange(optionKey, !options[optionKey])
  }
  const isReverse = reverseDir.includes(optionKey)
  return (
    <CheckOptionWrapper onClick={onClickHandler} isReverse={isReverse}>
      <CheckboxLabel checked={options[optionKey]} labelPadding="0px 16px">
        <LabelWithHelper optionKey={optionKey} />
      </CheckboxLabel>
    </CheckOptionWrapper>
  )
}
export default CheckOption

CheckOption.propTypes = {
  optionKey: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

const inverseDirCss = css`
  .ant-checkbox-wrapper {
    display: flex;
    flex-direction: row-reverse;
    margin-right: 18px;

    .ant-checkbox + span {
      padding-left: 0px;
    }

    .ant-checkbox {
      input {
        margin-right: 0px;
      }
    }
  }
`

const CheckOptionWrapper = styled.div`
  margin-bottom: 20px;
  cursor: pointer;

  ${({ isReverse }) => isReverse && inverseDirCss}
`
