import { Pagination, Card, Col, Radio } from 'antd'
import styled from 'styled-components'
import { FlexContainer } from '@edulastic/common'
import {
  mobileWidth,
  largeDesktopWidth,
  tabletWidth,
  red,
  themeColor,
  lightGreen4,
  extraDesktopWidth,
  extraDesktopWidthMax,
  yellow1,
  mediumDesktopExactWidth,
  title,
  brownDark,
} from '@edulastic/colors'
import { IconExclamationMark, IconScratchPad } from '@edulastic/icons'

import { themes } from '../../../../theme'

const classBoardTheme = themes.default.classboard
const { pastDueTagBackground, pastDueTagColor } = themes.default.default

export const StyledFlexContainer = styled(FlexContainer)`
  width: 100%;
  margin: 0px auto;
`

export const ExclamationMark = styled(IconExclamationMark)`
  margin-right: 5px;
  width: 13px;
  height: 13px;
`

export const StyledCardContiner = styled(FlexContainer)`
  flex-wrap: wrap;
  width: 100%;
  justify-content: flex-start;
  position: relative;
`

export const DisneyCard = styled.div``

export const StyledPagination = styled(Pagination)`
  display: flex;
  justify-content: flex-end;
  padding: 20px 0;
`

export const MainDiv = styled.div`
  display: flex;
  justify-content: space-between;
`

export const MainDivLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  .ant-card {
    margin-right: 4%;
  }
`

export const PerfomanceSection = styled.div`
  width: 100%;
`

export const StyledCard = styled(Card)`
  margin-top: 15px;
  margin-right: 15px;
  border-radius: 10px;
  border: 1px solid #dadae4;
  width: 100%;
  cursor: ${(props) => (props.isClickEnable ? 'pointer' : 'default')};
  transition: all 0.2s ease-in;
  .ant-card-body {
    padding: 20px;
  }
  &:hover {
    box-shadow: ${(props) =>
      props.isClickEnable
        ? '8px 4px 10px rgba(0,0,0,0.1)'
        : '0px 3px 10px rgba(0,0,0,0.1)'};
  }

  @media (min-width: ${mobileWidth}) and (max-width: 767px) {
    width: calc((100% - 15px) / 2);
    &:nth-child(2n) {
      margin-right: 0px;
    }
  }
  @media (min-width: ${tabletWidth}) and (max-width: 1199px) {
    width: calc((100% - 30px) / 3);
    &:nth-child(3n) {
      margin-right: 0px;
    }
  }
  @media (min-width: ${largeDesktopWidth}) and (max-width: 1599px) {
    width: calc((100% - 45px) / 4);
    &:nth-child(4n) {
      margin-right: 0px;
    }
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    width: calc((100% - 60px) / 5);
    &:nth-child(5n) {
      margin-right: 0px;
    }
  }
`

export const Space = styled.div`
  display: inline-block;
  height: 30px;
`

export const PagInfo = styled.span`
  font-weight: 600;
  font-size: 10px;
  color: ${themeColor};
  text-overflow: ellipsis;
  /* width: 50%; */
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  user-select: none;

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: 11px;
  }
  @media (max-width: ${mobileWidth}) {
    width: 100%;
    text-align: center;
  }
`

export const GSpan = styled.span`
  font-size: 10px;
`

export const PaginationInfoF = styled(StyledFlexContainer)`
  flex: 100%;
  align-items: center;
  margin-bottom: 28px;
  align-items: flex-start;
`

export const PaginationInfoS = styled(StyledFlexContainer)`
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 15px;
`

export const PaginationInfoT = styled(StyledFlexContainer)`
  flex-wrap: wrap;
  justify-content: flex-start;
  min-height: 15px;
  &.questions-grid {
    @media (min-width: 1024px) {
      display: grid;
      grid-template-columns: 22px 22px 22px 22px 22px 22px 22px 22px 22px 22px;
      grid-gap: 1px;
    }
  }
`

export const CircularDiv = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: ${themeColor};
  cursor: ${(props) => (props.isLink ? 'pointer' : 'default')};
  font-weight: 600;
  line-height: 38px;
  background-color: ${lightGreen4};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;

  @media (min-width: ${extraDesktopWidth}) {
    margin-right: 18px;
  }
`

export const StyledFlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-right: 0px;
`

export const StyledName = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 70%;
  word-break: break-word;
`

