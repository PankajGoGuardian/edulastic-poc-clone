import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  min-height: 600px;
  background: white;
`

export const Count = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ color }) => color};
  user-select: none;
`

export const Title = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: #505050;
  user-select: none;
`
