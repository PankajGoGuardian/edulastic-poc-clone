import {
  dropZoneTitleColor,
  extraDesktopWidth,
  extraDesktopWidthMax,
  greenDark,
  lightGreySecondary,
  secondaryTextColor,
  smallDesktopWidth,
} from '@edulastic/colors'
import { Paper } from '@edulastic/common'
import { Col, Row, Typography } from 'antd'
import styled from 'styled-components'
import { SummarySelect } from '../../../Summary/common/SummaryForm'
import { MainTitle } from '../../../Summary/components/Sidebar/styled'

const { Paragraph } = Typography

export const Container = styled(Paper)`
  padding: 15px 0px;

  @media (max-width: 1199px) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
`

export const FlexBoxOne = styled.div`
  @media (max-width: 1199px) {
    flex-basis: calc(20% - 10px);
  }
`
export const FlexBoxTwo = styled.div`
  @media (max-width: 1199px) {
    flex-basis: calc(30% - 10px);
    padding-top: 25px;
  }
`
export const FlexBoxThree = styled.div`
  @media (max-width: 1199px) {
    flex-basis: calc(20% - 10px);
  }
`
export const FlexBoxFour = styled.div`
  @media (max-width: 1199px) {
    flex-basis: calc(30% - 10px);
  }
`

export const InnerFlex = styled.div`
  @media (max-width: 1199px) {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
`

export const MainLabel = styled(MainTitle)`
  @media (max-width: 1199px) {
    font-size: 11px;
    margin-bottom: ${(props) => props.marginBottom || '8px'};
    flex-basis: ${(props) => props.width || ''};
  }
`

export const SummarySelectBox = styled(SummarySelect)``

export const SummaryInfoContainer = styled.div`
  padding: 5px 10px;
  border-radius: 2px;
  background: ${lightGreySecondary};
  width: calc(50% - 5px);
  height: 40px;
  line-height: 28px;
  text-align: center;

  @media (max-width: 1199px) {
    min-width: 100%;
    margin-bottom: 5px;
    height: 30px;
    line-height: 20px;
  }
  @media (max-width: ${smallDesktopWidth}) {
    padding: 5px;
  }
`

export const SummaryInfoNumber = styled.span`
  font-size: ${(props) => props.theme.titleSecondarySectionFontSize};
  font-weight: 600;
  color: ${secondaryTextColor};
  float: left;

  @media (min-width: ${extraDesktopWidth}) {
    font-size: ${(props) => props.theme.subtitleFontSize};
  }
  @media (max-width: ${smallDesktopWidth}) {
    font-size: ${(props) => props.theme.standardFont};
  }
`

export const SummaryInfoTitle = styled.span`
  display: inline-block;
  font-size: ${(props) => props.theme.smallLinkFontSize};
  font-weight: 600;
  color: ${secondaryTextColor};

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: ${(props) => props.theme.smallFontSize};
  }
`

export const TableHeaderCol = styled(Col)`
  text-align: center;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${dropZoneTitleColor};
  padding: 22px 0;

  @media (max-width: 1199px) {
    padding: 2px 0px 7px;
  }
`

export const TableBodyRow = styled(Row)`
  background: ${lightGreySecondary};
  border-radius: 2px;
  &:not(:last-child) {
    margin-bottom: 7px;
    @media (max-width: 1199px) {
      margin-bottom: 5px;
    }
  }
`

export const TableBodyCol = styled(Col)`
  font-size: 14px;
  font-weight: 600;
  color: ${secondaryTextColor};
  text-align: center;
  padding: 7px 0;
  &:first-child {
    padding-left: 7px;
  }

  @media (max-width: 1199px) {
    padding: 3px 0;
  }
`

export const Standard = styled.span`
  display: inline-block;
  background: #d1f9eb;
  color: ${greenDark};
  font-size: 10px;
  font-weight: 700;
  border-radius: 5px;
  padding: 5px 20px;
  width: 100%;
  word-break: break-word;

  @media (max-width: 1199px) {
    padding: 4px 20px;
  }
`

export const TestIdCopy = styled(Paragraph)`
  &.ant-typography {
    display: inline-block;
    margin-left: 3px;
    font-size: 12px;
    font-weight: 600;
    font-family: open sans;
    color: dimgrey;
  }
  .ant-typography-copy {
    margin-left: 3px;
  }
  svg {
    opacity: 0.8;
  }
`
