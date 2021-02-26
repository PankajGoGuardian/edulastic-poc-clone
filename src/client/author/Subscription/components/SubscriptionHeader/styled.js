import { themeColorBlue, title, white, themeColor } from '@edulastic/colors'
import styled from 'styled-components'
import IMG17 from '../../static/bg-hero.svg'

export const TopBanner = styled.div`
  background: ${(props) => (props.isBannerVisible ? `url(${IMG17})` : white)};
  padding-bottom: ${(props) => (props.isBannerVisible ? '80px' : '0px')};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 0px 65px;
`
export const HeaderSubscription = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
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
  h2 {
    font-size: 18px;
    display: flex;
    align-items: center;
    margin: 0px;
    font-weight: bold;
    span {
      margin-left: 20px;
    }
  }
`
export const ModalBody = styled.div`
  font-size: 14px;
  color: #304050;
`
export const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`
export const Boxes = styled.div`
  width: 210px;
  height: 210px;
  border: 2px solid #dadae4;
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

export const BannerContent = styled.div`
  min-height: 200px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  h3 {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 3px;
  }
  p {
    font-size: 14px;
    margin-bottom: 15px;
  }
`

export const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  .free {
    color: ${themeColor};
    padding-right: 25px;
    padding-left: 15px;
  }
  .plan {
    color: #97a4c1;
  }
  .free,
  .plan {
    height: 24px;
    font-size: 10px;
    display: flex;
    align-items: center;
    text-transform: uppercase;
  }
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
export const PlanText = styled.span`
  font-size: 14px !important;
  font-weight: bold;
`
