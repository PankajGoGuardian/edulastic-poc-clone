import styled from 'styled-components'
import { greyThemeDark4 } from '@edulastic/colors'

const SubLabel = styled.div`
  color: ${({ theme }) => theme.questionTextColor || greyThemeDark4};
  padding-left: ${({ paddingLeft }) => paddingLeft || '0.7rem'};
  font-weight: ${({ theme }) => theme.bold || 'bold'};
  margin-right: 1rem;
  width: 100%;
`

export default SubLabel
