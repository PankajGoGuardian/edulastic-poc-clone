import {
  desktopWidth,
  mobileWidthMax,
  tabGrey,
  themeColor,
  themeColorTagsBg,
  white,
} from '@edulastic/colors'
import { Avatar, Card, Checkbox, Input } from 'antd'
import styled from 'styled-components'

const { TextArea } = Input

export const StyledCardTwo = styled(Card)`
  display: ${(props) => (props.disabled ? 'none' : 'flex')};
  border-radius: 10px;
  border: 1px solid #dadae4;
  flex-direction: column;
  flex: 3;
  margin: 0px 0px 0px 15px;
  min-height: 100%;
  max-width: 250px;
  .ant-card-head {
    height: 60px;
  }
  .ant-card-head-title {
    padding: 13px 0px;
  }
  .ant-card-body {
    position: relative;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: calc(100% - 60px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .ant-input-disabled {
      padding: 4px 22px;
    }
  }

  @media screen and (min-width: ${desktopWidth}) {
    width: ${({ twoColLayout, showCollapseBtn }) =>
      showCollapseBtn ? 'auto' : twoColLayout?.second || '250px'};
    min-width: 250px;
  }
  @media (max-width: ${mobileWidthMax}) {
    margin-left: 0px;
    min-width: 100%;
    .ant-card-body {
      height: 200px;
    }
  }
`

export const StyledDivSec = styled.div`
  height: 50px;
  margin: 0px auto;
  display: flex;
  justify-content: center;
`

export const ScoreInputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  text-align: center;
`

export const ScoreInput = styled(Input)`
  width: 70%;
  height: 47px;
  border: 0px;
  background-color: #f8f8f8;
  border-radius: 2px;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  display: inline-block;
`

export const TextPara = styled.p`
  padding-left: 10px;
  padding-right: 15px;
  font-size: 28px;
  font-weight: 600;
  line-height: 47px;
  background-color: #ececec;
  height: 47px;
  width: 30%;
  border-radius: 0px 2px 2px 0px;
  display: inline-block;
`
export const GradingPolicyWrapper = styled.p`
  text-transform: uppercase;
  margin-top: ${({ mt }) => mt || '10px'};
  font-size: 9px;
  font-weight: 600;
  width: 100%;
  display: inline-block;
`

export const GradingPolicy = styled.span`
  color: ${tabGrey};
`

export const LeaveDiv = styled.div`
  margin: 0px 0px 10px;
  font-weight: 600;
  color: ${tabGrey};
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
`

export const TitleDiv = styled.div`
  font-weight: 400;
  color: ${tabGrey};
  font-size: 13px;
  display: flex;
  align-items: center;
`

export const FeedbackInput = styled(TextArea)`
  width: 100%;
  border: 0;
  border-radius: 2px;
  display: inline-block;
  background: #f8f8f8;
  display: ${({ isShowFeedbackInput }) => !isShowFeedbackInput && 'none'};
  padding-bottom: ${({ paddingBottom }) => paddingBottom || '4px'};
`
export const FeedbackDisplay = styled.div`
  width: 100%;
  padding: 4px 11px;
  overflow: hidden;
  background: #f8f8f8;
  border-radius: 2px;
  line-height: 1.5;
  max-height: 32px;
  min-height: 32px;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
`

export const UserAvatar = styled(Avatar)`
  background-color: ${themeColorTagsBg};
  width: 34px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  border-radius: 50%;
  color: ${themeColor};
  font-weight: 600;
  margin-right: 10px;
  font-size: 14px;
  text-transform: uppercase;
`

export const FeedbaclInputWrapper = styled.div`
  min-height: 74px;
  margin-top: 12px;
  position: relative;
`

export const FeedbackInputInnerWrapper = styled.div`
  background: ${white};
  position: ${({ isAbsolutePos }) => isAbsolutePos && 'absolute'};
  bottom: ${({ isAbsolutePos }) => isAbsolutePos && 0};
  width: 100%;
`

export const FeedbackInputInnerWrapper2 = styled.div`
  position: relative;
`

export const CustomCheckBox = styled(Checkbox)`
  position: absolute;
  bottom: 5px;
  left: 10px;
  font-size: 10px;
  font-weight: 600;
`
