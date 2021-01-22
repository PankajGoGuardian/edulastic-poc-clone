import React, { useMemo } from 'react'
import { MathSpan, FieldLabel, replaceLatexTemplate } from '@edulastic/common'
import styled from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import HelperToolTip from './HelperToolTip'

const LabelWithHelper = ({
  t,
  label,
  optionKey,
  vertical,
  large,
  isGraph,
  color,
}) => {
  const optionLabel = useMemo(
    () => replaceLatexTemplate(label || t(`component.math.${optionKey}`)),
    [label, optionKey]
  )
  return (
    <FieldLabel
      color={color}
      marginBottom={vertical ? '' : '0px'}
      display={vertical ? '' : 'inline-block'}
    >
      <OptionLabel text={optionLabel} />
      <HelperToolTip optionKey={optionKey} large={large} isGraph={isGraph} />
    </FieldLabel>
  )
}

export default withNamespaces('assessment')(LabelWithHelper)

const OptionLabel = styled(MathSpan).attrs(({ text }) => ({
  dangerouslySetInnerHTML: { __html: text },
  fontSize: 11,
  color: 'inherit',
}))`
  font-weight: 600;

  & .input__math {
    font-size: 13px;
    text-transform: initial;
    color: #48632d;
  }
`
