import React, { useMemo } from 'react'
import { Popover } from 'antd'
import styled from 'styled-components'
import { MathSpan, replaceLatexTemplate } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { IconCharInfo } from '@edulastic/icons'
import { greyThemeDark1 } from '@edulastic/colors'

const HelpTooltipLabel = ({
  t,
  className,
  contentKey,
  helperKey,
  zIndex = 1500,
  placement = 'topRight',
}) => {
  const helpText = useMemo(() => {
    if (helperKey) {
      const text = replaceLatexTemplate(t(helperKey))
      return <HelperText text={text} />
    }
    return null
  }, [helperKey])

  const labelText = useMemo(() => {
    if (contentKey) {
      const text = replaceLatexTemplate(t(contentKey))
      return <HelperText text={text} />
    }
    return null
  }, [contentKey])

  return (
    <Container className={className}>
      {labelText}
      {helpText && (
        <Popover
          content={helpText}
          zIndex={zIndex}
          placement={placement}
          overlayClassName="help-text-popover"
        >
          <InfoIcon />
        </Popover>
      )}
    </Container>
  )
}

export default withNamespaces('assessment')(HelpTooltipLabel)

const Container = styled.span`
  position: relative;
  color: ${greyThemeDark1};
  margin-bottom: 8px;
  display: inline-block;
`

const InfoIcon = styled(IconCharInfo)`
  width: 6px;
  height: 10px;
  position: absolute;
  top: -5px;
  right: -12px;
  cursor: pointer;
`

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
