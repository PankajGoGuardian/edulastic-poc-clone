import styled from 'styled-components'
import { Card } from '@edulastic/common'
import {
  secondaryTextColor,
  themeColor,
  lightGrey,
  white,
  greenDark,
  themeLightGrayColor,
  smallDesktopWidth,
  greyThemeDark2,
} from '@edulastic/colors'
import {
  testStatusBackgroundColor as backgroundColor,
  testStatusTextColor as textColor,
} from '../../../src/constants/colors'

export const ModalTitle = styled.h2`
  font-weight: bolder;
  color: ${secondaryTextColor};
  font-size: 22px;
  margin: 0px;
  display: flex;
  align-items: center;
`

export const ModalContainer = styled(Card)`
  color: ${secondaryTextColor};
  margin-top: 20px;
  box-shadow: none;
  .ant-card-body {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0px;
    min-width: 100%;
    &:before,
    &:after {
      content: unset;
    }
  }
`

export const Image = styled.div`
  width: 400px;
  height: 200px;
  position: relative;
  background: ${(props) =>
    props.src
      ? `url(${props.src})`
      : `url("https://cdn2.edulastic.com/default/default-test-1.jpg")`};
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  border-radius: 4px;
`

export const ModalColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => props.justify || ''};
  width: calc(50% - 15px);
  position: relative;
  .scrollbar-container {
    position: absolute;
    top: 120px;
    left: 0px;
    width: 100%;
    max-height: calc(100% - 120px);
  }
  .public-access-btn-wrapper {
    width: 60%;
    position: absolute;
    right: -19px;
  }
`

export const SummaryScrollbar = styled.div``

const Label = styled.div`
  font-size: 13px;
  font-family: 'Open Sans';
  margin-top: 20px;
  margin-bottom: 10px;
  font-weight: 600;
`

export const AssessmentNameLabel = styled(Label)`
  display: inline-block;
`
export const AssessmentName = styled.div`
  margin-left: 10px;
  font-size: 15px;
  font-weight: 600;
`

export const DescriptionLabel = styled(Label)``
export const Description = styled.div`
  font-size: 13px;
  margin-left: 15px;
`

export const TagGrade = styled.span`
  text-transform: uppercase;
  border-radius: 5px;
  padding: 4px 15px;
  font-size: 10px;
  display: inline-block;
  margin-bottom: 5px;
  color: ${themeColor};
  background-color: rgba(66, 209, 132, 0.3);
  margin-right: 7px;
  font-weight: 700;

  :last-child {
    margin-right: 0;
  }
`
export const TagsLabel = styled(Label)``
export const TagsConatiner = styled.div`
  width: 100%;
`

export const GradeLabel = styled(Label)``
export const GradeConatiner = styled.div`
  width: 100%;
`

export const SubjectLabel = styled(Label)``
export const Subject = styled.div`
  font-size: 15px;
  font-weight: 600;
`

export const Footer = styled.div`
  display: flex;
  margin-top: 20px;
`

export const FooterIcon = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;
  &:first-child {
    margin-left: 0px;
  }
`

export const IconText = styled.span`
  font-size: 10px;
  color: ${themeLightGrayColor};
  margin-left: 5px;
  font-weight: 600;
`

export const ButtonContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
`

export const ButtonComponent = styled.div`
  width: 100%;
  font-size: ${(props) => props.theme.linkFontSize};
  color: ${({ bgColor }) => (bgColor ? white : themeColor)};
  background: ${({ bgColor }) => bgColor || 'white'};
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${themeColor};
  font-weight: 600;
  margin-right: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
  &:hover {
    background: ${({ bgColor }) => (bgColor ? themeColor : lightGrey)};
  }
  &:last-child {
    margin-right: 0px;
  }
`

export const SummaryContainer = styled.div`
  margin-top: 20px;
`

export const SummaryTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
`

export const SummaryCardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`

export const SummaryCard = styled.div`
  width: 100%;
  border-radius: 2px;
  background-color: #f8f8f8;
  display: flex;
  padding: 7px 14px;
  margin-right: 10px;
  align-items: center;
  &:last-child {
    margin-right: 0px;
  }
`

export const SummaryCardLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
`

export const SummaryCardValue = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-right: 15px;
`
export const GroupName = styled(SummaryTitle)`
  margin-bottom: 5px;
`

export const GroupSummaryCard = styled(SummaryCard)`
  padding: 2px 10px;
`

export const GroupSummaryCardValue = styled(SummaryCardValue)`
  font-size: 16px;
`

export const GroupSummaryCardContainer = styled(SummaryCardContainer)`
  margin-bottom: 5px;
`
export const SummaryList = styled.div``
export const ListHeader = styled.div`
  display: flex;
  padding: 5px 10px;
`
export const ListHeaderCell = styled.div`
  color: #b1b1b1;
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  flex: 1;
`
export const ListRow = styled.div`
  padding: 7px 16px;
  background-color: #f8f8f8;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
`
export const ListCell = styled.div`
  font-size: 14px;
  color: #434b5d;
  font-weight: 600;
  text-align: center;
  flex: 1;
`
export const SammaryMark = styled.div`
  text-transform: uppercase;
  border-radius: 5px;
  padding: 4px 15px;
  font-size: 10px;
  color: ${greenDark};
  background-color: #d1f9eb;
  font-weight: 700;
  width: 100%;
  word-break: break-word;
`

export const IconWrapper = styled.span`
  margin-right: 15px;
  position: relative;
  line-height: 11px;
  @media (max-width: ${smallDesktopWidth}) {
    display: none;
  }
`

export const TestStatus = styled.span`
  margin-left: ${({ noMargin }) => !noMargin && '10px'};
  padding: 4px 10px;
  position: relative;
  font-size: 9px;
  color: ${({ status }) => textColor[status]};
  background-color: ${({ status }) => backgroundColor[status]};
  border-radius: 5px;
  text-transform: uppercase;
  font-weight: bold;
  line-height: 16px;
`

export const TestTitleWrapper = styled.span`
  width: 100%;
  max-width: 700px;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  float: left;
`

export const ViewModalButton = styled(ButtonComponent)`
  height: 40px;
  padding: 0px 11px;
`

export const DynamicIconWrapper = styled.span`
  margin-left: 20px;
  font-weight: bolder;
  font-size: 11px;
  color: ${greyThemeDark2};
`

export const CloneOptionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-around;

  label.ant-radio-wrapper {
    display: flex;

    span.ant-radio + * {
      white-space: normal;
      margin-bottom: 5px;
    }
  }
`
export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
`
export const CloseButton = styled.span`
  display: inline-flex;
  height: 32px;
  width: 32px;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  cursor: pointer;
`
export const RightButtonContainer = styled.div`
  display: flex;
`
