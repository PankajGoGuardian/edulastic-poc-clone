import styled from 'styled-components'
import Button from "antd/es/Button";
import { grey } from '@edulastic/colors'
import { StyledTable as Table } from '../../../../admin/Common/StyledComponents'

export const StyledTable = styled(Table)`
  .ant-table-row {
    &: hover {
      a {
        visibility: visible;
      }
    }
  }
`
export const TeacherSpan = styled.span`
  margin-right: 10px;

  &:not(:last-child):after {
    content: ',';
  }
`
export const UserNameContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px ${grey} solid;
  padding-bottom: 4px;
`

export const UserName = styled.div`
  background: ${grey};
  padding: 2px 8px;
  border-radius: 10px;
  margin-right: 2px;
  margin-bottom: 2px;
`
