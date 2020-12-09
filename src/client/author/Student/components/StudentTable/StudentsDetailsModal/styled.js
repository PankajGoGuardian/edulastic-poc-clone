import styled from 'styled-components'
import Icon from "antd/es/icon";

export const StatusDiv = styled.div`
  display: flex;
  align-items: center;
`

export const StyledStatusIcon = styled(Icon)`
  font-size: 18px;
  margin-right: 10px;
  color: ${(props) => props.iconColor};
`
