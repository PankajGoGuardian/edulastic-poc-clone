import { Select, Avatar } from 'antd'
import styled from 'styled-components'
import { themeColor, themeColorTagsBg } from '@edulastic/colors'

export const Container = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;

  .ant-select {
    width: auto;
    .ant-select-selection__rendered {
      margin: 0px;
      .ant-select-selection-selected-value {
        padding-right: 30px;
        font-size: 16px;
      }
    }
    .ant-select-selection {
      border: 0px;
      padding: 0 11px;
      .ant-select-arrow {
        right: 11px;
        .ant-select-arrow-icon {
          svg {
            fill: #434b5d;
          }
        }
      }
    }
  }

  .ant-select-selection__rendered {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
  }
`

export const StyledSelect = styled(Select)`
  display: inline-block;
  .ant-select-selection {
    border: 0px;
    &:focus {
      box-shadow: unset;
    }
  }
`

export const UserAvatar = styled(Avatar)`
  background-color: ${themeColorTagsBg};
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 50%;
  color: ${themeColor};
  font-weight: 600;
  margin-right: 10px;
  margin-bottom: 2px;
  font-size: 14px;
  text-transform: uppercase;
`
