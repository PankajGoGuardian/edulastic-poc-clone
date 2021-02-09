import { greenThird, title } from '@edulastic/colors'
import { Icon } from 'antd'
import styled from 'styled-components'

export const ContentWrapper = styled.div`
  padding: 15px 30px;
`
export const GreyBox = styled.div`
  background: #f3f3f3;
  border-radius: 10px;
  width: calc(50% - 10px);
  padding: 20px 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`
export const LeftCol = styled.div`
  h4 {
    font-size: 14px;
    color: ${title};
    font-weight: 700;
  }
  & > span {
    font-size: 10px;
    color: #878a91;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`
export const RightCol = styled.div`
  display: flex;
`
export const Countbox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 25px;
  border-right: 1px solid #dddddd;
  &:last-child {
    border: none;
    padding-right: 0px;
  }
  span {
    font-size: 11px;
    color: ${title};
    font-weight: 600;
    text-transform: uppercase;
  }
`
export const Count = styled.div`
  color: ${greenThird};
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
`
export const CheckboxWrpper = styled.div`
  padding: 15px 0px 0px;
`
export const StatusDiv = styled.div`
  display: flex;
  align-items: center;
`

export const StyledStatusIcon = styled(Icon)`
  font-size: 18px;
  margin-right: 10px;
  color: ${(props) => props.iconColor};
`
