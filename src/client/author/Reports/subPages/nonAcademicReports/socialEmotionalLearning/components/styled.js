import styled from 'styled-components'
import { Col, Row } from 'antd'
import { fadedBlack, greyishDarker1 } from '@edulastic/colors'

export const StyledChartContainer = styled.div`
  .navigator-left {
    left: -5px;
  }

  .navigator-right {
    right: -5px;
  }
`

export const StyledRow = styled(Row)`
  flex: 1;
  display: flex;
  flex-direction: column;

  .students-stats {
    > div {
      text-align: center;
      flex: 1;
      padding: 10px;

      .students-title {
        flex-grow: 1;
        font-size: 20px;
        font-weight: 600;
      }
      .students-value {
        color: ${fadedBlack};
        font-size: 16px;
      }
    }
  }
`

export const StyledInnerRow = styled(Row)`
  flex: 1;
  color: ${greyishDarker1};

  > div {
    display: flex;
    flex-direction: column;
    margin: 5px;
  }
`

export const StyledDropDownContainer = styled(Col)`
  .ant-btn.ant-dropdown-trigger {
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
    width: 100%;
    margin-bottom: 25px;
  }
`
