import styled from 'styled-components'
import { Card, TextInputStyled } from '@edulastic/common'
import { Drawer } from 'antd'

export const StandardReportWrapper = styled.div`
  position: relative;
`

export const StyledCard = styled(Card)`
  box-shadow: none;
  margin-bottom: 20px;
  .ant-card-body {
    padding: 0px;
  }
  padding-top: 30px;
  border-top: 1px solid #d1d1d1;
  border-radius: 0px;

  &:first-child {
    padding-top: 0px;
    border-top: 0px;
  }
`

export const StyledContainer = styled.div`
  padding: 0px;
  display: flex;
  ${({ premium }) => !premium && `padding-top: 15px;`}
`

export const ReportCardsWrapper = styled.div``

export const SearchBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0px;
`

export const StyledInput = styled(TextInputStyled)`
  max-width: 650px;
  height: 50px;
  font-size: 14px;

  & .ant-input {
    border-radius: 46px;
    background: #f1f1f1;
    border: 0px;
  }

  & svg {
    height: 20px;
    width: 20px;
    fill: #1ab395;
  }
  & .ant-input-affix-wrapper,
  & .ant-input-prefix {
    left: 20px;
  }

  & .ant-input-affix-wrapper,
  & .ant-input:not(:first-child) {
    padding-left: 60px;
  }
`

export const StyledLink = styled.div`
  margin-top: 16px;
  text-align: center;
  color: #1ab395;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 10px;
  cursor: pointer;
`

export const PossibleInsights = styled(Drawer)`
  & .ant-drawer-content-wrapper {
    width: 450px !important;
  }

  & .ant-drawer-body {
    padding: 28px;
  }
`

export const InsightsTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;

  & span {
    text-align: left;
    letter-spacing: -0.9px;
    color: #434b5d;
    font-size: 18px;
    font-weight: bold;
  }

  & svg {
    fill: #434b5d;
    cursor: pointer;
  }
`

export const InsightsItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  background: #f3f3f3;
  border-radius: 10px;
  padding: 16px 20px;
  cursor: pointer;

  & span {
    font-size: 14px;
    font-weight: 600;
    color: #434b5d;
  }
`

export const InsightsItemIndex = styled.div`
  letter-spacing: 0px;
  color: #5eb500;
  font-size: 18px;
  font-weight: bold;
  margin-right: 20px;
`
export const NoActivePremiumSubscriptionContainer = styled.div`
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
`
