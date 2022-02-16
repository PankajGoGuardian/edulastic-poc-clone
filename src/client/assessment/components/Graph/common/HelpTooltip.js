import React, { useMemo } from 'react'
import { Popover } from 'antd'
import styled from 'styled-components'
import { replaceLatexTemplate } from '@edulastic/common'
import { replaceLatexesWithMathHtml } from '@edulastic/common/src/utils/mathUtils'
import { withNamespaces } from '@edulastic/localization'

const HelperToolTip = ({ toolName, children, t }) => {
  const content = useMemo(() => {
    const text = replaceLatexTemplate(
      t(`component.graphing.helperText.${toolName}`)
    )

    return (
      <HelperText
        dangerouslySetInnerHTML={{ __html: replaceLatexesWithMathHtml(text) }}
      />
    )
  }, [toolName])

  return (
    <Popover
      overlayClassName="graph-tool-helper-popover"
      content={content}
      zIndex={1500}
      placement="topRight"
    >
      {children}
    </Popover>
  )
}

export default withNamespaces('assessment')(HelperToolTip)

const HelperText = styled.span`
  font-weight: 700;
  color: inherit;
  font-size: 11px;

  & .input__math {
    font-size: 13px;
    text-transform: initial;
    color: #48632d;
  }
`