// export const StyledCheckbox = styled(Checkbox)`
//   font-size: 0.7em;
//   color: ${classBoardTheme.headerCheckboxColor};
//   align-self: center;
//   margin-left: auto;
// `;

const SquareColorDiv = styled.div`
  display: inline-block;
  width: 22px;
  height: 8px;
  margin: 1px 1px 0px 0px;
`

export const SquareColorDivGreen = styled(SquareColorDiv)`
  background-color: #5eb500;
`

export const SquareColorDivGray = styled(SquareColorDiv)`
  background-color: rgb(106, 115, 127);
`

export const SquareColorBlue = styled(SquareColorDiv)`
  background-color: rgb(56, 150, 190);
`

export const SquareColorDisabled = styled(SquareColorDiv)`
  background-color: ${classBoardTheme.CardColor};
`

export const SquareColorDivPink = styled(SquareColorDiv)`
  background-color: #f35f5f;
`

export const SquareColorDivYellow = styled(SquareColorDiv)`
  background-color: ${yellow1};
`
export const SquareColorDivlGrey = styled(SquareColorDiv)`
  background-color: #e8e8e8;
`

export const SquareColorDivBrown = styled(SquareColorDiv)`
  background-color: ${brownDark};
`

export const StyledParaF = styled.p`
  font-size: 12px;
  line-height: 12px;
  font-weight: 600;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  cursor: ${(props) =>
    props.isLink && !props.disabled ? 'pointer' : 'default'};
  color: ${title};

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: 16px;
    line-height: 18px;
  }
`

export const StyledParaS = styled.p`
  font-size: 10px;
  line-height: 10px;
  font-weight: bold;
  color: ${({ color }) => color || classBoardTheme.CardCircularColor};
  text-transform: capitalize;
  cursor: ${(props) => (props.isLink ? 'pointer' : 'default')};
  display: flex;
  align-items: center;

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: 11px;
  }
`

export const StyledColorParaS = styled.p`
  font-size: 0.6em;
  font-weight: bold;
  color: ${red};
  text-transform: capitalize;
  display: flex;
  align-items: center;
`

export const StyledParaFF = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #7c848e;
`
export const ColorSpan = styled.span`
  color: ${classBoardTheme.CardCircularColor};
`

export const StyledParaSS = styled.p`
  display: flex;
  font-size: 20px;
  font-weight: bold;
  color: #434b5d;
  text-overflow: ellipsis;
  font-size: 16px;
`

export const StyledParaSSS = styled.p`
  font-size: 16px;
  font-weight: 600;
  margin-left: 18px;
  color: #5eb500;
  text-overflow: ellipsis;
  @media (max-width: ${mobileWidth}) {
    margin-left: 0px;
  }
`

export const SpaceDiv = styled.div`
  display: inline-block;
  width: 20px;
`

export const StyledDivLine = styled.div`
  width: 101%;
  height: 0.03em;
  border: 1px solid #f4f3f3;
  margin-top: 20px;
`

export const RightAlignedCol = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: auto;
`

export const ScratchPadIcon = styled(IconScratchPad)`
  margin: 2px 0;
  fill: ${themeColor};
  &:hover {
    fill: ${themeColor};
  }
`

export const StyledIconCol = styled(Col)`
  min-width: 19px;
  padding: 2px;
  text-align: center;
`

export const StatusRow = styled.div`
  span {
    height: 18px;
    overflow: hidden;
    flex-basis: 50%;
    background: ${pastDueTagBackground};
    color: ${pastDueTagColor};
    font-size: 9px;
    text-transform: uppercase;
    font-weight: bold;
    line-height: 16px;
    padding: 3px 12px;
    border-radius: 5px;
    margin-top: 3px;
  }
`

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`
export const StyledRadioBtn = styled(Radio)`
  .ant-radio .ant-radio-inner {
    border: 1.5px solid ${themeColor};
  }

  .ant-radio .ant-radio-inner::after {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .ant-radio.ant-radio-checked .ant-radio-inner {
    border-color: ${themeColor} !important;
  }

  .ant-radio.ant-radio-checked .ant-radio-inner::after {
    background-color: ${themeColor} !important;
  }

  .ant-radio:hover .ant-radio-inner {
    border-color: ${themeColor} !important;
  }
`
