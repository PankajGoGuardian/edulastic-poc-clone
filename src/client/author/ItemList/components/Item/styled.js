import {
  backgroundGrey,
  greenPrimary,
  greyDarken,
  labelGrey2,
  lightGrey,
  lightGreySecondary,
  red,
  smallDesktopWidth,
  tabletWidth,
  textColor,
  themeColor,
  themeColorTagsBg,
  themeLightGrayBgColor,
  themeLightGrayColor,
  title,
  white,
  themeColorBlue,
  textBlackColor,
  lightGrey11,
} from '@edulastic/colors'
import { EduButton } from '@edulastic/common'
import { IconHeart, IconId, IconUser, IconUsers } from '@edulastic/icons'
import { Tag, Button, Col, Row } from 'antd'
import styled, { css } from 'styled-components'

const Style = css`
  background: transparent !important;
  font-family: ${(props) => props.theme.defaultFontFamily} !important;
  font-size: ${(props) => props.theme.questionTextnormalFontSize} !important;
  color: ${(props) => props.theme.questionTextColor} !important;
  font-weight: normal !important;
  font-style: normal !important;
  text-decoration: none;
`

export const StimulusWrapper = styled.span`
  & *:not(.edu) {
    ${Style}
  }
`
const ButtonStyleCss = css`
  @media (max-width: ${tabletWidth}) {
    &.ant-btn {
      justify-content: center;
      width: 40px;
      height: 40px;
      padding: 0;
      span {
        display: none;
      }
      svg {
        margin: 0px;
      }
    }
  }
`
export const Link = styled.a`
  font-size: ${(props) => props.theme.questionTextnormalFontSize};
  padding-right: 20px;
  font-weight: 700;
  line-height: 20px;
  font-weight: bold;
  text-decoration: none;
  color: #333333;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 3;

  :hover {
    color: #333333;
  }

  p {
    font-size: 15px;
  }

  img {
    display: block;
    width: 200px;
    max-width: 100%;
  }
`

export const Container = styled.div`
  padding: 12px 0px 8px;
  border-bottom: 1px solid #dadae4;

  @media (max-width: ${tabletWidth}) {
    flex-direction: column;

    &:not(:first-child) {
      border-top: 0;
      position: relative;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 28px;
        right: 28px;
        height: 1px;
        background: ${lightGreySecondary};
      }
    }
  }
`

export const Question = styled.div`
  display: flex;

  & p {
    font-size: 13px;
  }

  table tr td img {
    max-height: 100%;
    max-width: 100%;
  }

  @media (max-width: ${tabletWidth}) {
    width: 100%;
    margin-bottom: 15px;
    text-align: center;
  }
`

export const QuestionContent = styled.div`
  flex: 1;
  line-height: 1;
  width: calc(100% - 180px); /* 130px --> width of the Add btn */
  margin-right: 10px;

  @media (max-width: ${tabletWidth}) {
    text-align: left;
  }
`

export const ViewButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: auto;
  position: relative;

  @media (max-width: ${tabletWidth}) {
    width: 50%;
    display: inline-flex;
    justify-content: flex-end;
    padding-right: 5px;
  }
`

const ButtonStyle = styled(EduButton)`
  ${ButtonStyleCss}
`

export const AddRemoveBtnContainer = styled.div`
  .ant-btn.ant-btn-primary {
    opacity: 0.5;
    filter: grayscale(1);
  }
`

export const AddRemoveBtn = styled(ButtonStyle)`
  &.ant-btn {
    color: ${({ isAddOrRemove }) =>
      isAddOrRemove ? themeColor : red} !important;
    border-color: ${({ isAddOrRemove }) =>
      isAddOrRemove ? themeColor : red} !important;
    background: white !important;
    margin-top: 15px;
    &:not(.disabled):hover {
      border-color: ${({ isAddOrRemove }) =>
        isAddOrRemove ? themeColorBlue : red} !important;
      background: ${({ isAddOrRemove }) =>
        isAddOrRemove ? themeColorBlue : white} !important;
      color: ${({ isAddOrRemove }) => (isAddOrRemove ? white : red)} !important;
    }
    @media (max-width: ${tabletWidth}) {
      margin: 0px;
      width: auto;
      padding: 0px 15px;
      span {
        display: block;
      }
      &:hover,
      &:focus,
      &:active {
        border: 1px solid ${(props) => (props.isAddOrRemove ? themeColor : red)} !important;
        color: ${(props) => (props.isAddOrRemove ? themeColor : red)};
      }
    }
  }
