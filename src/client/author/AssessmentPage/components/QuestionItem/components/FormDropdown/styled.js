import styled from 'styled-components'
import { Select } from 'antd'

export const Dropdown = styled(Select)`
  width: ${({ check }) => (check ? '210px' : '100%')};
`
