import { Tag } from 'antd'
import styled from 'styled-components'

export const NewTag = styled(Tag)`
  position: relative;
  font-size: ${({ fontSize }) => fontSize || '10px'};
  color: ${({ color }) => color || 'white'};
  background-color: ${({ backGroundColor }) => backGroundColor || '#05B2DC'};
  border: ${({ border }) => border || 'none'};
  font-weight: ${({ fontWeight }) => fontWeight || 'bold'};
  top: ${({ top }) => top};
  padding: ${({ padding }) => padding || '0px 8px'};
`
