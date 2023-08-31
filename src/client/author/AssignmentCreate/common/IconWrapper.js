import styled from 'styled-components'

const IconWrapper = styled.div`
  margin-bottom: ${(props) => props.marginBottom || '15px'};
  height: ${(props) => props.height || '44px'};
  width: ${(props) => props.width || '44px'};
  background: #bfbfbf;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    fill: white;
  }
`

export default IconWrapper
