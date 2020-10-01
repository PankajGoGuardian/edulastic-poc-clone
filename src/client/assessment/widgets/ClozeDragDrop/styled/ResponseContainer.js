import styled from 'styled-components'

export const ResponseContainer = styled.div`
  padding: 0px 10px;
  display: inline-flex;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;

  p {
    margin-bottom: 0px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: block;
    max-width: 380px;
  }
`
