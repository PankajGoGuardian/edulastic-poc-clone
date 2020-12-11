import styled from 'styled-components'
import Select from "antd/es/Select";

export const Dropdown = styled(Select)`
  width: ${({ check }) => (check ? '210px' : '100%')};
`
