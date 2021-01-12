import { themeColorBlue, title, white } from '@edulastic/colors'
import styled from 'styled-components'
import IMG17 from '../../static/bg-hero.svg'

export const TopBanner = styled.div`
  background: url(${IMG17});
  padding-bottom: 80px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 0px 65px;
`
export const HeaderSubscription = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
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
export const AddonList = styled.div`
  margin-top: 25px;
`
export const Total = styled.div`
  border-top: 1px solid #dddddd;
  margin-top: 15px;
  padding-top: 15px;
`
export const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 600;
  color: ${title};
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
    color: #1ab395;
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

export const ActionBtnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  display: none;
`
