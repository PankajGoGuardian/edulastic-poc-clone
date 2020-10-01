import styled from 'styled-components'
import { Tabs } from 'antd'

export const SubHeaderWrapper = styled.div`
  width: 100%;
  .ant-tabs {
    padding: 0;
    .ant-tabs-nav .ant-tabs-tab {
      padding: 0px 16px 12px;
    }
  }
`

export const StyledTabPane = styled(Tabs.TabPane)``
export const StyledSubMenu = styled(Tabs)`
  padding: 0 3%;
  margin-left: 0;
  .ant-tabs-bar {
    margin-bottom: 0;
    border-color: transparent;
  }
`
