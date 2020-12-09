import styled from 'styled-components'
import AntCol from "antd/es/col";

export const ColNoPaddingLeft = styled(AntCol)`
  margin-bottom: ${(props) =>
    props.marginBottom ? props.marginBottom : '15px'};
  margin-top: ${(props) => (props.marginTop ? props.marginTop : '0px')};
  padding-left: 0 !important;
`
