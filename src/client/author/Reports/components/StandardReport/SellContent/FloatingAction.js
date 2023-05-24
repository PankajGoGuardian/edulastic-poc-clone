import { segmentApi } from '@edulastic/api'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const FloatingAction = () => {
  const upgradeNow = () => {
    segmentApi.genericEventTrack(`Insights: Upgrade now clicked`, {})
  }

  return (
    <FloatingActionContainer onClick={upgradeNow} to="/author/subscription">
      UPGRADE TO PREMIUM
    </FloatingActionContainer>
  )
}

const FloatingActionContainer = styled(Link)`
  color: white;
  background-color: #1ab395;
  position: fixed;
  top: 50%;
  right: 36px;
  transform: translateY(-50%) rotate(-90deg);
  transform-origin: top right;
  border-top-left-radius: 10px;
  border-radius: 4px 4px 0px 0px;
  padding: 8px 16px;

  &:hover {
    color: white;
  }
`