`

export const AddRemoveBtnPublisher = styled(AddRemoveBtn)`
  &.ant-btn {
    background: ${({ isAddOrRemove }) =>
      isAddOrRemove ? 'inherit' : backgroundGrey};
    border: ${({ isAddOrRemove }) =>
      `1px solid ${isAddOrRemove ? themeColor : backgroundGrey}`} !important;
    color: ${({ isAddOrRemove }) => (isAddOrRemove ? themeColor : labelGrey2)};
    i {
      svg {
        width: 12px;
        height: 12px;
        fill: ${title};
      }
    }

    @media (max-width: ${tabletWidth}) {
      &:hover,
      &:focus,
      &:active {
        border: 1px solid
          ${({ isAddOrRemove }) =>
            isAddOrRemove ? themeColor : backgroundGrey} !important;
        color: ${({ isAddOrRemove }) =>
          isAddOrRemove ? themeColor : labelGrey2};
      }
    }
  }
`

export const MoreInfo = styled(ButtonStyle)`
  background: ${(props) => (props.isOpenedDetails ? themeColor : white)};
  color: ${(props) => (props.isOpenedDetails ? white : themeColor)};
  margin-right: 10px;
  transition: all 0.3s ease;
  &:focus,
  &:hover {
    background: ${(props) => (props.isOpenedDetails ? themeColor : white)};
    svg {
      fill: ${(props) => (props.isOpenedDetails ? white : themeColor)};
    }
  }
  svg {
    fill: ${(props) => (props.isOpenedDetails ? white : themeColor)};
    transition: all 0.3s ease;
    transform: ${(props) =>
      props.isOpenedDetails ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`

export const ViewButtonStyled = styled(Button)`
  ${ButtonStyleCss};
  height: 36px;
  background-color: ${white};
  color: ${themeColor};
  display: flex;
  align-items: center;
  padding: 0px 40px 0px 15px;
  svg {
    margin-right: 25px;
    fill: ${themeColor};
  }
  &:hover,
  &:focus {
    background-color: ${lightGrey};
    color: ${themeColor};
    svg {
      fill: ${themeColor};
    }
  }
`

export const CheckboxWrapper = styled.div`
  padding: 0px;
  height: auto;
  width: auto;
  border: none;
  box-shadow: none;
  &:hover,
  &:focus {
    color: ${({ selectedToCart }) => (selectedToCart ? red : themeColor)};
  }
`

export const AddRemoveButton = styled(ButtonStyle)`
  &.ant-btn {
    margin-left: 10px;
    color: ${({ selectedToCart }) => (selectedToCart ? red : themeColor)};
    border-color: ${({ selectedToCart }) =>
      selectedToCart ? red : themeColor} !important;
    background: white !important;
    &:hover {
      border-color: ${({ selectedToCart }) =>
        selectedToCart ? white : themeColorBlue} !important;
    }
    svg {
      fill: ${({ selectedToCart }) =>
        selectedToCart ? red : themeColor} !important;
    }
    &:hover,
    &:focus {
      background: ${lightGrey};
      color: ${({ selectedToCart }) => (selectedToCart ? red : themeColor)};
      border-color: ${({ selectedToCart }) =>
        selectedToCart ? red : themeColor} !important;
      svg {
        fill: ${({ selectedToCart }) => (selectedToCart ? red : themeColor)};
      }
    }
  }
`

export const Detail = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 8px;
  min-height: 40px;

  @media (max-width: ${tabletWidth}) {
    margin: 0;
    width: 50%;
    display: inline-flex;
    min-height: 0;
  }
`

export const TypeCategory = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;

  @media (max-width: ${tabletWidth}) {
    display: block;
    width: 100%;
    margin: 0;
    position: relative;
    top: 0px;
  }
`

export const DetailCategory = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  svg {
    max-width: 16px;
    max-height: 14px;
    fill: ${themeLightGrayColor};
    &:hover {
      fill: ${themeLightGrayColor};
    }
  }
  .like-icon {
    svg {
      max-width: unset;
      max-height: unset;
      fill: ${(props) => (props.isLiked ? '#ca481e' : themeLightGrayColor)};
      &:hover {
        fill: ${(props) => (props.isLiked ? 'black' : '#ca481e')};
      }
    }
  }

  .rubric-icon {
    cursor: pointer;
  }

  @media (max-width: ${smallDesktopWidth}) {
    margin-left: 10px;
  }
  @media (max-width: ${tabletWidth}) {
    width: auto;
    margin-right: 0px;
    margin-top: 15px;
    margin-left: 0px;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    flex-basis: 20%;
    & > span {
      color: ${themeLightGrayColor};
      line-height: 14px;
      font-weight: bold;
    }
    & > div {
      justify-content: center;
    }
  }
`

export const CategoryName = styled.span`
  display: flex;
  align-items: baseline;
  font-size: ${(props) => props.theme.smallLinkFontSize};
  font-weight: 600;
  margin-right: ${(props) => (props.type === 'like' ? '0px' : '5px')};
  color: ${themeLightGrayColor};

  @media (max-width: ${tabletWidth}) {
    display: block;
    font-size: ${(props) => props.theme.standardFont};
    margin: 0 auto;
  }
`

export const CategoryContent = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: ${tabletWidth}) {
    justify-content: flex-start;
    width: 100%;
    margin: 0px;
  }
`

export const Label = styled(Tag)`
  padding: 2px 10px;
  margin: 0px 3px 3px 0px;
  border: none;
  font-weight: 700;
  background: ${themeLightGrayBgColor};
`

export const Count = styled.div`
  display: inline-flex;
  margin-left: 0;
  font-size: 12px;
  font-weight: 700;
  line-height: 24px;
  margin-right: 10px;
  color: ${greyDarken};

  @media (max-width: ${tabletWidth}) {
    display: none;
  }
`

export const LabelText = styled.span`
  font-size: 10px;
  letter-spacing: 0.1px;
  text-align: center;
  color: ${textColor};
  text-transform: uppercase;
  @media (max-width: ${tabletWidth}) {
    letter-spacing: 0.2px;
    font-weight: bold;
    font-size: 10px;
  }
`

export const Text = styled.span`
  display: flex;
  align-items: center;
  font-size: ${(props) => props.theme.smallLinkFontSize};
  font-weight: 600;
  color: ${themeLightGrayColor};

  @media (max-width: ${tabletWidth}) {
    margin-top: 8px;
    font-size: ${(props) => props.theme.standardFont};
  }
`

export const Categories = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;

  @media (max-width: ${tabletWidth}) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: nowrap;
    width: 100%;
    margin: 0;
  }
`

export const ShareIcon = styled(IconUsers)`
  display: flex;
  align-items: center;
  fill: ${themeColor};
`

export const HeartIcon = styled(IconHeart)`
  display: flex;
  align-items: center;
  fill: ${themeColor};
`

export const UserIcon = styled(IconUser)`
  display: flex;
  align-items: center;
  fill: ${themeColor};
`

export const IdIcon = styled(IconId)`
  display: flex;
  align-items: center;
  fill: ${themeColor};
`

export const StandardContent = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${tabletWidth}) {
    flex-wrap: wrap;
    margin-right: 0;
    align-items: center;
  }
