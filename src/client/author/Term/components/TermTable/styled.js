import styled from 'styled-components'
import { Pagination } from 'antd'
import { StyledTable } from '../../../../common/styled'

export const StyledTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .ant-table-wrapper {
    width: 100%;
  }

  input {
    border: 1px solid #d9d9d9;
  }
`
export const StyledTermTable = styled(StyledTable)``

export const DeleteTermModalFooterDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`
export const StyledButton = styled.a`
  margin-right: 20px;
  font-size: 20px;
`

export const StyledDeleteButton = styled(StyledButton)`
  pointer-events: ${(props) => (props.disiable ? 'none' : 'auto')};
  color: ${(props) => (props.disiable ? 'rgba(0,0,0,0.65)' : '#1890ff')};
`

export const StyledPagination = styled(Pagination)`
  margin-top: 15px;
  align-self: flex-end;
`
