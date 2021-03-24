import { Collapse } from 'antd'
import styled from 'styled-components'
import { themeColor } from '@edulastic/colors'

export const StyledCollapse = styled(Collapse)`
  &.ant-collapse {
    border: none;
    background: none;
    padding-bottom: 30px;
    color: ${themeColor};
  }

  & > .ant-collapse-item {
    border: none;
    & > .ant-collapse-header {
      color: black;
      font-size: 20px;
      font-weight: bold;
      .ant-collapse-arrow {
        color: ${themeColor};
      }
    }
    .ant-collapse-content {
      border: none;
      & > .ant-collapse-content-box {
        padding: 15px 15px;
      }
    }
  }
`
