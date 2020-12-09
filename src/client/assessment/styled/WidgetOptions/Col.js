import styled from 'styled-components'
import AntCol from "antd/es/col";

export const Col = styled(AntCol)`
  margin-bottom: ${(props) =>
    props.marginBottom ? props.marginBottom : '20px'};
  margin-top: ${(props) => (props.marginTop ? props.marginTop : '0px')};
  ${(props) => props.style};
`
