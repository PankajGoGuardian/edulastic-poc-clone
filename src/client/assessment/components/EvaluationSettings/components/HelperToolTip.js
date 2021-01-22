import React, { useMemo } from 'react'
import { Popover } from 'antd'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { MathSpan, FieldLabel, replaceLatexTemplate } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { IconCharInfo } from '@edulastic/icons'

const HelperToolTip = ({ t, optionKey, large, isGraph }) => {
  const text = useMemo(() => {
    let helperTextKey = `component.math.helperText.${optionKey}`
    if (isGraph && optionKey === 'tolerance') {
      helperTextKey = 'component.math.helperText.graphTolerance'
    }

    let _text = t(helperTextKey)
    if (!optionKey) {
      _text = ''
    }

    return replaceLatexTemplate(_text)
  }, [])

  const optionLabel = useMemo(
    () => replaceLatexTemplate(t(`component.math.${optionKey}`)),
    [optionKey]
  )

  const hasHelperText = !isEmpty(text)

  const content = (
    <ContentWrapper large={large}>
      {optionKey && (
        <FieldLabel>
          <OptionLabel text={optionLabel} />
        </FieldLabel>
      )}
      {text && <Desc text={text} />}
    </ContentWrapper>
  )

  return (
    <Wrapper>
      {hasHelperText && (
        <Popover content={content} placement="right" zIndex={1500}>
          <InfoIcon />
        </Popover>
      )}
    </Wrapper>
  )
}

export default withNamespaces('assessment')(HelperToolTip)

const Wrapper = styled.span`
  position: relative;
`

const InfoIcon = styled(IconCharInfo)`
  width: 6px;
  height: 10px;
  position: absolute;
  top: -4px;
  left: -2px;
  cursor: pointer;
`

const ContentWrapper = styled.div`
  padding: 6px 8px;
  color: ${({ theme }) => theme.questionTextColor};
  width: ${({ large }) => (large ? '450px' : '350px')};

  .katex {
    .text {
      font-size: 0.85em;
    }
  }
`

const OptionLabel = styled(MathSpan).attrs(({ text }) => ({
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

export const Desc = styled(MathSpan).attrs(({ text }) => ({
  dangerouslySetInnerHTML: { __html: text },
}))``
