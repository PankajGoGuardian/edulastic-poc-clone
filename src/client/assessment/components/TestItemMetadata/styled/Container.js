import styled from 'styled-components'
import { Paper } from '@edulastic/common'

export const Container = styled(Paper)`
  display: flex;
  width: 100%;
  padding: ${(props) => (props.padding ? props.padding : '0px')};
`
