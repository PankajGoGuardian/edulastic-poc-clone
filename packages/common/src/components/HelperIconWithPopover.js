import React, { useMemo } from 'react'
import { Popover } from 'antd'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { MathSpan, FieldLabel, replaceLatexTemplate } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { IconCharInfo } from '@edulastic/icons'

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

const Description = styled(MathSpan).attrs(({ text }) => ({
  dangerouslySetInnerHTML: { __html: text },
}))``

function HelperIconWithPopover({
  labelKey,
  contentKey,
  placement = 'topRight',
  t,
  zIndex = 1500,
}) {
  const text = useMemo(() => {
    const helperText = t(contentKey)
    return replaceLatexTemplate(helperText)
  }, [])

  const optionLabel = useMemo(() => {
    const helperLabel = t(labelKey)
    return replaceLatexTemplate(helperLabel)
  }, [])

  const content = (
    <ContentWrapper>
      {labelKey && (
        <FieldLabel>
          <OptionLabel text={optionLabel} />
        </FieldLabel>
      )}
      {text && <Description text={text} />}
    </ContentWrapper>
  )

  const hasHelperText = !isEmpty(text)

  return (
    <Wrapper>
      {hasHelperText && (
        <Popover
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          content={content}
          placement={placement}
          zIndex={zIndex}
        >
          <InfoIcon />
        </Popover>
      )}
    </Wrapper>
  )
}

export default withNamespaces('assessment')(HelperIconWithPopover)
