import { Icon } from 'antd'
import styled from 'styled-components'

export const MainWrapper = styled.div`
  width: 100%;
`
export const CommonInlineWrapper = styled.span`
  padding: ${({ padding }) => padding};
  margin: ${({ margin }) => margin};
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  border: ${({ border }) => border};
`
export const StyledIcon = styled(Icon)`
  font-size: ${({ fontSize }) => fontSize || '16px'};
`
