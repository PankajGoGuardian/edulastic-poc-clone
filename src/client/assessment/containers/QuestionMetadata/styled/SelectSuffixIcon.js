import styled from 'styled-components'
import Icon from "antd/es/icon";

export const SelectSuffixIcon = styled(Icon)`
  color: ${(props) => props.theme.questionMetadata.selectSuffixIconColor};
  font-size: ${(props) =>
    props.theme.questionMetadata.selectSuffixIconFontSize};
  margin-right: 5px;
`
