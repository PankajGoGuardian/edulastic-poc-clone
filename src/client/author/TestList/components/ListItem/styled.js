import {
  darkGrey,
  extraDesktopWidthMax,
  fadedGrey,
  lightGrey,
  red,
  themeColor,
  white,
  themeColorBlue,
} from '@edulastic/colors'
import { Card } from '@edulastic/common'
import IconELogo from '@edulastic/icons/src/IconELogo'
import IconPearAssessCertifiedLogo from '@edulastic/icons/src/IconPearAssessCertifiedLogo'
import { Col, Rate, Row } from 'antd'
import styled from 'styled-components'
import {
  testStatusBackgroundColor as backgroundColor,
  testStatusTextColor as textColor,
} from '../../../src/constants/colors'
import { StyledLink } from '../Item/styled'
import { isPearDomain } from '../../../../../utils/pear'

const CertifiedIcon = isPearDomain ? IconPearAssessCertifiedLogo : IconELogo

export const Container = styled.div`
  display: flex;
  padding: 20px 0px 15px;
  border-bottom: 1px solid ${fadedGrey};
`

export const ListCard = styled(Card)`
  width: 115px;
  border-radius: 5px;
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
  .ant-card-body,
  .ant-card-head,
  .ant-card-head-title {
    padding: 0;
  }
`

export const Inner = styled.div`
  padding: 0px 0px 0px 25px;
  width: 100%;
  display: inline-block;
  vertical-align: middle;
`

export const Outer = styled.div`
  display: flex;
  justify-content: space-between;
`

export const Description = styled.div`
  font-size: 12px;
  color: #444444;
  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 13px;
  }
`

export const TagsWrapper = styled(Col)`
  display: flex;
  align-items: center;
`

export const TestStatus = styled.span`
  background: ${({ status }) => backgroundColor[status]};
  padding: ${({ view }) => (view === 'tile' ? ' 2px 0px' : ' 2px 10px')};
  margin-bottom: 3px;
  border-radius: 5px;
  font-size: 9px;
  color: ${({ status }) => textColor[status]};
  text-transform: uppercase;
  font-weight: bold;
  line-height: 16px;
  width: 77px;
  justify-content: center;
`

export const EdulasticVerified = styled(CertifiedIcon)`
  ${(props) => {
    if (props.bottom) {
      return `margin-left:10px;`
    }
    return `position: absolute;
      top: 10px;
      right: 10px;`
  }};
`

export const StatusWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
`

export const UsageWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

export const Author = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${darkGrey};
  display: inline-flex;
  align-items: center;
  max-width: 100px;
  margin-left: 10px;
  svg {
    width: 14px;
    height: 14px;
    fill: ${darkGrey};
    vertical-align: middle;
    &:hover {
      fill: ${darkGrey};
    }
  }
`

export const AuthorName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ButtonWrapper = styled.div`
  position: absolute;
  height: 100%;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  display: none;
  background: rgba(0, 0, 0, 0.5);
`

export const Header = styled.div`
  height: 65px;
  width: 100%;
  position: relative;
  background: url(${(props) =>
    props.src
      ? props.src
      : 'https://cdn2.edulastic.com/default/default-test-1.jpg'});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  border-radius: 5px;
  &:hover {
    .showHover {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
`

export const Stars = styled(Rate)`
  font-size: 10px;
  position: absolute;
  left: 10px;
  top: 5px;
  z-index: 1;
  .ant-rate-star {
    margin-right: 3px;
  }
`

export const StyledLinkExt = styled(StyledLink)`
  padding-right: 15px;
`

export const ItemInformation = styled(Col)`
  text-align: right;
`

export const TypeContainer = styled.div`
  display: flex;
  margin-top: 15px;
  font-size: 13px;
  font-weight: 600;
  color: #444444;

  div:first-child {
    width: 250px;
    margin-left: 10px;

    & > span {
      padding: 4px 15px;
    }
  }
`

export const IconWrapper = styled.div`
  max-width: 100px;
  display: inline-flex;
  align-items: center;
  margin-left: 30px;
`

export const IconText = styled.span`
  font-size: 11px;
  color: ${darkGrey};
`

export const CardIdWrapper = styled.div`
  color: ${darkGrey};
  font-size: 11px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  max-width: 100px;
  margin-left: 30px;
  svg {
    fill: ${darkGrey};
    width: 13px;
    height: 13px;
    &:hover {
      fill: ${darkGrey};
    }
  }
`
export const CardId = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ViewButtonWrapper = styled(Col)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 280px;
`

export const StyledModuleName = styled.div`
  background: ${fadedGrey};
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 170px;
  padding: 10px;
`

export const ContentWrapper = styled(Row)`
  width: 100%;
`

export const ViewButton = styled.div`
  width: 120px;
  float: right;
  font-size: 12px;
  color: ${themeColor};
  background: white;
  margin-left: 10px;
  padding: 8px;
  box-shadow: 0px 1px 1px 1px ${fadedGrey};
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
  margin-top: 8px;
  cursor: pointer;
  &:hover {
    background: ${lightGrey};
  }
`

export const AddButton = styled.div`
  width: 120px;
  float: right;
  font-size: 12px;
  color: ${(props) => (props.isTestAdded ? red : themeColor)};
  background: white;
  padding: 8px;
  box-shadow: 0px 1px 1px 1px ${fadedGrey};
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  margin-top: ${(props) => (props.windowWidth < 1485 ? '10px' : '0px')};
  &:hover {
    background: ${lightGrey};
  }
`

export const Footer = styled(Col)`
  margin-top: 15px;
`

export const DynamicIconWrapper = styled.span`
  display: inline-flex;
  margin: auto 10px;
`

export const AddRemove = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  width: 40px;
  height: 36px;
  color: ${({ selectedToCart }) => (selectedToCart ? red : themeColor)};
  border: 1px solid
    ${({ selectedToCart }) => (selectedToCart ? red : themeColor)};
  border-radius: 5px;
  &:hover {
    border: 1px solid
      ${({ selectedToCart }) => (selectedToCart ? white : themeColorBlue)};
  }
  svg {
    fill: ${({ selectedToCart }) => (selectedToCart ? red : themeColor)};
    margin: auto;
  }
  &:hover,
  &:focus {
    color: ${({ selectedToCart }) => (selectedToCart ? red : themeColor)};
    border-color: ${({ selectedToCart }) =>
      selectedToCart ? red : themeColor};
    svg {
      fill: ${({ selectedToCart }) => (selectedToCart ? red : themeColor)};
    }
  }
`
