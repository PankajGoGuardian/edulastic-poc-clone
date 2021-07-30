import React, { useMemo } from 'react'
import { Popover } from 'antd'
import styled from 'styled-components'
import { MathSpan, replaceLatexTemplate } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'

const HelperToolTip = ({ toolName, children, t }) => {
  const content = useMemo(() => {
    const text = replaceLatexTemplate(
      t(`component.graphing.helperText.${toolName}`)
    )
    return <HelperText text={replaceLatexTemplate(text)} />
  }, [toolName])
  return (
    <Popover content={content} zIndex={1500} placement="top">
      {children}
    </Popover>
  )
}

export default withNamespaces('assessment')(HelperToolTip)

const HelperText = styled(MathSpan).attrs(({ text }) => ({
  dangerouslySetInnerHTML: { __html: text },
  fontSize: 11,
  color: 'inherit',
}))`
  font-weight: 700;

  & .input__math {
    font-size: 13px;
    text-transform: initial;
    color: #48632d;
  }
`
