import Table from "antd/es/table";
import styled from 'styled-components'

export const ReviewTableWrapper = styled(Table)`
  .ant-table-body > table {
    table-layout: fixed;
    width: 100%;
    img {
      max-width: 100%;
    }
  }
`
