import {
  backgroundGrey,
  darkGrey2,
  greyThemeLight,
  greyThemeLighter,
  largeDesktopWidth,
  lightGrey4,
  lightGrey9,
  mobileWidth,
  mobileWidthLarge,
  publishStatusColor,
  secondaryTextColor,
  tabletWidth,
  themeColor,
  white,
} from '@edulastic/colors'
import { Button, Card, FlexContainer } from '@edulastic/common'
import { Typography } from 'antd'
import styled from 'styled-components'

const { Paragraph } = Typography

export const Container = styled.div`
  padding: 20px 30px;
  left: 0;
  right: 0;
  height: 100%;
  overflow: auto;
`

export const Main = styled.div`
  flex: 1;
  width: 100%;
`

export const AssignButton = styled(Button)`
  position: relative;
  min-width: 130px;
  height: 45px;
  color: ${themeColor};
  border-radius: 3px;
  background: ${white};
  justify-content: space-around;
  margin-left: 20px;
  border-color: ${themeColor};
`

export const StyledCard = styled(Card)`
  border-radius: 5;
  overflow-x: auto;

  .ant-card-body {
    padding: 24px;
  }

  @media (max-width: ${tabletWidth}) {
    display: none;
  }
`

export const FlexContainerWrapper = styled(FlexContainer)`
  width: 1010px;
  min-height: 300px;
  background-color: ${white};
  margin: 50px auto 0px;
  padding: 20px;
  align-items: flex-start;

  @media (max-width: ${largeDesktopWidth}) {
    width: 100%;
  }
  @media (max-width: ${tabletWidth}) {
    padding: 0px;
  }
`

export const FlexContainerWrapperLeft = styled(FlexContainer)`
  flex-direction: column;
  justify-content: flex-start;
  width: 320px;
  padding-right: 15px;
  .anticon-star {
    svg {
      width: 11px;
      height: 11px;
    }
  }
  .ant-card {
    &.ant-card-bordered {
      width: 264px;
    }
    .ant-card-head-wrapper {
      .ant-card-head-title {
        & > div {
          height: 97px;
        }
      }
    }
  }
  @media (max-width: ${tabletWidth}) {
    width: 300px;
    padding-right: 35px;
  }
  @media (max-width: ${mobileWidthLarge}) {
    width: 100%;
    padding-right: 0px;
    padding-bottom: 20px;
  }
`
export const FlexContainerWrapperRight = styled(FlexContainer)`
  width: calc(100% - 320px);
  justify-content: ${(props) =>
    props.isAssignSuccess ? 'flex-start' : 'center'};
  align-items: flex-start;
  flex-direction: column;
  padding-left: 15px;

  @media (max-width: ${tabletWidth}) {
    width: calc(100% - 300px);
    padding: 0px;
  }
  @media (max-width: ${mobileWidthLarge}) {
    width: 100%;
  }
`

export const StyledFlexContainer = styled(FlexContainer)`
  @media (max-width: ${tabletWidth}) {
    width: 100%;
    background-color: ${white};
    display: flex;
    justify-content: space-around;
  }

  @media (max-width: ${mobileWidth}) {
    width: 100%;
    background-color: ${white};
    display: flex;
    justify-content: space-around;
  }

  @media (max-width: ${tabletWidth}) {
    background-color: ${white};
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    width: 100%;
  }
`

export const SecondHeader = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.isMobileSize ? 'row' : 'column')}
  justify-content: space-between;

  & > div > .ant-btn {
    background: transparent;
    height: 24px;
    margin-left: 17px;
    & > button {
      height: 24px;
      margin-top: -1px;
    }
  }
`

export const FlexTitle = styled.div`
  display: flex;
  font-weight: 800;
  font-size: 18px;
  margin-bottom: 10px;
`

export const FlexTextWrapper = styled.div`
  font-size: 14px;
  margin-bottom: 35px;
  color: ${darkGrey2};
  opacity: 1;
  background-color: ${(props) => props.isAsyncAssign && publishStatusColor};
  font-weight: ${(props) => props.isAsyncAssign && 900};
`
export const FlexText = styled.div`
  margin-bottom: 8px;
  color: ${darkGrey2};
`

export const FlexShareContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`
export const FlexShareTitle = styled.div`
  display: flex;
  font-weight: 800;
  margin-bottom: 10px;
  text-transform: uppercase;
  color: ${secondaryTextColor};
  font-size: 11px;
`

export const FlexShareWithBox = styled.div`
  display:flex;
  border: 1px solid ${greyThemeLight};
  height:40px;
  width:${(props) => props.width || '100%'}; 
  margin-bottom:10px;
  justify-content:space-between;
  padding:8px 10px
  box-shadow: 0px 5px 6px ${lightGrey4};
  background: ${greyThemeLighter};
`

export const FlexShareBox = styled.div`
  display: flex;
  border: 1px solid ${greyThemeLight};
  height: 40px;
  width: 100%;
  padding: 8px 18px;
  background-color: ${greyThemeLighter};
  color: ${themeColor};
  justify-content: space-between;
  margin-bottom: 10px;
`

export const IconWrapper = styled.div`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
`

export const ShareUrlDiv = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: calc(100% - 80px);
  display: inline-block;
  font-weight: 500;
`

export const TitleCopy = styled(Paragraph)`
  &.ant-typography {
    color: ${lightGrey9};
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 13px;
    align-items: center;
    margin-bottom: 0;
  }
  button {
    margin-right: 10px;
  }
  i.anticon.anticon-copy {
    display: flex;
    align-items: center;
    &:after {
      content: 'COPY';
      font-size: 12px;
      color: ${themeColor};
      margin-left: 3px;
      font-size: 11px;
    }
  }
  svg {
    width: 15px;
    height: 15px;
    color: ${themeColor};
  }
`

export const ImageWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100px;
  margin-right: 0px;
  border-radius: 5px;
  background: url(${(props) => props.imgUrl || props.src});
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  margin-bottom: 20px;
`

export const FlexWrapperUrlBox = styled.div`
  display: flex;
  flex-direction: column;
  background: ${backgroundGrey};
  padding: 13px 23px 23px 17px;
`

export const FlexWrapperClassroomBox = styled.div`
  display: flex;
  flex-direction: row;
  background: ${backgroundGrey};
  padding: 13px 23px 23px 17px;
  margin-bottom: 13px;
`

export const FlexTitleBox = styled.div`
  flex: 1;
`

export const FlexShareMessage = styled.div`
  margin-top: 10px;
`
