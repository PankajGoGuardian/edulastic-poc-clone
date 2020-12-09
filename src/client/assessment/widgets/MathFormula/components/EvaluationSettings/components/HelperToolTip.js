import React, { useMemo } from 'react'
import Popover from "antd/es/popover";
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { MathSpan, FieldLabel } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { IconCharInfo } from '@edulastic/icons'

const replaceLatexTemplate = (str) => {
  return str.replace(
    /#{(.*?)#}/g,
    '<span class="input__math" data-latex="$1"></span>'
  )
}

const HelperToolTip = ({ t, optionKey, large }) => {
  const text = useMemo(() => {
    let _text = t(`component.math.helperText.${optionKey}`)
    if (!optionKey) {
      _text = ''
    }

    return replaceLatexTemplate(_text)
  }, [])

  const hasHelperText = !isEmpty(text)

  const content = (
    <ContentWrapper large={large}>
      {optionKey && (
        <OptionLabel>{t(`component.math.${optionKey}`)}</OptionLabel>
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
  max-width: ${({ large }) => (large ? '450px' : '350px')};

  .katex {
    .text {
      font-size: 0.85em;
    }
  }
`

const OptionLabel = styled(FieldLabel)`
  font-weight: 700;
`

const Desc = styled(MathSpan).attrs(({ text }) => ({
  dangerouslySetInnerHTML: { __html: text },
}))``
