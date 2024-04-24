import styled from 'styled-components'
import { Select, Button } from 'antd'

export const SectionHeadingSpan = styled.div`
  font-weight: bold;
  font-size: 22px;
  margin-bottom: 30px;
`

export const HeadingSpan = styled.span`
  font-weight: bold;
  font-size: 14px;
`

export const ValueSpan = styled.span`
  font-size: 14px;
  padding: 0px 10px 0px;
`

export const OrSeparator = styled.span`
  font-size: 15px;
  float: left;
  width: 100%;
  padding-left: 270px;
  padding-bottom: 20px;
`

export const PermissionSelect = styled(Select)`
  .ant-select-selection {
    border-radius: 4px 0px 0px 4px;
  }
`

export const PermissionSaveBtn = styled(Button)`
  border-radius: 0px 4px 4px 0px;
`
