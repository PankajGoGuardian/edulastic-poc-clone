import styled from 'styled-components'
import {
  white,
  secondaryTextColor,
  largeDesktopWidth,
  borderGrey5,
  lightGrey9,
  lightGrey,
} from '@edulastic/colors'
import { CustomModalStyled } from '@edulastic/common'

export const SubscriptionContentWrapper = styled.div`
  background: ${lightGrey};
  width: 100%;
  height: 100%;
  padding: 20px 30px;
`

export const CompareModal = styled(CustomModalStyled)`
  width: calc(100% - 80px) !important;

  .ant-modal-content {
    .ant-modal-body {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
    }
  }
`

export const PlanCard = styled.div`
  width: 320px;
  background: ${white};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  user-select: none;
  border: 1px solid ${borderGrey5};

  @media (max-width: ${largeDesktopWidth}) {
    width: 240px;
  }
`

export const PlanHeader = styled.div`
  background: ${({ color, bgImg }) => `${color} url(${bgImg})`};
  background-size: contain;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 8px 8px 0px 0px;
  line-height: 1.5;
  h2 {
    font-size: 18px;
    color: ${white};
    font-weight: bold;
    margin: 0px;
  }
  span {
    font-size: 12px;
    color: ${white};
    font-weight: 600;
    letter-spacing: 1.5px;
  }
`

export const PlanContent = styled.div`
  width: 270px;
  margin: 30px;

  @media (max-width: ${largeDesktopWidth}) {
    width: 220px;
  }
`

export const PlanTitle = styled.div`
  font-weight: 700;
  color: ${secondaryTextColor};
  font-size: 13px;
`

export const PlanDescription = styled.div`
  margin-bottom: 23px;
  font-size: 12px;
  color: ${lightGrey9};
`
