import React from 'react'
import styled from 'styled-components'
import { PremiumLabel } from '@edulastic/common'

export const ReportItemCards = ({
  data,
  handleClick,
  showPremiumLabel,
  showGreenBorder,
}) => {
  return (
    <ItemCard onClick={handleClick}>
      {showPremiumLabel && (
        <PremiumLabel style={{ top: 8, right: 8 }}> PREMIUM</PremiumLabel>
      )}
      <StyledPreviewImage
        src={data.thumbnail}
        alt={data.title}
        showGreenBorder={showGreenBorder}
      />
      <CardTitle>{data.title}</CardTitle>
      <CardDescription>{data.description}</CardDescription>
    </ItemCard>
  )
}

export const LinksWrapper = styled.ul`
  padding: 0px;
  margin: 0px;
  list-style: none;
`

export const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const ItemCard = styled.div`
  position: relative;
  width: 235px;
  margin: 0px 14px 20px 0px;
`

const StyledPreviewImage = styled.img`
  width: 100%;
  min-height: 130px;
  user-select: none;
  pointer-events: none;
  object-fit: contain;
  ${({ showGreenBorder }) => showGreenBorder && 'border: 2px solid;'}
`

const CardTitle = styled.h4`
  color: #1a76b3;
  font-size: 13px;
  margin: 13px 0px;
`

const CardDescription = styled.p`
  font-size: 11px;
  color: #434b5d;
`
