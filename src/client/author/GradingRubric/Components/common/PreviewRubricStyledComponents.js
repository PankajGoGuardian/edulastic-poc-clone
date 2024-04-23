import styled from 'styled-components'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  lightGreen3,
  themeColor,
  greyScoreCardTitleColor,
  boxShadowColor3,
  fadedRed,
  red,
} from '@edulastic/colors'

export const CriteriaSection = styled.div`
  white-space: normal;
  text-align: left;
  padding: 0px 42px;
  color: ${greyScoreCardTitleColor};
  > div:first-child {
    margin-bottom: 15px;
    font-weight: ${(props) => props.theme.bold};
    text-transform: uppercase;
    font-size: ${(props) => props.theme.questionTextlargeFontSize};
  }
`

export const RatingSection = styled.div`
  min-width: 175px;
  max-width: 400px;
  min-height: 100px;
  margin-right: 10px;
  padding: 5px 10px;
  white-space: normal;
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
  box-shadow: 0px 2px 5px ${boxShadowColor3};
  border-radius: 2px;
  background: ${({ selected }) => (selected ? lightGreen3 : 'inherit')};
  overflow: auto;
  > div:first-child {
    font-weight: ${(props) => props.theme.semiBold};
    margin-bottom: 7px;
    font-size: ${(props) => props.theme.questionTextsmallFontSize};
    text-transform: uppercase;
    display: flex;
    justify-content: space-between;
  }
  .points {
    text-transform: uppercase;
    color: ${themeColor};
    font-size: ${(props) => props.theme.keyboardFontSize};
    font-weight: ${(props) => props.theme.bold};
    margin-left: 5px;
  }
`

export const Container = styled.div`
  padding: 5px 0px;
`

export const CriteriaWrapper = styled.div`
  box-shadow: ${({ showError }) =>
    showError ? `0px 0px 2px 2px ${fadedRed}` : 'none'};
  border: ${({ showError }) => (showError ? `1px solid ${red}` : 'none')};
  margin-bottom: 10px;
  border-radius: 8px;
`

export const RatingContainer = styled.div`
  position: relative;
  padding: 0px 42px;
`

export const RatingScrollContainer = styled(PerfectScrollbar)`
  padding: 2px 3px 12px 3px;
  white-space: nowrap;
  display: flex;
`

export const NavBtn = styled.div`
  width: 35px;
  height: 35px;
  background-color: transparent;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  font-size: 26px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #878a91;

  &:hover {
    background-color: ${themeColor};
    color: #fff;
  }
`

export const PrevBtn = styled(NavBtn)`
  left: 4px;
`

export const NextBtn = styled(NavBtn)`
  right: 4px;
`

export const MessageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${themeColor};
  margin-top: 10px;
`
