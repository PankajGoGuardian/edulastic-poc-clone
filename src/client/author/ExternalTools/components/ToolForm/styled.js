import styled from 'styled-components'
import Row from "antd/es/Row";
import Col from "antd/es/Col";
import List from "antd/es/List";
import { lightGreySecondary, sectionBorder } from '@edulastic/colors'

export const StyledColRight = styled(Col)`
  display: flex;
  justify-content: flex-end;
`
export const StyledRow = styled(Row)`
  display: flex;
  align-items: center;
  background-color: ${lightGreySecondary};
  border-color: ${sectionBorder};

  i {
    margin-right: 10px;
  }
`

export const StyledListItem = styled(List.Item)`
  padding: 6px 0;
`
