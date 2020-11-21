import React, { useMemo } from 'react'
import { Popover } from 'antd'
import styled from 'styled-components'
import { isArray, isEmpty, keys } from 'lodash'
import { IconCharInfo } from '@edulastic/icons'
import texts from './helperTexts.json'

const HelperToolTip = ({ optionKey, large }) => {
  const text = useMemo(() => {
    if (!optionKey) {
      return texts.defaultText
    }
    return texts[optionKey] || {}
  }, [])

  const hasHelperText = !isEmpty(text)

  const content = (
    <ContentWrapper large={large}>
      {text.description && (
        <Desc mb={isArray(text.expamples) ? '10px' : '0px'}>
          {text.description}
        </Desc>
      )}
      {isArray(text.expamples) &&
        text.expamples.map((exam, index) => (
          <ExampleWrapper key={index}>
            {keys(exam).map((key) => (
              <LatexField key={key}>
                <span className="title">{key}:</span>
                <span className="latex">{exam[key]}</span>
              </LatexField>
            ))}
          </ExampleWrapper>
        ))}
      {text.description1 && (
        <Desc mb="0px" mt="10px">
          {text.description1}
        </Desc>
      )}
    </ContentWrapper>
  )

  return (
    <Wrapper>
      {hasHelperText && (
        <Popover content={content} placement="right">
          <InfoIcon />
        </Popover>
      )}
    </Wrapper>
  )
}

export default HelperToolTip

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
`

const Desc = styled.p`
  margin-bottom: ${({ mb }) => mb};
  margin-top: ${({ mt }) => mt};
`

const LatexField = styled.div`
  .title {
    font-weight: 600;
    text-transform: capitalize;
  }
  .latex {
    margin-left: 4px;
  }
`

const ExampleWrapper = styled.div`
  margin-top: 8px;
`
