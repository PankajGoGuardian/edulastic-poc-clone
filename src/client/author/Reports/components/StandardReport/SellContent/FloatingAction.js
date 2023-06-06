import { segmentApi } from '@edulastic/api'
import React from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

export const FloatingAction = withRouter(
  ({ title = 'UPGRADE TO PREMIUM', onUpgrade, history }) => {
    const upgradeNow = () => {
      if (onUpgrade) {
        return onUpgrade()
      }
      history.push('/author/subscription')
      segmentApi.genericEventTrack(`Insights: Upgrade now clicked`, {})
    }

    return (
      <FloatingActionContainer onClick={upgradeNow}>
        {title}
      </FloatingActionContainer>
    )
  }
)

const FloatingActionContainer = styled.span`
  cursor: pointer;
  color: white;
  background-color: #1ab395;
  position: fixed;
  top: 50%;
  right: 26px;
  transform: translateY(-50%) rotate(-90deg);
  transform-origin: top right;
  border-top-left-radius: 10px;
  border-radius: 4px 4px 0px 0px;
  padding: 8px 16px;
  font-size: 10px;
  font-weight: bold;
  padding: 6px 8px;

  &:hover {
    color: white;
  }
`
