import React from 'react'
import styled from 'styled-components'
import { greyThemeDark4, borderGrey4 } from '@edulastic/colors'

const ItemLevelScoreWrapper = ({ itemLevelScore }) => {
  return (
    <ScoreWrapper>
      <span>Single score for entire item</span>{' '}
      <ScoreBlock>{itemLevelScore}</ScoreBlock>
    </ScoreWrapper>
  )
}

export default ItemLevelScoreWrapper

const ScoreWrapper = styled.p`
  padding: 8px 14px;
  margin-left: 58px;
  margin-bottom: 32px;
  color: ${greyThemeDark4};
  border: 1px solid ${borderGrey4};
  border-radius: 4px;
  max-width: 650px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.22px;
  width: 100%;
`

const ScoreBlock = styled.span`
  font-weight: 700;
`
