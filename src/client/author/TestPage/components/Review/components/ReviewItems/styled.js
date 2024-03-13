import styled from 'styled-components'
import { Checkbox, Collapse } from 'antd'
import { title, themeColor } from '@edulastic/colors'

export const DragCrad = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding-left: ${({ noPadding }) => !noPadding && '30px'};
`

export const DragHandler = styled.div`
  width: 36px;
  cursor: move;
  text-align: center;
`

export const ReviewItemWrapper = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'calc(100% - 30px)')};
  background: white;

  &:first-child {
    border-top: 1px solid #e8e8e8;
  }
`

export const QuestionCheckbox = styled(Checkbox)`
  display: block;
  margin-top: 10px;
`

export const GroupCollapse = styled(Collapse)`
  &.ant-collapse {
    border: none;
    background: none;
    & > .ant-collapse-item {
      border: none;
      margin-bottom: 5px;
    }
  }
  .ant-collapse-extra {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 20px;
  }
  &.ant-collapse-icon-position-right {
    & > .ant-collapse-item {
      & > .ant-collapse-header {
        padding: 4px 16px;
        height: 50px;
        align-items: center;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        font-weight: 600;
        color: ${title};
        background: #f8f8f8;
        border: 1px solid #dfdfdf;
        border-radius: 8px;
        .ant-collapse-arrow {
          color: ${themeColor};
        }
      }
      &.ant-collapse-item-active {
        & > .ant-collapse-header {
          border-radius: 8px 8px 0px 0px;
        }
      }
      .ant-collapse-content {
        border: none;
        & > .ant-collapse-content-box {
          padding: 15px 0px;
        }
      }
    }
  }
`

export const InfoDiv = styled.div`
  display: flex;
  flex-direction: ${({ hasSections }) => (hasSections ? 'row' : 'column')};
  align-items: center;
  line-height: 16px;
  padding: 0px 10px;
  justify-content: ${({ hasSections }) => hasSections && 'space-evenly'};
  gap: ${({ hasSections }) => hasSections && '10px'};
`

export const Text = styled.div`
  font-size: 9px;
  text-transform: uppercase;
  color: ${title};
  font-weight: 600;
`

export const Count = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${title};
`

export const QuestionIndex = styled.div``

export const StyledSpinnerContainer = styled.div`
  padding: 10px;
  > div {
    position: relative;
    top: unset;
    left: unset;
    transform: unset;
  }
`