`

export const LabelStandard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  height: 24px;
  padding: 6px 14px;
  margin-right: 8px;
  border-radius: 5px;
  background: ${themeColorTagsBg};

  span {
    font-size: 10px;
    font-weight: 700;
    font-weight: bold;
    letter-spacing: 0.2px;
    text-transform: uppercase;
    color: ${themeColor};
  }

  @media (max-width: ${tabletWidth}) {
    margin-left: 0;
    width: auto;
    height: 26px;
    padding: 4px;
  }
`

export const LabelStandardText = styled.span`
  font-size: 10px;
  letter-spacing: 0.1px;
  text-align: center;
  color: ${textColor};
  text-transform: uppercase;

  @media (max-width: ${tabletWidth}) {
    letter-spacing: 0.2px;
    font-weight: bold;
    font-size: 10px;
  }
`

export const CountGreen = styled.div`
  display: inline-flex;
  margin-left: 0;
  font-size: 12px;
  font-weight: 700;
  line-height: 24px;
  margin-right: 10px;
  color: ${greenPrimary};
`

export const Details = styled.div`
  background: ${lightGreySecondary};
  border-radius: 3px;
  margin-top: ${(props) => (props.isOpenedDetails ? '12px' : '0')};
  padding: ${(props) => (props.isOpenedDetails ? '20px' : '0 20px 0')};
  transition: all 0.3s ease;
  max-height: ${(props) => (props.isOpenedDetails ? '150px' : '0')};
  position: relative;
  overflow: hidden;

  @media (max-width: ${tabletWidth}) {
    display: flex;
    flex-wrap: wrap;
  }
`

export const HeartWrapper = styled.span`
  cursor: pointer;
  > svg {
    fill: ${({ isEnabled }) => (isEnabled ? red : themeLightGrayColor)};
    &:hover {
      fill: ${({ isEnabled }) => (isEnabled ? red : themeLightGrayColor)};
    }
  }
`
export const PassageIconContainer = styled(Col)`
  width: 25px;
  height: 22px;
`
export const PassageTitleContainer = styled(Col)`
  height: 18px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
`
export const PassageTitle = styled.span`
  color: ${(props) => props?.theme?.common?.subtitleColor || textBlackColor};
  height: 18px;
  text-align: left;
  font: normal normal bold 14px/19px Open Sans;
  opacity: 1;
  display: inline-block;
`
export const StyledRow = styled(Row)`
  margin-bottom: 10px;
`
export const PassageInfo = styled(Col)`
  height: 14px;
  text-align: left;
  font: normal normal bold 10px/14px Open Sans;
  color: ${lightGrey11};
  opacity: 1;
`
