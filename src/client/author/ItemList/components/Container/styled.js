import {
  desktopWidth,
  mobileWidth,
  mobileWidthLarge,
  white,
} from '@edulastic/colors'
import { Paper, MainContentWrapper } from '@edulastic/common'
import PerfectScrollbar from 'react-perfect-scrollbar'
import styled from 'styled-components'
import { Modal } from 'antd'

export const Container = styled(MainContentWrapper)`
  padding: 0;
  overflow: hidden;
  display: flex;

  @media (max-width: ${mobileWidth}) {
    padding: 0;
    height: initial;
    overflow: auto;
  }
`

export const FullScreenModal = styled(Modal)`
  top: 0px;
  width: 100% !important;
  .ant-modal-close-x {
    visibility: hidden;
  }
  .ant-modal-body {
    padding: 0px;
    display: flex;
    height: 100vh;
  }
`

export const ContentWrapper = styled(Paper)`
  position: relative;
  height: 100%;
  overflow: hidden;
  padding-bottom: 80px;

  @media (max-width: ${mobileWidth}) {
    height: initial;
    overflow-y: initial;
    overflow-x: initial;
    border-radius: 10px;
    padding: 0 0 28px 0;
  }
`

export const MobileFilterIcon = styled.div`
  display: block;

  @media (max-width: ${desktopWidth}) {
    display: none;
  }
`

export const ListItems = styled.div`
  flex: 1;
  padding-left: ${(props) => (props.isShowFilter ? '0px' : '30px')};
  width: calc(100% - 370px); /* 370px --> width of the item filter */

  @media (max-width: ${desktopWidth}) {
    padding-left: 0px;
  }
`

export const ScrollbarContainer = styled(PerfectScrollbar)`
  padding: 0px 30px;

  @media (max-width: ${mobileWidthLarge}) {
    padding: 0px 15px;
  }
`

export const Element = styled.div`
  margin: 0;
  height: 100%;

  .ant-pagination {
    padding: 30px 0 0 0;
    background: ${white};
    justify-content: flex-end;
  }
  .ant-pagination-total-text {
    display: none;
  }
  @media (max-width: ${mobileWidth}) {
    margin: 0 0 20px 0;
    height: initial;

    .ant-pagination {
      justify-content: flex-end;
      padding: 20px 0 0 0;
      margin: 0;
      width: 100%;
    }
  }
`

export const SpinContainer = styled.div`
  transition: all 0.3s ease;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  z-index: 10;
  pointer-events: none;
  opacity: 0;

  &.active {
    pointer-events: all;
    opacity: 1;
  }
`

export const PaginationContainer = styled.div`
  .ant-pagination {
    padding: 20px 55px 20px 0px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`
