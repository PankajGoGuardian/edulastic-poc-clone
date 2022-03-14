import React from 'react'
import styled, { css } from 'styled-components'
import { greyThemeDark4, borderGrey4 } from '@edulastic/colors'

const ItemLevelScoreWrapper = ({ itemLevelScore, isLCBView, marginBottom }) => {
  return (
    <ScoreWrapper isLCBView={isLCBView} marginBottom={marginBottom}>
      <span>Single score for entire item</span>{' '}
      <ScoreBlock>{itemLevelScore}</ScoreBlock>
    </ScoreWrapper>
  )
}

export default ItemLevelScoreWrapper

const lcbStyles = css`
  max-width: 100%;
  margin-top: 4px;
  border-radius: 6px;
`

const ScoreWrapper = styled.div`
  padding: 8px 14px;
  color: ${greyThemeDark4};
  border: 1px solid ${borderGrey4};
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  width: 100%;
  margin-bottom: ${({ marginBottom }) => marginBottom};
  ${({ isLCBView }) => isLCBView && lcbStyles}
`

const ScoreBlock = styled.span`
  font-weight: 700;
`
