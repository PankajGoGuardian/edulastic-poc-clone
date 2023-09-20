import styled from 'styled-components'
import {
  mainBgColor,
  tabletWidth,
  desktopWidth,
  smallDesktopWidth,
  mediumDesktopExactWidth,
  extraDesktopWidthMax,
  grey,
  white,
} from '@edulastic/colors'
import { Col, Row } from 'antd'

export const ReviewPageContainer = styled.div`
  padding: 20px 30px;
  .fixed-second-header {
    background: ${mainBgColor};
    top: ${(props) => props.theme.HeaderHeight.xs}px;
    position: fixed;
    left: 70px;
    right: 0;
    z-index: 999;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
    padding: 10px 25% 10px 30px;
    transition: top 1s ease-in;
    > div {
      margin: 0;
      .ant-breadcrumb {
        display: none;
      }
    }

    @media (min-width: ${mediumDesktopExactWidth}) {
      top: ${(props) => props.theme.HeaderHeight.md}px;
    }
    @media (min-width: ${extraDesktopWidthMax}) {
      top: ${(props) => props.theme.HeaderHeight.xl}px;
    }
    @media (max-width: ${smallDesktopWidth}) {
      padding: 10px 10px 10px 55px;
    }
    @media (max-width: ${desktopWidth}) {
      padding: 10px;
      top: 0px;
    }
    @media (max-width: ${tabletWidth}) {
      left: 0px;
    }
  }
`

export const ReviewContentWrapper = styled(Row)`
  @media (max-width: 1199px) {
    display: flex;
    flex-wrap: wrap;
  }
`

export const ReviewLeftContainer = styled(Col)`
  padding-right: 15px;
  @media (max-width: 1199px) {
    order: 2;
  }
`

export const ReviewSummaryWrapper = styled(Col)`
  padding: 0px 15px;
  border: 1px solid ${grey};
  border-radius: 8px;
  margin-top: 7px;
  @media (max-width: 1199px) {
    order: 1;
    width: 100%;
    padding: 0px;
    margin-bottom: 10px;
  }
`

export const SecondHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > div > .ant-btn {
    background: transparent;
    height: 24px;
    margin-left: 17px;
    & > button {
      height: 24px;
      margin-top: -1px;
    }
  }

  @media (max-width: ${desktopWidth}) {
    flex-direction: column;
  }
`

export const TestTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
`

export const SecondHeaderWrapper = styled(Row)`
  background-color: ${white};
  display: flex;
  align-items: center;
  height: 55px;
  position: sticky;
  top: -30px;
  z-index: 1000;
`

export const SectionControlWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
`
