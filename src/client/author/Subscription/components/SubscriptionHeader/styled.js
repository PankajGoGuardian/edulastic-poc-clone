import {
  themeColorBlue,
  title,
  white,
  themeColor,
  lightGrey16,
  darkGrey2,
  lightBlue11,
  borderGrey4,
} from '@edulastic/colors'
import styled from 'styled-components'

export const TopBanner = styled.div`
  height: 52px;
`

export const HeaderSubscription = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-bottom: 1px solid ${lightGrey16};
  height: 52px;
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  z-index: 10;
  padding: 0px 30px 0px 100px;
  .ant-dropdown-menu-item {
    padding: 0px;
    span {
      padding: 5px 12px;
      display: inline-block;
    }
    a {
      color: ${white};
      margin: 0px;
      padding: 0px;
      &:hover {
        color: ${white};
      }
    }
  }
`
export const Title = styled.div`
  display: flex;
  align-items: center;
  h2 {
    font-size: 18px;
    display: flex;
    align-items: center;
    margin: 0px 25px 0px 0px;
    font-weight: bold;
    span {
      margin-left: 20px;
    }
  }
`
export const ModalBody = styled.div`
  font-size: 14px;
  color: ${darkGrey2};
`
export const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`
export const Boxes = styled.div`
  width: 210px;
  height: 210px;
  border: 2px solid ${borderGrey4};
  border-radius: 10px;
  color: ${title};
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-direction: column;
  svg {
    height: 85px;
    margin-bottom: 30px;
  }
`

export const LearnMore = styled.div`
  font-size: 11px;
  color: ${themeColorBlue};
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 600;
`
export const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  .ant-dropdown-menu {
    background: ${themeColorBlue};
    li {
      color: ${white};
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
  }
`
export const CustomLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${themeColorBlue};
  font-size: 11px;
  height: 24px;
  text-transform: uppercase;
  font-weight: 600;
  padding-right: 25px;
  cursor: pointer;
`
export const CartButton = styled(CustomLink)`
  padding-right: 0px;
  padding-left: 25px;
  border-left: 1px solid ${lightGrey16};
`

export const UserStatus = styled.div`
  display: flex;
  align-items: center;
`
export const PlanText = styled.span`
  display: flex;
  align-items: center;
  font-size: 11px !important;
  font-weight: bold;
  text-transform: uppercase;
  &:not(.plan) {
    color: ${themeColor};
    padding-right: 25px;
    padding-left: 15px;
  }
  &.plan {
    color: ${lightBlue11};
  }
`
export const IconWrapper = styled.div`
  position: relative;
  margin-right: 5px;
  width: 34px;
  span {
    color: ${title};
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 1px;
    font-size: 11px;
  }
`
